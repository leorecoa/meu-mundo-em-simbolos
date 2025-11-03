import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PresentationScreenProps {
  phrase: string;
  onClose: () => void;
}

export const PresentationScreen = ({ phrase, onClose }: PresentationScreenProps) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-8">
      <Button onClick={onClose} variant="ghost" className="absolute top-4 right-4">
        <X className="h-8 w-8" />
        Fechar
      </Button>
      <div className="text-6xl md:text-8xl lg:text-9xl font-bold text-black text-center break-words">
        {phrase}
      </div>
    </div>
  );
};
