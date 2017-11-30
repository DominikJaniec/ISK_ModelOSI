import { Subject } from 'rxjs/Subject';

import { Direction } from '../directions';
import { LayerKind, LayerId, LayerData, orderFor } from '../layers';

export class LayersStream {
  private readonly map: LayersMap;
  readonly headId: LayerId;

  constructor() {
    const receiverPart = generateFor(Direction.Receiver, null);
    const senderPart = generateFor(Direction.Sender, receiverPart.head);

    const map = {};
    map[Direction.Receiver] = receiverPart.map;
    map[Direction.Sender] = senderPart.map;
    this.map = map;

    this.headId = senderPart.head.id;
  }

  for(layerId: LayerId): StreamLayer {
    return this.map[layerId.direction][layerId.kind];
  }

  downstreamFrom(layerId: LayerId): StreamLayer {
    return this.for(layerId).downstream;
  }
}

export class StreamLayer {
  readonly id: LayerId;
  readonly downstream: StreamLayer;
  readonly dataSubject: Subject<LayerData>;
  readonly clearFromSubject: Subject<{}>;

  constructor(id: LayerId, downstream: StreamLayer = null) {
    this.id = id;
    this.downstream = downstream;
    this.dataSubject = new Subject<LayerData>();
    this.clearFromSubject = new Subject();

    if (downstream !== null) {
      this.clearFromSubject.subscribe(_ => downstream.clearFromSubject.next());
    }
  }
}

interface LayersMap {
  readonly [direction: number]: PartMap;
}

interface PartMap {
  readonly [layer: number]: StreamLayer;
}

interface Part {
  readonly head: StreamLayer;
  readonly map: PartMap;
}

function generateFor(direction: Direction, previous: StreamLayer): Part {
  const map = {};

  for (const layer of orderFor(direction).reverse()) {
    const id: LayerId = { kind: layer, direction: direction };
    const element = new StreamLayer(id, previous);

    map[layer] = element;
    previous = element;
  }

  return {
    head: previous,
    map: map
  };
}
