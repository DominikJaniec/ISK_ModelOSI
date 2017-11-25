import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-osi-container',
  templateUrl: './osi-container.component.html',
  styleUrls: ['./osi-container.component.css']
})
export class OsiContainerComponent implements OnInit {
  public uploadMode: boolean;

  constructor() {
    this.uploadMode = true;
  }

  setUploadMode() {
    this.uploadMode = true;
  }

  setDownloadMode() {
    this.uploadMode = false;
  }

  getModeName() {
    return this.uploadMode ? "Upload" : "Downlaod";
  }

  ngOnInit() {
  }

}
