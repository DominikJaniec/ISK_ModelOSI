import { Component, OnInit, Input } from '@angular/core';
import { Direction, translateDirection } from '../../domain/directions';

@Component({
  selector: 'app-transport-layer',
  templateUrl: './transport-layer.component.html',
  styleUrls: ['./transport-layer.component.css']
})
export class TransportLayerComponent implements OnInit {
  @Input() direction: Direction;

  constructor() {}

  ngOnInit() {}

  getModeName() {
    return translateDirection(this.direction);
  }
}
