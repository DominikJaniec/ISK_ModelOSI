import {
  Component,
  OnInit,
  OnDestroy,
  Input
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { OrchestratorService } from '../../orchestrator.service';
import { LayerContent } from '../layer-content';
import { TranslateService } from '../../translate.service';
import {
  LayerKind,
  Direction,
  LayerData,
  LayerId,
  DataBlock
} from '../../domain/layers';
import {
  Config,
  PhysicalBlock,
  PhysicalLayer
} from '../../domain/layers/physical';
import { Format } from '../../domain/symbol';
import { Encoding, EncodingKind } from '../../domain/encoding';

export interface FormatOption {
  name: string;
  format: Format;
}

@Component({
  selector: 'app-physical-layer',
  templateUrl: './physical-layer.component.html',
  styleUrls: ['./physical-layer.component.css']
})
export class PhysicalLayerComponent implements OnDestroy, LayerContent {
  private readonly layerLogic = new PhysicalLayer();
  private readonly transferFormat = Format.Binary;
  private clearStreamSubscription: Subscription;
  private layerDataSubscription: Subscription;
  private sourceLayerData: LayerData = { blocks: [] };
  private sourceDataBytes: number[][] = [];
  private direction: Direction;

  readonly availableBlockSizes = [8, 16, 20, 32, 42, 64, 100];
  readonly availableFormats: FormatOption[] = [
    { name: 'Binarnie', format: Format.Binary },
    { name: 'Czwórkowo', format: Format.Quaternary },
    { name: 'Ósemkowo', format: Format.Octal },
    { name: 'Szesnastkowo', format: Format.Hexadecimal },
    { name: 'Znaki ASCII', format: Format.ASCII }
  ];

  transferBlockSize = this.availableBlockSizes[1];
  displayFormat = this.availableFormats[3];
  displayBlocks: PhysicalBlock[][] = [];

  constructor(private readonly orchestrator: OrchestratorService) {}

  initialize(direction: Direction) {
    this.direction = direction;

    const observables = this.orchestrator.registerLayer(this.getLayerId());

    this.clearStreamSubscription = observables.clearStream.subscribe(() => {
      this.sourceLayerData = { blocks: [] };
      this.sourceDataBytes = [];
      this.displayBlocks = [];
    });

    this.layerDataSubscription = observables.layerData.subscribe(data => {
      this.sourceLayerData = data;
      this.processLayerData();
    });
  }

  ngOnDestroy() {
    this.clearStreamSubscription.unsubscribe();
    this.layerDataSubscription.unsubscribe();
  }

  isSender(): boolean {
    return this.direction === Direction.Sender;
  }

  setDisplayBlocks() {
    if (!this.hasData()) {
      return;
    }

    const cfg = this.getDisplayConfig();
    this.displayBlocks = this.getPhysicalBlocks(cfg);
  }

  processLayerData() {
    if (!this.hasData()) {
      return;
    }

    this.extractBytesFromSource();
    this.setDisplayBlocks();

    const layerData = this.makeNextLayerData();
    this.orchestrator.ready(this.getLayerId(), layerData);
  }

  private hasData(): boolean {
    return this.sourceLayerData.blocks.length > 0;
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

  private extractBytesFromSource() {
    if (this.isSender()) {
      this.sourceDataBytes = this.sourceLayerData.blocks
        .map(block => this.extractSenderMessage(block))
        .map(msg => Encoding.getBytesAs(EncodingKind.ASCII, msg));
    } else {
      const cfg = this.getTransferConfig();
      this.sourceDataBytes = this.sourceLayerData.blocks.map(packet => {
        const physicalBlocks = packet.bytes as PhysicalBlock[];
        return this.layerLogic.unprocess(cfg, physicalBlocks);
      });
    }
  }

  private makeNextLayerData(): LayerData {
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

  private getLayerId(): LayerId {
    return {
      kind: LayerKind.Physical,
      direction: this.direction
    };
  }

  private extractSenderMessage(dataBlocks: DataBlock): string {
    if (dataBlocks.bytes instanceof Array) {
      const data = dataBlocks.bytes as any[];
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
