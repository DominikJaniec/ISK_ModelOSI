import { Component, OnInit, Input } from '@angular/core';
import { Direction, translateDirection } from '../../domain/directions';

@Component({
  selector: 'app-network-layer',
  templateUrl: './network-layer.component.html',
  styleUrls: ['./network-layer.component.css']
})
export class NetworkLayerComponent implements OnInit {
  @Input() direction: Direction;

  constructor() {}

  ngOnInit() {}

  getModeName() {
    return translateDirection(this.direction);
  }
}
