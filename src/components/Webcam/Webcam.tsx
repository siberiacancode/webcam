import type { ComponentPropsWithoutRef, FC, RefObject } from 'react';
import React, { useEffect, useRef } from 'react';

import type { WebcamStreamParams } from '../../utils';
import { getWebcamStream, stopWebcamStream } from '../../utils';

type VideoElementProps = Omit<ComponentPropsWithoutRef<'video'>, 'onPlay' | 'onError'>;

export interface WebcamProps extends VideoElementProps, WebcamStreamParams {
  mirrored?: boolean;
  stream?: MediaStream;
  innerRef?: RefObject<HTMLVideoElement>;
  audioConstraints?: MediaTrackConstraints;
  videoConstraints?: MediaTrackConstraints;
  onError?: (error: string) => void;
  onPlay?: (video: HTMLVideoElement) => void;
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
  onError,
  onPlay,
  debug,
  ...props
}) => {
  const internalVideoRef = useRef<HTMLVideoElement | null>(null);
  const internalStreamRef = useRef<MediaStream | null>(null);

  const videoRef = externalVideoRef ?? internalVideoRef;

  const webcamSteamConstraints: MediaStreamConstraints = {
    video: videoConstraints,
    audio: audioConstraints
  };

  const webcamSteamParams: WebcamStreamParams = {
    cameraResolutionMode,
    cameraResolutionType,
    frontCamera,
    mainCamera,
    debug,
    muted
  };

  const requestUserMedia = async () => {
    if (!videoRef.current) return;

    if (externalStream) {
      videoRef.current.srcObject = externalStream;
      return;
    }

    try {
      const webcamStream = await getWebcamStream({
        constraints: webcamSteamConstraints,
        params: webcamSteamParams
      });

      internalStreamRef.current = webcamStream;
      videoRef.current.srcObject = webcamStream;
    } catch (error) {
      onError?.(error as string);
    }
  };

  useEffect(() => {
    requestUserMedia();

    return () => {
      stopWebcamStream(internalStreamRef.current);
    };
  }, [webcamSteamConstraints, webcamSteamParams, onError]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMetaData = () => {
      video.play();
      onPlay?.(video);
      if (!debug) return;
      console.info(
        '[Webcam/stream]:',
        'playing with resolution',
        `${video.videoWidth}x${video.videoHeight}`
      );
    };

    video.addEventListener('loadedmetadata', handleMetaData);

    return () => {
      video.removeEventListener('loadedmetadata', handleMetaData);
    };
  }, [onPlay]);

  return (
    <>
      <video
        autoPlay
        playsInline
        muted={muted}
        ref={videoRef}
        controls={false}
        style={{
          ...style,
          ...(mirrored && {
            transform: `${style.transform ? `${style.transform} ` : ''}scaleX(-1)`
          })
        }}
        {...props}
      />
      {children}
    </>
  );
};
