import { Component } from '@angular/core';
import { BaseLayerComponent } from '../base-layer-component';
import { OrchestratorService } from '../../orchestrator.service';
import { LayerKind } from '../../domain/layers';

@Component({
  selector: 'app-datalink-layer',
  templateUrl: './datalink-layer.component.html',
  styleUrls: ['./datalink-layer.component.css']
})
export class DatalinkLayerComponent extends BaseLayerComponent {
  constructor(orchestrator: OrchestratorService) {
    super(orchestrator);
  }

  getLayerKind(): LayerKind {
    return LayerKind.DataLink;
  }
}
