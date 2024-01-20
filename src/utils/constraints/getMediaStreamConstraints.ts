import { getConstraintsBySource } from './getConstraintsBySource';
import type { VideoTrackConstraintsOptions } from './getVideoTrackConstraints';
import { getVideoTrackConstraints } from './getVideoTrackConstraints';

export interface MediaTrackConstraintsOptions extends VideoTrackConstraintsOptions {
  muted?: boolean;
}

export interface GetMediaStreamConstraintsParams {
  options?: MediaTrackConstraintsOptions;
  constraints?: MediaStreamConstraints;
}

export const getMediaStreamConstraints = async ({
  constraints: { video = true, audio = false, ...constraints } = {},
  options: { muted = true, ...options } = {}
}: GetMediaStreamConstraintsParams = {}) => {
  if ('mediaDevices' in navigator) {
    const videoConstraints = await getVideoTrackConstraints(
      typeof video === 'object' ? video : {},
      options
    );

    return {
      ...constraints,
      ...(!muted && {
        audio: typeof audio !== 'undefined' ? audio : true
      }),
      video: videoConstraints
    };
  }

  return getConstraintsBySource({ video, audio });
};
