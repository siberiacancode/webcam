export interface GetWebcamScreenshotOptions {
  width?: number;
  height?: number;
  imageSmoothingEnabled?: boolean;
  format?: ImageFormat;
  quality?: number;
}

export const getWebcamScreenshot = (
  source: HTMLVideoElement,
  {
    imageSmoothingEnabled = true,
    format = 'image/jpeg',
    quality = 1,
    ...options
  }: GetWebcamScreenshotOptions = {}
) => {
  const canvasWidth = source.videoWidth;
  const canvasHeight = source.videoHeight;

  const canvas = document.createElement('canvas');
  canvas.width = options?.width || canvasWidth;
  canvas.height = options?.height || canvasHeight;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas context is empty');
  }

  context.imageSmoothingEnabled = imageSmoothingEnabled;
  context.drawImage(source, 0, 0, canvasWidth, canvasHeight);

  return canvas.toDataURL(format, quality);
};
