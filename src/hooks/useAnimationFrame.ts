import { useEffect, useRef } from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export const useAnimationFrame = (
  callback: (time: number) => void,
  active?: boolean
): [(timestamp?: DOMHighResTimeStamp) => void, () => void] => {
  const animationFrameRequestRef = useRef<number>();
  const previousTimestampRef = useRef<number>();
  const savedHandlerRef = useRef(callback);

  useIsomorphicLayoutEffect(() => {
    savedHandlerRef.current = callback;
  }, [callback]);

  const onFrameRequest = (timestamp?: DOMHighResTimeStamp) => {
    if (timestamp) {
      previousTimestampRef.current = timestamp;
      if (typeof previousTimestampRef.current === 'undefined') return;
      savedHandlerRef.current(timestamp - previousTimestampRef.current);
    }

    animationFrameRequestRef.current = requestAnimationFrame(onFrameRequest);
  };

  const onFrameCancel = () => {
    if (!animationFrameRequestRef.current) return;
    cancelAnimationFrame(animationFrameRequestRef.current);
  };

  useEffect(() => {
    if (typeof active !== 'boolean') return;

    if (active) {
      animationFrameRequestRef.current = requestAnimationFrame(onFrameRequest);
      return;
    }

    onFrameCancel();
    return () => onFrameCancel();
  }, [active]);

  return [onFrameRequest, onFrameCancel];
};
