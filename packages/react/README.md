# 📸 Webcam React

Ultimate tool for working with media stream in your React application

## References

- [**DEMO**](https://react-webcam-ultimate.vercel.app/en/react)
- [**Web API**](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [**Browser Сompatibility**](https://caniuse.com/stream)

## Installation

Install with [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

```shell
npm i @webcam/react
# or
yarn add @webcam/react
```

## Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Webcam } from '@webcam/react';

const App = () => (
  <Webcam />
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
```

### Get webcam snapshot

Returns a base64 encoded string of the current video stream frame in the specified format and quality:

```jsx
import { Webcam } from '@webcam/react';

const YourComponent = () => (
  <Webcam mirrored>
    {({ getSnapshot }) => (
      <button onClick={() => getSnapshot({ quality: 0.8 })}>
        Make photo
      </button>
    )}
  </Webcam>
);
```

## API

You can pass any supported [properties](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) to the underlying video tag (eg `autoPlay`, `className`, etc). However, for convenience, the component uses its own values for these properties, but you can reassign them without any problems:
| **Prop**                  | **Type** | **Default**  | **Note**                                                                                |
| ------------------------- | -------- | ------------ | --------------------------------------------------------------------------------------- |
| muted                     | boolean  | true         | also excludes audio constraints from the MediaStream request                            |
| autoPlay                  | boolean  | true         |                                                                                         |
| playsInline               | boolean  | true         |                                                                                         |
| controls                  | boolean  | false        |                                                                                         |

The component also supports many properties for more specific work:
| **Prop**                  | **Type** | **Default**  | **Note**                                                                                |
| ------------------------- | -------- | ------------ | --------------------------------------------------------------------------------------- |
| mirrored                  | boolean  | false        | show camera preview and get the screenshot mirrored                                     |
| mainCamera       | boolean \| object | false        | should use a main camera (requires Navigator.mediaDevices.enumerateDevices)             |
| frontCamera               | boolean  | false        | should use a front camera (MediaTrackConstraints['facingFront'] === 'user')             |
| applyConstraints          | boolean  | false        | should new constraints be applied to the media stream                                   |
| cameraResolutionType      | string   |              | video track resolution size - `('UHD' \| 'QHD' \| 'FHD' \| 'HD')`                       |
| cameraResolutionMode      | string   | 'ideal'      | video track resolution mode - `('min' \| 'max' \| 'ideal' \| 'exact')`                  |
| requestTimeLimit          | number   |              | limiting the media stream request by time                                               |
| onStreamRequest           | function |              | callback for when component requests a media stream                                     |
| onStreamStart             | function |              | callback for when component starts a media stream                                       |
| onStreamStop              | function |              | callback for when component stops a media stream                                        |
| onStreamError             | function |              | callback for when component can't receive a media stream                                |
| audioConstraints          | object   |              |
MediaStreamConstraints['audio'](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints)                                         |
| videoConstraints          | object   |              |
MediaStreamConstraints['video'](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints)                                         |
| stream                    | object   |              |
external MediaStream(https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) (turns off internal media stream handling logic)             |




