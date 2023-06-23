import { busRead, busWrite } from "./bus.js";
import { instructions } from "./instructions.js";


class cpuUtilities {
    constructor() {

    }
    reverseByte(byte) {
        return ( (byte & 0xFF00) >> 8) | ((byte & 0x00FF) << 8);
    }
    cpuReadRegister(register) {
        // read the value of a register
        // can just return registers A, B, C, D, E, F, H, L as theya re just 8 bit registers
        if (register === "A" || register === "B" || register === "C" || register === "D" || register === "E" || register === "F" || register === "H" || register === "L" || register === "SP" || register === "PC") {
            return this.registers[register];
        }
        
        switch (register) {
            case "AF":
                return this.reverseByte(this.registers.A)
            case "BC":
                return this.reverseByte(this.registers.B)
            case "DE":
                return this.reverseByte(this.registers.D)
            case "HL":
                return this.reverseByte(this.registers.H)
            default:
                console.log("Unknown register: " + register);
        }
    }
}

export class cpu extends cpuUtilities{
    constructor() {
        super();
        this.registers = {
            A: 0,   //Accumulator -> 8 bit , AF can be combined to make 16 bit
            F: 0,   //Flags -> 8 bit
            B: 0,   //BC can be combined to make 16 bit
            C: 0,
            D: 0,   //DE can be combined to make 16 bit
            E: 0,
            H: 0,   //HL can be combined to make 16 bit
            L: 0,
            SP: 0,   //Stack Pointer -> 16 bit
            PC: 100,   //Program Counter/Pointer -> 16 bit
        };

        this.isHalted;
        this.isStepping; 
        
    }
    fetchInstruction() {
        // read the current opcode from the bus, then increment the program counter
        this.currentOpcode = busRead(this.registers.PC);
        this.registers.PC++;
        
        if (instructions[parseInt(this.currentOpcode)] == undefined) {
            console.log("Unknown opcode: " + this.currentOpcode);
            this.currentInstruction = "NONE";
        } else {
            this.currentInstruction = instructions[parseInt(this.currentOpcode)];
        }
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
                this.fetchedData = this.cpuReadRegister(this.currentInstruction.register);
                break;
            }
            case "RD8": {
                // Read 8 bit data from the bus, and add it to a register
                this.fetchedData = busRead(this.registers.PC).toString(8);
                lavishEmulator.emuCycles(1);
                this.registers.PC++;
                break;
            }
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
            default: {
                console.log("Unknown addressing mode: " + this.currentInstruction.addressMode);
                break;
            }
        }
    }
    cpuInit() {
    }
    executeInstruction() {
        console.log("Not Executing Instruction: " + this.currentInstruction.name);
    }
    cpuStep() {
        if (this.isHalted) return;

        this.fetchInstruction();
        this.fetchData();
        this.executeInstruction();
    }
}