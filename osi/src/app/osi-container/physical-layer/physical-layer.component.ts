import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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
  private layerData: LayerData = { blocks: [] };
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
      this.layerData = { blocks: [] };
      this.displayBlocks = [];
    });

    this.layerDataSubscription = observables.layerData.subscribe(data => {
      if (this.isSender()) {
        this.layerData = data;
        this.processLayerData();
      }
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
    if (!this.hasLayerData()) {
      return;
    }

    const cfg = this.getDisplayConfig();
    this.displayBlocks = this.layerData.blocks.map(block =>
      this.layerLogic.process(cfg, this.getSenderContent(block))
    );
  }

  processLayerData() {
    if (!this.hasLayerData()) {
      return;
    }

    this.setDisplayBlocks();
    const cfg = this.getTransferConfig();
    const listOfBinaries = this.layerData.blocks.map(block =>
      this.layerLogic.process(cfg, this.getSenderContent(block))
    );

    const layerData = this.toLayerData(listOfBinaries);
    this.orchestrator.ready(this.getLayerId(), layerData);
  }

  private getLayerId(): LayerId {
    return {
      kind: LayerKind.Physical,
      direction: this.direction
    };
  }

  private hasLayerData(): boolean {
    return this.layerData.blocks.length > 0;
  }

  private getSenderContent(dataBlocks: DataBlock): string {
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
      'DataBlock.bytes is expected to be Array with single string - as current implementation works'
    );
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

  toLayerData(listOfBlocks: PhysicalBlock[][]): LayerData {
    const dataBlocks: DataBlock[] = [];
    for (const physicalBlocks of listOfBlocks) {
      for (const block of physicalBlocks) {
        if (block.format !== Format.Binary) {
          throw this.notTransferableError(block.format);
        }
        dataBlocks.push({ bytes: block.symbols });
      }
    }
    return { blocks: dataBlocks };
  }

  notTransferableError(format: Format): Error {
    const message =
      'Transferred block can be only as Binary' +
      `, but got format: '${format}'.`;

    return new Error(message);
  }
}
