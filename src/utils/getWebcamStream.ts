import { canGetUserMedia } from './canGetUserMedia';
import { getConstraintsBySource } from './getConstraintsBySource';
import { getUserMedia } from './getUserMedia';
import type { VideoTrackConstraintsParams } from './getVideoTrackConstraints';
import { getVideoTrackConstraints } from './getVideoTrackConstraints';

export interface MediaTrackConstraintsParams extends VideoTrackConstraintsParams {
  muted?: boolean;
}

export interface GetWebcamStreamOptions {
  params?: MediaTrackConstraintsParams;
  constraints?: MediaStreamConstraints;
  defaultErrorMessage?: string;
}

export const getWebcamStream = ({
  constraints: { video = true, audio = false, ...constraints } = {},
  params: { muted = true, ...params } = {},
  defaultErrorMessage = 'Something went wrong'
}: GetWebcamStreamOptions = {}): Promise<MediaStream> =>
  new Promise((resolve, reject) => {
    const handleUserMediaError = (userMediaError: Error) => {
      const { message = defaultErrorMessage } = userMediaError;
      reject(message);
    };

    const onMediaSourceSelect = async (
      defaultVideoConstraints?: MediaStreamConstraints['video'],
      audioConstraints?: MediaStreamConstraints['audio'],
      mergeConstraints?: boolean
    ) => {
      try {
        if (typeof window === 'undefined' || !canGetUserMedia()) {
          throw new Error('Function getUserMedia of Navigator is not supported');
        }

        let videoConstraints =
          typeof defaultVideoConstraints === 'object' ? defaultVideoConstraints : {};

        if (mergeConstraints) {
          videoConstraints = await getVideoTrackConstraints(videoConstraints, params);
        }

        const mediaStreamConstraints: MediaStreamConstraints = {
          ...constraints,
          ...(!muted && {
            audio: typeof audioConstraints !== 'undefined' ? audioConstraints : true
          }),
          video: videoConstraints
        };

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
      onMediaSourceSelect(video, audio, !!params.mergeConstraints);
      return;
    }

    getConstraintsBySource(onMediaSourceSelect, { video, audio });
  });
