import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {
  OrchestratorService,
  registerDummyRepeater
} from '../../orchestrator.service';
import { Direction, translateDirection } from '../../domain/directions';
import { LayerKind, LayerData, LayerId } from '../../domain/layers';

@Component({
  selector: 'app-network-layer',
  templateUrl: './network-layer.component.html',
  styleUrls: ['./network-layer.component.css']
})
export class NetworkLayerComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  @Input() direction: Direction;

  constructor(private readonly orchestrator: OrchestratorService) {}

  ngOnInit() {
    this.subscription = registerDummyRepeater(
      {
        kind: LayerKind.Network,
        direction: this.direction
      },
      this.orchestrator
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getModeName() {
    return translateDirection(this.direction);
  }
}
