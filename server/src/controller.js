import { constants } from './constants';

export default class Controller {
  #users = new Map();
  #rooms = new Map();

  constructor({ socketServer }) {
    this.socketServer = socketServer;
  }

  onNewConnection(socket) {
    const { id } = socket;
    console.log('connection stablished with', id);
    const userData = { id, socket };
    this.#updateGlobalUserData(id, userData);

    socket.on('data', this.#onSocketData(id));
    socket.on('error', this.#onSocketClosed(id));
    socket.on('end', this.#onSocketClosed(id));
  }

  async joinRoom(socketId, data) {
    const userData = JSON.parse(data);
    console.log(`${userData} joined!`[socketId]);

    const { roomId } = userData;

    const user = this.#updateGlobalUserData(socketId, data);
    const users = this.#joinUserOnRoom(roomId, user);

    const currentUsers = Array.from(users.values()).map(({ id, username }) => ({
      id,
      username,
    }));
    this.socketServer.sendMessage(
      user.socket,
      constants.event.UPDATE_USERS,
      currentUsers,
    );
  }

  #joinUserOnRoom(roomId, user) {
    const usersOnRoom = this.#rooms.get(roomId) ?? new Map();

    usersOnRoom.set(user.id, user);
    this.#rooms.set(roomId, usersOnRoom);
  }

  #onSocketData(id) {
    return (data) => {
      try {
        const { event, message } = JSON.parse(data);
        this[event](id, message);
      } catch (error) {
        console.error(`wrong event format!`, data.toString());
      }
    };
  }

  #onSocketClosed(id) {
    return () => {
      console.log('onSocketClosed with', id);
    };
  }

  #updateGlobalUserData(socketId, userData) {
    const users = this.#users;
    const user = users.get(socketId) ?? {};

    const updatedUserData = {
      ...user,
      ...userData,
    };

    users.set(socketId, updatedUserData);

    return users.get(socketId);
  }
}
