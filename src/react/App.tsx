import { useEffect } from 'react';
import { playerMarkup } from './playerMarkup';

export function App() {
  useEffect(() => {
    void import('../app.js');
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: playerMarkup }} />;
}
