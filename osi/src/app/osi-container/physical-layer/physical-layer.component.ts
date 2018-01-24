import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {
  OrchestratorService,
  registerDummyRepeater
} from '../../orchestrator.service';
import { TranslateService } from '../../translate.service';
import { LayerKind, Direction, LayerData, LayerId } from '../../domain/layers';
import { PhysicalLayer } from '../../domain/layers/physical';
import { Format } from '../../domain/symbol';
import { LayerContent } from '../layer-content';

@Component({
  selector: 'app-physical-layer',
  templateUrl: './physical-layer.component.html',
  styleUrls: ['./physical-layer.component.css']
})
export class PhysicalLayerComponent implements OnDestroy, LayerContent {
  private subscription: Subscription;
  private direction: Direction;
  readonly layer: PhysicalLayer;
  
  constructor(
    private readonly orchestrator: OrchestratorService,
    private readonly translate: TranslateService
  ) {
    this.layer = new PhysicalLayer();
    this.layer.bytesBlockSize = 8;
    this.layer.displayFormat = Format.Hexadecimal;
    
  }

  initialize(direction: Direction) {
    this.subscription = registerDummyRepeater(
      {
        kind: LayerKind.Physical,
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

  fakeChanged(fakedUserInput: string) {
    this.layer.load(fakedUserInput);
  }

  getFormat(): string {
    return Format[this.layer.displayFormat];
  }
}
