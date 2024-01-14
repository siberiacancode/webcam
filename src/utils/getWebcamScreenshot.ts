import type { GetVideoFrameCanvasOptions } from './getVideoFrameCanvas';
import { getVideoFrameCanvas } from './getVideoFrameCanvas';

export interface GetWebcamScreenshotOptions extends GetVideoFrameCanvasOptions {
  format?: ImageFormat;
  quality?: number;
}

export const getWebcamScreenshot = (
  source: HTMLVideoElement,
  { format = 'image/jpeg', quality = 1, ...options }: GetWebcamScreenshotOptions = {}
) => {
  const canvas = getVideoFrameCanvas(source, options);

  if (canvas) {
    return canvas.toDataURL(format, quality);
  }
};
