import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {
  OrchestratorService,
  registerDummyRepeater
} from '../../orchestrator.service';
import { TranslateService } from '../../translate.service';
import { LayerKind, Direction, LayerData, LayerId } from '../../domain/layers';

@Component({
  selector: 'app-session-layer',
  templateUrl: './session-layer.component.html',
  styleUrls: ['./session-layer.component.css']
})
export class SessionLayerComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  @Input() direction: Direction;

  constructor(
    private readonly orchestrator: OrchestratorService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit() {
    this.subscription = registerDummyRepeater(
      {
        kind: LayerKind.Session,
        direction: this.direction
      },
      this.orchestrator
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getModeName() {
    return this.translate.direction(this.direction);
  }
}
