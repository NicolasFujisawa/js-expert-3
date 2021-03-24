import TerminalController from "./src/terminalController.js";
import Events from "events";

const componentEmitter = new Events();

const controller = new TerminalController();
await controller.initializeTable(componentEmitter);
