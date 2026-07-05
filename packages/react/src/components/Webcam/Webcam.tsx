import type {
  GetVideoFrameCanvasOptions,
  GetWebcamSnapshotOptions,
  MediaTrackConstraintsOptions
} from '@webcam/core';
import type { ComponentProps, ReactNode, RefObject } from 'react';

import { getVideoFrameCanvas, getWebcamSnapshot } from '@webcam/core';
import React, { useRef } from 'react';

import { useWebcam } from './hooks';

export type WebcamRenderProps = (options: {
  getCanvas: (options?: GetVideoFrameCanvasOptions) => HTMLCanvasElement | undefined;
  getSnapshot: (options?: GetWebcamSnapshotOptions) => string | undefined;
  element: HTMLVideoElement | null;
}) => ReactNode;

interface BaseWebcamProps
  extends Omit<ComponentProps<'video'>, 'children' | 'onError'>, MediaTrackConstraintsOptions {
  audioConstraints?: MediaTrackConstraints;
  children?: ReactNode | WebcamRenderProps;
  mirrored?: boolean;
  ref?: RefObject<HTMLVideoElement>;
  requestTimeLimit?: number;
  videoConstraints?: MediaTrackConstraints;
  onError?: (error: Error) => void;
  onRequest?: () => void;
  onStart?: (stream: MediaStream) => void;
  onStop?: (stream?: MediaStream) => void;
}

interface WebcamPropsWithInternalStream extends BaseWebcamProps {
  stream?: undefined;
}

interface WebcamPropsWithExternalStream extends BaseWebcamProps {
  stream?: MediaStream;
}

export type WebcamProps = WebcamPropsWithExternalStream | WebcamPropsWithInternalStream;

/**
 * Renders the Webcam component and handles the requesting and displaying of the media stream
 *
 * @param {WebcamProps} props - The props for the Webcam component
 * @return {ReactElement} The rendered Webcam component
 */
export const Webcam = ({
  ref,
  stream,
  cameraResolutionMode,
  cameraResolutionType,
  videoConstraints,
  audioConstraints,
  requestTimeLimit,
  frontCamera,
  mainCamera,
  mirrored = true,
  muted = true,
  style = {},
  children,
  onLoadedMetadata,
  onRequest,
  onError,
  onStart,
  onStop,
  ...props
}: WebcamProps) => {
  const internalVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = ref ?? internalVideoRef;

  useWebcam(videoRef, {
    stream,
    requestTimeLimit,
    onRequest,
    onError,
    onStart,
    onStop,
    videoConstraints,
    audioConstraints,
    cameraResolutionMode,
    cameraResolutionType,
    frontCamera,
    mainCamera,
    muted
  });

  return (
    <>
      <video
        autoPlay
        playsInline
        ref={videoRef}
        style={{
          ...style,
          ...(mirrored && {
            transform: `${style.transform ? `${style.transform} ` : ''}scaleX(-1)`
          })
        }}
        controls={false}
        muted={muted}
        onLoadedMetadata={(event) => {
          onLoadedMetadata?.(event);
          event.currentTarget.play();
        }}
        {...props}
      />
      {typeof children === 'function'
        ? children({
            element: videoRef.current,
            getCanvas: (options?: GetVideoFrameCanvasOptions) =>
              videoRef.current
                ? getVideoFrameCanvas(videoRef.current, { ...options, mirrored })
                : undefined,
            getSnapshot: (options?: GetWebcamSnapshotOptions) =>
              videoRef.current
                ? getWebcamSnapshot(videoRef.current, { ...options, mirrored })
                : undefined
          })
        : children}
    </>
  );
};
