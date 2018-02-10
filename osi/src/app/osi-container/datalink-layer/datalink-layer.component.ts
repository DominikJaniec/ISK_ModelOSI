import { Component } from '@angular/core';
import { BaseLayerComponent } from '../base-layer-component';
import { OrchestratorService } from '../../orchestrator.service';
import { LayerKind, LayerData, DataBlock } from '../../domain/layers';
import { Endpoint } from '../../domain/endopoint';
import { SenderData } from '../../domain/layers/physical';

@Component({
  selector: 'app-datalink-layer',
  templateUrl: './datalink-layer.component.html',
  styleUrls: ['./datalink-layer.component.css']
})
export class DatalinkLayerComponent extends BaseLayerComponent {
  senderEndpoint: Endpoint;
  receiverEndpoint: Endpoint;

  readonly availableBlockSizes = [8, 16, 20, 32, 42, 64, 100];
  transferBlockSize = this.availableBlockSizes[1];

  constructor(orchestrator: OrchestratorService) {
    super(orchestrator);
    this.senderEndpoint = new Endpoint();
    this.receiverEndpoint = new Endpoint();
  }

  getLayerKind(): LayerKind {
    return LayerKind.DataLink;
  }

  regenerate() {
    this.senderEndpoint.regenerate();
    this.receiverEndpoint.regenerate();
  }

  protected getNextLayerData(): LayerData {
    return {
      blocks: this.sourceLayerData.blocks.map(
        block =>
          ({
            bytes: {
              blockSize: this.transferBlockSize,
              dataBytes: block.bytes
            } as SenderData
          } as DataBlock)
      )
    };
  }
}
