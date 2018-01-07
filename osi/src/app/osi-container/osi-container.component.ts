import { Component, OnInit } from '@angular/core';
import { Direction } from '../domain/layers';

@Component({
  selector: 'app-osi-container',
  templateUrl: './osi-container.component.html',
  styleUrls: ['./osi-container.component.css']
})
export class OsiContainerComponent implements OnInit {
  readonly senderDirection = Direction.Sender;
  readonly receiverDirection = Direction.Receiver;

  direction = Direction.Sender;

  constructor() {}
  ngOnInit() {}
}
