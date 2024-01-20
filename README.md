# 📸 React Webcam Ultimate

Ultimate tool for working with media stream and displaying it in your React application

## Installation

Install with [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

```shell
npm i react-webcam-ultimate
# or
yarn add react-webcam-ultimate
```

## Usage

```jsx
import React from 'react';
import { Webcam } from 'react-webcam-ultimate';

const WebcamComponent = () => <Webcam />;
```

## API

You can pass any supported [properties](https://developer.mozilla.org/ru/docs/Web/HTML/Element/video) to the underlying video tag (eg `autoplay`, `className`, etc). However, for convenience, the component uses its own values for these properties, but you can reassign them without any problems:
| **Prop**                  | **Type** | **Default**  |
| ------------------------- | -------- | ------------ |
| muted                     | boolean  | true         |
| autoPlay                  | boolean  | true         |
| playsInline               | boolean  | true         |
| controls                  | boolean  | false        |

The component also supports many properties for more specific work:
| **Prop**                  | **Type** | **Default**  | **Note**                                                                                |
| ------------------------- | -------- | ------------ | --------------------------------------------------------------------------------------- |
| mirrored                  | boolean  | false        | show camera preview and get the screenshot mirrored                                     |
| disableStream             | boolean  |              | enable/disable internal media stream handling logic                                     |
| mainCamera                | boolean  | false        | should use the main camera                                                              |
| frontCamera               | boolean  | false        | should use the front camera                                                             |
| cameraResolutionType      | string   |              | video track resolution size - 'UHD' | 'QHD' | 'FHD' | 'HD'                              |
| cameraResolutionMode      | string   | 'ideal'      | video track resolution mode - 'min' | 'max' | 'ideal' | 'exact'                         |
| audioConstraints          | object   |              | audio track constraints - MediaStreamConstraints['audio']                               |
| videoConstraints          | object   |              | video track constraints - MediaStreamConstraints['video']                               |
| requestTimeLimit          | number   |              | limiting the request for a media stream by time                                         |
| onStreamRequest           | function | noop         | callback for when component requests a media stream                                     |
| onStreamStart             | function | noop         | callback for when component starts a media stream                                       |
| onStreamStop              | function | noop         | callback for when component starts a media stream                                       |
| onStreamError             | function | noop         | callback for when component can't receive a media stream                                |




