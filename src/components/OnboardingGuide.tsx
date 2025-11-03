import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface OnboardingStep {
  elementId: string;
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  { elementId: 'montar-frase-btn', title: 'Montar Frases', description: 'Clique aqui para ir à tela de formar frases, onde a comunicação acontece!' },
  { elementId: 'categorias-grid', title: 'Explorar Categorias', description: 'Ou comece explorando as categorias de símbolos aqui.' },
  { elementId: 'recompensas-btn', title: 'Suas Recompensas', description: 'Acompanhe seu progresso, moedas e conquistas nesta tela.' },
  { elementId: 'painel-cuidador-btn', title: 'Painel do Cuidador', description: 'Aqui você pode gerenciar todo o aplicativo, fazer backups e muito mais.' },
];

interface OnboardingGuideProps {
  onComplete: () => void;
}

export const OnboardingGuide = ({ onComplete }: OnboardingGuideProps) => {
  const [stepIndex, setStepIndex] = useState(0);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onComplete();
    }
  };

  const currentStep = steps[stepIndex];
  const targetElement = document.getElementById(currentStep.elementId);

  if (!targetElement) return null;

  const rect = targetElement.getBoundingClientRect();
  const highlightStyle = {
    top: `${rect.top - 10}px`,
    left: `${rect.left - 10}px`,
    width: `${rect.width + 20}px`,
    height: `${rect.height + 20}px`,
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="absolute border-4 border-white rounded-lg transition-all duration-500" style={highlightStyle}></div>
      <div className="relative z-10 bg-white p-6 rounded-lg shadow-xl max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
        <p className="text-gray-600 mb-4">{currentStep.description}</p>
        <Button onClick={handleNext}>{stepIndex === steps.length - 1 ? 'Concluir' : 'Próximo'}</Button>
      </div>
    </div>
  );
};
