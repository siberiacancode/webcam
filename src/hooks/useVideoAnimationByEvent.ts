import type { RefObject } from 'react';
import { useEffect } from 'react';

import { noop } from '../utils/noop';

import { useAnimationFrame } from './useAnimationFrame';

type HTMLVideoElementEvent = HTMLVideoElementEventMap[keyof HTMLVideoElementEventMap];

interface HTMLVideoElementEventParams {
  options?: boolean | EventListenerOptions;
  eventKey?: keyof HTMLVideoElementEventMap;
  handler?: (event: HTMLVideoElementEvent) => void;
}

export interface UseVideoAnimationByEventOptions {
  start?: HTMLVideoElementEventParams;
  stop?: HTMLVideoElementEventParams;
}

export const useVideoAnimationByEvent = (
  videoRef: RefObject<HTMLVideoElement>,
  handler: (time?: number) => void,
  {
    start: {
      eventKey: startEventKey = 'loadedmetadata',
      handler: startEventHandler = noop,
      ...startEvent
    } = {},
    stop: { eventKey: stopEventKey = 'ended', handler: stopEventHandler = noop, ...stopEvent } = {}
  }: UseVideoAnimationByEventOptions = {}
) => {
  const [requestAnimationFrame, cancelAnimationFrame] = useAnimationFrame(handler);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const onStartEvent = (e: HTMLVideoElementEvent) => {
      requestAnimationFrame();
      startEventHandler(e);
    };
    const onEndEvent = (e: HTMLVideoElementEvent) => {
      cancelAnimationFrame();
      stopEventHandler(e);
    };

    videoElement.addEventListener(startEventKey, onStartEvent, startEvent.options);
    videoElement.addEventListener(stopEventKey, onEndEvent, stopEvent.options);

    return () => {
      videoElement.removeEventListener(startEventKey, onStartEvent, startEvent.options);
      videoElement.removeEventListener(stopEventKey, onEndEvent, stopEvent.options);
    };
  }, []);
};
