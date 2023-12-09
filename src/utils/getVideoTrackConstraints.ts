import type { GetMainCameraParams } from './getMainCamera';
import { getMainCamera } from './getMainCamera';

export type VideoResolutionSize = {
  width: number;
  height: number;
};

export type CameraResolutionType = 'HD' | 'FHD' | 'QHD' | 'UHD';
export type CameraResolutionMode = keyof ConstrainULongRange;

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

export interface VideoTrackConstraintsParams {
  mainCamera?: GetMainCameraParams | boolean;
  cameraResolutionMode?: CameraResolutionMode;
  cameraResolutionType?: CameraResolutionType;
  mergeConstraints?: 'start' | 'end';
  frontCamera?: boolean;
}

export const getVideoTrackConstraints = async (
  defaultConstraints: MediaTrackConstraints,
  {
    mainCamera: useMainCamera,
    frontCamera: useFrontCamera,
    mergeConstraints = 'start',
    cameraResolutionType,
    cameraResolutionMode = 'ideal'
  }: VideoTrackConstraintsParams
) => {
  const videoConstraints: MediaTrackConstraints = {};

  if (useMainCamera) {
    const mainCamera = await getMainCamera(
      typeof useMainCamera === 'object' ? useMainCamera : undefined,
      useFrontCamera
    );

    if (mainCamera?.deviceId) {
      videoConstraints.deviceId = { exact: mainCamera.deviceId };
    }
  }

  if (!videoConstraints.deviceId && typeof useFrontCamera === 'boolean') {
    videoConstraints.facingMode = useFrontCamera ? 'user' : 'environment';
  }

  return {
    ...(mergeConstraints === 'start' && defaultConstraints),
    ...videoConstraints,
    ...(cameraResolutionType && {
      width: {
        [cameraResolutionMode]: VIDEO_RESOLUTION_SIZE[cameraResolutionType].width
      },
      height: {
        [cameraResolutionMode]: VIDEO_RESOLUTION_SIZE[cameraResolutionType].height
      }
    }),
    ...(mergeConstraints === 'end' && defaultConstraints)
  };
};
