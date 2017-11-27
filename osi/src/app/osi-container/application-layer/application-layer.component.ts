import { Component, OnInit, Input } from '@angular/core';
import { Direction, translateDirection } from '../../domain/directions';

@Component({
  selector: 'app-application-layer',
  templateUrl: './application-layer.component.html',
  styleUrls: ['./application-layer.component.css']
})
export class ApplicationLayerComponent implements OnInit {
  @Input() direction: Direction;

  constructor() {}

  ngOnInit() {}

  getModeName() {
    return translateDirection(this.direction);
  }
}
