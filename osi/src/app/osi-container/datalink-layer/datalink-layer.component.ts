import { Component, OnInit, Input } from '@angular/core';
import { Direction, translateDirection } from '../../domain/directions';

@Component({
  selector: 'app-datalink-layer',
  templateUrl: './datalink-layer.component.html',
  styleUrls: ['./datalink-layer.component.css']
})
export class DatalinkLayerComponent implements OnInit {
  @Input() direction: Direction;

  constructor() {}

  ngOnInit() {}

  getModeName() {
    return translateDirection(this.direction);
  }
}
