import { Component } from '@angular/core';
import { BaseLayerComponent } from '../base-layer-component';
import { OrchestratorService } from '../../orchestrator.service';
import { LayerKind } from '../../domain/layers';

@Component({
  selector: 'app-network-layer',
  templateUrl: './network-layer.component.html',
  styleUrls: ['./network-layer.component.css']
})
export class NetworkLayerComponent extends BaseLayerComponent {
  dat: string;

  constructor(orchestrator: OrchestratorService) {
    super(orchestrator);
  }

  getLayerKind(): LayerKind {
    return LayerKind.Network;
  }

  protected processSourceLayerData() {
    this.dat = this.sourceLayerData.blocks[0].bytes[0];
  }
}
