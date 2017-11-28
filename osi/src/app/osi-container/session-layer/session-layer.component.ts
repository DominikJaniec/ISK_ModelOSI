import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { OrchestratorService } from '../../orchestrator.service';
import { Direction, translateDirection } from '../../domain/directions';
import { LayerKind, LayerData, LayerId } from '../../domain/layers';

@Component({
  selector: 'app-session-layer',
  templateUrl: './session-layer.component.html',
  styleUrls: ['./session-layer.component.css']
})
export class SessionLayerComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  @Input() direction: Direction;

  constructor(private orchestrator: OrchestratorService) {}

  ngOnInit() {
    this.subscription = this.orchestrator
      .registerLayer({
        kind: LayerKind.Session,
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
