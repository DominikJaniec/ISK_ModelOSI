export enum Format {
  Binary,
  Quaternary,
  Octal,
  Hexadecimal,
  ASCII
}

export class Symbol {
  private static readonly SYMBOLS = '0123456789ABCDEF';
  private static readonly BYTE_MAX = 255;

  static fromByte(byte: number, kind: Format): string {
    if (byte < 0 || byte > Symbol.BYTE_MAX) {
      throw Symbol.invalidCodeError(byte);
    }

    return kind === Format.ASCII
      ? String.fromCharCode(byte)
      : Symbol.toSymbolsOf(kind, byte);
  }

  static sizeFor(kind: Format): number {
    switch (kind) {
      case Format.Binary:
        return 8;
      case Format.Quaternary:
        return 4;
      case Format.Octal:
        return 3;
      case Format.Hexadecimal:
        return 2;
      case Format.ASCII:
        return 1;
      default:
        throw Symbol.invalidFormatError(kind);
    }
  }

  private static toSymbolsOf(kind: Format, value: number): string {
    const size = Symbol.sizeFor(kind);
    const shift = Symbol.shiftFor(kind);
    const mask = Symbol.maskFor(kind);

    let symbols = '';
    let current = value;
    for (let i = 0; i < size; ++i) {
      // tslint:disable:no-bitwise
      const index = current & mask;
      current = current >> shift;
      // tslint:enable:no-bitwise

      symbols += Symbol.SYMBOLS[index];
    }

    return symbols;
  }

  private static shiftFor(kind: Format): number {
    switch (kind) {
      case Format.Binary:
        return 1;
      case Format.Quaternary:
        return 2;
      case Format.Octal:
        return 3;
      case Format.Hexadecimal:
        return 4;
      default:
        throw Symbol.invalidFormatError(kind);
    }
  }

  private static maskFor(kind: Format): number {
    switch (kind) {
      case Format.Binary:
        return 1;
      case Format.Quaternary:
        return 3;
      case Format.Octal:
        return 7;
      case Format.Hexadecimal:
        return 15;
      default:
        throw Symbol.invalidFormatError(kind);
    }
  }

  private static invalidCodeError(byte: number): Error {
    return new Error(`Given value: '${byte} is not a BYTE.`);
  }

  private static invalidFormatError(format: Format): Error {
    return new Error(`Given: '${format}' is invalid or unknown as Format.`);
  }
}
