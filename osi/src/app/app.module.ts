import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { EnpointsComponent } from './enpoints/enpoints.component';
import { FileLoaderComponent } from './file-loader/file-loader.component';
import { OsiContainerComponent } from './osi-container/osi-container.component';
import { ApplicationLayerComponent } from './osi-container/application-layer/application-layer.component';
import { PresentationLayerComponent } from './osi-container/presentation-layer/presentation-layer.component';
import { SessionLayerComponent } from './osi-container/session-layer/session-layer.component';
import { TransportLayerComponent } from './osi-container/transport-layer/transport-layer.component';
import { NetworkLayerComponent } from './osi-container/network-layer/network-layer.component';
import { DatalinkLayerComponent } from './osi-container/datalink-layer/datalink-layer.component';
import { PhysicalLayerComponent } from './osi-container/physical-layer/physical-layer.component';
import { EndpointComponent } from './endpoint/endpoint.component';

@NgModule({
  declarations: [
    AppComponent,
    EnpointsComponent,
    FileLoaderComponent,
    OsiContainerComponent,
    ApplicationLayerComponent,
    PresentationLayerComponent,
    SessionLayerComponent,
    TransportLayerComponent,
    NetworkLayerComponent,
    DatalinkLayerComponent,
    PhysicalLayerComponent,
    EndpointComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
