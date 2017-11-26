export class PhysicalLayer {
  content: Block[];
  blockSize: number;
  displayFormat: Format;
}

export enum Format {
  Binary,
  Octal,
  Hexadecimal
}

export class Block {
  readonly index: number;
  readonly format: Format;
  readonly symbols: string[];
}

class Symbol {
  private static readonly SYMBOLS = '0123456789ABCDF';

  static fromByte(byte: string, kind: Format): string {
    if (byte.length !== 1) {
      throw Symbol.toLongError(byte);
    }

    const byteCode = byte.charCodeAt(0);
    if (byteCode < 0 || byteCode > 255) {
      throw Symbol.invalidCodeError(byte, byteCode);
    }

    return Symbol.toValueOf(kind, byteCode);
  }

  private static toValueOf(kind: Format, code: number): string {
    switch (kind) {
      case Format.Binary:
        return Symbol.toBinary(code);
      case Format.Octal:
        return Symbol.toOctal(code);
      case Format.Hexadecimal:
        return Symbol.toHexadecimal(code);
      default:
        throw unknownFormatError(kind);
    }
  }

  private static toBinary(code: number): string {
    throw new Error('Not implemented!');
  }

  private static toOctal(code: number): string {
    throw new Error('Not implemented!');
  }

  private static toHexadecimal(code: number): string {
    throw new Error('Not implemented!');
  }

  private static sizeFor(kind: Format): number {
    switch (kind) {
      case Format.Binary:
        return 8;
      case Format.Octal:
        return 3;
      case Format.Hexadecimal:
        return 2;
      default:
        throw unknownFormatError(kind);
    }
  }

  private static toLongError(byte: string): Error {
    return new Error(`Given: '${byte}' has got size other than 1.`);
  }

  private static invalidCodeError(byte: string, code: number): Error {
    return new Error(
      `Given: '${byte} is not a BYTE, because its value resolves to: ${code}.`
    );
  }
}

function unknownFormatError(format: Format): Error {
  return new Error(`Given: '${format}' is not known as any Format.`);
}
