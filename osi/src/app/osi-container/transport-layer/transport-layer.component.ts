import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { OrchestratorService } from '../../orchestrator.service';
import { Direction, translateDirection } from '../../domain/directions';
import { LayerKind, LayerData, LayerId } from '../../domain/layers';

@Component({
  selector: 'app-transport-layer',
  templateUrl: './transport-layer.component.html',
  styleUrls: ['./transport-layer.component.css']
})
export class TransportLayerComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  @Input() direction: Direction;

  constructor(private orchestrator: OrchestratorService) {}

  ngOnInit() {
    this.subscription = this.orchestrator
      .registerLayer({
        kind: LayerKind.Transport,
        direction: this.direction
      })
      .subscribe(this.handleDate);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getModeName() {
    return translateDirection(this.direction);
  }

  private handleDate(data: LayerData) {}
}
