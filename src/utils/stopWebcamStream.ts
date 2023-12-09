export const stopWebcamStream = (stream: MediaStreamTrack | MediaStream) => {
  if (stream instanceof MediaStreamTrack) {
    stream.stop();
    return;
  }

  if (stream.getVideoTracks && stream.getAudioTracks) {
    stream.getVideoTracks().forEach((track) => {
      stream.removeTrack(track);
      track.stop();
    });
    stream.getAudioTracks().forEach((track) => {
      stream.removeTrack(track);
      track.stop();
    });

    return;
  }

  if (stream.getTracks) {
    stream.getTracks().forEach((track) => {
      stream.removeTrack(track);
      track.stop();
    });
  }
};
