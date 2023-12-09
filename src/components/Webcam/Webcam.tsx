import type { ComponentPropsWithoutRef, FC, ReactNode, RefObject } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import type {
  GetVideoFrameCanvasOptions,
  GetWebcamScreenshotOptions,
  MediaTrackConstraintsParams
} from '../../utils';
import {
  cancelAnimationFrame,
  getVideoFrameCanvas,
  getWebcamScreenshot,
  getWebcamStream,
  requestAnimationFrame,
  stopWebcamStream
} from '../../utils';

type VideoElementProps = Omit<ComponentPropsWithoutRef<'video'>, 'children'>;

export type WebcamRenderProps = (options: {
  getCanvas: (options?: GetVideoFrameCanvasOptions) => HTMLCanvasElement | null;
  getScreenshot: (options?: GetWebcamScreenshotOptions) => string | null;
  videoElement: HTMLVideoElement | null;
}) => ReactNode;

export interface WebcamProps extends VideoElementProps, MediaTrackConstraintsParams {
  mirrored?: boolean;
  stream?: MediaStream;
  innerRef?: RefObject<HTMLVideoElement>;
  children?: ReactNode | WebcamRenderProps;
  audioConstraints?: MediaTrackConstraints;
  videoConstraints?: MediaTrackConstraints;
  onStreamRequest?: () => void;
  onStreamError?: (error: string) => void;
  onStreamStop?: (stream: MediaStream) => void;
  onStreamStart?: (stream: MediaStream) => void;
  onVideoLoad?: (videoElement: HTMLVideoElement) => void;
  onVideoPlay?: (
    videoElement: HTMLVideoElement,
    timestamp?: DOMHighResTimeStamp
  ) => boolean | undefined;
}

export const Webcam: FC<WebcamProps> = ({
  innerRef: externalVideoRef,
  stream: externalStream,
  cameraResolutionMode,
  cameraResolutionType,
  videoConstraints,
  audioConstraints,
  frontCamera,
  mainCamera,
  mirrored = true,
  muted = true,
  style = {},
  children,
  onStreamError,
  onStreamStop,
  onStreamStart,
  onStreamRequest,
  onVideoPlay,
  onVideoLoad,
  ...props
}) => {
  const internalVideoRef = useRef<HTMLVideoElement | null>(null);
  const internalStreamRef = useRef<MediaStream | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>();

  const videoRef = externalVideoRef ?? internalVideoRef;

  const webcamStreamConstraints: MediaStreamConstraints = {
    video: videoConstraints,
    audio: audioConstraints
  };

  const mediaTrackConstraintsParams: MediaTrackConstraintsParams = {
    cameraResolutionMode,
    cameraResolutionType,
    frontCamera,
    mainCamera,
    muted
  };

  const setWebcamStream = (stream: MediaStream) => {
    if (!videoRef.current) return;

    if ('srcObject' in videoRef.current) {
      videoRef.current.srcObject = stream;
      return;
    }

    // @ts-ignore
    setVideoSrc(window.URL.createObjectURL(stream));
  };

  const requestUserMedia = async () => {
    if (externalStream) {
      setWebcamStream(externalStream);
      return;
    }

    try {
      onStreamRequest?.();
      const webcamStream = await getWebcamStream({
        constraints: webcamStreamConstraints,
        params: mediaTrackConstraintsParams
      });

      onStreamStart?.(webcamStream);
      setWebcamStream(webcamStream);
      internalStreamRef.current = webcamStream;
    } catch (error) {
      onStreamError?.(error as string);
    }
  };

  useEffect(() => {
    requestUserMedia();

    return () => {
      if (videoSrc) {
        window.URL.revokeObjectURL(videoSrc);
      }

      if (internalStreamRef.current) {
        onStreamStop?.(internalStreamRef.current);
        stopWebcamStream(internalStreamRef.current);
      }
    };
  }, [webcamStreamConstraints, mediaTrackConstraintsParams]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    let animationFrameRequestId: number | undefined;

    const cancelFrameRequest = () => {
      if (animationFrameRequestId) {
        cancelAnimationFrame(animationFrameRequestId);
      }
    };

    const handleMetaData = () => {
      onVideoLoad?.(videoElement);
      videoElement.play();

      if (!onVideoPlay) return;

      const onFrameRequest = (timestamp?: DOMHighResTimeStamp) => {
        const stopRequest = onVideoPlay(videoElement, timestamp);

        if (stopRequest) {
          cancelFrameRequest();
          return;
        }

        animationFrameRequestId = requestAnimationFrame(onFrameRequest);
      };

      onFrameRequest();
    };

    videoElement.addEventListener('loadedmetadata', handleMetaData);

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleMetaData);
      cancelFrameRequest();
    };
  }, [onVideoLoad, onVideoPlay]);

  return (
    <>
      <video
        autoPlay
        playsInline
        disableRemotePlayback
        disablePictureInPicture
        controls={false}
        muted={muted}
        ref={videoRef}
        src={videoSrc}
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
              getVideoFrameCanvas(videoRef.current, options),
            getScreenshot: (options?: GetWebcamScreenshotOptions) =>
              getWebcamScreenshot(videoRef.current, options)
          })
        : children}
    </>
  );
};
