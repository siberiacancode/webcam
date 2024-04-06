# 📸 Webcam Core

Ultimate tool for working with media stream

## References

- [**Demo**](https://react-webcam-ultimate.vercel.app/en/javascript)
- [**Web API**](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [**Browser Сompatibility**](https://caniuse.com/stream)

## Installation

Install with [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

```shell
npm i @webcam/core
# or
yarn add @webcam/core
```

## 🦉 Philosophy

📸 **Webcam Core** is a package that includes ready-made solutions for common cases of setting up and using a media stream from your webcam using Web API. Our goal is to create simple and flexible tools that allow users to create, test and maintain their products.

## Features

- TypeScript support out of the box - full typed package
- Webcam Snapshots - creating an image from a video stream
- Media Stream Handling - request, errors, update, stop, etc
- Advanced Video Settings - selecting camera type and resolution
- Legacy API Support - outdated implementations for each browser

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

Adds extra error handling and support for legacy [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) implementation.

**NOTE:** The function can only be used in a [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts). For example, when a page is loaded using `HTTPS` or a page loaded from `localhost`. Otherwise the function will throw an error.

### getMediaStream

Accepts custom parameters and uses getUserMedia to get an instance of the [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream).

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
- `cameraResolutionType?` {CameraResolutionType} - Video track resolution size (width x height)
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

Returns main camera [info](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo) in accordance with the default or passed parameters.

**NOTE:** Requires [browser support](https://caniuse.com/mdn-api_mediadevices_enumeratedevices) for Navigator.MediaDevices.[enumerateDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices) to work.

- `params?` {GetMainCameraParams} - Pattern for searching the main camera device info by its label
  - {RegExp} - General default pattern
  - {Object} - Patterns for front and main cameras
    - `back?` {RegExp} - Value `(?=.*\bback\b)(?=.*\b0\b)` is using as default
    - `front?` {RegExp} - Value `\bfront\b` is using as default
- `isFrontCamera?` {boolean} - Should the front camera be searched (back camera as default)

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

### getWebcamSnapshot

Returns a base64 encoded string of the current video stream frame in the specified format and quality.

- `source` {HTMLVideoElement} - Video element instance with provided media stream
- `options?` {GetWebcamSnapshotOptions} - Options for getting webcam snapshot
  - `format?` - {image/webp | image/png | image/jpeg} - A string indicating the image format (default === image/jpeg)
  - `quality?` - {number} - A number between 0 and 1 indicating the image quality (only for image/jpeg or image/webp)
  - ... {GetVideoFrameCanvasOptions} - Options passed to `getVideoFrameCanvas` function

### getVideoFrameCanvas

Returns a canvas with a drawn image of the current video stream frame in accordance with the passed options.

- `source` {HTMLVideoElement} - Video element instance with provided media stream
- `options?` {GetVideoFrameCanvasOptions} - Options for getting video frame canvas
  - `width?` {number} - Width of the canvas on which the image will be drawn
  - `height?` {number} - Height of the canvas on which the image will be drawn
  - `mirrored?` {boolean} - Should the drawing image be mirrored horizontally
  - `imageSmoothingEnabled?` {boolean} - Should smooth scaled image or not (default === true)

## ✨ Contributors

<table>
  <tr>
    <td align="center" style="word-wrap: break-word; width: 100; height: 100">
        <a href="https://github.com/michael-mir">
            <img src="https://avatars.githubusercontent.com/u/88126915?v=4"
            width="100;"  
            alt="michael-mir" />
            <br />
            <sub style="font-size:13px"><b>🌶️ michael-mir</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 100; height: 100">
        <a href="https://github.com/debabin">
            <img src="https://avatars.githubusercontent.com/u/45297354?v=4"
            width="100;"  
            alt="debabin" />
            <br />
            <sub style="font-size:13px"><b>🧊 debabin</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 100.0; height: 100.0">
        <a href="https://github.com/RiceWithMeat">
            <img src="https://avatars.githubusercontent.com/u/47690223?v=4"
            width="100;"  
            alt="RiceWithMeat" />
            <br />
            <sub style="font-size:13px"><b>🐘 RiceWithMeat</b></sub>
        </a>
    </td>
  </tr>
</table>
