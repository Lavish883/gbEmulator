import { loadCartridge, cartridgeTypeDict, newLicenseeCodeDict, oldLicenseeCodeDict, ramSizeDict , romSizeDict } from "./cart.js";

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getTitle() {
    var title = "";
    for (var i = 0x0134; i <= 0x0143; i++) {
        title += String.fromCharCode(lavishEmulator.romData.getUint8(i));
    }
    return title;
}

function getLicenseeCode() {
    // check 0x0014B in the ROM data, to see if it uses the new or old licensee code
    // toString(16) converts the number to a hex string
    if (lavishEmulator.romData.getUint8(0x0014B).toString(16) == 33) {
        console.log("New licensee code");
        return newLicenseeCodeDict[lavishEmulator.romData.getUint8(0x0145).toString(16).toUpperCase()];
    } else {
        console.log("Old licensee code");
        return oldLicenseeCodeDict[lavishEmulator.romData.getUint8(0x014B).toString(8).toUpperCase()];
    }
}

export async function emulatorRun(romFile) {
    // There is no ROM file selected, and return -1
    if (romFile == undefined || romFile == null) {
        console.log("No ROM file selected");
        return -1;
    }

    var romData = await loadCartridge(romFile);
    lavishEmulator.romData = romData;
    // read the Cartidge header with Uint8Array
    // if the ROM file fails to load, then return -1
    if (romData == -1) {
        alert("Error loading ROM file: " + error);
    }
    // game Info
    var licensedBy = getLicenseeCode();
    var cartridgeType = cartridgeTypeDict[lavishEmulator.romData.getUint8(0x0147).toString(16).toUpperCase()];
    var title = getTitle();
    var romVerison = lavishEmulator.romData.getUint8(0x014C);
    var ramSize = ramSizeDict[lavishEmulator.romData.getUint8(0x0149).toString(16).toUpperCase()];
    var romSize = romSizeDict[lavishEmulator.romData.getUint8(0x0148).toString(16).toUpperCase()];

    console.log("Cartridge loaded successfully: " + romFile);
    console.log("Title:" + title);
    console.log("Cartridge type: " + cartridgeType);
    console.log("ROM Size: " + romSize);
    console.log("RAM Size: " + ramSize);
    console.log("Licensed by: " + licensedBy);
    console.log("ROM Version: " + romVerison);

    // do CheckSum
    var checksum = 0;
    for (var i = 0x0134; i <= 0x014C; i++) {
        checksum = checksum - lavishEmulator.romData.getUint8(i) - 1;
    }
    if (checksum && 0xFF) {
        console.log("Checksum is correct");
    } else {
        alert("Checksum is incorrect");
        return -1;
    }

    // makes a game loop, which will run the emulator
    while (lavishEmulator.running) {
        // if the emulator is paused, then don't run the emulator
        if (lavishEmulator.paused) {
            await sleep(10);
            lavishEmulator.paused = false;
            continue;
        }

        if (lavishEmulator.ticks % 10 == 0) {
            lavishEmulator.paused = true;
            // console.log("updating screen")
        }

        lavishEmulator.ticks++;
    }
}