export function captureError(message: string, error: unknown, details?: unknown): void;
export function clearDebugLog(): Promise<void>;
export function exportDebugLog(): Promise<string>;
export function initDebugLogging(options?: { desktop?: boolean }): void;
export function isVerboseLoggingEnabled(): boolean;
export function log(level: string, message: string, details?: unknown): void;
export function setVerboseLogging(enabled: boolean): boolean;
