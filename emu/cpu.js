import { busRead, busWrite , busRead16 , busWrite16 } from "./bus.js";
import { instructions } from "./instructions.js";
import { stackPop, stackPop16, stackPush, stackPush16 } from "./stack.js";

// outisde the class cpu
// to refrence don't use this. just use lavishEmulator.cpu
// cause otherwise it will be undefined
class cpuUtilities {
    constructor() {

    }
    getSigned8BitValue(value) {
        // get the signed value of an 8 bit value
        // get first bit , if 1 then negative, 0 then positive
        let firstBit = lavishEmulator.cpu.getBit(value, 7);
        if (firstBit == 1) {
            //console.log("negative");
            return value - 256;
        }
        return value;

    }
    reverseByte(byte) {
        return ((byte & 0xFF00) >> 8) | ((byte & 0x00FF) << 8);
    }
    cpuReadRegister(register) {
        // read the value of a register
        // can just return registers A, B, C, D, E, F, H, L as theya re just 8 bit registers
        if (register === "A" || register === "B" || register === "C" || register === "D" || register === "E" || register === "F" || register === "H" || register === "L" || register === "SP" || register === "PC") {
            return lavishEmulator.cpu.registers[register];
        }

        switch (register) {
            case "AF":
                return lavishEmulator.cpu.reverseByte(lavishEmulator.cpu.registers.A)
            case "BC":
                return lavishEmulator.cpu.reverseByte(lavishEmulator.cpu.registers.B)
            case "DE":
                return lavishEmulator.cpu.reverseByte(lavishEmulator.cpu.registers.D)
            case "HL":
                return lavishEmulator.cpu.reverseByte(lavishEmulator.cpu.registers.H)
            default:
                throw new Error("Unknown register: " + register);
        }
    }
    getBit(byte, bit) {
        return ((byte & (1 << bit)) ? 1 : 0);
    }
    bitSet(byte, bit, on) {
        if (on) { 
            byte |= (1 << bit);
        } else {
            byte &= ~(1 << bit);
        }
        return byte;
    }
    between(a, b, c) {
        return ((a >= b) && (a <= c));
    }
    getZFlag() {
        return lavishEmulator.cpu.getBit(lavishEmulator.cpu.registers.F, 7);
    }
    getCFlag() {
        return lavishEmulator.cpu.getBit(lavishEmulator.cpu.registers.F, 4);
    }
    checkCondition() {
        var zFlag = lavishEmulator.cpu.getZFlag();
        var cFlag = lavishEmulator.cpu.getCFlag();

        // if they have conditionals then check them, otherwise just return true
        if (lavishEmulator.cpu.currentInstruction.condition == undefined) {
            return true;
        }

        switch (lavishEmulator.cpu.currentInstruction.condition) {
            case "C": return cFlag;
            case "NC": return !cFlag;
            case "Z": return zFlag;
            case "NZ": return !zFlag;
        }

        return false;
    }
    setFlags(z, n, h, c) {
        if (z != -1){
            lavishEmulator.cpu.registers.F = this.bitSet(lavishEmulator.cpu.registers.F, 7, z);
        }
        if (n != -1){
            lavishEmulator.cpu.registers.F = this.bitSet(lavishEmulator.cpu.registers.F, 6, n);
        }
        if (h != -1){
            lavishEmulator.cpu.registers.F = this.bitSet(lavishEmulator.cpu.registers.F, 5, h);
        }
        if (c != -1){
            lavishEmulator.cpu.registers.F = this.bitSet(lavishEmulator.cpu.registers.F, 4, c);
        }
    }
    cpuSetRegister(register, value) {
        // for 8 bit registers
        if (register == 'A' || register == 'B' || register == 'C' || register == 'D' || register == 'E' || register == 'F' || register == 'H' || register == 'L') {
            lavishEmulator.cpu.registers[register] = (value & 0xFF);
            return;
        }

        switch (register) {
            // for 16 bit registers, reverse the values
            case "AF": lavishEmulator.cpu.registers.A = this.reverseByte(value); break;
            case "BC": lavishEmulator.cpu.registers.B = this.reverseByte(value); break;
            case "DE": lavishEmulator.cpu.registers.D = this.reverseByte(value); break;
            case "HL": lavishEmulator.cpu.registers.H = this.reverseByte(value); break;
            // PC and SP just set the value
            case "PC": lavishEmulator.cpu.registers.PC = value; break;
            case "SP": lavishEmulator.cpu.registers.SP = value; break;
        }

    }
}

class cpuInstructionsProcess extends cpuUtilities {
    constructor() {
        super();

        this.processFunctions = {
            "LD": this.processLD,
            "LDH": this.processLDH,
            "JMP": this.processJMP,
            "NOP": this.processNOP,
            "DI": this.processDI,
            "XOR": this.processXOR,
            "POP": this.processPOP,
            "PUSH": this.processPUSH,
            "CALL": this.processCALL,
            "JR": this.processJR,
            "RET": this.processRET,
            "RETI": this.processRETI,
            "RST": this.processRST,
            "INC": this.processINC,
            "DEC": this.processDEC,
        }
    }
    // To do: implement all the instructions
    processLD() {
        var cpu = lavishEmulator.cpu;
        // corner cases/ exceptions
        if (cpu.destinationIsMemory){
            // Ld (BC), A
            // If 16 bit register
            if (lavishEmulator.cpu.is16BitRegister(lavishEmulator.cpu.currentInstruction.register2)) {
                lavishEmulator.emuCycles(1);
                busWrite16(cpu.memoryDestination, cpu.fetchedData)
            } else {
                busWrite(cpu.memoryDestination, cpu.fetchedData)
            }
            return;
        }
        if (cpu.currentInstruction.addressMode == "HLSPR"){
            let hFlagValue = (cpu.cpuReadRegister(cpu.currentInstruction.register2) & 0xF) 
            + (cpu.fetchedData & 0xF) >= 0x10;

            let cFlagValue = (cpu.cpuReadRegister(cpu.currentInstruction.register2) & 0xFF) 
            + (cpu.fetchedData & 0xFF) >= 0x100;

            cpu.setFlags(0, 0, hFlagValue, cFlagValue);

            cpu.cpuSetRegister(cpu.currentInstruction.register1, 
                cpu.cpuReadRegister(cpu.currentInstruction.register2 + cpu.getSigned8BitValue(cpu.fetchedData)));
            return;
            }
        cpu.cpuSetRegister(cpu.currentInstruction.register1, lavishEmulator.cpu.fetchedData)
    }
    processJMP() {
        lavishEmulator.cpu.goToAddress(lavishEmulator.cpu.fetchedData, false);
    }
    // jump relative
    processJR(){
        // get only the 8 bit value
        let signedValue = lavishEmulator.cpu.getSigned8BitValue(lavishEmulator.cpu.fetchedData);
        //console.log('signedValue:' + signedValue);
        let address = lavishEmulator.cpu.registers.PC + parseInt(signedValue);
        console.log('address:' + address);
        lavishEmulator.cpu.goToAddress(address, false);
    }
    processNOP() {
    }
    processDI() {
        lavishEmulator.cpu.InterruptMasterEnabled = false;
    }
    processINC() {
        var value = lavishEmulator.cpu.cpuReadRegister(lavishEmulator.cpu.currentInstruction.register1) + 1;

        if (lavishEmulator.cpu.is16BitRegister(lavishEmulator.cpu.currentInstruction.register1)){
            lavishEmulator.emuCycles(1);
        }
        // Do this for HL and address mode MR
        if (lavishEmulator.cpu.currentInstruction.register1 == "HL" &&
            lavishEmulator.cpu.currentInstruction.addressMode == "MR"
            ){
            value = busRead(lavishEmulator.cpu.cpuReadRegister("HL")) + 1;
            value &= 0xFF;
            
            busWrite(lavishEmulator.cpu.cpuReadRegister("HL"), value);
        } else {
            lavishEmulator.cpu.cpuSetRegister(lavishEmulator.cpu.currentInstruction.register1, value);
            value = lavishEmulator.cpu.cpuReadRegister(lavishEmulator.cpu.currentInstruction.register1);
        }

        // check if we need to set cpu flags or not, by checking bottom 2 bits
        if ((lavishEmulator.cpu.currentOpcode & 0x03) == 0x03){
            return;
        }
        // need to set cpu flags
        lavishEmulator.cpu.setFlags(
            value == 0 ? 1 : 0,
            0,
            (value & 0x0F) == 0 ? 1 : 0,
            -1
        )
    }
    processDEC() {
        var value = lavishEmulator.cpu.cpuReadRegister(lavishEmulator.cpu.currentInstruction.register1) - 1;

        if (lavishEmulator.cpu.is16BitRegister(lavishEmulator.cpu.currentInstruction.register1)){
            lavishEmulator.emuCycles(1);
        }
        // Do this for HL and address mode MR
        if (lavishEmulator.cpu.currentInstruction.register1 == "HL" &&
            lavishEmulator.cpu.currentInstruction.addressMode == "MR"
            ){
            value = busRead(lavishEmulator.cpu.cpuReadRegister("HL")) - 1;            
            busWrite(lavishEmulator.cpu.cpuReadRegister("HL"), value);
        } else {
            lavishEmulator.cpu.cpuSetRegister(lavishEmulator.cpu.currentInstruction.register1, value);
            value = lavishEmulator.cpu.cpuReadRegister(lavishEmulator.cpu.currentInstruction.register1);
        }

        // check if we need to set cpu flags or not, by checking bottom 2 bits
        if ((lavishEmulator.cpu.currentOpcode & 0x0B) == 0x0B){
            return;
        }
        console.log('value:' + value);
        if (value == 0){
            alert('Z flag set');
        }
        // need to set cpu flags
        lavishEmulator.cpu.setFlags(
            value == 0 ? 1 : 0,
            1,
            (value & 0x0F) == 0x0F ? 1 : 0,
            -1
        )

    }
    processADD() {
        var cpu = lavishEmulator.cpu;
        var value = cpu.cpuReadRegister(cpu.currentInstruction.register1) + cpu.fetchedData;
        // check if it is 16 bit register
        let is16Bit = cpu.is16BitRegister(cpu.currentInstruction.register1);

        if (is16Bit){
            lavishEmulator.emuCycles(1);
        }

        // Special cases
        if (cpu.currentInstruction.register1 == "SP"){
            value = cpu.cpuReadRegister("SP") + cpu.getSigned8BitValue(cpu.fetchedData);
        }

        // check the cpu flags
        var z = (value & 0xFF) == 0 ? 1 : 0;
        var h = (cpu.cpuReadRegister(cpu.currentInstruction.register1) & 0xF) + (cpu.fetchedData & 0xF) >= 0x10 ? 1 : 0; 
        var c = (cpu.cpuReadRegister(cpu.currentInstruction.register1) & 0xFF) + (cpu.fetchedData & 0xFF) >= 0x100 ? 1 : 0; 

        if (is16Bit){
            z = -1;
            h = (cpu.cpuReadRegister(cpu.currentInstruction.register1) & 0xFFF) + (cpu.fetchedData & 0xFFF) >= 0x1000 ? 1 : 0; 
            n = (cpu.cpuReadRegister(cpu.currentInstruction.register1)) + (cpu.fetchedData);
            c = n >= 0x10000 ? 1 : 0;
        }

        if (cpu.currentInstruction.register1 == "SP"){
            z = 0;
            h = (cpu.cpuReadRegister("SP") & 0xF) + ((cpu.fetchedData) & 0xF) >= 0x10 ? 1 : 0;
            c = (cpu.cpuReadRegister("SP") & 0xFF) + ((cpu.fetchedData) & 0xFF) >= 0x100 ? 1 : 0;
        }

        // set the flags and register
        cpu.cpuSetRegister(cpu.currentInstruction.register1, value & 0xFFFF);
        cpu.setFlags(z, 0, h, c);

    }
    processXOR() {
        lavishEmulator.cpu.registers.A ^= lavishEmulator.cpu.fetchedData & 0xFF;
        lavishEmulator.cpu.setFlags(lavishEmulator.cpu.registers.A == 0, 0, 0, 0);
    }
    processLDH(){
        if (lavishEmulator.cpu.currentInstruction.register1 == "A"){
            lavishEmulator.cpu.cpuSetRegister(lavishEmulator.cpu.currentInstruction.register1, 
                busRead(0xFF00 | lavishEmulator.cpu.fetchedData));
        } else {
            busWrite(lavishEmulator.memoryDestination, lavishEmulator.cpu.cpuReadRegister("A")); 
        }

        lavishEmulator.emuCycles(1);
    }
    processPOP() {
        let lowByte = stackPop();
        lavishEmulator.emuCycles(1);
        let highByte = stackPop(); 
        lavishEmulator.emuCycles(1);

        let value = (highByte << 8) | lowByte;

        lavishEmulator.cpu.cpuSetRegister(lavishEmulator.cpu.currentInstruction.register1, value);

        if (lavishEmulator.cpu.currentInstruction.register1 == "AF"){
            lavishEmulator.cpu.setIERegister(lavishEmulator.cpu.currentInstruction.register1, value & 0xFFF0);
        }
    }
    processPUSH(){
        let highByte = (lavishEmulator.cpu.cpuReadRegister(lavishEmulator.cpu.currentInstruction.register1) >> 8) & 0xFF; 
        lavishEmulator.emuCycles(1);
        stackPush(highByte);

        let lowByte = lavishEmulator.cpu.cpuReadRegister(lavishEmulator.cpu.currentInstruction.register1) & 0xFF;
        lavishEmulator.emuCycles(1);
        stackPush(lowByte);

        lavishEmulator.emuCycles(1);
    }
    processCall() {
        lavishEmulator.cpu.goToAddress(lavishEmulator.cpu.fetchedData, true);
    }
    processRET() {
        // conditional return
        if (lavishEmulator.cpu.currentInstruction.condition != undefined){
            lavishEmulator.emuCycles(1);
        }

        if (lavishEmulator.cpu.checkCondition()){
            let lowByte = stackPop();
            lavishEmulator.emuCycles(1);
            let highByte = stackPop();
            lavishEmulator.emuCycles(1);

            let address = (highByte << 8) | lowByte;

//            console.log("returning to " + address.toString(16));
            lavishEmulator.cpu.cpuSetRegister("PC", address);
            lavishEmulator.emuCycles(1);
        }

    }
    processRETI(){
        lavishEmulator.cpu.InterruptMasterEnabled = true;
        lavishEmulator.cpu.processRET();
    }
    processRST() {
        lavishEmulator.cpu.goToAddress(lavishEmulator.cpu.currentInstruction.param, true);
    }
    // 16 bit address and boolean to push to the stack pointer or not
    goToAddress(address, pushToStack) {
        let condition = lavishEmulator.cpu.checkCondition();
        if (condition) {
            if (pushToStack){
                lavishEmulator.emuCycles(2);
                stackPush16(lavishEmulator.cpu.cpuReadRegister("PC"));
            }

            lavishEmulator.cpu.cpuSetRegister("PC", address);
            lavishEmulator.emuCycles(1);
        }
    }
    is16BitRegister(registerType) {
        if (registerType == "BC" || 
            registerType == "DE" || 
            registerType == "HL" || 
            registerType == "SP" || 
            registerType == "AF" ||
            registerType == "PC") {
            return true;
        }
        return false;
    }
}

class cpuFetchData extends cpuInstructionsProcess {
    constructor() {
        super();
    }
    fetchData() {
        this.memoryDestination = 0;
        this.destinationIsMemory = false;
        // based on the addressing mode, read the data from the bus in that way
        switch (this.currentInstruction.addressMode) {
            case "IMP": {
                break;
            }
            case "R": {
                this.fetchedData = this.cpuReadRegister(this.currentInstruction.register1);
                break;
            }
            case "RR": {
                this.fetchedData = this.cpuReadRegister(this.currentInstruction.register2);
                break;
            }
            case "RD8": {
                // Read 8 bit data from the bus, and add it to a register
                this.fetchedData = busRead(this.registers.PC);
                lavishEmulator.emuCycles(1);
                this.registers.PC++;
                break;
            }
            case "RD16":
            case "D16": {
                // read high value, then low value as we can only read 8 bits at a time
                let lowValue = busRead(this.registers.PC);
                lavishEmulator.emuCycles(1);

                let highValue = busRead(this.registers.PC + 1);
                lavishEmulator.emuCycles(1);

                // now make that into a 16 bit number
                this.fetchedData = lowValue | (highValue << 8);
                this.registers.PC += 2;
                break;
            }
            // loading register to memory
            case "MRR": {
                this.fetchedData = this.cpuReadRegister(this.currentInstruction.register2);
                this.memoryDestination = this.cpuReadRegister(this.currentInstruction.register1);
                this.destinationIsMemory = true; 

                if (this.currentInstruction.register1 == "C"){
                    this.memoryDestination |= 0xFF00;
                }
                
                return;
            }
            case "RMR": {
                let address = this.cpuReadRegister(this.currentInstruction.register2);

                if (this.currentInstruction.register1 == "C"){
                    address |= 0xFF00;
                }

                this.fetchedData = busRead(address);
                lavishEmulator.emuCycles(1);

                return;
            }
            case "RHLI": { // Read from register HL, then increment HL by 1
                this.fetchedData = busRead(this.cpuReadRegister(this.currentInstruction.register2));
                lavishEmulator.emuCycles(1);
                this.cpuSetRegister("HL", this.cpuReadRegister("HL") + 1); 
                return;
            }
            case "RHLD": { // Read from register HL, then decremnt HL by 1
                this.fetchedData = busRead(this.cpuReadRegister(this.currentInstruction.register2));
                lavishEmulator.emuCycles(1);
                this.cpuSetRegister("HL", this.cpuReadRegister("HL") - 1); 
                return;
            }
            case "HLIR": {
                this.fetchedData = this.cpuReadRegister(this.currentInstruction.register2);
                this.memoryDestination = this.cpuReadRegister(this.currentInstruction.register1);
                this.destinationIsMemory = true;
                this.cpuSetRegister("HL", this.cpuReadRegister("HL") + 1);
                break;
            }
            case "HLDR": {
                this.fetchedData = this.cpuReadRegister(this.currentInstruction.register2);
                this.memoryDestination = this.cpuReadRegister(this.currentInstruction.register1);
                this.destinationIsMemory = true;
                this.cpuSetRegister("HL", this.cpuReadRegister("HL") - 1);
                break;
            }
            case "RA8": {
                this.fetchedData = busRead(this.registers.PC);
                lavishEmulator.emuCycles(1);
                this.registers.PC++;
                return;
            }
            case "A8R": {
                this.memoryDestination = busRead(this.registers.PC) | 0xFF00;
                this.destinationIsMemory = true;
                lavishEmulator.emuCycles(1);
                this.registers.PC++;
                return;
            }
            case "HLSPR": {
                this.fetchedData = busRead(this.registers.PC); 
                lavishEmulator.emuCycles(1);
                this.registers.PC++;
                return;
            }
            case "D8": {
                this.fetchedData = busRead(this.registers.PC);
                //console.error("D8: " + this.fetchedData.toString(16), lavishEmulator.cpu.registers.PC);
                lavishEmulator.emuCycles(1);
                this.registers.PC++;
                break;
            }
            case "A16R":
            case "D16R": {
                var lowValue = busRead(this.registers.PC);
                lavishEmulator.emuCycles(1);

                var highValue = busRead(this.registers.PC + 1);
                lavishEmulator.emuCycles(1);

                this.memoryDestination = lowValue | (highValue << 8);
                this.destinationIsMemory = true;

                this.registers.PC += 2;
                this.fetchedData = this.cpuReadRegister(this.currentInstruction.register2);
                return;
            }
            case "MRD8": {
                this.fetchedData = busRead(this.registers.PC);
                lavishEmulator.emuCycles(1);
                this.registers.PC++;
                this.memoryDestination = this.cpuReadRegister(this.currentInstruction.register1);
                this.destinationIsMemory = true;
                break;
            }
            case "MR": {
                this.memoryDestination = this.cpuReadRegister(this.currentInstruction.register1);
                this.destinationIsMemory = true;
                this.fetchedData = busRead(this.memoryDestination);
                lavishEmulator.emuCycles(1);
                return;
            }
            case "RA16": {
                let lowValue = busRead(this.registers.PC);
                lavishEmulator.emuCycles(1);

                let highValue = busRead(this.registers.PC + 1);
                lavishEmulator.emuCycles(1);

                //console.log(lowValue, highValue);
                let address = lowValue | (highValue << 8);
                
                this.registers.PC += 2;
                this.fetchedData = busRead(address);
                lavishEmulator.emuCycles(1);
                return;
            }   
            default: {
                //console.log("Unknown addressing mode: " + this.currentInstruction.addressMode);
                break;
            }
        }
    }

}

export class cpu extends cpuFetchData {
    constructor() {
        super();
        this.registers = {
            A: 1,   //Accumulator -> 8 bit , AF can be combined to make 16 bit
            F: 0o0,   //Flags -> 8 bit , Z:7 N:6 H:5 C:4
            B: 0o0,   //BC can be combined to make 16 bit
            C: 0o0,
            D: 0o0,   //DE can be combined to make 16 bit
            E: 0o0,
            H: 0o0,   //HL can be combined to make 16 bit
            L: 0o0,
            SP: 0x0,   //Stack Pointer -> 16 bit
            PC: 0 //0x64,   //Program Counter/Pointer -> 16 bit, 100 in decimal
        };

        this.isHalted;
        this.isStepping;
        this.currentOpcode;
        this.currentInstruction;
        this.memoryDestination;
        this.destinationIsMemory;
        this.InterruptMasterEnabled;
        this.IEregister; // Interrupt Enable Register
    }
    fetchInstruction() {
        // read the current opcode from the bus, then increment the program counter
        this.currentOpcode = busRead(this.registers.PC);

        this.registers.PC++;

        if (instructions[parseInt(this.currentOpcode)] == undefined) {
            console.log("Unknown opcode: " + this.currentOpcode, 'PC: ', this.registers.PC - 1);
            this.currentInstruction = "NONE";
        } else {
            this.currentInstruction = instructions[parseInt(this.currentOpcode)];
            if (this.processFunctions[this.currentInstruction.name] != undefined) {
                //console.log("Fetched opcode: " + this.currentOpcode, 'PC: ', this.registers.PC - 1);
            }
        }
    }
    executeInstruction() {
        this.processFunctions[this.currentInstruction.name]();
        //alert("Running....." + this.currentInstruction.name);
    }
    cpuStep() {
        if (this.isHalted) return;
        //console.log("PC: " + this.registers.PC)

        this.fetchInstruction();
        this.fetchData();


        console.log('Flags Before:' + ' Z: ' + this.getZFlag() + ' C: ' + this.getCFlag());

        if (this.currentInstruction == "NONE" || this.processFunctions[this.currentInstruction.name] == undefined) return;
        console.log("Running....." + this.currentInstruction.name, 'PC: ', this.registers.PC - 1, 'Fetched Data: ', this.fetchedData, 'OPcode: ', this.currentOpcode.toString(16));

        this.executeInstruction();
        console.log('Registers: ' + 'A: ' + this.cpuReadRegister('A') + ' B: ' + this.cpuReadRegister('B') + ' C: ' + this.cpuReadRegister('C') + ' D: ' + this.cpuReadRegister('D') + ' E: ' + this.cpuReadRegister('E') + ' H: ' + this.cpuReadRegister('H') + ' L: ' + this.cpuReadRegister('L') + ' F: ' + this.cpuReadRegister('F') + ' SP: ' + this.cpuReadRegister('SP') + ' PC: ' + this.cpuReadRegister('PC'));
        console.log('Flags After:' + ' Z: ' + this.getZFlag() + ' C: ' + this.getCFlag());
    }
    getIERegister() {
        return this.IEregister;
    }
    // Interrupt Enable Register, passes in 8 bit number
    setIERegister(number) {
        this.IEregister = number;
    }
}