import { Injectable } from '@angular/core';

import { LayerKind, Direction } from './domain/layers';

@Injectable()
export class TranslateService {
  constructor() {}

  direction(direction: Direction): string {
    switch (direction) {
      case Direction.Sender:
        return 'Nadawca';

      case Direction.Receiver:
        return 'Odbiorca';

      default:
        throw new Error(`Unknown direction: '${direction}'.`);
    }
  }

  layer(kind: LayerKind): string {
    switch (kind) {
      case LayerKind.Application:
        return 'Warstwa aplikacji';

      case LayerKind.Presentation:
        return 'Warstwa prezentacji';

      case LayerKind.Session:
        return 'Warstwa sesji';

      case LayerKind.Transport:
        return 'Warstwa transportowa';

      case LayerKind.Network:
        return 'Warstwa sieciowa';

      case LayerKind.DataLink:
        return 'Warstwa łącza danych';

      case LayerKind.Physical:
        return 'Warstwa fizyczna';

      default:
        throw new Error(`Unknown kind of layer: '${kind}'.`);
    }
  }
}
