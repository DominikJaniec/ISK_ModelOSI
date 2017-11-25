import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-transport-layer',
  templateUrl: './transport-layer.component.html',
  styleUrls: ['./transport-layer.component.css']
})
export class TransportLayerComponent implements OnInit {

  @Input() uploadMode: boolean;

  constructor() { }

  ngOnInit() {
  }

  getModeName() {
    return this.uploadMode ? "Upload" : "Downlaod";
  }
}
