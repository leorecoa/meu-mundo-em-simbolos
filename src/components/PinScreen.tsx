import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface PinScreenProps {
  onPinVerified: () => void;
  storedPin: string;
}

export const PinScreen = ({ onPinVerified, storedPin }: PinScreenProps) => {
  const [inputPin, setInputPin] = useState('');
  const { toast } = useToast();

  const handlePinChange = (value: string) => {
    if (value.length <= 4 && /^[0-9]*$/.test(value)) {
      setInputPin(value);
    }
  };

  const handleSubmit = () => {
    if (inputPin === storedPin) {
      onPinVerified();
    } else {
      toast({ title: 'PIN Incorreto', description: 'Por favor, tente novamente.', variant: 'destructive' });
      setInputPin('');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">Acesso Restrito</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
            <p className="text-sm text-gray-600">Digite o PIN para acessar o painel do cuidador.</p>
            <Input 
              type="password" 
              maxLength={4}
              value={inputPin}
              onChange={(e) => handlePinChange(e.target.value)}
              className="text-center text-2xl tracking-[1.5rem] w-48"
              autoFocus
            />
            <Button onClick={handleSubmit} className="w-full">Entrar</Button>
        </CardContent>
      </Card>
    </div>
  );
};
