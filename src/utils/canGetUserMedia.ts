import { getUserMediaFunction } from './getUserMedia';

// ✅ important:
// In mobile browser work only for https://
export const canGetUserMedia = () => {
  if (navigator.mediaDevices) {
    return !!navigator.mediaDevices.getUserMedia;
  }

  return !!getUserMediaFunction;
};
