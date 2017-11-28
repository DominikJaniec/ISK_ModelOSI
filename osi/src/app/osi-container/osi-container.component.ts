import { Component, OnInit } from '@angular/core';
import { Direction, translateDirection } from '../domain/directions';

@Component({
  selector: 'app-osi-container',
  templateUrl: './osi-container.component.html',
  styleUrls: ['./osi-container.component.css']
})
export class OsiContainerComponent implements OnInit {
  readonly senderDirection = Direction.Sender;
  readonly receiverDirection = Direction.Receiver;
  readonly senderName = translateDirection(Direction.Sender);
  readonly receiverName = translateDirection(Direction.Receiver);

  direction: Direction;

  constructor() {
    this.direction = Direction.Sender;
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
  }

  showReceiver() {
    this.direction = Direction.Receiver;
  }
}
