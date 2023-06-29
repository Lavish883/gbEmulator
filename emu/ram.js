export class ram {
    constructor() {
        this.wram = new Uint8Array(0x2000);
        this.hram = new Uint8Array(0x80);
    }
    wramRead(address) {
        address -= 0xC000;
        return this.wram[address];
    }
    // reads a 16bit address and writes an 8bit value
    wramWrite(address, value) {
        address -= 0xC000;
        this.wram[address] = value;
       // alert("wramWrite: " + address.toString(16).toUpperCase() + " " + value.toString(16).toUpperCase());
    }
    hramRead(address) {
        address -= 0xFF80;
        return this.hram[address];
    }
    // reads a 16bit address and writes an 8bit value
    hramWrite(address, value) {
        address -= 0xFF80;
        this.hram[address] = value;
        //alert("hramWrite: " + address.toString(16).toUpperCase() + " " + value.toString(16).toUpperCase())
    }
}