import type { ComponentPropsWithoutRef, FC, ReactNode, RefObject, SyntheticEvent } from 'react';
import React, { useRef } from 'react';

import type { UseMediaStreamParams } from '../../hooks';
import { useVideoSourceFromStream } from '../../hooks/useVideoSourceFromStream';
import type { GetVideoFrameCanvasOptions, GetVideoFrameDataUrlOptions } from '../../utils';
import { getVideoFrameCanvas, getVideoFrameDataUrl } from '../../utils';
import { noop } from '../../utils/noop';

type VideoElementProps = Omit<ComponentPropsWithoutRef<'video'>, 'children'>;

export type WebcamRenderProps = (options: {
  getCanvas: (options?: GetVideoFrameCanvasOptions) => HTMLCanvasElement | undefined;
  getScreenshot: (options?: GetVideoFrameDataUrlOptions) => string | undefined;
  videoElement: HTMLVideoElement | null;
}) => ReactNode;

interface WebcamProps extends VideoElementProps, UseMediaStreamParams {
  children?: ReactNode | WebcamRenderProps;
  innerRef?: RefObject<HTMLVideoElement>;
  mirrored?: boolean;
}

/**
 * Renders the Webcam component and handles the requesting and displaying of the media stream.
 *
 * @param {WebcamProps} props - The props for the Webcam component.
 * @return {ReactElement} The rendered Webcam component.
 */
export const Webcam: FC<WebcamProps> = ({
  innerRef: externalVideoRef,
  cameraResolutionMode,
  cameraResolutionType,
  videoConstraints,
  audioConstraints,
  requestTimeLimit,
  disableStream,
  frontCamera,
  mainCamera,
  mirrored = true,
  muted = true,
  style = {},
  children,
  onLoadedMetadata = noop,
  onStreamRequest,
  onStreamError,
  onStreamStart,
  onStreamStop,
  ...props
}) => {
  const internalVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = externalVideoRef || internalVideoRef;

  const onStreamLoad = (event: SyntheticEvent<HTMLVideoElement, Event>) => {
    onLoadedMetadata(event);
    event.currentTarget.play();
  };

  const streamSrc = useVideoSourceFromStream(videoRef, {
    disableStream,
    requestTimeLimit,
    // STREAM HANDLERS:
    onStreamRequest,
    onStreamError,
    onStreamStart,
    onStreamStop,
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
        muted={muted}
        ref={videoRef}
        src={streamSrc}
        controls={false}
        onLoadedMetadata={onStreamLoad}
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
              videoRef.current
                ? getVideoFrameCanvas(videoRef.current, { ...options, mirrored })
                : undefined,
            getScreenshot: (options?: GetVideoFrameDataUrlOptions) =>
              videoRef.current
                ? getVideoFrameDataUrl(videoRef.current, { ...options, mirrored })
                : undefined
          })
        : children}
    </>
  );
};
