import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import {
  LayerKind,
  Direction,
  LayerId,
  DataBlock,
  LayerData
} from './domain/layers';
import { LayersStream, StreamLayer } from './domain/layers/stream';

export enum Navigate {
  Restart,
  Next
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

  private initData: DataBlock = null;
  private isWaiting = false;
  private readyLayerId: LayerId;
  private readyLayerData: LayerData;

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
    this.initData = data;
    this.logInitializeFlow(data);
    this.notifyProgress({ progress: Progress.Beginning });

    this.isWaiting = true;
    this.layersStream
      .for(this.layersStream.headId)
      .dataSubject.next({ blocks: [data] });
  }

  navigate(action: Navigate) {
    switch (action) {
      case Navigate.Restart:
        if (this.initData !== null) {
          this.initializeFlow(this.initData);
        }
        break;

      case Navigate.Next:
        if (this.isWaiting) {
          this.pushIntoDownstreamOf(this.readyLayerId, this.readyLayerData);
        }
        break;

      default:
        throw new Error(`Unknown kind of Navigate: '${action}'.`);
    }
  }

  ready(layerId: LayerId, data: LayerData) {
    this.logDataFlow(LogEvent.DataReady, layerId, data);
    this.readyLayerId = layerId;
    this.readyLayerData = data;

    this.notifyProgressStep(layerId);
    this.clearDownstreamFrom(layerId);
  }

  private clearDownstreamFrom(layerId: LayerId) {
    this.logDataFlow(LogEvent.ClearDownstream, layerId);
    this.withDownstreamOf(layerId, downstream =>
      downstream.clearFromSubject.next()
    );
  }

  private pushIntoDownstreamOf(layerId: LayerId, data: LayerData) {
    this.isWaiting = false;
    this.withDownstreamOf(
      layerId,
      downstream => {
        this.isWaiting = true;
        this.logDataFlow(LogEvent.DataPush, layerId, data);
        downstream.dataSubject.next(data);
      },
      () => this.notifyProgress({ progress: Progress.Finished })
    );
  }

  private withDownstreamOf(
    layerId: LayerId,
    whenHas: (layer: StreamLayer) => void,
    whenHasNot: () => void = null
  ) {
    const downstream = this.layersStream.downstreamFrom(layerId);
    if (downstream !== null) {
      whenHas(downstream);
    } else if (whenHasNot !== null) {
      whenHasNot();
    }
  }

  private notifyProgressStep(layerId: LayerId) {
    this.notifyProgress({
      progress: Progress.LayerStep,
      layerId: layerId
    });
  }

  private notifyProgress(data: ProgressData) {
    this.logProgressStep(data);
    this.progressSubject.next(data);
  }

  private logInitializeFlow(dataBlock: DataBlock) {
    this.loggerSubject.next({
      event: LogEvent.InitializeFlow,
      data: dataBlock
    });
  }

  private logProgressStep(data: ProgressData) {
    this.loggerSubject.next({
      event: LogEvent.Progress,
      data: {
        source: data.layerId,
        progress: data.progress
      }
    });
  }

  private logDataFlow(
    flow: LogEvent,
    layerId: LayerId,
    layerData: LayerData = null
  ) {
    this.loggerSubject.next({
      event: flow,
      data: {
        source: layerId,
        layerData: layerData
      }
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
