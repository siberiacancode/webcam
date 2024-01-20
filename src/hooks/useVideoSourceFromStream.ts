import type { RefObject } from 'react';
import { useState } from 'react';

import type { UseMediaStreamParams } from './useMediaStream';
import { useMediaStream } from './useMediaStream';

export const useVideoSourceFromStream = (
  videoRef: RefObject<HTMLVideoElement>,
  params: UseMediaStreamParams = {}
) => {
  const [streamSource, setStreamSource] = useState<string>();

  const onStreamStart = (stream?: MediaStream) => {
    if (!stream) return;

    if (videoRef.current && 'srcObject' in videoRef.current) {
      // eslint-disable-next-line no-param-reassign
      videoRef.current.srcObject = stream;
      return;
    }

    // @ts-ignore
    setStreamSource(window.URL.createObjectURL(stream));
  };

  const onStreamStop = () => {
    if (!streamSource) return;

    window.URL.revokeObjectURL(streamSource);
  };

  useMediaStream({ ...params, onStreamStart, onStreamStop });

  return streamSource;
};
