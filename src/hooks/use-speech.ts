import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { useProfile } from '@/contexts/ProfileContext';

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  voice?: SpeechSynthesisVoice | null;
}

export function useSpeech() {
  const { activeProfileId } = useProfile();
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

    loadVoices();
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
  const getVoiceFromSettings = async () => {
    if (!activeProfileId) return voices[0] || null;
    
    const settings = await db.userSettings.where({ profileId: activeProfileId }).first();
    const preferredVoiceType = settings?.voiceType || 'feminina';
    const preferredLang = settings?.language || 'pt-BR';
    
    // Filtrar vozes por idioma
    let langVoices = voices.filter(voice => 
      voice.lang.startsWith(preferredLang.split('-')[0]) || 
      voice.lang === preferredLang
    );
    
    if (langVoices.length === 0) {
      langVoices = voices.filter(voice => voice.lang.startsWith('en'));
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
  const speak = async (text: string, options: SpeechOptions = {}) => {
    window.speechSynthesis.cancel();
    
    const settings = activeProfileId 
      ? await db.userSettings.where({ profileId: activeProfileId }).first()
      : null;
    
    const newUtterance = new SpeechSynthesisUtterance(text);
    
    newUtterance.lang = options.lang || settings?.language || 'pt-BR';
    newUtterance.rate = options.rate || (settings?.voiceSpeed || 50) / 50;
    newUtterance.pitch = options.pitch || 1;
    newUtterance.volume = options.volume || 1;
    
    const voice = options.voice || await getVoiceFromSettings();
    if (voice) {
      newUtterance.voice = voice;
    }
    
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
    
    setUtterance(newUtterance);
    window.speechSynthesis.speak(newUtterance);
  };

  const pause = () => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

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
