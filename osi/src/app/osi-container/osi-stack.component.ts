import { Component, OnInit, Input } from '@angular/core';
import { Direction, translateDirection } from '../domain/directions';

@Component({
  selector: 'app-osi-stack',
  templateUrl: './osi-stack.component.html',
  styleUrls: ['./osi-stack.component.css']
})
export class OsiStackComponent implements OnInit {
  @Input() direction: Direction;
  directionName: string;

  constructor() {}

  ngOnInit() {
    this.directionName = translateDirection(this.direction);
  }
}
