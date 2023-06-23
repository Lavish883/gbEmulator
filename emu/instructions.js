/*
    name = Instruction name
        NOP: No operation
        JMP: Jump to address
        LD: Load value into register
        DEC: Decrement register

    addressMode = Addressing mode
        IMP: Implied, no addressing mode
        D16: 16-bit address 
        RD8: 8-bit address read 
        R: Using register
            When using register need to know which register is being used
    

*/
export const instructions = {
    0x00: { name: "NOP", addressMode: "IMP"}, 
    0x05: { name: "DEC", addressMode: "R", register: "B"},
    0x0E: { name: "LD", addressMode: "RD8", register: "C"},  // reads C register as an 8 bit
    0xAF: { name: "XOR", addressMode: "R", register: "A"}, 
    0xC3: { name: "JMP", addressMode: "D16"}, 
    0xF0: { name: "LDH", addressMode: "RD8", register: "A"},
}; 

