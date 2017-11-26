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
  readonly content: Symbol[];
}

export class Symbol {
  readonly kind: Format;
  readonly value: string;
}
