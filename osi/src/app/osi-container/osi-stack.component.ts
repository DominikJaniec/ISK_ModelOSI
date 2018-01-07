import { Component, OnInit, Input } from '@angular/core';
import { Direction } from '../domain/layers';
import { TranslateService } from '../translate.service';

@Component({
  selector: 'app-osi-stack',
  templateUrl: './osi-stack.component.html',
  styleUrls: ['./osi-stack.component.css']
})
export class OsiStackComponent implements OnInit {
  @Input() direction: Direction;

  constructor(private readonly translate: TranslateService) {}

  ngOnInit() {}

  getFlowDirectionName(): string {
    return this.translate.direction(this.direction);
  }
}
