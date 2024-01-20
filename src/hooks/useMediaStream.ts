import { useEffect, useRef } from 'react';

import type { GetMediaStreamConstraintsParams, MediaTrackConstraintsOptions } from '../utils';
import {
  applyMediaStreamConstraints,
  getMediaStream,
  getMediaStreamConstraints,
  stopMediaStream
} from '../utils';

export interface UseMediaStreamParams extends MediaTrackConstraintsOptions {
  disableStream?: boolean;
  requestTimeLimit?: number;
  audioConstraints?: MediaTrackConstraints;
  videoConstraints?: MediaTrackConstraints;
  onStreamRequest?: () => void;
  onStreamError?: (error: Error) => void;
  onStreamStart?: (stream: MediaStream) => void;
  onStreamStop?: (stream?: MediaStream) => void;
}

export const useMediaStream = ({
  onStreamRequest,
  onStreamError,
  onStreamStart,
  onStreamStop,
  disableStream,
  requestTimeLimit,
  videoConstraints,
  audioConstraints,
  cameraResolutionMode,
  cameraResolutionType,
  frontCamera,
  mainCamera,
  muted
}: UseMediaStreamParams = {}) => {
  const streamRef = useRef<MediaStream>();

  useEffect(() => {
    if (disableStream) return;

    const streamConstraintsParams: GetMediaStreamConstraintsParams = {
      constraints: {
        video: videoConstraints,
        audio: audioConstraints
      },
      options: {
        cameraResolutionMode,
        cameraResolutionType,
        frontCamera,
        mainCamera,
        muted
      }
    };

    const requesMediaStream = async (params: GetMediaStreamConstraintsParams) => {
      try {
        onStreamRequest?.();

        const mediaStream = await getMediaStream(params, requestTimeLimit);

        onStreamStart?.(mediaStream);
      } catch (error) {
        onStreamError?.(error as Error);
      }
    };

    const runningStream = streamRef.current;
    if (runningStream) {
      getMediaStreamConstraints(streamConstraintsParams)
        .then((constraints) => applyMediaStreamConstraints(runningStream, constraints))
        .catch(() => requesMediaStream(streamConstraintsParams));
    } else {
      requesMediaStream(streamConstraintsParams);
    }

    return () => {
      onStreamStop?.(runningStream);
      if (!runningStream) return;
      stopMediaStream(runningStream);
    };
  }, [
    disableStream,
    requestTimeLimit,
    // DEFAULT CONSTRAINTS:
    videoConstraints,
    audioConstraints,
    // CUSTOM CONSTRAINTS:
    cameraResolutionMode,
    cameraResolutionType,
    frontCamera,
    mainCamera,
    muted
  ]);

  return streamRef.current;
};
