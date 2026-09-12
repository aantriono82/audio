import { readEmbeddedMetadata } from './import.js';

self.onmessage = async event => {
  const { id, file } = event.data || {};
  if (!id || !(file instanceof Blob)) return;
  try {
    const metadata = await readEmbeddedMetadata(file);
    self.postMessage({ id, metadata });
  } catch (error) {
    self.postMessage({ id, error: error instanceof Error ? error.message : 'Metadata tidak dapat dibaca.' });
  }
};
