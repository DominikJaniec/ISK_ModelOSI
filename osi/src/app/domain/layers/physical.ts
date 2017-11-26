import { Format, Symbol } from '../symbol';

export class PhysicalLayer {
  displayFormat = Format.ASCII;
  blockSize = 16;
  content: Block[] = [];

  load(content: string) {
    const bytes = toBytes(content);
    const blocks: Block[] = [];

    let index = 0;
    let current = '';
    for (let i = 0; i < bytes.length; ++i) {
      current += Symbol.fromByte(bytes[i], this.displayFormat);

      if (this.nextBlock(i)) {
        blocks.push(this.makeBlock(index, current));

        current = '';
        ++index;
      }
    }

    this.content = blocks;
  }
  private makeBlock(index: number, symbols: string) {
    return new Block(index, this.displayFormat, symbols);
  }

  private nextBlock(i: number): boolean {
    return i % this.blockSize === this.blockSize - 1;
  }
}

export class Block {
  constructor(
    readonly index: number,
    readonly format: Format,
    readonly symbols: string
  ) {}
}

function toBytes(data: string): number[] {
  // TODO: We should deal also with other coding than ASCII.
  return data.split('').map(c => c.charCodeAt(0));
}
