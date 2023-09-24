import { canGetUserMedia } from './canGetUserMedia';
import { getConstraintsBySource } from './getConstraintsBySource';
import { getMainCameras } from './getMainCameras';
import { getUserMedia } from './getUserMedia';

export interface WebcamStreamParams {
  maxVideoQuality?: boolean;
  consoleInfo?: boolean;
  frontCamera?: boolean;
  mainCamera?: boolean;
  muted?: boolean;
}

export interface GetWebcamStreamOptions {
  constraints?: MediaStreamConstraints;
  defaultErrorMessage?: string;
  params?: WebcamStreamParams;
}

export const MAX_VIDEO_QUALITY_CONSTRAINTS: MediaTrackConstraints = {
  width: { ideal: 3840 },
  height: { ideal: 2160 }
};

export const getWebcamStream = ({
  params: {
    frontCamera: shouldUseFrontCamera = true,
    maxVideoQuality = true,
    consoleInfo = true,
    mainCamera = true,
    muted = true
  } = {},
  constraints: { video = true, audio = false, ...constraints } = {},
  defaultErrorMessage = 'Something went wrong'
}: GetWebcamStreamOptions = {}): Promise<MediaStream> =>
  new Promise((resolve, reject) => {
    const handleUserMediaError = (userMediaError: Error) => {
      const { message = defaultErrorMessage } = userMediaError;
      if (consoleInfo) console.error('[Webcam/error]:', message);
      reject(message);
    };

    const onMediaSourceSelect = async (
      videoConstraints?: MediaStreamConstraints['video'],
      audioConstraints?: MediaStreamConstraints['audio']
    ) => {
      try {
        if (typeof window === 'undefined' || !canGetUserMedia()) {
          throw new Error('Function getUserMedia of Navigator is not supported');
        }

        const [frontCamera, backCamera] = mainCamera ? await getMainCameras() : [];

        const mediaStreamConstraints: MediaStreamConstraints = {
          ...constraints,
          video: videoConstraints
            ? {
                facingMode: shouldUseFrontCamera ? 'user' : 'environment',
                ...(maxVideoQuality && MAX_VIDEO_QUALITY_CONSTRAINTS),
                ...(backCamera && {
                  deviceId: shouldUseFrontCamera
                    ? { exact: frontCamera?.deviceId }
                    : { exact: backCamera?.deviceId }
                }),
                ...(typeof videoConstraints === 'object' && videoConstraints)
              }
            : false
        };

        if (!muted) {
          mediaStreamConstraints.audio =
            typeof audioConstraints !== 'undefined' ? audioConstraints : true;
        }

        const stream = await getUserMedia(mediaStreamConstraints);

        if (!stream) {
          throw new Error('Stream of media content was not found');
        }

        resolve(stream);
      } catch (e) {
        handleUserMediaError(e as Error);
      }
    };

    if ('mediaDevices' in navigator) {
      onMediaSourceSelect(video, audio);
      return;
    }

    getConstraintsBySource(onMediaSourceSelect, { video, audio });
  });
