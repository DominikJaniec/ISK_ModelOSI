import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Format, Symbol } from '../../domain/symbol';

import {
  OrchestratorService,
  registerDummyRepeater
} from '../../orchestrator.service';
import { TranslateService } from '../../translate.service';
import { LayerKind, Direction, LayerData, LayerId } from '../../domain/layers';
import { LayerContent } from '../layer-content';

@Component({
  selector: 'app-transport-layer',
  templateUrl: './transport-layer.component.html',
  styleUrls: ['./transport-layer.component.css']
})
export class TransportLayerComponent implements OnDestroy, LayerContent {
  private subscription: Subscription;
  @Input() direction: Direction;
  data: LayerData;
  dat: string;
  dateByteArray: string;
  parityBit: number = 0;

  constructor(
    private readonly orchestrator: OrchestratorService,
    private readonly translate: TranslateService
  ) {}

  initialize(direction: Direction) {
    this.subscription = registerDummyRepeater(
      {
        kind: LayerKind.Transport,
        direction: direction
      },
      this.orchestrator
    );
    this.direction = direction;

    this.orchestrator.registerLayer({
      kind: LayerKind.Transport,
      direction: direction
    }).layerData.subscribe(data => {
      this.data = data;
      this.dat = data.blocks[0].bytes[0];
      this.dateByteArray = this.process(this.dat);
      this.parityBit = this.getParityBit(this.dateByteArray);
    });
  }

  process(content: string): string {
    const bytes = this.toBytes(content);
    var currentSymbols = "";

    for (let i = 0; i < bytes.length; ++i) {
      currentSymbols += Symbol.fromByte(bytes[i], Format.Binary);

    }
    return currentSymbols;
  }

  private toBytes(data: string): number[] {
    return data.split('').map(c => c.charCodeAt(0));
  }

  getBatchedstring(data: string): string {
    var processedData = "";
    if (data.length > 50) {
      let batches: string[] = [];
      for (let i = 0; i < data.length; i++)
      {
        batches.push(data.slice(i, i + 25));
        i += 25;
      }
      processedData = batches[0] + "..." + batches[batches.length - 1];
    }
    else
      processedData = data;

    return processedData;
  }

  getParityBit(data: string): number
  {
    var parityCounter = 0;

    for (let character of data)
    {
      if (character === '1')
        parityCounter++;
    }
    if (parityCounter % 2 == 0)
      return 0;
    else
      return 1;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getModeName() {
    return this.translate.direction(this.direction);
  }
}
