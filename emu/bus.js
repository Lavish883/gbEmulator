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

// reads a 16bit address and returns an 8bit value
// address is a 16bit number
export function busRead(address){
    // only handles rom
    if (address < 0x8000){
        return cartRead(address);
    }


    return -1;
}

// reads a 16bit address and writes an 8bit value
export function busWrite(address, value){
    if (address < 0x8000){
        cartWrite(address, value);
        return;
    }
}