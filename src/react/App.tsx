import { useEffect } from 'react';
import { playerMarkup } from './playerMarkup';

export function App() {
  useEffect(() => {
    // The legacy DOM player is the single runtime owner for playback and library state.
    // React remains the bootstrap shell so the migration can happen without two audio engines.
    let onboarded = false;
    try {
      onboarded = JSON.parse(localStorage.getItem('atiga-state') || '{}')?.onboarded === true;
    } catch { /* The runtime will recover from invalid state and start fresh. */ }
    const welcomeDialog = document.getElementById('welcome-dialog');
    if (!onboarded && welcomeDialog instanceof HTMLDialogElement && !welcomeDialog.open) {
      welcomeDialog.showModal();
    }

    let timer = 0;
    const frame = window.requestAnimationFrame(() => {
      timer = window.setTimeout(() => { void import('../app.js'); }, 0);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: playerMarkup }} />;
}
