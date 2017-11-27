import { Direction } from './directions';

export enum LayerKind {
  ContentInput,
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

export interface LayerData {
  readonly bytes: number[];
}
