<div align="center">
  <h1>Webcam React</h1>

<a href="https://www.npmjs.com/package/@webcam/react"><img alt="NPM version" src="https://img.shields.io/npm/v/@webcam/react.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://github.com/siberiacancode/webcam/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/@webcam/react.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://siberiacancode.github.io/reactuse/"><img alt="reactuse" src="https://img.shields.io/badge/reactuse-blueviolet.svg?style=for-the-badge&logo=npm&labelColor=000000&logoWidth=20"></a>
<a href="https://github.com/siberiacancode/webcam/discussions"><img alt="Join the community on GitHub" src="https://img.shields.io/badge/Join%20the%20community-blueviolet.svg?style=for-the-badge&logo=React&labelColor=000000&logoWidth=20"></a>

</div>

Webcam React is a powerful library that provides easy integration of webcam and media stream features into your React applications. Built with **TypeScript-first** approach, **SSR compatibility**, and **tree-shaking optimization** - everything you need to request, display, and manage camera streams in a modern React app.

## Supported Features

- **Live webcam preview** - render media streams with a simple React component
- **Snapshots** - capture the current frame as base64 image data
- **Constraint controls** - configure camera source, resolution, facing mode, and more
- **Stream lifecycle hooks** - react to request, start, stop, and error events
- **External stream support** - attach an existing `MediaStream` when needed

## Documentation

Visit https://react-webcam-ultimate.vercel.app/en/react to view the full documentation.

## Getting Started

```bash
npm install @webcam/react
```

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Webcam } from '@webcam/react';

const App = () => (
  <Webcam
    mirrored
    cameraResolutionType='FHD'
    onStreamError={(error) => console.error(error)}
  />
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Create a component to use webcam snapshots:

```tsx
import { Webcam } from '@webcam/react';

export const Camera = () => {
  return (
    <Webcam mirrored>
      {({ getSnapshot }) => (
        <button type="button" onClick={() => getSnapshot({ quality: 0.8 })}>
          Make photo
        </button>
      )}
    </Webcam>
  );
};
```

## Reactuse

Reactuse delivers **production-ready hooks** that solve real-world problems. Built with **TypeScript-first** approach, **SSR compatibility**, and **tree-shaking optimization** - everything you need to build modern React applications. Improve your react applications with our library 📦 designed for comfort and speed.

## Documentation

Visit https://reactuse.org to view the full documentation.

## Getting Started

```bash
npm install @siberiacancode/reactuse
```
