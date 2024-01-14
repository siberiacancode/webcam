// ✅ important
// Implementations for each browser need to be supported
export const getUserMediaFunction =
  typeof navigator !== 'undefined' &&
  (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

// ✅ important
// Polyfill to support legacy web-api
export const getUserMedia = (constraints: MediaStreamConstraints): Promise<MediaStream> => {
  if (!navigator.mediaDevices?.getUserMedia) {
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
