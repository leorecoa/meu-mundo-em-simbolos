import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { getSettings } from './lib/storage'

// Inicializar o idioma do documento
try {
  const settings = getSettings();
  if (settings.language) {
    document.documentElement.lang = settings.language.split('-')[0];
  }
} catch (error) {
  console.error('Erro ao definir o idioma do documento:', error);
}

createRoot(document.getElementById("root")!).render(<App />);
