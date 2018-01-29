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
  process(cfg: Config, content: string): PhysicalBlock[] {
    const bytes = this.toBytes(content);
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
      // TODO: Should we provide padding to block's size?
      blocks.push({
        index: blockIndex,
        format: cfg.format,
        symbols: currentSymbols
      });
    }

    return blocks;
  }

  private toBytes(data: string): number[] {
    // TODO: We should deal also with other coding than ASCII.
    return data.split('').map(c => c.charCodeAt(0));
  }

  private endsOfBlock(cfg: Config, idx: number): boolean {
    const maxIndex = cfg.blockSize - 1;
    return idx % cfg.blockSize === maxIndex;
  }
}
