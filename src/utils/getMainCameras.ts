export const getMainCameras = async () => {
  const mediaDevices = await navigator.mediaDevices.enumerateDevices();
  const cameras = mediaDevices.filter(({ kind }) => kind === 'videoinput');

  if (cameras.length <= 2) return cameras;

  const frontCamera = cameras.find(({ label }) => label.match(/\bfront\b/));
  const backCamera = cameras.find(({ label }) => label.match(/\bback\b/) && label.match(/\b0\b/));

  if (!frontCamera || !backCamera) {
    return [cameras[0], cameras.at(-1)];
  }

  return [frontCamera, backCamera];
};
