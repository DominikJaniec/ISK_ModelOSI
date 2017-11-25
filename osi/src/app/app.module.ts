import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { EnpointsComponent } from './enpoints/enpoints.component';
import { FileLoaderComponent } from './file-loader/file-loader.component';
import { OsiContainerComponent } from './osi-container/osi-container.component';
import { ApplicationLayerComponent } from './osi-container/application-layer/application-layer.component';


@NgModule({
  declarations: [
    AppComponent,
    EnpointsComponent,
    FileLoaderComponent,
    OsiContainerComponent,
    ApplicationLayerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
