import { canGetUserMedia } from './canGetUserMedia';
import { getConstraintsBySource } from './getConstraintsBySource';
import type { GetMainCamerasOptions } from './getMainCameras';
import { getMainCameras } from './getMainCameras';
import { getUserMedia } from './getUserMedia';

export type CameraResolutionType = 'HD' | 'FHD' | 'QHD' | 'UHD';
export type CameraResolutionMode = keyof ConstrainULongRange;

export interface WebcamStreamParams {
  mainCamera?: GetMainCamerasOptions | boolean;
  cameraResolutionMode?: CameraResolutionMode;
  cameraResolutionType?: CameraResolutionType;
  frontCamera?: boolean;
  debug?: boolean;
  muted?: boolean;
}

export interface GetWebcamStreamOptions {
  constraints?: MediaStreamConstraints;
  defaultErrorMessage?: string;
  params?: WebcamStreamParams;
}

type VideoResolutionSize = {
  width: number;
  height: number;
};

export const VIDEO_RESOLUTION_SIZE: Record<CameraResolutionType, VideoResolutionSize> = {
  UHD: {
    width: 3840,
    height: 2160
  },
  QHD: {
    width: 2560,
    height: 1440
  },
  FHD: {
    width: 1920,
    height: 1080
  },
  HD: {
    width: 1280,
    height: 720
  }
};

const getVideoTrackConstraints = async (
  constraints: MediaTrackConstraints,
  {
    frontCamera: shouldUseFrontCamera,
    cameraResolutionMode = 'ideal',
    cameraResolutionType,
    mainCamera
  }: WebcamStreamParams
) => {
  const videoConstraints: MediaTrackConstraints = {
    ...constraints
  };

  if (mainCamera) {
    const [frontCamera, backCamera] =
      (await getMainCameras(typeof mainCamera === 'object' ? mainCamera : {})) || [];

    if (shouldUseFrontCamera && frontCamera) {
      videoConstraints.deviceId = { exact: frontCamera.deviceId };
    }

    if (!shouldUseFrontCamera && backCamera) {
      videoConstraints.deviceId = { exact: backCamera.deviceId };
    }
  }

  if (!videoConstraints.deviceId) {
    videoConstraints.facingMode = shouldUseFrontCamera ? 'user' : 'environment';
  }

  return {
    ...videoConstraints,
    ...(cameraResolutionType && {
      width: {
        [cameraResolutionMode]: VIDEO_RESOLUTION_SIZE[cameraResolutionType].width
      },
      height: {
        [cameraResolutionMode]: VIDEO_RESOLUTION_SIZE[cameraResolutionType].height
      }
    })
  };
};

export const getWebcamStream = ({
  params: { debug = true, muted = true, ...params } = {},
  constraints: { video = true, audio = false, ...constraints } = {},
  defaultErrorMessage = 'Something went wrong'
}: GetWebcamStreamOptions = {}): Promise<MediaStream> =>
  new Promise((resolve, reject) => {
    const handleUserMediaError = (userMediaError: Error) => {
      const { message = defaultErrorMessage } = userMediaError;
      if (debug) console.error('[Webcam/error]:', message);
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

        const mediaStreamConstraints: MediaStreamConstraints = {
          ...constraints,
          ...(!muted && {
            audio: typeof audioConstraints !== 'undefined' ? audioConstraints : true
          })
        };

        if (videoConstraints) {
          mediaStreamConstraints.video = await getVideoTrackConstraints(
            typeof videoConstraints === 'object' ? videoConstraints : {},
            params
          );
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
