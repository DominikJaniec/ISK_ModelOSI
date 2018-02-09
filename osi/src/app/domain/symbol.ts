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

  static nullOf(kind: Format): string {
    return Symbol.fromByte(0, kind);
  }

  static fromByte(byte: number, kind: Format): string {
    if (byte < 0 || byte > Symbol.BYTE_MAX) {
      throw Symbol.invalidCodeError(byte);
    }

    return kind === Format.ASCII
      ? String.fromCharCode(byte)
      : Symbol.toSymbolsOf(kind, byte);
  }

  static toByte(symbols: string, kind: Format): number {
    if (symbols.length !== Symbol.sizeOfByteFor(kind)) {
      throw Symbol.invalidSymbolOf(kind, symbols);
    }

    switch (kind) {
      case Format.ASCII:
        return symbols.charCodeAt(0);
      case Format.Binary:
        return Symbol.fromBinary(symbols);
      default:
        throw new Error(`Not implemented for format: ${Format[kind]}.`);
    }
  }

  static sizeOfByteFor(kind: Format): number {
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
    const size = Symbol.sizeOfByteFor(kind);
    const shift = Symbol.shiftFor(kind);
    const mask = Symbol.maskFor(kind);

    const symbols: string[] = [];
    let current = value;
    for (let i = 0; i < size; ++i) {
      // tslint:disable:no-bitwise
      const index = current & mask;
      current = current >> shift;
      // tslint:enable:no-bitwise

      symbols.unshift(Symbol.SYMBOLS[index]);
    }

    return symbols.join('');
  }

  private static fromBinary(symbols: string): number {
    const size = Symbol.sizeOfByteFor(Format.Binary);
    let factor = (Symbol.BYTE_MAX + 1) / 2;

    let byteValue = 0;
    for (let i = 0; i < size; ++i) {
      const bit = symbols.charAt(i) === '0' ? 0 : 1;
      byteValue += factor * bit;
      factor /= 2;
    }

    return byteValue;
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

  private static invalidSymbolOf(format: Format, symbol: string): Error {
    return new Error(
      `Given symbol: '${symbol}' could not represents` +
        ` any BYTE in format: ${Format[format]}.`
    );
  }

  private static invalidFormatError(format: Format): Error {
    return new Error(
      `Given: '${Format[format]}' is invalid or unknown as Format.`
    );
  }
}
