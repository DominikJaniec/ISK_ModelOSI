import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { EndpointComponent } from './endpoint/endpoint.component';
import { FileLoaderComponent } from './file-loader/file-loader.component';
import { OsiContainerComponent } from './osi-container/osi-container.component';
import { OsiStackComponent } from './osi-container/osi-stack.component';
import { ApplicationLayerComponent } from './osi-container/application-layer/application-layer.component';
import { PresentationLayerComponent } from './osi-container/presentation-layer/presentation-layer.component';
import { SessionLayerComponent } from './osi-container/session-layer/session-layer.component';
import { TransportLayerComponent } from './osi-container/transport-layer/transport-layer.component';
import { NetworkLayerComponent } from './osi-container/network-layer/network-layer.component';
import { DatalinkLayerComponent } from './osi-container/datalink-layer/datalink-layer.component';
import { PhysicalLayerComponent } from './osi-container/physical-layer/physical-layer.component';
import { OrchestratorService } from './orchestrator.service';
import { NavigatorComponent } from './navigator/navigator.component';
import { LoggerComponent } from './logger/logger.component';

@NgModule({
  declarations: [
    AppComponent,
    EndpointComponent,
    FileLoaderComponent,
    OsiContainerComponent,
    OsiStackComponent,
    ApplicationLayerComponent,
    PresentationLayerComponent,
    SessionLayerComponent,
    TransportLayerComponent,
    NetworkLayerComponent,
    DatalinkLayerComponent,
    PhysicalLayerComponent,
    NavigatorComponent,
    LoggerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    OrchestratorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
