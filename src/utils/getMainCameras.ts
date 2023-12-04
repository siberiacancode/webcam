export type GetMainCamerasOptions = {
  front?: RegExp;
  back?: RegExp;
};

export const DEFAULT_MAIN_CAMERA_REG_EXP = {
  BACK: /(?=.*\bback\b)(?=.*\b0\b)/,
  FRONT: /\bfront\b/
};

export const getMainCameras = async ({
  front = DEFAULT_MAIN_CAMERA_REG_EXP.FRONT,
  back = DEFAULT_MAIN_CAMERA_REG_EXP.BACK
}: GetMainCamerasOptions = {}) => {
  const mediaDevices = await navigator.mediaDevices.enumerateDevices();
  const cameras = mediaDevices.filter(({ kind }) => kind === 'videoinput');

  if (cameras.length <= 2) return cameras;

  const frontCamera = cameras.find(({ label }) => label.match(front));
  const backCamera = cameras.find(({ label }) => label.match(back));

  return [frontCamera, backCamera];
};
