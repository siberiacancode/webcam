import { useEffect } from 'react';

import { useAnimationFrame } from './useAnimationFrame';

interface HTMLVideoElementEventParams {
  eventKey?: keyof HTMLVideoElementEventMap;
  options?: boolean | EventListenerOptions;
  handler?: (event: Event) => void;
}

export interface UseVideoSourcePlayParams {
  start?: HTMLVideoElementEventParams;
  stop?: HTMLVideoElementEventParams;
}

export const useVideoSourcePlay = <T extends HTMLVideoElement | void = void>(
  targetElement: T,
  handler: (time?: number) => void,
  {
    start: { eventKey: startEventKey = 'loadedmetadata', ...startEvent } = {},
    stop: { eventKey: stopEventKey = 'ended', ...stopEvent } = {}
  }: UseVideoSourcePlayParams = {}
) => {
  const [requestAnimationFrame, cancelAnimationFrame] = useAnimationFrame(handler);

  useEffect(() => {
    if (!targetElement) return;

    const onStartEvent = (e: Event) => {
      requestAnimationFrame();
      startEvent.handler?.(e);
    };
    const onEndEvent = (e: Event) => {
      cancelAnimationFrame();
      stopEvent.handler?.(e);
    };

    targetElement.addEventListener(startEventKey, onStartEvent, startEvent.options);
    targetElement.addEventListener(stopEventKey, onEndEvent, stopEvent.options);

    return () => {
      targetElement.removeEventListener(startEventKey, onStartEvent, startEvent.options);
      targetElement.removeEventListener(stopEventKey, onEndEvent, stopEvent.options);
    };
  }, []);
};
