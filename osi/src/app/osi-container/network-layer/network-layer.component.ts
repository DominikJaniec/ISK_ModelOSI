import { Component } from '@angular/core';
import { BaseLayerComponent } from '../base-layer-component';
import { OrchestratorService } from '../../orchestrator.service';
import { LayerKind } from '../../domain/layers';
import { Endpoint } from '../../domain/endopoint';

@Component({
  selector: 'app-network-layer',
  templateUrl: './network-layer.component.html',
  styleUrls: ['./network-layer.component.css']
})
export class NetworkLayerComponent extends BaseLayerComponent {
  senderEndpoint: Endpoint;
  receiverEndpoint: Endpoint;
  dat: string;

  constructor(orchestrator: OrchestratorService) {
    super(orchestrator);
    this.senderEndpoint = new Endpoint();
    this.receiverEndpoint = new Endpoint();
  }

  getLayerKind(): LayerKind {
    return LayerKind.Network;
  }

  regenerate() {
    this.senderEndpoint.regenerate();
    this.receiverEndpoint.regenerate();
  }

  protected processSourceLayerData() {
    this.dat = this.sourceLayerData.blocks[0].bytes[0];
  }
}
