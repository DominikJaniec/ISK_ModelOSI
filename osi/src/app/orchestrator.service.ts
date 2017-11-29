import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Direction } from './domain/directions';
import { LayerKind, LayerId, DataBlock, LayerData } from './domain/layers';
import { LayersStream, StreamLayer } from './domain/layers/stream';

export enum NavigatorBehavior {
  AutoContinue,
  BreakOnNext
}

export enum Progress {
  Beginning,
  LayerStep,
  Finished
}

export interface ProgressData {
  progress: Progress;
  layerId?: LayerId;
}

export interface LayerObservables {
  readonly clearStream: Observable<{}>;
  readonly layerData: Observable<LayerData>;
}

export enum LogEvent {
  Progress,
  ClearDownstream,
  InitializeFlow,
  DataPush,
  DataReady
}

export interface LogEntry {
  event: LogEvent;
  data: any;
}

@Injectable()
export class OrchestratorService {
  private readonly progressSubject = new Subject<ProgressData>();
  private readonly loggerSubject = new Subject<LogEntry>();
  private readonly layersStream = new LayersStream();

  private readyLayerId: LayerId;
  private readyLayerData: LayerData;
  private isWaiting = false;
  private behavior = NavigatorBehavior.AutoContinue;

  registerLayer(layerId: LayerId): LayerObservables {
    const layer = this.layersStream.for(layerId);
    return {
      clearStream: layer.clearFromSubject.asObservable(),
      layerData: layer.dataSubject.asObservable()
    };
  }

  registerNavigator(): Observable<ProgressData> {
    return this.progressSubject.asObservable();
  }

  registerLogger(): Observable<LogEntry> {
    return this.loggerSubject.asObservable();
  }

  initializeFlow(data: DataBlock) {
    this.logInitializeFlow(data);
    this.notifyProgress({ progress: Progress.Beginning });
    this.layersStream
      .for(this.layersStream.headId)
      .dataSubject.next({ blocks: [data] });
  }

  navigate(action: NavigatorBehavior) {
    switch (action) {
      case NavigatorBehavior.BreakOnNext:
      case NavigatorBehavior.AutoContinue:
        this.behavior = action;
        break;

      default:
        throw new Error(`Unknown kind of behavior: '${this.behavior}'.`);
    }

    if (this.isWaiting) {
      this.pushIntoDownstreamOf(this.readyLayerId, this.readyLayerData);
    }
  }

  ready(layerId: LayerId, data: LayerData) {
    this.logDataFlow(LogEvent.DataPush, layerId, data);
    this.readyLayerId = layerId;
    this.readyLayerData = data;

    this.notifyProgressStep(layerId);
    this.clearDownstreamFrom(layerId);

    this.isWaiting = true;
    if (this.behavior === NavigatorBehavior.AutoContinue) {
      this.pushIntoDownstreamOf(layerId, data);
    }
  }

  private clearDownstreamFrom(layerId: LayerId) {
    this.logDataFlow(LogEvent.ClearDownstream, layerId);
    this.layersStream.downstreamFrom(layerId).clearFromSubject.next();
  }

  private pushIntoDownstreamOf(layerId: LayerId, data: LayerData) {
    this.isWaiting = false;
    const downstream = this.layersStream.downstreamFrom(layerId);
    if (downstream !== null) {
      this.logDataFlow(LogEvent.DataPush, layerId, data);
      downstream.dataSubject.next(data);
    } else {
      this.notifyProgress({ progress: Progress.Finished });
    }
  }

  private notifyProgressStep(layerId: LayerId) {
    this.notifyProgress({
      progress: Progress.LayerStep,
      layerId: layerId
    });
  }

  private notifyProgress(data: ProgressData) {
    this.loggerSubject.next({ event: LogEvent.Progress, data: data });
    this.progressSubject.next(data);
  }

  private logInitializeFlow(dataBlock: DataBlock) {
    this.loggerSubject.next({
      event: LogEvent.InitializeFlow,
      data: dataBlock
    });
  }

  private logDataFlow(
    flow: LogEvent,
    layerId: LayerId,
    layerData: LayerData = null
  ) {
    this.loggerSubject.next({
      event: flow,
      data: { source: layerId, layerData: layerData }
    });
  }
}

export function registerDummyRepeater(
  layerId: LayerId,
  orchestrator: OrchestratorService
): Subscription {
  return orchestrator
    .registerLayer(layerId)
    .layerData.subscribe(data => orchestrator.ready(layerId, data));
}
