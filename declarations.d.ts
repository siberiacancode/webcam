interface Navigator {
  getUserMedia?: (
    options: MediaStreamConstraints,
    success: (stream: MediaStream) => void,
    error: (exception: DOMException) => void
  ) => Promise<MediaStream>;
  webkitGetUserMedia?: Navigator['getUserMedia'];
  mozGetUserMedia?: Navigator['getUserMedia'];
  msGetUserMedia?: Navigator['getUserMedia'];
}

type ImageFormat = 'image/webp' | 'image/png' | 'image/jpeg';
