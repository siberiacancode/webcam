import type { GetVideoFrameCanvasOptions } from './getVideoFrameCanvas';
import { getVideoFrameCanvas } from './getVideoFrameCanvas';

export interface GetVideoFrameDataUrlOptions extends GetVideoFrameCanvasOptions {
  format?: 'image/webp' | 'image/png' | 'image/jpeg';
  quality?: number;
}

export const getVideoFrameDataUrl = (
  source: HTMLVideoElement,
  { format = 'image/jpeg', quality = 1, ...options }: GetVideoFrameDataUrlOptions = {}
) => {
  const canvas = getVideoFrameCanvas(source, options);

  if (canvas) {
    return canvas.toDataURL(format, quality);
  }
};
