import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as CryptoJS from 'crypto-js';

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
  dat: string;
  ciphers: cipherAlgorithms[];
  selectedCipher: cipherAlgorithms;
  cipherKey: string = "";
  encryptedData: string = "";
  deshifre: string = "";

  constructor(
    private readonly orchestrator: OrchestratorService,
    private readonly translate: TranslateService
  ) {
    this.ciphers = [
      { name: "", id: 0 },
      { name: "AES", id: 1 },
      { name: "DES", id: 2 },
      { name: "Triple DES", id: 3 },
      { name: "Rabbit", id: 4 },
      { name: "Rabbit Legacy", id: 5 },
      { name: "RC4", id: 6 },
      { name: "RC4Drop", id: 7 },
    ]
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
    this.orchestrator.ready({
      kind: LayerKind.Presentation,
      direction: this.direction
    }, { blocks: [this.contentToData(data)]} );

  }

  onCipherSelectChange(value: number)
  {
    if (value > 0)
      this.selectedCipher = this.ciphers.find(r => r.id == value);
    else
      this.selectedCipher = null;
  }

  EncryptData() {
    var data = this.dat.toString();
    var cipherKey = this.cipherKey.toString();

    switch (this.selectedCipher.id)
    {
      case 1: {
        this.encryptedData = CryptoJS.AES.encrypt(data, cipherKey).toString();        
      }
      case 2: {
        this.encryptedData = CryptoJS.DES.encrypt(data, cipherKey).toString();
      }
      case 3: {
        this.encryptedData = CryptoJS.TripleDES.encrypt(data, cipherKey).toString();
      }
      case 4: {
        this.encryptedData = CryptoJS.Rabbit.encrypt(data, cipherKey).toString();
      }
      case 5: {
        this.encryptedData = CryptoJS.RabbitLegacy.encrypt(data, cipherKey).toString();
      }
      case 6: {
        this.encryptedData = CryptoJS.RC4.encrypt(data, cipherKey).toString();
      }
      case 7: {
        this.encryptedData = CryptoJS.RC4Drop.encrypt(data, cipherKey).toString();
      }
    }
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

class cipherAlgorithms {
  name: string;
  id: number;
}
