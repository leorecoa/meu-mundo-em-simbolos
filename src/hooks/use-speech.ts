import { useState, useEffect, useCallback } from 'react';
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
    if (!text.trim() || isSpeaking) return;

    const settings = activeProfileId ? await db.userSettings.where({ profileId: activeProfileId }).first() : null;
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = settings?.language || 'pt-BR';
    utterance.rate = (settings?.voiceSpeed || 10) / 10; // Escala de 0.1 a 2.0
    // utterance.pitch = (settings?.voicePitch || 10) / 10;

    const availableVoices = voices.filter(v => v.lang.startsWith(utterance.lang.split('-')[0]));
    let voiceToUse: SpeechSynthesisVoice | undefined;

    // Prioridade 1: Voz exata salva pelo usuário
    if (settings?.voiceType) {
      voiceToUse = availableVoices.find(v => v.name === settings.voiceType);
    }
    // Prioridade 2: Vozes de alta qualidade (Google/Microsoft) para o idioma
    if (!voiceToUse) {
      voiceToUse = availableVoices.find(v => v.name.includes('Google')) || availableVoices.find(v => v.name.includes('Microsoft'));
    }
    // Prioridade 3: Primeira voz disponível para o idioma
    if (!voiceToUse) {
      voiceToUse = availableVoices[0];
    }

    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [voices, activeProfileId, isSpeaking]);

  return { speak, isSpeaking, voices };
}
