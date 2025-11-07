import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '@/lib/db';
import { useProfile } from '@/contexts/ProfileContext';

export function useSpeech() {
  const { activeProfileId } = useProfile();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Cancelar fala anterior
    window.speechSynthesis.cancel();

    const settings = activeProfileId ? await db.userSettings.where({ profileId: activeProfileId }).first() : null;
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = settings?.language || 'pt-BR';
    utterance.rate = (settings?.voiceSpeed || 10) / 10;

    const availableVoices = voices.filter(v => v.lang === utterance.lang);
    let voiceToUse: SpeechSynthesisVoice | undefined;

    if (settings?.voiceType) {
      voiceToUse = availableVoices.find(v => v.name === settings.voiceType);
    }

    if (!voiceToUse) {
      voiceToUse = availableVoices.find(v => v.name.includes('Google')) || availableVoices.find(v => v.name.includes('Microsoft'));
    }

    if (!voiceToUse) {
      voiceToUse = availableVoices[0];
    }

    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [voices, activeProfileId]);

  const getFilteredVoices = useCallback((languageCode: string) => {
    return voices.filter(v => v.lang.startsWith(languageCode));
  }, [voices]);

  return { speak, isSpeaking, voices, getFilteredVoices };
}
