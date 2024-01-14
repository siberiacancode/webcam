import { getConstraintsBySource } from './getConstraintsBySource';
import type { VideoTrackConstraintsParams } from './getVideoTrackConstraints';
import { getVideoTrackConstraints } from './getVideoTrackConstraints';

export interface MediaTrackConstraintsParams extends VideoTrackConstraintsParams {
  muted?: boolean;
}

export interface GetMediaStreamConstraintsOptions {
  params?: MediaTrackConstraintsParams;
  constraints?: MediaStreamConstraints;
}

export const getMediaStreamConstraints = async ({
  constraints: { video = true, audio = false, ...constraints } = {},
  params: { muted = true, ...params } = {}
}: GetMediaStreamConstraintsOptions = {}) => {
  if ('mediaDevices' in navigator) {
    const videoConstraints = await getVideoTrackConstraints(
      typeof video === 'object' ? video : {},
      params
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
