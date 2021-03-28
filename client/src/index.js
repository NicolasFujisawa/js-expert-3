/*
node index.js \
        --username nicolasf \
        --room sala01 \
        --host localhost
*/

import TerminalController from './terminalController.js';
import Events from 'events';
import CliConfig from './cliConfig.js';
import SocketClient from './socket.js';
import EventManager from './eventManager.js';

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);

const componentEmitter = new Events();

const socketClient = new SocketClient(config);
await socketClient.initialize();

const eventManager = new EventManager({ componentEmitter, socketClient });
const data = {
  roomId: config.room,
  username: config.username,
};
eventManager.joinRoomAndWaitForMessages(data);

const controller = new TerminalController();
await controller.initializeTable(componentEmitter);
