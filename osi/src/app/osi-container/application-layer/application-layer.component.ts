import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-application-layer',
  templateUrl: './application-layer.component.html',
  styleUrls: ['./application-layer.component.css']
})
export class ApplicationLayerComponent implements OnInit {

  @Input() uploadMode: boolean;

  constructor() { }

  ngOnInit() {
  }

  getModeName() {
    return this.uploadMode ? "Upload" : "Downlaod";
  }
}
