export class Endpoints {
  sender: Endpoint;
  receiver: Endpoint;

  constructor() {
    this.sender = new Endpoint();
    this.sender.regenerate();
    this.receiver = new Endpoint();
    this.receiver.regenerate();
  }

  regenerate() {
    this.sender.regenerate();
    this.receiver.regenerate();
  }
}

export class Endpoint {
  mac: string;
  ip: string;
  port: number;

  regenerate() {
    this.mac = NetMac.random();
    this.ip = NetIp4.random();
    this.port = NetPort.random();
  }
}

export class NetMac {
  static SEPARATORS = ['-', ':', '.'];
  static LENGTH = 12;
  static HEX_MATCH = new RegExp('^[0-9A-Fa-f]{' + NetMac.LENGTH + '}$');

  static random(): string {
    const hexPairs: String[] = [];
    for (let i = 0; i < NetMac.LENGTH; i += 2) {
      const pair = '' + NetMac.randomHex() + NetMac.randomHex();
      hexPairs.push(pair);
    }

    return hexPairs.join(NetMac.SEPARATORS[0]);
  }

  static isValid(address: string): boolean {
    let mac = address;
    for (const sep of NetMac.SEPARATORS) {
      mac = mac.replace(sep, '');
    }

    return NetMac.HEX_MATCH.test(mac);
  }

  private static randomHex(): String {
    const hexes = '0123456789ABCDEF';
    const index = Math.floor(Math.random() * hexes.length);

    return hexes[index];
  }
}

export class NetIp4 {
  static SEPARATOR = '.';
  static MAX_PART = 255;
  static MIN_PART = 1;

  static random(): string {
    const parts = [
      NetIp4.randomPart(),
      NetIp4.randomPart(),
      NetIp4.randomPart(),
      NetIp4.randomPart()
    ];

    return parts.join(NetIp4.SEPARATOR);
  }

  static isValid(address: string): boolean {
    const parts = address.split(NetIp4.SEPARATOR);
    if (parts.length !== 4) {
      return false;
    }

    for (const part of parts) {
      if (!NetIp4.isValidPart(part)) {
        return false;
      }
    }
    return true;
  }

  private static randomPart(): number {
    const start = NetIp4.MIN_PART;
    const limit = NetIp4.MAX_PART - start;

    return start + toInt(Math.random() * limit);
  }

  private static isValidPart(part: number | string): boolean {
    return isInt(part) && part >= NetIp4.MIN_PART && part <= NetIp4.MAX_PART;
  }
}

export class NetPort {
  static readonly MAX = 65535;

  static random(): number {
    return toInt(Math.random() * NetPort.MAX);
  }

  static isValid(port: number | string): boolean {
    return isInt(port) && port >= 0 && port <= NetPort.MAX;
  }
}

function isInt(value: any): boolean {
  if (isNaN(value)) {
    return false;
  }

  const n = parseFloat(value);
  // tslint:disable-next-line:no-bitwise
  return (n | 0) === n;
}

function toInt(value: number): number {
  // tslint:disable-next-line:no-bitwise
  return value | 0;
}
