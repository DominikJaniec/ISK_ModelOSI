import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-datalink-layer',
  templateUrl: './datalink-layer.component.html',
  styleUrls: ['./datalink-layer.component.css']
})
export class DatalinkLayerComponent implements OnInit {

  @Input() uploadMode: boolean;

  constructor() { }

  ngOnInit() {
  }

  getModeName() {
    return this.uploadMode ? "Upload" : "Downlaod";
  }
}
