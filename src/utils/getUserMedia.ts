export const getUserMediaFunction =
  typeof navigator !== 'undefined' &&
  (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

export const getUserMedia = (constraints: MediaStreamConstraints): Promise<MediaStream> => {
  if (navigator.mediaDevices?.getUserMedia === undefined) {
    if (!getUserMediaFunction) {
      return Promise.reject(
        new Error('Function getUserMedia of Navigator is not implemented in this browser')
      );
    }

    return new Promise((resolve, reject) => {
      getUserMediaFunction.call(navigator, constraints, resolve, reject);
    });
  }

  return navigator.mediaDevices.getUserMedia(constraints);
};
