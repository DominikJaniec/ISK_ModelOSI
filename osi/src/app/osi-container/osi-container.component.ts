import { Component, OnInit } from '@angular/core';
import { Direction, translateDirection } from '../domain/directions';

@Component({
  selector: 'app-osi-container',
  templateUrl: './osi-container.component.html',
  styleUrls: ['./osi-container.component.css']
})
export class OsiContainerComponent implements OnInit {
  readonly senderName = translateDirection(Direction.Sender);
  readonly receiverName = translateDirection(Direction.Receiver);

  direction: Direction;
  directionName: string;

  constructor() {
    this.direction = Direction.Sender;
    this.directionName = this.senderName;
  }

  ngOnInit() {}

  isSenderActive(): boolean {
    return this.direction === Direction.Sender;
  }
  isReceiverActive(): boolean {
    return this.direction === Direction.Receiver;
  }

  showSender() {
    this.direction = Direction.Sender;
    this.directionName = this.senderName;
  }

  showReceiver() {
    this.direction = Direction.Receiver;
    this.directionName = this.receiverName;
  }
}
