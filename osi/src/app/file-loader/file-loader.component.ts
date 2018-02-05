import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { OrchestratorService } from '../orchestrator.service';
import { DataBlock } from '../domain/layers';

@Component({
  selector: 'app-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.css']
})
export class FileLoaderComponent implements OnInit, OnDestroy {
  @Input() loadedMaxSize = 200;
  @Output() dataUpdated: EventEmitter<string> = new EventEmitter<string>();

  isFileUploaded = false;
  reader = new FileReader();

  file: File;
  fileText: string;
  alertText: string;
  binary: Blob;

  constructor(private readonly orchestrator: OrchestratorService) {}

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
      this.fileText = this.extractSample(this.reader);
      log('onloaded', this.fileText);

      this.orchestrator.initializeFlow(this.getDataBlock());
      this.dataUpdated.emit(this.fileText);
    };
  }

  private extractSample(reader: FileReader): string {
    // TODO: Load data as bytes, use encoding?
    return (reader.result as string).substr(0, this.loadedMaxSize);
  }

  private getDataBlock(): DataBlock {
    return { bytes: [this.fileText] };
  }
}

function log(header: string, content: any) {
  console.log(`FileLoader: ${header}\n${content}`);
}
