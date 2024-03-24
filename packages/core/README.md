# 📸 Webcam Core

Ultimate tool for working with media stream

## References

- [**DEMO**](https://react-webcam-ultimate.vercel.app/en/javascript)
- [**Web API**](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [**Browser Сompatibility**](https://caniuse.com/stream)

## Installation

Install with [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

```shell
npm i @webcam/core
# or
yarn add @webcam/core
```

## Usage

```javascript
import {
  applyMediaStreamConstraints,
  getMediaStream,
  getMediaStreamConstraints,
  stopMediaStream
} from '@webcam/core';

let runningStream: MediaStream | undefined;

const requestStream = async (params: GetMediaStreamConstraintsParams) => {
  try {
    runningStream = await getMediaStream(params, 5000);
  } catch (error) {
    console.error(error);
  }
};

const updateConstraints = async (params: GetMediaStreamConstraintsParams) => {
  try {
    const constraints = await getMediaStreamConstraints(params);

    applyMediaStreamConstraints(runningStream, constraints)
  } catch {
    requestMediaStream(params);
  }
};

const stopStream = () => stopMediaStream(runningStream);

requestStream({ mainCamera: true }, { width: 1920, height: 1080 });
```

## API

### getUserMedia
Adds extra error handling and support for legacy `getUserMedia`(https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) implementation.

**NOTE:** The function can only be used in a [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts). For example, when a page is loaded using `HTTPS` or a page loaded from `localhost`. Otherwise the function will throw an error.

### getMediaStream
Accepts custom parameters and uses getUserMedia to get an instance of the `MediaStream`(https://developer.mozilla.org/en-US/docs/Web/API/MediaStream).

- `params?`: {GetMediaStreamConstraintsParams} - Parameters passed to `getMediaStreamConstraints` function
- `timeLimitMs?`: {number} - Time limit for MediaStream request execution

### getMediaStreamConstraints
Generates and returns media stream constraints by passed options.

- `constraints?`: {MediaStreamConstraints} - External primary constraints (override output)
- `options?`: {MediaTrackConstraintsOptions} - Options for constraints generating
  - `muted?`: {boolean} - Excludes audio constraints from the MediaStream request
  - ... {VideoTrackConstraintsOptions} - Options passed to `getVideoTrackConstraints` function

### getVideoTrackConstraints
Generates and returns video track constraints by passed options.

- `frontCamera?` {boolean} - Should use a front camera (MediaTrackConstraints['facingFront'] === 'user')
- `mainCamera?` {boolean | GetMainCameraParams} - Should find and use the main camera by default/passed label patterns
- `cameraResolutionType?` {CameraResolutionType} - Video track resolution size (`{ width: number, height: number }`)
  - `HD` - 1280 x 720
  - `FHD` - 1920 x 1080
  - `QHD` - 2560 x 1440
  - `UHD` - 3840 x 2160
- `cameraResolutionMode?` {keyof ConstrainULongRange} - Video track resolution mode
  - `min` - Value is the smallest permissible. If the value cannot remain equal to or greater than this value, matching will fail.
  - `max` - Value is the largest permissible. If the value cannot remain equal to or less than this value, matching will fail.
  - `exact` - Value is specific and required. If the value cannot be considered acceptable, the match will fail.
  - `ideal` - If possible, a value will be used, but if it's not possible, the user agent will use the closest possible match.

### getMainCamera
Returns main camera `info`(https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo) in accordance with the default or passed parameters.

**NOTE:** Requires [browser support](https://caniuse.com/mdn-api_mediadevices_enumeratedevices) for [Navigator.MediaDevices.enumerateDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices) to work.

- `params?` {GetMainCameraParams} - Pattern for searching the main camera device info by its label
  - {RegExp} - General default pattern
  - {Object} - Patterns for front and main cameras
    - `back?` {RegExp} - `(?=.*\bback\b)(?=.*\b0\b)` as default
    - `front?` {RegExp} - `\bfront\b` as default
- `isFrontCamera?` {boolean} - Should the front camera be searched (back by default)

### applyMediaStreamConstraints
Applies a set of audio and video constraints to the corresponding media stream tracks.

**NOTE:** New constraints apply only within the previously used source.

- `stream` {MediaStream} - Media stream instance
- `constraints` {MediaStreamConstraints} - Constraints to be applied

### stopMediaStream
Stops and removes audio and video tracks from the stream.

- `stream?` {MediaStream | MediaStreamTrack} - Media stream or its track instance

### hasGetUserMedia
Checks for the presence of getUserMedia in mediaDevices.

### canGetUserMedia
Checks the possibility of using any implementation of getUserMedia.
