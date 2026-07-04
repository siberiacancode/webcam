import type { Meta, StoryObj } from '@storybook/react';

import { useBoolean, useDeviceList } from '@siberiacancode/reactuse';
import React, { useRef, useState } from 'react';

import { Webcam } from '@/components/Webcam/Webcam';

const RESOLUTION_PRESETS = {
  qvga: { label: 'QVGA', width: 320, height: 240 },
  vga: { label: 'VGA', width: 640, height: 480 },
  hd: { label: 'HD', width: 1280, height: 720 },
  fullHd: { label: 'Full HD', width: 1920, height: 1080 },
  televisionFourK: { label: 'Television 4K', width: 3840, height: 2160 },
  cinemaFourK: { label: 'Cinema 4K', width: 4096, height: 2160 },
  eightK: { label: '8K', width: 7680, height: 4320 }
} as const;

type ResolutionPresetKey = keyof typeof RESOLUTION_PRESETS;

const applySinkId = (element: HTMLVideoElement | null, deviceId: string) => {
  const mediaElement = element as
    | (HTMLVideoElement & {
        setSinkId?: (deviceId: string) => Promise<void>;
      })
    | null;
  if (!deviceId || !mediaElement?.setSinkId) return;
  mediaElement.setSinkId(deviceId).catch(() => undefined);
};

const WebcamLandingPlayground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [mirrored, setMirrored] = useBoolean();
  const [muted, setMuted] = useBoolean();
  const [lockAspectRatio, setLockAspectRatio] = useBoolean(false);
  const [resolutionPreset, setResolutionPreset] = useState<ResolutionPresetKey>('qvga');
  const [width, setWidth] = useState<number>(RESOLUTION_PRESETS.qvga.width);

  const [audioInputDeviceId, setAudioInputDeviceId] = useState('');
  const [audioOutputDeviceId, setAudioOutputDeviceId] = useState('');
  const [videoDeviceId, setVideoDeviceId] = useState('');

  const [snapshot, setSnapshot] = useState<string>();
  const [status, setStatus] = useState('Press allow in the browser prompt to start the preview.');
  const [videoAspectRatio, setVideoAspectRatio] = useState<number>();

  const [externalStream, setExternalStream] = useState<MediaStream>();

  const deviceList = useDeviceList({
    immediately: true,
    onUpdate: (devices) => {
      setAudioInputDeviceId(
        (current) =>
          current || devices.find((device) => device.kind === 'audioinput')?.deviceId || ''
      );
      setAudioOutputDeviceId(
        (current) =>
          current || devices.find((device) => device.kind === 'audiooutput')?.deviceId || ''
      );
      setVideoDeviceId(
        (current) =>
          current || devices.find((device) => device.kind === 'videoinput')?.deviceId || ''
      );
    }
  });

  const onResolutionChange = (preset: ResolutionPresetKey) => {
    setResolutionPreset(preset);
    setWidth(RESOLUTION_PRESETS[preset].width);
  };

  const onAudioOutputChange = (deviceId: string) => {
    setAudioOutputDeviceId(deviceId);
    applySinkId(videoRef.current, deviceId);
  };

  const videoConstraints: MediaTrackConstraints = {
    width: { exact: width },
    ...(lockAspectRatio && videoAspectRatio && { aspectRatio: { exact: videoAspectRatio } }),
    ...(videoDeviceId && { deviceId: { exact: videoDeviceId } })
  };

  const audioConstraints: boolean | MediaTrackConstraints = muted
    ? false
    : {
        ...(audioInputDeviceId ? { deviceId: { exact: audioInputDeviceId } } : {})
      };

  const onToggleExternalStream = async () => {
    // Stop mode — tear down the external stream and fall back to the internal request
    if (externalStream) {
      externalStream.getTracks().forEach((track) => track.stop());
      setExternalStream(undefined);
      setStatus('External stream stopped — back to internal mode.');
      return;
    }

    // Create mode — build a stream with the current UI constraints
    try {
      setStatus('Creating external stream...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: audioConstraints
      });
      setExternalStream(stream);
      setStatus('External stream created.');
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  return (
    <div>
      <div>
        <label>
          Audio input
          <select
            value={audioInputDeviceId}
            onChange={(event) => setAudioInputDeviceId(event.target.value)}
          >
            <option value=''>Default</option>
            {deviceList.audioInputs.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `audioinput ${device.deviceId.slice(0, 6)}`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          Audio output
          <select
            value={audioOutputDeviceId}
            onChange={(event) => onAudioOutputChange(event.target.value)}
          >
            <option value=''>Default</option>
            {deviceList.audioOutputs.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `audiooutput ${device.deviceId.slice(0, 6)}`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          Video source
          <select value={videoDeviceId} onChange={(event) => setVideoDeviceId(event.target.value)}>
            <option value=''>Default</option>
            {deviceList.videoInputs.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `videoinput ${device.deviceId.slice(0, 6)}`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          <input
            checked={!muted}
            type='checkbox'
            onChange={(event) => setMuted(!event.target.checked)}
          />
          Enable audio
        </label>
      </div>

      <div>
        <label>
          <input
            checked={mirrored}
            type='checkbox'
            onChange={(event) => setMirrored(event.target.checked)}
          />
          Mirrored preview
        </label>
      </div>

      <div>
        <label>
          Resolution preset
          <select
            value={resolutionPreset}
            onChange={(event) => onResolutionChange(event.target.value as ResolutionPresetKey)}
          >
            {Object.entries(RESOLUTION_PRESETS).map(([key, preset]) => (
              <option key={key} value={key}>
                {preset.label} ({preset.width}x{preset.height})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          Width: {width}px
          <input
            max={7680}
            min={0}
            type='range'
            value={width}
            onChange={(event) => setWidth(Number(event.target.value) || 0)}
          />
        </label>
      </div>

      <div>
        <label>
          <input
            checked={lockAspectRatio}
            type='checkbox'
            onChange={(event) => setLockAspectRatio(event.target.checked)}
          />
          Lock aspect ratio
        </label>
      </div>

      <div>
        <button type='button' onClick={onToggleExternalStream}>
          {externalStream ? 'Stop external stream' : 'Create external stream'}
        </button>
      </div>

      <p>{status}</p>

      <Webcam
        ref={videoRef}
        audioConstraints={audioConstraints}
        mirrored={mirrored}
        muted={muted}
        stream={externalStream}
        videoConstraints={videoConstraints}
        onError={(error) => setStatus(error.message)}
        onStart={(stream) => {
          const [track] = stream.getVideoTracks();
          const settings = track?.getSettings();
          const nextAspectRatio =
            settings?.aspectRatio ||
            (settings?.width && settings?.height ? settings.width / settings.height : undefined);

          if (nextAspectRatio) setVideoAspectRatio(nextAspectRatio);
          applySinkId(videoRef.current, audioOutputDeviceId);
          setStatus(
            `Live${settings?.width && settings?.height ? ` — ${settings.width}x${settings.height}` : ''}`
          );
        }}
        onStop={() => setStatus('Stopped')}
      >
        {({ getSnapshot }) => (
          <div>
            <button type='button' onClick={() => setSnapshot(getSnapshot({ quality: 0.92 }))}>
              Capture snapshot
            </button>{' '}
            <button type='button' onClick={() => setSnapshot(undefined)}>
              Clear snapshot
            </button>
          </div>
        )}
      </Webcam>

      {snapshot && (
        <div>
          <img alt='Captured webcam snapshot' src={snapshot} />
        </div>
      )}
    </div>
  );
};

const meta = {
  component: Webcam,
  title: 'Webcam/Playground',
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Webcam>;

type Story = StoryObj<typeof meta>;

export const Playground = {
  render: () => <WebcamLandingPlayground />
} satisfies Story;

export default meta;
