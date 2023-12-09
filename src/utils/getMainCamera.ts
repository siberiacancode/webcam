export type GetMainCameraParams = RegExp | { front?: RegExp; back?: RegExp };

export const DEFAULT_MAIN_CAMERA_REG_EXP = {
  BACK: /(?=.*\bback\b)(?=.*\b0\b)/,
  FRONT: /\bfront\b/
};

export const getMainCamera = async (params?: GetMainCameraParams, isFrontCamera?: boolean) => {
  if (navigator.mediaDevices?.enumerateDevices) {
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    const cameras = mediaDevices.filter(({ kind }) => kind === 'videoinput');

    if (cameras.length <= 2) return null;

    let regExp: RegExp | undefined;

    if (typeof params === 'object') {
      regExp = params instanceof RegExp ? params : params[isFrontCamera ? 'front' : 'back'];
    }

    return cameras.find(({ label }) =>
      label.match(regExp ?? DEFAULT_MAIN_CAMERA_REG_EXP[isFrontCamera ? 'FRONT' : 'BACK'])
    );
  }

  return null;
};
