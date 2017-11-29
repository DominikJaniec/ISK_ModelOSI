import { Subject } from 'rxjs/Subject';

import { Direction } from '../directions';
import { LayerKind, LayerId, LayerData, orderFor } from '../layers';

export class LayersStream {
  private readonly map: LayersMap;
  readonly head: StreamElement;

  constructor() {
    const receiverPart = generateFor(Direction.Receiver, null);
    const senderPart = generateFor(Direction.Sender, receiverPart.head);

    const map = {};
    map[Direction.Receiver] = receiverPart.map;
    map[Direction.Sender] = senderPart.map;
    this.map = map;

    this.head = senderPart.head;
  }

  for(layerId: LayerId): StreamElement {
    return this.map[layerId.direction][layerId.kind];
  }

  downstreamFrom(layerId: LayerId): StreamElement {
    return this.for(layerId).downstream;
  }
}

export class StreamElement {
  private readonly id: LayerId;
  readonly downstream: StreamElement;
  readonly dataSubject: Subject<LayerData>;
  readonly clearFromSubject: Subject<{}>;

  constructor(id: LayerId, downstream: StreamElement = null) {
    this.id = id;
    this.downstream = downstream;
    this.dataSubject = new Subject<LayerData>();
    this.clearFromSubject = new Subject();

    if (downstream !== null) {
      this.clearFromSubject.subscribe(downstream.clearFromSubject.next);
    }
  }
}

interface LayersMap {
  readonly [direction: number]: PartMap;
}

interface PartMap {
  readonly [layer: number]: StreamElement;
}

interface Part {
  readonly head: StreamElement;
  readonly map: PartMap;
}

function generateFor(direction: Direction, previous: StreamElement): Part {
  const map = {};

  for (const layer of orderFor(direction).reverse()) {
    const id: LayerId = { kind: layer, direction: direction };
    const element = new StreamElement(id, previous);

    map[layer] = element;
    previous = element;
  }

  return {
    head: previous,
    map: map
  };
}
