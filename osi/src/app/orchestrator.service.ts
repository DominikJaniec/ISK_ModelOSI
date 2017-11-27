import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Direction } from './domain/directions';
import { LayerKind, LayerId, LayerData } from './domain/layers';

export enum NavigatorAction {
  AutoContinue,
  BreakOnNext
}

@Injectable()
export class OrchestratorService {
  private readyLayers = new Subject<LayerId>();
  private layersData = new Subject<LayerData>();

  constructor() {}

  registerLayer(layerId: LayerId): Observable<LayerData> {
    return this.layersData.asObservable();
  }

  registerNavigator(): Observable<LayerId> {
    return this.readyLayers.asObservable();
  }

  navigate(action: NavigatorAction) {}

  ready(layerId: LayerId, data: LayerData) {}
}
