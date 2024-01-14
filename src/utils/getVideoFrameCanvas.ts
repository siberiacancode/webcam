export interface GetVideoFrameCanvasOptions {
  imageSmoothingEnabled?: boolean;
  mirrored?: boolean;
  height?: number;
  width?: number;
}

export const getVideoFrameCanvas = (
  source: HTMLVideoElement,
  { imageSmoothingEnabled = true, mirrored, ...options }: GetVideoFrameCanvasOptions = {}
) => {
  const { videoWidth: canvasWidth, videoHeight: canvasHeight } = source;

  const canvas = document.createElement('canvas');
  canvas.height = options.height || canvasHeight;
  canvas.width = options.width || canvasWidth;

  const context = canvas.getContext('2d');
  if (!context) return;

  if (mirrored) {
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
  }

  context.imageSmoothingEnabled = imageSmoothingEnabled;
  context.drawImage(source, 0, 0, canvasWidth, canvasHeight);

  if (mirrored) {
    context.scale(-1, 1);
    context.translate(-canvas.width, 0);
  }

  return canvas;
};
