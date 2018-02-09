export enum EncodingKind {
  ASCII
}

export class Encoding {
  static getBytesAs(enc: EncodingKind, content: string): number[] {
    switch (enc) {
      case EncodingKind.ASCII:
        return content.split('').map(c => c.charCodeAt(0));

      default:
        // TODO: We should deal also with other coding than ASCII.
        throw Encoding.unsupported(enc);
    }
  }

  static fromBytesAs(enc: EncodingKind, bytes: number[]): string {
    switch (enc) {
      case EncodingKind.ASCII:
        return bytes.map(c => String.fromCharCode(c)).join('');

      default:
        // TODO: We should deal also with other coding than ASCII.
        throw Encoding.unsupported(enc);
    }
  }

  private static unsupported(enc: EncodingKind): Error {
    return new Error(`Encoding '${EncodingKind[enc]}' is not supported.`);
  }
}
