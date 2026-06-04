declare module "fast-png" {
  export type DecodedPng = {
    width: number;
    height: number;
    data: Uint8Array | Uint8ClampedArray | number[];
    channels?: number;
  };

  export function decode(data: Uint8Array | ArrayBuffer, options?: unknown): DecodedPng;
}
