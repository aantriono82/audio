export function playbackCapabilities({ desktop = false, platform = '' } = {}) {
  const nativeDirectPlayback = Boolean(desktop && /linux/i.test(platform));
  return {
    nativeDirectPlayback,
    webAudioDsp: !nativeDirectPlayback,
    outputRouting: !nativeDirectPlayback,
    browserDemo: !desktop,
  };
}
