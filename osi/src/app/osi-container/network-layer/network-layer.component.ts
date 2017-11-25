import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-network-layer',
  templateUrl: './network-layer.component.html',
  styleUrls: ['./network-layer.component.css']
})
export class NetworkLayerComponent implements OnInit {

  @Input() uploadMode: boolean;

  constructor() { }

  ngOnInit() {
  }

  getModeName() {
    return this.uploadMode ? "Upload" : "Downlaod";
  }
}
