import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {
  OrchestratorService,
  registerDummyRepeater
} from '../../orchestrator.service';
import { TranslateService } from '../../translate.service';
import { LayerKind, Direction, LayerData, LayerId, DataBlock } from '../../domain/layers';
import { LayerContent } from "../layer-content";

@Component({
  selector: 'app-datalink-layer',
  templateUrl: './datalink-layer.component.html',
  styleUrls: ['./datalink-layer.component.css']
})
export class DatalinkLayerComponent implements OnDestroy, LayerContent {
  private subscription: Subscription;
  @Input() direction: Direction;
  data: any;

  constructor(
    private readonly orchestrator: OrchestratorService,
    private readonly translate: TranslateService
  ) {}

  initialize(direction: Direction) {

    var g: LayerId;
    this.subscription = registerDummyRepeater(
      {
        kind: LayerKind.DataLink,
        direction: direction
      },
      this.orchestrator
    );
    this.direction = direction;
    this.orchestrator.registerLayer({
      kind: LayerKind.DataLink,
      direction: direction
    }).layerData.subscribe(data => { this.data = data; console.log(data); });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getModeName() {
    return this.translate.direction(this.direction);
  }
}
