export default class CliConfig {
  constructor({ username, room, hostUri }) {
    this.username = username;
    this.room = room;

    const { hostname, port, protocol } = new URL(hostUri);

    this.host = hostname;
    this.port = port;
    this.protocol = protocol.replace(/\W/, '');
  }

  static paseArguments(commands) {
    const cmd = new Map();

    for (const key in commands) {
      const index = parseInt(key);
      const command = commands[key];

      const commandPrefix = '--';
      if (!command.includes(commandPrefix)) {
        continue;
      }
      cmd.set(command.replace(commandPrefix, ''), commands[index + 1]);
    }

    return new CliConfig(Object.fromEntries(cmd));
  }
}