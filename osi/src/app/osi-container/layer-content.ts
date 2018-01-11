import { Type } from '@angular/core';

import { LayerKind, Direction } from '../domain/layers';
import { ApplicationLayerComponent } from './application-layer/application-layer.component';
import { PresentationLayerComponent } from './presentation-layer/presentation-layer.component';
import { SessionLayerComponent } from './session-layer/session-layer.component';
import { TransportLayerComponent } from './transport-layer/transport-layer.component';
import { NetworkLayerComponent } from './network-layer/network-layer.component';
import { DatalinkLayerComponent } from './datalink-layer/datalink-layer.component';
import { PhysicalLayerComponent } from './physical-layer/physical-layer.component';

export interface LayerContent {
  initialize(direction: Direction);
}

export function layerContentTypeFactory(
  layerKind: LayerKind
): Type<LayerContent> {
  switch (layerKind) {
    case LayerKind.Application:
      return ApplicationLayerComponent;

    case LayerKind.Presentation:
      return PresentationLayerComponent;

    case LayerKind.Session:
      return SessionLayerComponent;

    case LayerKind.Transport:
      return TransportLayerComponent;

    case LayerKind.Network:
      return NetworkLayerComponent;

    case LayerKind.DataLink:
      return DatalinkLayerComponent;

    case LayerKind.Physical:
      return PhysicalLayerComponent;

    default:
      throw new Error(`Unknown kind of layer: ${layerKind}.`);
  }
}
