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
    if (!text.trim()) return;

    const settings = activeProfileId ? await db.userSettings.where({ profileId: activeProfileId }).first() : null;
    const utterance = new SpeechSynthesisUtterance(text);

    // 1. Definições de Rate e Pitch com base nas configurações
    utterance.lang = settings?.language || 'pt-BR';
    utterance.rate = (settings?.voiceSpeed || 10) / 10; // Ajuste para uma escala de 0.1 a 2.0
    // utterance.pitch = (settings?.voicePitch || 10) / 10;

    // 2. Lógica de Seleção de Voz Prioritária
    const availableVoices = voices.filter(v => v.lang === utterance.lang);
    let voiceToUse: SpeechSynthesisVoice | undefined;

    // Prioridade 1: Voz salva pelo usuário
    if (settings?.voiceType) {
      voiceToUse = availableVoices.find(v => v.name === settings.voiceType);
    }

    // Prioridade 2: Vozes de alta qualidade (Google/Microsoft)
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
  }, [voices, activeProfileId]);

  return { speak, isSpeaking, voices };
}
