/*
    name = Instruction name
        NOP: No operation
        JMP: Jump to address
        LD: Load value into register
        DEC: Decrement register
        DI: Disable interrupts

    addressMode = Addressing mode
        IMP: Implied, no addressing mode
        D16: 16-bit address 
        RD8: 8-bit address 
        R: Using register
            When using register need to know which register is being used
        RD16: 16-bit address read from a register
    

*/
export const instructions = {
    0x00: { name: "NOP", addressMode: "IMP"}, 
    // BC
    0x01: { name: "LD", addressMode: "RD16", register1: "BC"},
    0x02: { name: "LD", addressMode: "RD16", register1: "BC", register2: "A"},
    0x05: { name: "DEC", addressMode: "R", register1: "B"},
    0x06: { name: "LD", addressMode: "RD8", register1: "B"},  // reads B register as an 8 bit
    0x08: { name: "LD", addressMode: "A16R", register1: "None", register2 : "SP"},
    0x0A: { name: "LD", addressMode: "RMR", register1: "A", register2: "BC"},
    0x0E: { name: "LD", addressMode: "RD8", register1: "C"},  // reads C register as an 8 bit

    // DE
    0x11: { name: "LD", addressMode: "RD16", register1: "DE"},
    0x12: { name: "LD", addressMode: "MRR", register1: "DE", register2: "A"},
    0x15: { name: "DEC", addressMode: "R", register1: "D"},
    0x16: { name: "LD", addressMode: "RD8", register1: "D"}, 
    0x1A: { name: "LD", addressMode: "RMR", register1: "A", register2: "DE"},
    0x1E: { name: "LD", addressMode: "RD8", register1: "E"},     

    // HL
    0x21: { name: "LD", addressMode: "RD16", register1: "HL"},
    0x22: { name: "LD", addressMode: "HLIR", register1: "HL", register2: "A"},
    0x25: { name: "DEC", addressMode: "R", register1: "H"},
    0x26: { name: "LD", addressMode: "RD8", register1: "H"},  
    0x2A: { name: "LD", addressMode: "RHLI", register1: "A", register2: "HL"},
    0x2E: { name: "LD", addressMode: "RD8", register1: "L"}, 

    // SP
    0x31: { name: "LD", addressMode: "RD16", register1: "SP"},
    0x32: { name: "LD", addressMode: "HLDR", register1: "HL", register2: "A"},
    0x35: { name: "DEC", addressMode: "R", register1: "HL"},
    0x36: { name: "LD", addressMode: "MRD8", register1: "HL"},
    0x3A: { name: "LD", addressMode: "RHLD", register1: "A", register2: "HL"},
    0x3E: { name: "LD", addressMode: "RD8", register1: "A"},


    0xAF: { name: "XOR", addressMode: "R", register1: "A"}, 
    0xC3: { name: "JMP", addressMode: "D16"}, 
    0xF0: { name: "LDH", addressMode: "RD8", register1: "A"},
    0xF3: { name: "DI", addressMode: "IMP"},
}; 

