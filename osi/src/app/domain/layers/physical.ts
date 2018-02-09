import { Format, Symbol } from '../symbol';

export interface Config {
  readonly format: Format;
  readonly blockSize: number;
}

export interface PhysicalBlock {
  readonly index: number;
  readonly format: Format;
  readonly symbols: string;
}

export class PhysicalLayer {
  process(cfg: Config, bytes: number[]): PhysicalBlock[] {
    const blocks: PhysicalBlock[] = [];

    let blockIndex = 0;
    let currentSymbols = '';
    for (let i = 0; i < bytes.length; ++i) {
      currentSymbols += Symbol.fromByte(bytes[i], cfg.format);

      if (this.endsOfBlock(cfg, i)) {
        blocks.push({
          index: blockIndex,
          format: cfg.format,
          symbols: currentSymbols
        });

        currentSymbols = '';
        ++blockIndex;
      }
    }

    if (currentSymbols !== '') {
      const padded = currentSymbols.padEnd(
        this.maxBlockLength(cfg),
        Symbol.nullOf(cfg.format)
      );

      blocks.push({
        index: blockIndex,
        format: cfg.format,
        symbols: padded
      });
    }

    return blocks;
  }

  unprocess(cfg: Config, blocks: PhysicalBlock[]): number[] {
    const byteSize = Symbol.sizeOfByteFor(cfg.format);
    const bytes: number[] = [];

    for (const block of blocks) {
      this.ensureSameFormat(cfg, block);

      for (let i = 0; i < block.symbols.length; i += byteSize) {
        const byteSymbols = block.symbols.substr(i, byteSize);
        bytes.push(Symbol.toByte(byteSymbols, cfg.format));
      }
    }

    return bytes;
  }

  private endsOfBlock(cfg: Config, idx: number): boolean {
    const maxIndex = cfg.blockSize - 1;
    return idx % cfg.blockSize === maxIndex;
  }

  private maxBlockLength(cfg: Config): number {
    return cfg.blockSize * Symbol.sizeOfByteFor(cfg.format);
  }

  private ensureSameFormat(cfg: Config, block: PhysicalBlock) {
    if (cfg.format !== block.format) {
      throw new Error(
        `Block's (${Format[block.format]}) and` +
          ` Config's (${Format[cfg.format]})` +
          ` format mismatched.`
      );
    }
  }
}
