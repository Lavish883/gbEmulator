/*
    name = Instruction name
        NOP: No operation
        JMP: Jump to address
        LD: Load value into register
        DEC: Decrement register
        DI: Disable interrupts
        JR: Jump relative
        INC: Increment register
        RET: Return from subroutine
        RETI: Return from interrupt
        CALL: Call subroutine
        RST: unconditional call to address

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

    // Increment instructions
    0x03: { name: "INC", addressMode: "R", register1: "BC"},
    0X04: { name: "INC", addressMode: "R", register1: "B"},
    0x0C: { name: "INC", addressMode: "R", register1: "C"},
    
    0x13: { name: "INC", addressMode: "R", register1: "DE"},
    0x14: { name: "INC", addressMode: "R", register1: "D"},
    0x1C: { name: "INC", addressMode: "R", register1: "E"},
    
    0x23: { name: "INC", addressMode: "R", register1: "HL"},
    0x24: { name: "INC", addressMode: "R", register1: "H"},
    0x2C: { name: "INC", addressMode: "R", register1: "L"},
    
    0x33: {name: "INC", addressMode: "R", register1: "SP"},
    0x34: { name: "INC", addressMode: "MR", register1: "HL"},
    0x3C: { name: "INC", addressMode: "R", register1: "A"},
    
    // Decrement instructions
    0x05: { name: "DEC", addressMode: "R", register1: "B"},
    0x0B: { name: "DEC", addressMode: "R", register1: "BC"},
    0x0D: { name: "DEC", addressMode: "R", register1: "C"},

    0x15: { name: "DEC", addressMode: "R", register1: "D"},
    0x1B: { name: "DEC", addressMode: "R", register1: "DE"},
    0x1D: { name: "DEC", addressMode: "R", register1: "E"},

    0x25: { name: "DEC", addressMode: "R", register1: "H"},
    0x2B: { name: "DEC", addressMode: "R", register1: "HL"},
    0x2D: { name: "DEC", addressMode: "R", register1: "L"},

    0x35: { name: "DEC", addressMode: "MR", register1: "HL"},
    0x3B: { name: "DEC", addressMode: "R", register1: "SP"},
    0x3D: { name: "DEC", addressMode: "R", register1: "A"},





    // BC
    0x01: { name: "LD", addressMode: "RD16", register1: "BC"},
    0x02: { name: "LD", addressMode: "RD16", register1: "BC", register2: "A"},
    0x06: { name: "LD", addressMode: "RD8", register1: "B"},  // reads B register as an 8 bit
    0x08: { name: "LD", addressMode: "A16R", register1: "None", register2 : "SP"},
    0x0A: { name: "LD", addressMode: "RMR", register1: "A", register2: "BC"},
    0x0E: { name: "LD", addressMode: "RD8", register1: "C"},  // reads C register as an 8 bit

    // DE
    0x11: { name: "LD", addressMode: "RD16", register1: "DE"},
    0x12: { name: "LD", addressMode: "MRR", register1: "DE", register2: "A"},
    0x15: { name: "DEC", addressMode: "R", register1: "D"},
    0x16: { name: "LD", addressMode: "RD8", register1: "D"}, 
    0x18: {name: "JR", addressMode: "D8", register1: "None", register2: "None"},
    0x1A: { name: "LD", addressMode: "RMR", register1: "A", register2: "DE"},
    0x1E: { name: "LD", addressMode: "RD8", register1: "E"},     

    // HL
    0x20: { name: "JR", addressMode: "D8", register1: "None", register2: "None", condition: "NZ" },
    0x21: { name: "LD", addressMode: "RD16", register1: "HL"},
    0x22: { name: "LD", addressMode: "HLIR", register1: "HL", register2: "A"},
    0x25: { name: "DEC", addressMode: "R", register1: "H"},
    0x26: { name: "LD", addressMode: "RD8", register1: "H"},
    0x28: { name : "JR", addressMode: "D8", register1: "None", register2: "None", condition: "Z"},  
    0x2A: { name: "LD", addressMode: "RHLI", register1: "A", register2: "HL"},
    0x2E: { name: "LD", addressMode: "RD8", register1: "L"}, 

    // SP
    0x30: {name: "JR", addressMode: "D8", register1: "None", register2: "None", condition: "NC"},
    0x31: { name: "LD", addressMode: "RD16", register1: "SP"},
    0x32: { name: "LD", addressMode: "HLDR", register1: "HL", register2: "A"},
    0x35: { name: "DEC", addressMode: "R", register1: "HL"},
    0x36: { name: "LD", addressMode: "MRD8", register1: "HL"},
    0x38: { name : "JR", addressMode: "D8", register1: "None", register2: "None", condition: "C"},  
    0x3A: { name: "LD", addressMode: "RHLD", register1: "A", register2: "HL"},
    0x3E: { name: "LD", addressMode: "RD8", register1: "A"},

    0x40: { name: "LD", addressMode: "RR", register1: "B", register2: "B"},
    0x41: { name: "LD", addressMode: "RR", register1: "B", register2: "C"},
    0x42: { name: "LD", addressMode: "RR", register1: "B", register2: "D"},
    0x43: { name: "LD", addressMode: "RR", register1: "B", register2: "E"},
    0x44: { name: "LD", addressMode: "RR", register1: "B", register2: "H"},
    0x45: { name: "LD", addressMode: "RR", register1: "B", register2: "L"},
    0x46: { name: "LD", addressMode: "MRR", register1: "B", register2: "HL"},
    0x47: { name: "LD", addressMode: "RR", register1: "B", register2: "A"},
    0x48: { name: "LD", addressMode: "RR", register1: "C", register2: "B"},
    0x49: { name: "LD", addressMode: "RR", register1: "C", register2: "C"},
    0x4A: { name: "LD", addressMode: "RR", register1: "C", register2: "D"},
    0x4B: { name: "LD", addressMode: "RR", register1: "C", register2: "E"},
    0x4C: { name: "LD", addressMode: "RR", register1: "C", register2: "H"},
    0x4D: { name: "LD", addressMode: "RR", register1: "C", register2: "L"},
    0x4E: { name: "LD", addressMode: "MRR", register1: "C", register2: "HL"},
    0x4F: { name: "LD", addressMode: "RR", register1: "C", register2: "A"},
    
    
    0x50: { name: "LD", addressMode: "RR", register1: "D", register2: "B"},
    0x51: { name: "LD", addressMode: "RR", register1: "D", register2: "C"},
    0x52: { name: "LD", addressMode: "RR", register1: "D", register2: "D"},
    0x53: { name: "LD", addressMode: "RR", register1: "D", register2: "E"},
    0x54: { name: "LD", addressMode: "RR", register1: "D", register2: "H"},
    0x55: { name: "LD", addressMode: "RR", register1: "D", register2: "L"},
    0x56: { name: "LD", addressMode: "MRR", register1: "D", register2: "HL"},
    0x57: { name: "LD", addressMode: "RR", register1: "D", register2: "A"},
    0x58: { name: "LD", addressMode: "RR", register1: "E", register2: "B"},
    0x59: { name: "LD", addressMode: "RR", register1: "E", register2: "C"},
    0x5A: { name: "LD", addressMode: "RR", register1: "E", register2: "D"},
    0x5B: { name: "LD", addressMode: "RR", register1: "E", register2: "E"},
    0x5C: { name: "LD", addressMode: "RR", register1: "E", register2: "H"},
    0x5D: { name: "LD", addressMode: "RR", register1: "E", register2: "L"},
    0x5E: { name: "LD", addressMode: "MRR", register1: "E", register2: "HL"},
    0x5F: { name: "LD", addressMode: "RR", register1: "E", register2: "A"},

    0x60: { name: "LD", addressMode: "RR", register1: "H", register2: "B"},
    0x61: { name: "LD", addressMode: "RR", register1: "H", register2: "C"},
    0x62: { name: "LD", addressMode: "RR", register1: "H", register2: "D"},
    0x63: { name: "LD", addressMode: "RR", register1: "H", register2: "E"},
    0x64: { name: "LD ", addressMode: "RR", register1: "H", register2: "H"},
    0x65: { name: "LD", addressMode: "RR", register1: "H", register2: "L"},
    0x66: { name: "LD", addressMode: "MRR", register1: "H", register2: "HL"},
    0x67: { name: "LD", addressMode: "RR", register1: "H", register2: "A"},
    0x68: { name: "LD", addressMode: "RR", register1: "L", register2: "B"},
    0x69: { name: "LD", addressMode: "RR", register1: "L", register2: "C"},
    0x6A: { name: "LD", addressMode: "RR", register1: "L", register2: "D"},
    0x6B: { name: "LD", addressMode: "RR", register1: "L", register2: "E"},
    0x6C: { name: "LD", addressMode: "RR", register1: "L", register2: "H"},
    0x6D: { name: "LD", addressMode: "RR", register1: "L", register2: "L"},
    0x6E: { name: "LD", addressMode: "MRR", register1: "L", register2: "HL"},
    0x6F: { name: "LD", addressMode: "RR", register1: "L", register2: "A"},

    0x70: { name: "LD", addressMode: "MRR", register1: "HL", register2: "B"},
    0x71: { name: "LD", addressMode: "MRR", register1: "HL", register2: "C"},
    0x72: { name: "LD", addressMode: "MRR", register1: "HL", register2: "D"},
    0x73: { name: "LD", addressMode: "MRR", register1: "HL", register2: "E"},
    0x74: { name: "LD", addressMode: "MRR", register1: "HL", register2: "H"},
    0x75: { name: "LD", addressMode: "MRR", register1: "HL", register2: "L"},
    0x76: { name: "HALT", addressMode: "IMP"},
    0x77: { name: "LD", addressMode: "MRR", register1: "HL", register2: "A"},
    0x78: { name: "LD", addressMode: "RR", register1: "A", register2: "B"},
    0x79: { name: "LD", addressMode: "RR", register1: "A", register2: "C"},
    0x7A: { name: "LD", addressMode: "RR", register1: "A", register2: "D"},
    0x7B: { name: "LD", addressMode: "RR", register1: "A", register2: "E"},
    0x7C: { name: "LD", addressMode: "RR", register1: "A", register2: "H"},
    0x7D: { name: "LD", addressMode: "RR", register1: "A", register2: "L"},
    0x7E: { name: "LD", addressMode: "MRR", register1: "A", register2: "HL"},
    0x7F: { name: "LD", addressMode: "RR", register1: "A", register2: "A"},


    0xAF: { name: "XOR", addressMode: "R", register1: "A"}, 

    0xC0: {name: "RET", addressMode: "IMP", register1: "None", register2: "None", condition: "NZ"},
    0xC1: {name: "POP", addressMode: "R", register1: "BC", register2: "None"},
    0xC2: {name: "JMP", addressMode: "D16", register1: "None", register2: "None", condition: "NZ"},
    0xC3: { name: "JMP", addressMode: "D16"}, 
    0xC4: { name: "CALL", addressMode: "D16", register1: "None", register2: "None", condition: "NZ"},
    0xC5: {name: "PUSH", addressMode: "R", register1: "BC", register2: "None"},
    0xC7: {name: "RST", addressMode: "IMP", register1: "None", register2: "None", condition: undefined, "param": 0x00},
    0xC8: { name: "RET", addressMode: "IMP", register1: "None", register2: "None", condition: "Z"},
    0xC9: {name : "RET", addressMode: "IMP", register1: "None", register2: "None"},
    0xCA: { name: "JMP", addressMode: "D16", register1: "None", register2: "None", condition: "Z"},
    0xCC: { name: "CALL", addressMode: "D16", register1: "None", register2: "None", condition: "Z"},
    0xCD: { name: "CALL", addressMode: "D16", register1: "None", register2: "None"},

    0xD0: {name: "RET", addressMode: "IMP", register1: "None", register2: "None", condition: "NC"},
    0xD1: {name: "POP", addressMode: "R", register1: "DE", register2: "None"},
    0xD2: {name: "JMP", addressMode: "D16", register1: "None", register2: "None", condition: "NC"},
    0xD4: {name: "CALL", addressMode: "D16", register1: "None", register2: "None", condition: "NC"},
    0xD5: {name: "PUSH", addressMode: "R", register1: "DE", register2: "None"},
    0xD7: {name: "RST", addressMode: "IMP", register1: "None", register2: "None", condition: undefined, "param": 0x10},
    0xD8: {name: "RET", addressMode: "IMP", register1: "None", register2: "None", condition: "C"}, 
    0xD9: {name: "RETI", addressMode: "IMP", register1: "None", register2: "None"},
    0xDA: {name : "JMP", addressMode: "D16", register1: "None", register2: "None", condition: "C"},
    0xDC: {name: "CALL", addressMode: "D16", register1: "None", register2: "None", condition: "C"}, 
    0xDF: {name: "RST", addressMode: "IMP", register1: "None", register2: "None", condition: undefined, "param": 0x18},

    0xE0: {name: "LDH", addressMode: "A8R", register1:  "None", register2: "A"},
    0xE1: {name: "POP", addressMode: "R", register1: "HL", register2: "None"},
    0xE2: { name: "LD", addressMode: "MRR", register1: "C", register2: "A"},
    0xE5: {name: "PUSH", addressMode: "R", register1: "HL", register2: "None"},
    0xE7: {name: "RST", addressMode: "IMP", register1: "None", register2: "None", condition: undefined, "param": 0x20},
    0xE9: {name : "JMP", addressMode: "MR", register1: "HL", register2: "None"}, 
    0xEA: { name: "LD", addressMode: "A16R", register1: "None", register2: "A"},
    0xEF: {name: "RST", addressMode: "IMP", register1: "None", register2: "None", condition: undefined, "param": 0x28},

    
   // 0xFx

    0xF0: { name: "LDH", addressMode: "RA8", register1: "A", register2: "None"},
    0xF1: {name: "POP", addressMode: "R", register1: "AF", register2: "None"},
    0xF2: { name: "LD", addressMode: "RMR", register1: "A", register2: "C"},
    0xF3: { name: "DI", addressMode: "IMP"},
    0xF5: {name: "PUSH", addressMode: "R", register1: "AF", register2: "None"},
    0xF7: {name: "RST", addressMode: "IMP", register1: "None", register2: "None", condition: undefined, "param": 0x30},
    0xFA: { name: "LD", addressMode: "RA16", register1: "A", register2: "None"},
    0xFF: {name: "RST", addressMode: "IMP", register1: "None", register2: "None", condition: undefined, "param": 0x38},
}; 


