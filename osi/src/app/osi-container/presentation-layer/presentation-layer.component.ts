import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-presentation-layer',
  templateUrl: './presentation-layer.component.html',
  styleUrls: ['./presentation-layer.component.css']
})
export class PresentationLayerComponent implements OnInit {

  @Input() uploadMode: boolean;

  constructor() { }

  ngOnInit() {
  }

  getModeName() {
    return this.uploadMode ? "Upload" : "Downlaod";
  }
}
