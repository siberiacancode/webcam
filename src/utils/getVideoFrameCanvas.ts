export interface GetVideoFrameCanvasOptions {
  imageSmoothing?: boolean;
  mirrored?: boolean;
  height?: number;
  width?: number;
}

export const getVideoFrameCanvas = (
  source?: HTMLVideoElement | null,
  { imageSmoothing = true, mirrored, ...options }: GetVideoFrameCanvasOptions = {}
) => {
  if (!source) return null;

  const canvasWidth = source.videoWidth;
  const canvasHeight = source.videoHeight;

  const canvas = document.createElement('canvas');
  canvas.width = options?.width || canvasWidth;
  canvas.height = options?.height || canvasHeight;

  const context = canvas.getContext('2d');

  if (!context) return null;

  if (mirrored) {
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
  }

  context.imageSmoothingEnabled = imageSmoothing;
  context.drawImage(source, 0, 0, canvasWidth, canvasHeight);

  if (mirrored) {
    context.scale(-1, 1);
    context.translate(-canvas.width, 0);
  }

  return canvas;
};
