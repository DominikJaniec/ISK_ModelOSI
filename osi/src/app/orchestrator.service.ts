import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Direction } from './domain/directions';
import { LayerKind, LayerId, DataBlock, LayerData } from './domain/layers';
import { LayersStream, StreamElement } from './domain/layers/stream';

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

@Injectable()
export class OrchestratorService {
  private readonly progressSubject = new Subject<ProgressData>();
  private readonly layersStream = new LayersStream();

  private currentLayerId: LayerId;
  private currentData: LayerData;
  private isWaiting = false;
  private behavior = NavigatorBehavior.AutoContinue;

  registerLayer(layerId: LayerId): Observable<LayerData> {
    return this.registerLayer_new(layerId).layerData;
  }

  registerLayer_new(layerId: LayerId): LayerObservables {
    const layer = this.layersStream.for(layerId);

    return {
      clearStream: layer.clearFromSubject.asObservable(),
      layerData: layer.dataSubject.asObservable()
    };
  }

  registerNavigator(): Observable<ProgressData> {
    return this.progressSubject.asObservable();
  }

  dataReady(data: DataBlock) {
    this.layersStream.head.clearFromSubject.next();
    this.layersStream.head.dataSubject.next({ blocks: [data] });
    this.notifyBeginning();
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
      this.pushIntoDownstream();
    }
  }

  ready(layerId: LayerId, data: LayerData) {
    this.currentLayerId = layerId;
    this.currentData = data;
    this.isWaiting = true;

    this.notifyProgressStep();
    this.clearFromCurrent();

    if (this.behavior === NavigatorBehavior.AutoContinue) {
      this.pushIntoDownstream();
    }
  }

  private pushIntoDownstream() {
    this.isWaiting = false;
    const downstreamLayer = this.currentDownstream();

    if (downstreamLayer !== null) {
      downstreamLayer.dataSubject.next(this.currentData);
    } else {
      this.notifyFinished();
    }
  }

  private currentDownstream(): StreamElement {
    return this.layersStream.downstreamFrom(this.currentLayerId);
  }

  private clearFromCurrent() {
    this.layersStream.for(this.currentLayerId).clearFromSubject.next();
  }

  private notifyBeginning() {
    this.progressSubject.next({
      progress: Progress.Beginning
    });
  }

  private notifyProgressStep() {
    this.progressSubject.next({
      progress: Progress.LayerStep,
      layerId: this.currentLayerId
    });
  }

  private notifyFinished() {
    this.progressSubject.next({
      progress: Progress.Finished
    });
  }
}
