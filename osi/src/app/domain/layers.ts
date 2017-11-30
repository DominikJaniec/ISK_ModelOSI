import { Direction } from './directions';

export enum LayerKind {
  Application,
  Presentation,
  Session,
  Transport,
  Network,
  DataLink,
  Physical
}

export interface LayerId {
  readonly kind: LayerKind;
  readonly direction: Direction;
}

export interface DataBlock {
  readonly bytes: number[];
}

export interface LayerData {
  readonly blocks: DataBlock[];
}

export function orderFor(direction: Direction): LayerKind[] {
  const senderOrder = [
    LayerKind.Application,
    LayerKind.Presentation,
    LayerKind.Session,
    LayerKind.Transport,
    LayerKind.Network,
    LayerKind.DataLink,
    LayerKind.Physical
  ];

  switch (direction) {
    case Direction.Sender:
      return senderOrder;

    case Direction.Receiver:
      return senderOrder.reverse();

    default:
      throw new Error(`Unknown value: '${direction} for the 'Direction'.`);
  }
}
