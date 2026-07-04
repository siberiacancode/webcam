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
  applyConstraints?: boolean;
  audioConstraints?: MediaTrackConstraints;
  children?: ReactNode | WebcamRenderProps;
  innerRef?: RefObject<HTMLVideoElement>;
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
  ref: externalVideoRef,
  stream: externalStream,
  cameraResolutionMode,
  cameraResolutionType,
  videoConstraints,
  audioConstraints,
  requestTimeLimit,
  applyConstraints,
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
  const videoRef = externalVideoRef ?? internalVideoRef;

  useWebcam(videoRef, {
    stream: externalStream,
    // STREAM PARAMS:
    applyConstraints,
    requestTimeLimit,
    // STREAM HANDLERS:
    onRequest,
    onError,
    onStart,
    onStop,
    // DEFAULT CONSTRAINTS:
    videoConstraints,
    audioConstraints,
    // CUSTOM CONSTRAINTS:
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
