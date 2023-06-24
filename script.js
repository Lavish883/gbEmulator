import {emulatorRun} from "./emu/main.js";
import { instructions } from "./emu/instructions.js";

// make global holder, which will hold all the data for the current state for the emulator
var lavishEmulator = {
    "running": true,
    "paused": false,
    "ticks": 0,
    "cpuCycles": 0,
    "instructions": instructions
};

lavishEmulator.emuCycles = (incrementBy) => {
    lavishEmulator.cpuCycles += incrementBy;
};

// make it to the window object, so it can be accessed from anywhere
window.lavishEmulator = lavishEmulator;

emulatorRun("roms/tetris.gb");