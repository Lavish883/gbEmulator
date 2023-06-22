import {emulatorRun} from "./emu/main.js";

// make global holder, which will hold all the data for the current state for the emulator
var lavishEmulator = {
    "running": true,
    "paused": false,
    "ticks": 0,
};

// make it to the window object, so it can be accessed from anywhere
window.lavishEmulator = lavishEmulator;

emulatorRun("roms/sf2.gb");