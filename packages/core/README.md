<div align="center">
  <h1>Webcam Core</h1>

<a href="https://www.npmjs.com/package/@webcam/core"><img alt="NPM version" src="https://img.shields.io/npm/v/@webcam/core.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://github.com/siberiacancode/webcam/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/@webcam/core.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://github.com/siberiacancode/webcam/discussions"><img alt="Join the community on GitHub" src="https://img.shields.io/badge/Join%20the%20community-blueviolet.svg?style=for-the-badge&logo=React&labelColor=000000&logoWidth=20"></a>

</div>

Webcam Core is a powerful library that provides easy integration of webcam and media stream utilities into your applications. Built with **TypeScript-first** approach, **SSR compatibility**, and **tree-shaking optimization** - everything you need to request, configure, and process media streams with the Web API.

## Supported Features

- **Media stream requests** - request camera and microphone access with helpful utilities
- **Constraint generators** - build video and audio constraints from high-level options
- **Main camera detection** - find the preferred front or back camera on supported devices
- **Snapshots and canvas frames** - capture frames from a video element
- **Legacy support** - includes fallbacks for older browser implementations

## Documentation

Visit https://react-webcam-ultimate.vercel.app/en/javascript to view the full documentation.

## Getting Started

```bash
npm install @webcam/core
```

```ts
import {
  applyMediaStreamConstraints,
  getMediaStream,
  getMediaStreamConstraints,
  stopMediaStream
} from '@webcam/core';

let runningStream: MediaStream | undefined;

const requestStream = async () => {
  runningStream = await getMediaStream({
    options: {
      mainCamera: true,
      cameraResolutionType: 'FHD'
    }
  });
};

const updateConstraints = async () => {
  const constraints = await getMediaStreamConstraints({
    options: {
      frontCamera: true,
      cameraResolutionType: 'HD'
    }
  });

  if (runningStream) {
    await applyMediaStreamConstraints(runningStream, constraints);
  }
};

const stopStream = () => stopMediaStream(runningStream);

requestStream();
```

Create a snapshot from a video element:

```ts
import { getWebcamSnapshot } from '@webcam/core';

const snapshot = getWebcamSnapshot(videoElement, {
  quality: 0.8,
  mirrored: true
});
```
