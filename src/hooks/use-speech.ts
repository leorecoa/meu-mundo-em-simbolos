import { useState, useEffect } from 'react';
import { getSettings } from '@/lib/storage';
import { applyLanguageSettings } from '@/lib/applyLanguageSettings';

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  voice?: SpeechSynthesisVoice | null;
}

export function useSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Carregar vozes disponíveis
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Carregar vozes iniciais
    loadVoices();

    // Adicionar evento para quando as vozes forem carregadas
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Limpar ao desmontar
  useEffect(() => {
    return () => {
      if (utterance) {
        window.speechSynthesis.cancel();
      }
    };
  }, [utterance]);

  // Obter voz com base nas configurações
  const getVoiceFromSettings = () => {
    const settings = getSettings();
    const preferredVoiceType = settings.voiceType;
    const preferredLang = settings.language || 'pt-BR';
    
    // Filtrar vozes por idioma
    let langVoices = voices.filter(voice => 
      voice.lang.startsWith(preferredLang.split('-')[0]) || 
      voice.lang === preferredLang
    );
    
    // Se não encontrar vozes para o idioma preferido, tente encontrar qualquer voz
    if (langVoices.length === 0) {
      // Tentar encontrar vozes em inglês como fallback
      langVoices = voices.filter(voice => 
        voice.lang.startsWith('en')
      );
      
      // Se ainda não encontrar, use qualquer voz disponível
      if (langVoices.length === 0) {
        return voices[0] || null;
      }
    }
    
    // Tentar encontrar voz que corresponda ao tipo preferido
    if (preferredVoiceType === 'feminina') {
      const femaleVoice = langVoices.find(voice => 
        !voice.name.includes('Male') && 
        !voice.name.includes('Masculino') &&
        !voice.name.includes('male')
      );
      if (femaleVoice) return femaleVoice;
    } else if (preferredVoiceType === 'masculina') {
      const maleVoice = langVoices.find(voice => 
        voice.name.includes('Male') || 
        voice.name.includes('Masculino') ||
        voice.name.includes('male')
      );
      if (maleVoice) return maleVoice;
    }
    
    // Retornar a primeira voz disponível se não encontrar correspondência
    return langVoices[0];
  };
  
  // Obter lista de idiomas disponíveis
  const getAvailableLanguages = () => {
    const languageMap = new Map();
    
    voices.forEach(voice => {
      const langCode = voice.lang;
      const langName = new Intl.DisplayNames([navigator.language || 'en'], { type: 'language' }).of(langCode.split('-')[0]);
      
      if (langName && !languageMap.has(langCode)) {
        languageMap.set(langCode, {
          code: langCode,
          name: langName,
          localName: voice.lang.includes('-') ? `${langName} (${voice.lang.split('-')[1]})` : langName
        });
      }
    });
    
    return Array.from(languageMap.values());
  };

  // Função para falar texto
  const speak = (text: string, options: SpeechOptions = {}) => {
    // Cancelar qualquer fala anterior
    window.speechSynthesis.cancel();
    
    const settings = getSettings();
    
    // Criar nova utterance
    const newUtterance = new SpeechSynthesisUtterance(text);
    
    // Configurar opções
    newUtterance.lang = options.lang || settings.language || 'pt-BR';
    newUtterance.rate = options.rate || settings.voiceSpeed / 50; // Converter de 0-100 para aproximadamente 0-2
    newUtterance.pitch = options.pitch || 1;
    newUtterance.volume = options.volume || 1;
    
    // Selecionar voz
    const voice = options.voice || getVoiceFromSettings();
    if (voice) {
      newUtterance.voice = voice;
    }
    
    // Configurar eventos
    newUtterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    
    newUtterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setUtterance(null);
    };
    
    newUtterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setUtterance(null);
    };
    
    // Armazenar utterance para controle
    setUtterance(newUtterance);
    
    // Iniciar fala
    window.speechSynthesis.speak(newUtterance);
  };

  // Pausar fala
  const pause = () => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // Retomar fala
  const resume = () => {
    if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  // Cancelar fala
  const cancel = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setUtterance(null);
  };

  return {
    speak,
    pause,
    resume,
    cancel,
    isSpeaking,
    isPaused,
    voices,
    getVoiceFromSettings,
    getAvailableLanguages
  };
}