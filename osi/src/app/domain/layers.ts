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

const senderOrder = [
  LayerKind.Application,
  LayerKind.Presentation,
  LayerKind.Session,
  LayerKind.Transport,
  LayerKind.Network,
  LayerKind.DataLink,
  LayerKind.Physical
];

const receiverOrder = senderOrder.slice().reverse();

export function orderFor(direction: Direction): LayerKind[] {
  switch (direction) {
    case Direction.Sender:
      return senderOrder.slice();

    case Direction.Receiver:
      return receiverOrder.slice();

    default:
      throw new Error(`Unknown value: '${direction} for the 'Direction'.`);
  }
}

export function flowCentsOf(layerId: LayerId): number {
  const order = orderFor(layerId.direction);
  let position = order.indexOf(layerId.kind) + 1;
  position =
    layerId.direction === Direction.Receiver
      ? position + receiverOrder.length
      : position;

  const totalCount = senderOrder.length + receiverOrder.length;
  const percent = position * 100.0 / totalCount;
  return parseInt(Math.round(percent).toString(), 10);
}
