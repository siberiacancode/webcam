import type { GetVideoFrameCanvasOptions } from './getVideoFrameCanvas';
import { getVideoFrameCanvas } from './getVideoFrameCanvas';

export interface GetWebcamScreenshotOptions extends GetVideoFrameCanvasOptions {
  format?: ImageFormat;
  quality?: number;
}

export const getWebcamScreenshot = (
  source?: HTMLVideoElement | null,
  { format = 'image/jpeg', quality = 1, ...options }: GetWebcamScreenshotOptions = {}
) => {
  const canvas = getVideoFrameCanvas(source, options);

  return canvas && canvas.toDataURL(format, quality);
};
