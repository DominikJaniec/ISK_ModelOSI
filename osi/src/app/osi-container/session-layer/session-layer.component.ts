import { Component, OnInit, Input } from '@angular/core';
import { Direction, translateDirection } from '../../domain/directions';

@Component({
  selector: 'app-session-layer',
  templateUrl: './session-layer.component.html',
  styleUrls: ['./session-layer.component.css']
})
export class SessionLayerComponent implements OnInit {
  @Input() direction: Direction;

  constructor() {}

  ngOnInit() {}

  getModeName() {
    return translateDirection(this.direction);
  }
}
