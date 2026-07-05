import type { HookTarget, StateRef, UseMediaStreamOptions } from '@siberiacancode/reactuse';
import type { MediaTrackConstraintsOptions } from '@webcam/core';

import {
  isTarget,
  useDidUpdate,
  useMediaStream,
  useMount,
  useRefState,
  useUnmount
} from '@siberiacancode/reactuse';
import { getMediaStreamConstraints } from '@webcam/core';
import { useEffect } from 'react';

export interface UseWebcamParams extends MediaTrackConstraintsOptions {
  audioConstraints?: MediaTrackConstraints;
  requestTimeLimit?: number;
  stream?: MediaStream;
  videoConstraints?: MediaTrackConstraints;
  onError?: (error: Error) => void;
  onRequest?: () => void;
  onStart?: (stream: MediaStream) => void;
  onStop?: (stream?: MediaStream) => void;
}

export interface UseWebcamReturn {
  stream?: MediaStream;
  apply: (constraints: MediaStreamConstraints) => Promise<boolean>;
  start: (constraints?: MediaStreamConstraints) => Promise<MediaStream | undefined>;
  stop: () => void;
}

export interface UseWebcam {
  (target: HookTarget, params?: UseWebcamParams): UseWebcamReturn;

  (params?: UseWebcamParams): UseWebcamReturn & {
    ref: StateRef<HTMLVideoElement>;
  };
}

/**
 * @name useWebcam
 * @description - Hook that manages a webcam media stream for a video element
 *
 * @overload
 * @param {HookTarget} target The target video element the stream will be attached to
 * @param {UseWebcamParams} [params] The webcam parameters
 * @returns {UseWebcamReturn} An object containing the stream and controls
 *
 * @overload
 * @param {UseWebcamParams} [params] The webcam parameters
 * @returns {UseWebcamReturn & { ref: StateRef<HTMLVideoElement> }} An object containing the stream, controls and ref
 */
export const useWebcam = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = ((target ? params[1] : params[0]) as UseWebcamParams) ?? {};

  const {
    stream: externalStream,
    videoConstraints,
    audioConstraints,
    cameraResolutionMode,
    cameraResolutionType,
    frontCamera,
    mainCamera,
    muted,
    onRequest,
    onError,
    onStart,
    onStop
  } = options;

  const internalRef = useRefState<HTMLVideoElement>();
  const resolvedRef = (target ?? internalRef) as HookTarget;

  const mediaStream = useMediaStream(resolvedRef, {
    immediately: false,
    onStart,
    onStop,
    onError
  } satisfies UseMediaStreamOptions);

  const createConstraints = () =>
    getMediaStreamConstraints({
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
    });

  useMount(() => {
    if (externalStream) return;
    const run = async () => {
      onRequest?.();
      const constraints = await createConstraints();
      mediaStream.start(constraints);
    };

    run();
  });

  useDidUpdate(() => {
    if (externalStream) return;

    const run = async () => {
      onRequest?.();
      const constraints = await createConstraints();

      if (mediaStream.stream) {
        const ok = await mediaStream.apply(constraints);
        if (!ok) mediaStream.start(constraints);
        return;
      }

      mediaStream.start(constraints);
    };

    run();
  }, [
    videoConstraints,
    audioConstraints,
    cameraResolutionMode,
    cameraResolutionType,
    frontCamera,
    mainCamera,
    muted
  ]);

  useEffect(() => {
    if (!externalStream) return;

    const element = isTarget.getElement(resolvedRef) as HTMLVideoElement | null;
    if (!element) return;

    element.srcObject = externalStream;
    onStart?.(externalStream);

    return () => {
      onStop?.(externalStream);
    };
  }, [externalStream, target && isTarget.getRawElement(target), internalRef.state]);

  useUnmount(() => {
    if (externalStream) return;
    mediaStream.stop();
  });

  if (target)
    return {
      stream: externalStream ?? mediaStream.stream,
      start: mediaStream.start,
      apply: mediaStream.apply,
      stop: mediaStream.stop
    };
  return {
    stream: externalStream ?? mediaStream.stream,
    start: mediaStream.start,
    apply: mediaStream.apply,
    stop: mediaStream.stop,
    ref: internalRef
  };
}) as UseWebcam;
