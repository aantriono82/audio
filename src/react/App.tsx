import { useEffect } from 'react';
import { playerMarkup } from './playerMarkup';

export function App() {
  useEffect(() => {
    // The legacy DOM player is the single runtime owner for playback and library state.
    // React remains the bootstrap shell so the migration can happen without two audio engines.
    void import('../app.js');
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: playerMarkup }} />;
}
