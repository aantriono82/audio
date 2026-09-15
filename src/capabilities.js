export function playbackCapabilities({ desktop = false, platform = '' } = {}) {
  const nativeDirectPlayback = Boolean(desktop && /linux/i.test(platform));
  return {
    nativeDirectPlayback,
    // Linux opts into Web Audio only after an explicit DSP/EQ action. It is
    // available, but deliberately not part of the initial playback path.
    webAudioDsp: true,
    webAudioDspOptIn: nativeDirectPlayback,
    outputRouting: !nativeDirectPlayback,
    browserDemo: !desktop,
  };
}
