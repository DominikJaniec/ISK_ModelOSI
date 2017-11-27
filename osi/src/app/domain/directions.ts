export enum Direction {
  Sender,
  Receiver
}

export function translateDirection(direction: Direction): string {
  switch (direction) {
    case Direction.Sender:
      return 'Nadawca';

    case Direction.Receiver:
      return 'Odbiorca';

    default:
      throw new Error(`Unknown direction: '${direction}'.`);
  }
}
