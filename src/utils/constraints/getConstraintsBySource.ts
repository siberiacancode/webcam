const getOptionalSourceConstraints = (id: string | null) =>
  ({ optional: [{ sourceId: id }] }) as MediaTrackConstraints;

const getSourceIdByConstraints = (constraints?: MediaTrackConstraints | boolean) => {
  if (typeof constraints !== 'object') return null;

  const { deviceId } = constraints;

  if (typeof deviceId === 'string') return deviceId;

  if (Array.isArray(deviceId)) {
    return deviceId[0] ?? null;
  }

  if (typeof deviceId === 'object' && deviceId.ideal) {
    return Array.isArray(deviceId.ideal) ? deviceId.ideal[0] : deviceId.ideal;
  }

  return null;
};

// ✅ important
// Deprecated web-api
export const getConstraintsBySource = (constraints: MediaStreamConstraints) =>
  new Promise<MediaStreamConstraints>((resolve) => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    MediaStreamTrack.getSources((sources: MediaStreamTrack[]) => {
      let audioSource: string | null = null;
      let videoSource: string | null = null;

      sources.forEach((source: MediaStreamTrack) => {
        if (source.kind === 'video') {
          videoSource = source.id;
          return;
        }

        if (source.kind === 'audio') {
          audioSource = source.id;
        }
      });

      const videoSourceId = getSourceIdByConstraints(constraints.video);
      const audioSourceId = getSourceIdByConstraints(constraints.audio);

      resolve({
        audio: getOptionalSourceConstraints(audioSourceId ?? audioSource),
        video: getOptionalSourceConstraints(videoSourceId ?? videoSource)
      });
    });
  });
