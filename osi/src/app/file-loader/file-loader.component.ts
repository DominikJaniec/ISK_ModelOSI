import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.css']
})
export class FileLoaderComponent implements OnInit {
  file: File;
  isFileUploaded: boolean;
  reader = new FileReader();

  fileText: string;
  allertText: string;

  constructor() {
      this.isFileUploaded = false;
  }

  ngOnInit() {
  }

  

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      if (fileList[0].size > 150000)
      {
        this.allertText = 'Wielkośc pliku nie może przekraczać 150kb!';
        this.isFileUploaded = false;
        return;
      }
      this.allertText = '';
      this.file = fileList[0];
      this.isFileUploaded = true;
    }

    this.reader.onload = () => {
      var text = this.reader.result;
    }
    this.reader.readAsText(this.file);

    this.reader.onloadend = (e) => {
      console.log(this.reader.result);
      this.fileText = this.reader.result;
    };
  }
}

