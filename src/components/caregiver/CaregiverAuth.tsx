
import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getPin } from '@/lib/storage';

interface CaregiverAuthProps {
  onAuthenticated: () => void;
  onBack: () => void;
}

export const CaregiverAuth = ({ onAuthenticated, onBack }: CaregiverAuthProps) => {
  const [pin, setPin] = useState('');
  const { toast } = useToast();

  const handleLogin = () => {
    const storedPin = getPin();
    if (pin === storedPin) {
      onAuthenticated();
      toast({
        title: "Acesso concedido",
        description: "Bem-vindo ao modo cuidador",
      });
    } else {
      toast({
        title: "PIN inválido",
        description: "O PIN informado não está correto",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-8">
        <Lock className="h-12 w-12 mx-auto mb-4 text-blue-600" />
        <h1 className="text-2xl font-bold">Modo Cuidador</h1>
        <p className="text-gray-600 mt-2">
          Digite o PIN para acessar as configurações avançadas
        </p>
      </div>
      
      <div className="w-full max-w-xs">
        <Input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Digite o PIN"
          className="text-center text-xl tracking-widest mb-4"
          maxLength={4}
        />
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleLogin}
        >
          Entrar
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full mt-4"
          onClick={onBack}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};
