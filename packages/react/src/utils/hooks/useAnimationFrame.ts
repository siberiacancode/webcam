import { useIsomorphicLayoutEffect } from '@siberiacancode/reactuse';
import { useEffect, useRef } from 'react';

import { cancelAnimationFrame, requestAnimationFrame } from '../helpers';

/**
 * Helps request and cancel animation frame
 *
 * @param {Function} callback - frame request callback
 * @param {boolean} active - should animation frame be requested
 * @return {object} request/cancel animation frame handlers
 */
export const useAnimationFrame = (callback: (time: number) => void, active?: boolean) => {
  const animationFrameRequestRef = useRef<number>(undefined);
  const previousTimestampRef = useRef<number>(undefined);
  const savedHandlerRef = useRef(callback);

  useIsomorphicLayoutEffect(() => {
    savedHandlerRef.current = callback;
  }, [callback]);

  const onFrameRequest = (timestamp?: DOMHighResTimeStamp) => {
    if (timestamp) {
      previousTimestampRef.current = timestamp;
      if (previousTimestampRef.current === undefined) return;
      savedHandlerRef.current(timestamp - previousTimestampRef.current);
    }

    animationFrameRequestRef.current = requestAnimationFrame(onFrameRequest);
  };

  const onFrameCancel = () => {
    if (!animationFrameRequestRef.current) return;
    cancelAnimationFrame(animationFrameRequestRef.current);
  };

  useEffect(() => {
    if (active) {
      animationFrameRequestRef.current = requestAnimationFrame(onFrameRequest);
      return;
    }

    onFrameCancel();
    return () => onFrameCancel();
  }, [active]);

  return {
    request: onFrameRequest,
    cancel: onFrameCancel
  };
};
