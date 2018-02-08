import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Format, Symbol } from '../../domain/symbol';
import * as CRC from 'crc';

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
  dateByteArrayWithParityBit: string;
  parityBit: number = 0;
  licznik: number = 0;
  crcValue: string;

  constructor(
    private readonly orchestrator: OrchestratorService,
    private readonly translate: TranslateService
  ) {
  }

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
      this.dateByteArrayWithParityBit = this.dateByteArray + this.parityBit.toString();
      this.crcValue = this.getCrcValue(this.dateByteArray);
      this.reverseCrc(this.dateByteArray + this.crcValue);
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

  getCrcValue(bytesStringArray: string): string {
    var array = this.crc(bytesStringArray += "000");
    return [array[array.length - 3], array[array.length - 2], array[array.length - 1],].join("");
  }

  reverseCrc(bytesStringArray: string): number {
    var array = this.crc(bytesStringArray);

    console.log(parseInt(array[array.length - 3]) + parseInt(array[array.length - 2]) + parseInt(array[array.length - 1]));
    return parseInt(array[array.length - 3]) + parseInt(array[array.length - 2]) + parseInt(array[array.length - 1]);
  }

  crc(stringArray: string): string[]
  {
    var array = (stringArray).split('');
    var divisor = "1011";

    for (let i = 0; i < (array.length - 4);) {
      for (i; array[i].valueOf() == ("0").valueOf() && i < (array.length - 4); i++) { }

      for (let j = 0; j < divisor.length; j++) {
        if (divisor[j].valueOf() == array[i + j].valueOf())
          array[i + j] = '0';
        else
          array[i + j] = '1';
      }

      var oneCounter = 0;
      for (let y = 0; y < array.length - 3; y++) {
        if (array[y].valueOf() == ("1").valueOf())
          oneCounter++;
      }
      if (oneCounter == 0)
        break;
    }
    return array;
  }


  getBatchedstring(data: string): string {
    var processedData = "";
    if (data.length > 60) {
      let batches: string[] = [];
      for (let i = 0; i < data.length; i++)
      {
        batches.push(data.slice(i, i + 30));
        i += 30;
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
