import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {
  OrchestratorService,
  registerDummyRepeater
} from '../../orchestrator.service';
import { TranslateService } from '../../translate.service';
import { LayerKind, Direction, LayerData, LayerId, DataBlock } from '../../domain/layers';
import { LayerContent } from '../layer-content';

@Component({
  selector: 'app-session-layer',
  templateUrl: './session-layer.component.html',
  styleUrls: ['./session-layer.component.css']
})
export class SessionLayerComponent implements OnDestroy, LayerContent {
  private subscription: Subscription;
  private direction: Direction;
  data: LayerData;
  dat: string;

  constructor(
    private readonly orchestrator: OrchestratorService,
    private readonly translate: TranslateService
  ) {}

  initialize(direction: Direction) {
    this.subscription = registerDummyRepeater(
      {
        kind: LayerKind.Session,
        direction: direction
      },
      this.orchestrator
    );
    this.direction = direction;

    this.orchestrator.registerLayer({
      kind: LayerKind.Session,
      direction: direction
    }).layerData.subscribe(data => {
      this.data = data;
      this.dat = data.blocks[0].bytes[0];
      console.log("HERE");
      console.log(data);
      });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getModeName() {
    return this.translate.direction(this.direction);
  }
}
