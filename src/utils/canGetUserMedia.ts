import { getUserMediaFunction } from './getUserMedia';

// ✅ important:
// In mobile browser work only for https://
export const canGetUserMedia = () => {
  if ('mediaDevices' in navigator) {
    return !!navigator.mediaDevices.getUserMedia;
  }

  return !!getUserMediaFunction;
};
