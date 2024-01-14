export const applyMediaStreamConstraints = (
  stream: MediaStream,
  { video, audio }: MediaStreamConstraints
) => {
  if (stream.getVideoTracks) {
    const [videoTrack] = stream.getVideoTracks();
    if (videoTrack) {
      videoTrack.applyConstraints(typeof video === 'object' ? video : {});
    }
  }

  if (stream.getAudioTracks) {
    const [audioTrack] = stream.getAudioTracks();
    if (audioTrack) {
      audioTrack.applyConstraints(typeof audio === 'object' ? audio : {});
    }
  }
};
