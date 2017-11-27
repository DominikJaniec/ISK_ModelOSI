import { Component, OnInit, Input } from '@angular/core';
import { PhysicalLayer } from '../../domain/layers/physical';
import { Format } from '../../domain/symbol';
import { Direction, translateDirection } from '../../domain/directions';

@Component({
  selector: 'app-physical-layer',
  templateUrl: './physical-layer.component.html',
  styleUrls: ['./physical-layer.component.css']
})
export class PhysicalLayerComponent implements OnInit {
  @Input() direction: Direction;
  readonly layer: PhysicalLayer;

  constructor() {
    this.layer = new PhysicalLayer();
    this.layer.bytesBlockSize = 8;
    this.layer.displayFormat = Format.Hexadecimal;
  }

  ngOnInit() {}
  fakeChanged(fakedUserInput: string) {
    this.layer.load(fakedUserInput);
  }

  getFormat(): string {
    return Format[this.layer.displayFormat];
  }

  getModeName() {
    return translateDirection(this.direction);
  }
}
