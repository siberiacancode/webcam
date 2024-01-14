import { canGetUserMedia } from './canGetUserMedia';
import type { GetMediaStreamConstraintsOptions } from './constraints';
import { getMediaStreamConstraints } from './constraints';
import { getUserMedia } from './getUserMedia';

export const getMediaStream = async (
  options: GetMediaStreamConstraintsOptions,
  timeLimitMs?: number
): Promise<MediaStream> => {
  if (!canGetUserMedia()) {
    throw new Error('Function getUserMedia of Navigator is not supported');
  }

  let mediaStream: MediaStream | undefined;
  const mediaStreamConstraints = await getMediaStreamConstraints(options);

  if (timeLimitMs) {
    mediaStream = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('User media request has reached the specified time limit'));
      }, timeLimitMs);

      getUserMedia(mediaStreamConstraints)
        .then((result) => {
          clearTimeout(timer);
          return resolve(result);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  } else {
    mediaStream = await getUserMedia(mediaStreamConstraints);
  }

  if (!mediaStream) {
    throw new Error('Stream of media content was not found');
  }

  return mediaStream;
};
