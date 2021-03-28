/*
node index.js \
        --username nicolasf \
        --room sala01 \
        --host localhost
*/

import TerminalController from './src/terminalController.js';
import Events from 'events';
import CliConfig from './src/cliConfig.js';
import SocketClient from './src/socket.js';

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.paseArguments(commands);

console.log(config);
const componentEmitter = new Events();

const socketClient = new SocketClient(config);
await socketClient.initialize();

const controller = new TerminalController();
await controller.initializeTable(componentEmitter);
