import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {
  OrchestratorService,
  registerDummyRepeater
} from '../../orchestrator.service';
import { TranslateService } from '../../translate.service';
import { LayerKind, Direction, LayerData, LayerId } from '../../domain/layers';
import { LayerContent } from '../layer-content';

@Component({
  selector: 'app-presentation-layer',
  templateUrl: './presentation-layer.component.html',
  styleUrls: ['./presentation-layer.component.css']
})
export class PresentationLayerComponent implements OnDestroy, LayerContent {
  private subscription: Subscription;
  private direction: Direction;

  constructor(
    private readonly orchestrator: OrchestratorService,
    private readonly translate: TranslateService
  ) {}

  initialize(direction: Direction) {
    this.subscription = registerDummyRepeater(
      {
        kind: LayerKind.Presentation,
        direction: direction
      },
      this.orchestrator
    );
    this.direction = direction;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getModeName() {
    return this.translate.direction(this.direction);
  }
}
