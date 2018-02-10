import { Component } from '@angular/core';
import { BaseLayerComponent } from '../base-layer-component';
import { OrchestratorService } from '../../orchestrator.service';
import { LayerKind, LayerData, DataBlock } from '../../domain/layers';
import { Encoding, EncodingKind } from '../../domain/encoding';
import { Format } from '../../domain/symbol';
import {
  PhysicalLayer,
  PhysicalBlock,
  Config,
  SenderData
} from '../../domain/layers/physical';

export interface FormatOption {
  name: string;
  format: Format;
}

@Component({
  selector: 'app-physical-layer',
  templateUrl: './physical-layer.component.html',
  styleUrls: ['./physical-layer.component.css']
})
export class PhysicalLayerComponent extends BaseLayerComponent {
  private readonly layerLogic = new PhysicalLayer();
  private readonly transferFormat = Format.Binary;
  private sourceDataBytes: number[][] = [];

  readonly availableFormats: FormatOption[] = [
    { name: 'Binarnie', format: Format.Binary },
    { name: 'Czwórkowo', format: Format.Quaternary },
    { name: 'Ósemkowo', format: Format.Octal },
    { name: 'Szesnastkowo', format: Format.Hexadecimal },
    { name: 'Znaki ASCII', format: Format.ASCII }
  ];

  displayFormat = this.availableFormats[3];
  displayBlocks: PhysicalBlock[][] = [];
  transferBlockSize = 0;

  constructor(orchestrator: OrchestratorService) {
    super(orchestrator);
  }

  getLayerKind(): LayerKind {
    return LayerKind.Physical;
  }

  setDisplayBlocks() {
    if (!this.hasSource()) {
      return;
    }

    const cfg = this.getDisplayConfig();
    this.displayBlocks = this.getPhysicalBlocks(cfg);
  }

  processLayerData() {
    if (!this.hasSource()) {
      return;
    }

    this.processSourceLayerData();
    this.pushNextLayerData();
  }

  protected processSourceLayerData() {
    if (this.isSender()) {
      this.sourceDataBytes = this.sourceLayerData.blocks
        .map(block => this.extractSenderMessage(block))
        .map(msg => msg.split('').map(c => (c === '0' ? 0 : 1)));
      // .map(msg => Encoding.getBytesAs(EncodingKind.ASCII, msg));
    } else {
      const cfg = this.getTransferConfig();
      this.sourceDataBytes = this.sourceLayerData.blocks.map(packet => {
        const physicalBlocks = packet.bytes as PhysicalBlock[];
        return this.layerLogic.unprocess(cfg, physicalBlocks);
      });
    }

    this.setDisplayBlocks();
  }

  protected getNextLayerData(): LayerData {
    if (this.isSender()) {
      const cfg = this.getTransferConfig();
      const transferBlocks = this.getPhysicalBlocks(cfg).map(
        packet => ({ bytes: packet } as DataBlock)
      );

      return { blocks: transferBlocks };
    } else {
      const messageBlocks = this.sourceDataBytes
        .map(packet => Encoding.fromBytesAs(EncodingKind.ASCII, packet))
        .map(msg => ({ bytes: msg } as DataBlock));

      return { blocks: messageBlocks };
    }
  }

  protected clearRequested() {
    this.sourceDataBytes = [];
    this.displayBlocks = [];
  }

  private getDisplayConfig(): Config {
    return {
      format: this.displayFormat.format,
      blockSize: this.transferBlockSize
    };
  }

  private getTransferConfig(): Config {
    return {
      format: Format.Binary,
      blockSize: this.transferBlockSize
    };
  }

  private getPhysicalBlocks(cfg: Config): PhysicalBlock[][] {
    return this.sourceDataBytes.map(packet =>
      this.layerLogic.process(cfg, packet)
    );
  }

  private extractSenderMessage(dataBlocks: DataBlock): string {
    const senderData = dataBlocks.bytes as SenderData;
    this.transferBlockSize = senderData.blockSize;

    if (senderData.dataBytes instanceof Array) {
      const data = senderData.dataBytes as any[];
      if (data.length === 1) {
        const content = data[0];
        if (typeof content === 'string') {
          return content as string;
        }
      }
    }

    throw new Error(
      'DataBlock.bytes is expected to be Array with single string' +
        ' - as current implementation provides to Sender.'
    );
  }
}
