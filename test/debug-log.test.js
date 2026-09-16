import test from 'node:test';
import assert from 'node:assert/strict';
import { getDebugLogText, isVerboseLoggingEnabled, log, setVerboseLogging } from '../src/debug-log.js';

test('debug logger records structured information and gates verbose entries', () => {
  setVerboseLogging(false);
  const before = getDebugLogText();
  log('info', 'test.info', { count: 2 });
  assert.match(getDebugLogText().slice(before.length), /\[INFO\].*test\.info.*"count":2/);

  log('debug', 'test.hidden');
  assert.doesNotMatch(getDebugLogText(), /test\.hidden/);
  setVerboseLogging(true);
  assert.equal(isVerboseLoggingEnabled(), true);
  log('debug', 'test.visible', { enabled: true });
  assert.match(getDebugLogText(), /\[DEBUG\].*test\.visible.*"enabled":true/);
  setVerboseLogging(false);
});
