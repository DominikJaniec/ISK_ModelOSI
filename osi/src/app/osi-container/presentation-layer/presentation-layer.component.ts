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
  selector: 'app-presentation-layer',
  templateUrl: './presentation-layer.component.html',
  styleUrls: ['./presentation-layer.component.css']
})
export class PresentationLayerComponent implements OnDestroy, LayerContent {
  private subscription: Subscription;
  private direction: Direction;
  data: LayerData;
  dat : string;


  constructor(
    private readonly orchestrator: OrchestratorService,
    private readonly translate: TranslateService
  ) {
  }

  initialize(direction: Direction) {
    this.subscription = registerDummyRepeater(
      {
        kind: LayerKind.Presentation,
        direction: direction
      },
      this.orchestrator
    );
    this.direction = direction;

    this.orchestrator.registerLayer({
      kind: LayerKind.Presentation,
      direction: direction
    }).layerData.subscribe(data =>
      {
      this.data = data;
      this.dat = data.blocks[0].bytes[0];
      this.pushData(this.dat);
      });
    
  }
  pushData(data: any)
  {
    data += "GGWP";
    this.orchestrator.ready({
      kind: LayerKind.Presentation,
      direction: this.direction
    }, { blocks: [this.contentToData(data)]} );

  }
  
contentToData(data: string): DataBlock {
  // TODO: Load data as bytes, use encoding?
  //this.data = ;
  return { bytes: [data] };
}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getModeName() {
    return this.translate.direction(this.direction);
  }
}
