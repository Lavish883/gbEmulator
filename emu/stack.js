import { busRead, busWrite, busWrite16, busRead16 } from "./bus.js";


// 8 bit
export function stackPop() {
    let address = lavishEmulator.cpu.cpuReadRegister('SP');
    address += 1;
    //alert('SP: ' + address)
    return busRead(address);
}
// 16 bit
export function stackPop16() {
    var lowByte = this.stackPop();
    var highByte = this.stackPop();

    return (highByte << 8) | lowByte;
}
// 8 bit
export function stackPush(data) {
    lavishEmulator.cpu.registers.SP--;
    console.log('Data: ' +  data, 'SP: ' + lavishEmulator.cpu.registers.SP)
    busWrite(lavishEmulator.cpu.registers.SP, data)
}
// 16 bit
export function stackPush16(data) {
    stackPush((data >> 8) & 0xFF);
    stackPush(data & 0xFF);
}
