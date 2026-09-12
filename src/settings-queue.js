// Serialize writes so an older snapshot can never replace newer settings.
export function createSettingsQueue(write) {
  let pending = Promise.resolve();
  return {
    save(value) {
      const snapshot = JSON.parse(JSON.stringify(value));
      pending = pending.catch(() => {}).then(() => write(snapshot));
      return pending;
    },
    flush() { return pending; }
  };
}
