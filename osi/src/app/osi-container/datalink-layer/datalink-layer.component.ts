import { Component } from '@angular/core';
import { BaseLayerComponent } from '../base-layer-component';
import { OrchestratorService } from '../../orchestrator.service';
import { LayerKind } from '../../domain/layers';
import { Endpoint } from '../../domain/endopoint';

@Component({
  selector: 'app-datalink-layer',
  templateUrl: './datalink-layer.component.html',
  styleUrls: ['./datalink-layer.component.css']
})
export class DatalinkLayerComponent extends BaseLayerComponent {
  senderEndpoint: Endpoint;
  receiverEndpoint: Endpoint;

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
}
