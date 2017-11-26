import { Component } from '@angular/core';
import { Endpoint } from './domain/endopoint';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sender: Endpoint;
  receiver: Endpoint;

  constructor() {
    this.sender = new Endpoint();
    this.sender.regenerate();

    this.receiver = new Endpoint();
    this.receiver.regenerate();
  }
}
