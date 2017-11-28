import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { OrchestratorService } from '../../orchestrator.service';
import { Direction, translateDirection } from '../../domain/directions';
import { LayerKind, LayerData, LayerId } from '../../domain/layers';

@Component({
  selector: 'app-application-layer',
  templateUrl: './application-layer.component.html',
  styleUrls: ['./application-layer.component.css']
})
export class ApplicationLayerComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  @Input() direction: Direction;

  constructor(private orchestrator: OrchestratorService) {}

  ngOnInit() {
    this.subscription = this.orchestrator
      .registerLayer({
        kind: LayerKind.Application,
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
