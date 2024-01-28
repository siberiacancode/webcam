import { getUserMediaFunction } from './getUserMedia';

// ✅ important
// In mobile browser work only for https://
export const canGetUserMedia = () => {
  if (typeof navigator === 'undefined') return false;

  if ('mediaDevices' in navigator) {
    return !!navigator.mediaDevices.getUserMedia;
  }

  return !!getUserMediaFunction;
};
