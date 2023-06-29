export class cart {
    constructor(romFile) {
        var logo = new Uint8Array(0x30);

        var title = new Uint8Array(0x10);
        var newLicenseeCode = new Uint16Array();
        var sgbFlag = new Uint8Array();
        var cartridgeType = new Uint8Array();
        var romSize = new Uint8Array();
        var ramSize = new Uint8Array();
        var destinationCode = new Uint8Array();
        var oldLicenseeCode = new Uint8Array();
        var verison = new Uint8Array();
        var checksum = new Uint8Array();
        var globalChecksum = new Uint16Array();

        var romSize = new Uint32Array();
        var romData = new Uint8Array();
    }
}

// returns an 8 bit value, reads a 16bit address
export function cartRead(address) {
    // only handles rom rn
    //console.log("Read: " + '0x' + lavishEmulator.romData.getUint8(address).toString(16).toUpperCase());
    // is .toString(16) in the end to convert the deciaml number holded in the Uint8Array to hex
    // as the Uint8Array only holds decimal numbers
    // FF is highest in 8 bit, and you only return two
    if (address > lavishEmulator.romData.byteLength) {
        throw new Error("Address out of bounds: " + address);
    }
    //console.log(address)
    return '0x' + lavishEmulator.romData.getUint8(address).toString(16).toUpperCase().padStart(2, '0');
}


export function cartWrite(address, value) {
    // only handles rom rn
}


// Will return false if loading fails, true if loading succeeds
export async function loadCartridge(romFile) {
    try {
        var fetchedRom = await fetch(romFile);
        var romData = await fetchedRom.arrayBuffer();
        var dataView = new DataView(romData);

        return dataView;
    } catch (error) {
        console.log("Error loading ROM file: " + error);
        alert("Error loading ROM file: " + error);
        return -1;
    }
}

export var newLicenseeCodeDict = {
    "0": "None",
    "1": "Nintendo R&D1",
    "8": "Capcom",
    "13": "Electronic Arts",
    "18": "Hudson Soft",
    "19": "b-ai",
    "20": "kss",
    "22": "pow",
    "24": "PCM Complete",
    "25": "san-x",
    "28": "Kemco Japan",
    "29": "seta",
    "30": "Viacom",
    "31": "Nintendo",
    "32": "Bandai",
    "33": "Ocean/Acclaim",
    "34": "Konami",
    "35": "Hector",
    "37": "Taito",
    "38": "Hudson",
    "39": "Banpresto",
    "41": "Ubi Soft",
    "42": "Atlus",
    "44": "Malibu",
    "46": "angel",
    "47": "Bullet-Proof",
    "49": "irem",
    "50": "Absolute",
    "51": "Acclaim",
    "52": "Activision",
    "53": "American sammy",
    "54": "Konami",
    "55": "Hi tech entertainment",
    "56": "LJN",
    "57": "Matchbox",
    "58": "Mattel",
    "59": "Milton Bradley",
    "60": "Titus",
    "61": "Virgin",
    "64": "LucasArts",
    "67": "Ocean",
    "69": "Electronic Arts",
    "70": "Infogrames",
    "71": "Interplay",
    "72": "Broderbund",
    "73": "sculptured",
    "75": "sci",
    "78": "THQ",
    "79": "Accolade",
    "80": "misawa",
    "83": "lozc",
    "86": "Tokuma Shoten Intermedia",
    "87": "Tsukuda Original",
    "91": "Chunsoft",
    "92": "Video system",
    "93": "Ocean/Acclaim",
    "95": "Varie",
    "96": "Yonezawa/s’pal",
    "97": "Kaneko",
    "99": "Pack in soft",
    "A4": "Konami (Yu-Gi-Oh!)",
}

export var oldLicenseeCodeDict = {
    "0": "None",
    "1": "Nintendo",
    "8": "Capcom",
    "9": "Hot-B",
    "0A": "Jaleco",
    "0B": "Coconuts Japan",
    "0C": "Elite Systems",
    "13": "EA (Electronic Arts)",
    "18": "Hudsonsoft",
    "19": "ITC Entertainment",
    "1A": "Yanoman",
    "1D": "Japan Clary",
    "1F": "Virgin Interactive",
    "24": "PCM Complete",
    "25": "San-X",
    "28": "Kotobuki Systems",
    "29": "Seta",
    "30": "Infogrames",
    "31": "Nintendo",
    "32": "Bandai",
    "34": "Konami",
    "35": "HectorSoft",
    "38": "Capcom",
    "39": "Banpresto",
    "3C": ".Entertainment i",
    "3E": "Gremlin",
    "41": "Ubisoft",
    "42": "Atlus",
    "44": "Malibu",
    "46": "Angel",
    "47": "Spectrum Holoby",
    "49": "Irem",
    "4A": "Virgin Interactive",
    "4D": "Malibu",
    "4F": "U.S. Gold",
    "50": "Absolute",
    "51": "Acclaim",
    "52": "Activision",
    "53": "American Sammy",
    "54": "GameTek",
    "55": "Park Place",
    "56": "LJN",
    "57": "Matchbox",
    "59": "Milton Bradley",
    "5A": "Mindscape",
    "5B": "Romstar",
    "5C": "Naxat Soft",
    "5D": "Tradewest",
    "60": "Titus",
    "61": "Virgin Interactive",
    "67": "Ocean Interactive",
    "69": "EA (Electronic Arts)",
    "6E": "Elite Systems",
    "6F": "Electro Brain",
    "70": "Infogrames",
    "71": "Interplay",
    "72": "Broderbund",
    "73": "Sculptered Soft",
    "75": "The Sales Curve",
    "78": "t.hq",
    "79": "Accolade",
    "7A": "Triffix Entertainment",
    "7C": "Microprose",
    "7F": "Kemco",
    "80": "Misawa Entertainment",
    "83": "Lozc",
    "86": "Tokuma Shoten Intermedia",
    "8B": "Bullet-Proof Software",
    "8C": "Vic Tokai",
    "8E": "Ape",
    "8F": "I’Max",
    "91": "Chunsoft Co.",
    "92": "Video System",
    "93": "Tsubaraya Productions Co.",
    "95": "Varie Corporation",
    "96": "Yonezawa/S’Pal",
    "97": "Kaneko",
    "99": "Arc",
    "9A": "Nihon Bussan",
    "9B": "Tecmo",
    "9C": "Imagineer",
    "9D": "Banpresto",
    "9F": "Nova",
    "A1": "Hori Electric",
    "A2": "Bandai",
    "A4": "Konami",
    "A6": "Kawada",
    "A7": "Takara",
    "A9": "Technos Japan",
    "AA": "Broderbund",
    "AC": "Toei Animation",
    "AD": "Toho",
    "AF": "Namco",
    "B0": "acclaim",
    "B1": "ASCII or Nexsoft",
    "B2": "Bandai",
    "B4": "Square Enix",
    "B6": "HAL Laboratory",
    "B7": "SNK",
    "B9": "Pony Canyon",
    "BA": "Culture Brain",
    "BB": "Sunsoft",
    "BD": "Sony Imagesoft",
    "BF": "Sammy",
    "C0": "Taito",
    "C2": "Kemco",
    "C3": "Squaresoft",
    "C4": "Tokuma Shoten Intermedia",
    "C5": "Data East",
    "C6": "Tonkinhouse",
    "C8": "Koei",
    "C9": "UFL",
    "CA": "Ultra",
    "CB": "Vap",
    "CC": "Use Corporation",
    "CD": "Meldac",
    "CE": ".Pony Canyon or",
    "CF": "Angel",
    "D0": "Taito",
    "D1": "Sofel",
    "D2": "Quest",
    "D3": "Sigma Enterprises",
    "D4": "ASK Kodansha Co.",
    "D6": "Naxat Soft",
    "D7": "Copya System",
    "D9": "Banpresto",
    "DA": "Tomy",
    "DB": "LJN",
    "DD": "NCS",
    "DE": "Human",
    "DF": "Altron",
    "E0": "Jaleco",
    "E1": "Towa Chiki",
    "E2": "Yutaka",
    "E3": "Varie",
    "E5": "Epcoh",
    "E7": "Athena",
    "E8": "Asmik ACE Entertainment",
    "E9": "Natsume",
    "EA": "King Records",
    "EB": "Atlus",
    "EC": "Epic/Sony Records",
    "EE": "IGS",
    "F0": "A Wave",
    "F3": "Extreme Entertainment",
    "FF": "LJN",
}

export var cartridgeTypeDict = {
    "0": "ROM ONLY",
    "1": "MBC1",
    "2": "MBC1+RAM",
    "3": "MBC1+RAM+BATTERY",
    "5": "MBC2",
    "6": "MBC2+BATTERY",
    "8": "ROM+RAM 1",
    "9": "ROM+RAM+BATTERY 1",
    "B": "MMM01",
    "C": "MMM01+RAM",
    "D": "MMM01+RAM+BATTERY",
    "F": "MBC3+TIMER+BATTERY",
    "10": "MBC3+TIMER+RAM+BATTERY 2",
    "11": "MBC3",
    "12": "MBC3+RAM 2",
    "13": "MBC3+RAM+BATTERY 2",
    "19": "MBC5",
    "1A": "MBC5+RAM",
    "1B": "MBC5+RAM+BATTERY",
    "1C": "MBC5+RUMBLE",
    "1D": "MBC5+RUMBLE+RAM",
    "1E": "MBC5+RUMBLE+RAM+BATTERY",
    "20": "MBC6",
    "22": "MBC7+SENSOR+RUMBLE+RAM+BATTERY",
    "FC": "POCKET CAMERA",
    "FD": "BANDAI TAMA5",
    "FE": "HuC3",
    "FF": "HuC1+RAM+BATTERY",
}

export var ramSizeDict = {
    "0": "None",
    "1": "-",
    "2": "8 Kbytes",
    "3": "32 KBytes (4 banks of 8KBytes each)",
    "4": "128 KBytes (16 banks of 8KBytes each)",
    "5": "64 KBytes (8 banks of 8KBytes each)",
}

export var romSizeDict = {
    "0": "32 KBytes (no ROM banking)",
    "1": "64 KBytes (4 banks)",
    "2": "128 KBytes (8 banks)",
    "3": "256 KBytes (16 banks)",
    "4": "512 KBytes (32 banks)",
    "5": "1 MByte (64 banks)  - only 63 banks used by MBC1",
    "6": "2 MBytes (128 banks) - only 125 banks used by MBC1",
    "7": "4 MBytes (256 banks)",
    "8": "8 MBytes (512 banks)",
    "52": "1.1 MBytes (72 banks)",
    "53": "1.2 MBytes (80 banks)",
    "54": "1.5 MBytes (96 banks)",
}