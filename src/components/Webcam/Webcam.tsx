import type { ComponentPropsWithoutRef, FC, ReactNode, RefObject, SyntheticEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import type {
  GetMediaStreamConstraintsOptions,
  GetVideoFrameCanvasOptions,
  GetWebcamScreenshotOptions,
  MediaTrackConstraintsParams
} from '../../utils';
import {
  applyMediaStreamConstraints,
  getMediaStream,
  getMediaStreamConstraints,
  getVideoFrameCanvas,
  getWebcamScreenshot,
  stopMediaStream
} from '../../utils';

type VideoElementProps = Omit<ComponentPropsWithoutRef<'video'>, 'children'>;

export type WebcamRenderProps = (options: {
  getCanvas: (options?: GetVideoFrameCanvasOptions) => HTMLCanvasElement | undefined;
  getScreenshot: (options?: GetWebcamScreenshotOptions) => string | undefined;
  videoElement: HTMLVideoElement | null;
}) => ReactNode;

export interface WebcamProps extends VideoElementProps, MediaTrackConstraintsParams {
  mirrored?: boolean;
  stream?: MediaStream;
  requestTimeLimit?: number;
  innerRef?: RefObject<HTMLVideoElement>;
  children?: ReactNode | WebcamRenderProps;
  audioConstraints?: MediaTrackConstraints;
  videoConstraints?: MediaTrackConstraints;
  onStreamRequest?: () => void;
  onStreamError?: (error: Error) => void;
  onStreamStart?: (stream: MediaStream) => void;
  onStreamStop?: (stream: MediaStream) => void;
  onStreamLoad?: (event: SyntheticEvent<HTMLVideoElement, Event>) => void;
}

export const Webcam: FC<WebcamProps> = ({
  innerRef: externalVideoRef,
  stream: externalStream,
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
  onStreamRequest,
  onStreamError,
  onStreamStart,
  onStreamStop,
  onStreamLoad,
  ...props
}) => {
  const internalVideoRef = useRef<HTMLVideoElement | null>(null);
  const internalStreamRef = useRef<MediaStream | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>();

  const videoRef = externalVideoRef ?? internalVideoRef;

  const onLoadedMetadata = (event: SyntheticEvent<HTMLVideoElement, Event>) => {
    onStreamLoad?.(event);
    event.currentTarget.play();
  };

  const setMediaStream = (stream: MediaStream) => {
    if (!videoRef.current) return;

    if ('srcObject' in videoRef.current) {
      videoRef.current.srcObject = stream;
      return;
    }

    // @ts-ignore
    setVideoSrc(window.URL.createObjectURL(stream));
  };

  const requestUserMedia = async (options: GetMediaStreamConstraintsOptions) => {
    try {
      onStreamRequest?.();

      const mediaStream = await getMediaStream(options, requestTimeLimit);

      onStreamStart?.(mediaStream);
      setMediaStream(mediaStream);
      internalStreamRef.current = mediaStream;
    } catch (error) {
      onStreamError?.(error as Error);
    }
  };

  useEffect(() => {
    if (externalStream) {
      setMediaStream(externalStream);
    }
  }, [externalStream]);

  useEffect(() => {
    const mediaStream = internalStreamRef.current;

    const options: GetMediaStreamConstraintsOptions = {
      constraints: {
        video: videoConstraints,
        audio: audioConstraints
      },
      params: {
        cameraResolutionMode,
        cameraResolutionType,
        frontCamera,
        mainCamera,
        muted
      }
    };

    if (mediaStream) {
      getMediaStreamConstraints(options)
        .then((constraints) => applyMediaStreamConstraints(mediaStream, constraints))
        .catch(() => requestUserMedia(options));
      return;
    }

    requestUserMedia(options);

    return () => {
      if (videoSrc) {
        window.URL.revokeObjectURL(videoSrc);
      }

      if (!mediaStream) return;

      onStreamStop?.(mediaStream);
      stopMediaStream(mediaStream);
    };
  }, [
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

  return (
    <>
      <video
        autoPlay
        playsInline
        muted={muted}
        ref={videoRef}
        src={videoSrc}
        controls={false}
        onLoadedMetadata={onLoadedMetadata}
        style={{
          ...style,
          ...(mirrored && {
            transform: `${style.transform ? `${style.transform} ` : ''}scaleX(-1)`
          })
        }}
        {...props}
      />
      {typeof children === 'function'
        ? children({
            videoElement: videoRef.current,
            getCanvas: (options?: GetVideoFrameCanvasOptions) =>
              videoRef.current ? getVideoFrameCanvas(videoRef.current, options) : undefined,
            getScreenshot: (options?: GetWebcamScreenshotOptions) =>
              videoRef.current ? getWebcamScreenshot(videoRef.current, options) : undefined
          })
        : children}
    </>
  );
};
