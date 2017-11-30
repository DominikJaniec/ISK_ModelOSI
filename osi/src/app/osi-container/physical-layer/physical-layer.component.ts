import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {
  OrchestratorService,
  registerDummyRepeater
} from '../../orchestrator.service';
import { Direction, translateDirection } from '../../domain/directions';
import { LayerKind, LayerData, LayerId } from '../../domain/layers';
import { PhysicalLayer } from '../../domain/layers/physical';
import { Format } from '../../domain/symbol';

@Component({
  selector: 'app-physical-layer',
  templateUrl: './physical-layer.component.html',
  styleUrls: ['./physical-layer.component.css']
})
export class PhysicalLayerComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  readonly layer: PhysicalLayer;
  @Input() direction: Direction;

  constructor(private readonly orchestrator: OrchestratorService) {
    this.layer = new PhysicalLayer();
    this.layer.bytesBlockSize = 8;
    this.layer.displayFormat = Format.Hexadecimal;
  }

  ngOnInit() {
    this.subscription = registerDummyRepeater(
      {
        kind: LayerKind.Physical,
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

  fakeChanged(fakedUserInput: string) {
    this.layer.load(fakedUserInput);
  }

  getFormat(): string {
    return Format[this.layer.displayFormat];
  }
}
