// Memory bus for the emulator
// This is the main memory bus for the emulator, it will handle all the memory reads and writes
/*
Start	End	    Description	                    Notes
0000	3FFF	16 KiB ROM bank 00	            From cartridge, usually a fixed bank
4000	7FFF	16 KiB ROM Bank 01~NN	        From cartridge, switchable bank via mapper (if any)
8000	9FFF	8 KiB Video RAM (VRAM)	        In CGB mode, switchable bank 0/1
A000	BFFF	8 KiB External RAM	            From cartridge, switchable bank if any
C000	CFFF	4 KiB Work RAM (WRAM)	
D000	DFFF	4 KiB Work RAM (WRAM)	        In CGB mode, switchable bank 1~7
E000	FDFF	Mirror of C000~DDFF (ECHO RAM)	Nintendo says use of this area is prohibited.
FE00	FE9F	Sprite attribute table (OAM)	
FEA0	FEFF	Not Usable	                    Nintendo says use of this area is prohibited
FF00	FF7F	I/O Registers	
FF80	FFFE	High RAM (HRAM)	
FFFF	FFFF	Interrupt Enable register (IE)	*/

import {cartRead, cartWrite} from "./cart.js";  
//import {}

// reads a 16bit address and returns an 8bit value
// address is a 16bit number
export function busRead(address){
    //console.log("Read: " + address.toString(16).toUpperCase());
    // only handles rom
    if (address < 0x8000){
        return cartRead(address);
    } else if (address < 0xA000){
        // Char Map/Tile Data, TO DO with PPU
        return;
        throw new Error("Not implemented yet");
    } else if (address < 0xC000){
        // Cartridge RAM
        return cartRead(address);
    } else if (address < 0xE000){
        // Rom Bank 0, or Bank 1, switchable 
        // Working RAM, WRAM
        return lavishEmulator.ram.wramRead(address);
    } else if (address < 0xFE00){
        // reserved Echo RAM
        console.log("Reserved Memory");
        return 0;
    } else if (address < 0xFEA0){
        // Sprite Attribute Table, OAM
        // To Do
        return 0;
    } else if (address < 0xFF00){
        // Reserved unusable
        console.log("Reserved Memory");
        return 0;
    } else if (address < 0xFF80){
        // I/O Registers, controllers and so on
        //console.log(address.toString(16).toUpperCase());
        return;
        //throw new Error("Not implemented yet");
    } else if (address == 0xFFFF){
        // CPU Enable Register ...
        // TO DO
        return lavishEmulator.cpu.getIERegister();
        throw new Error("Not implemented yet");
    } else {
        return lavishEmulator.ram.hramRead(address) // High RAM
    }

    console.log(lavishEmulator.cpu.currentInstruction)
    console.log(lavishEmulator.cpu.fetchedData)
    console.log(address.toString(16).toUpperCase())
    throw new Error("Out of bounds, have not implemented memory for address: " + address.toString(16).toUpperCase());
}

// reads a 16bit address and writes an 8bit value
export function busWrite(address, value){
    if (address < 0x8000){
        cartWrite(address, value);
    } else if (address < 0xA000){
        // Char Map/Tile Data, TO DO with PPU
        // unsupported for now
    } else if (address < 0xC000){
        cartWrite(address, value);
    } else if (address < 0xE000){
        lavishEmulator.ram.wramWrite(address, value);
    } else if (address < 0xFE00){
        // reserved Echo RAM
    } else if (address < 0xFEA0){
        // Sprite Attribute Table, OAM
        // To Do
    } else if (address < 0xFF00){
        // Reserved unusable
    } else if (address < 0xFF80){
        // I/O Registers, controllers and so on
    } else if (address == 0xFFFF){
        return lavishEmulator.cpu.setIERegister(value);
    } else {
        lavishEmulator.ram.hramWrite(address, value); // High RAM
    }

}

export function busRead16(address){
    // read the two 8bit values and combine them into a 16bit value
    var lowByte = busRead(address);
    var highByte = busRead(address + 1);

    return lowByte | (highByte << 8);
}


// reads a 16bit address and returns a 16bit value
export function busWrite16(address , value){
    busWrite(address + 1, (value >> 8) & 0xFF);
    busWrite(address, value & 0xFF);
}