import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { OrchestratorService } from '../orchestrator.service';
import { LayerData } from '../domain/layers';

@Component({
  selector: 'app-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.css']
})
export class FileLoaderComponent implements OnInit, OnDestroy {
  isFileUploaded = false;
  reader = new FileReader();

  file: File;
  fileText: string;
  alertText: string;

  constructor(private orchestrator: OrchestratorService) {}

  ngOnInit() {}
  ngOnDestroy() {}

  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      if (fileList[0].size > 150000) {
        this.alertText = 'Wielkośc pliku nie może przekraczać 150kb!';
        this.isFileUploaded = false;
        return;
      }

      this.alertText = '';
      this.file = fileList[0];
      this.isFileUploaded = true;
    }

    this.reader.onload = () => {
      log('onload', this.reader.result);
    };
    this.reader.readAsText(this.file);

    this.reader.onloadend = e => {
      const fileContent = this.reader.result;
      this.fileText = fileContent;
      log('onloaded', fileContent);

      this.orchestrator.inputReady(contentToBytes(this.reader));
    };
  }
}

function contentToBytes(reader: FileReader): LayerData {
  // TODO: Load data as bytes, use encoding?
  return { bytes: [] };
}

function log(header: string, content: any) {
  console.log(`FileLoader: ${header}\n${content}`);
}
