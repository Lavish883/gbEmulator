import { busRead, busWrite, busWrite16, busRead16 } from "./bus.js";


// 8 bit
export function stackPop() {
    lavishEmulator.cpu.cpuSetRegister('SP', lavishEmulator.cpu.cpuReadRegister('SP') + 1);
    let address = lavishEmulator.cpu.cpuReadRegister('SP');
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
    lavishEmulator.cpu.cpuSetRegister('SP', lavishEmulator.cpu.cpuReadRegister('SP') - 1);   
    busWrite(lavishEmulator.cpu.cpuReadRegister('SP'), data)
}
// 16 bit
export function stackPush16(data) {
    stackPush((data >> 8) & 0xFF);
    stackPush(data & 0xFF);
}
