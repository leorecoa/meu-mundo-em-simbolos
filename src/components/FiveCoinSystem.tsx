
import { useState, useEffect } from 'react';
import { Coins, Star, Gift, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FiveCoinSystemProps {
  currentCoins: number;
  onCoinsChange: (newAmount: number) => void;
}

export const FiveCoinSystem = ({ currentCoins, onCoinsChange }: FiveCoinSystemProps) => {
  const { toast } = useToast();
  const [showAnimation, setShowAnimation] = useState(false);

  const rewards = [
    { id: 1, name: 'Tema Especial', cost: 50, icon: Star, description: 'Desbloqueie um tema exclusivo' },
    { id: 2, name: 'Sons Personalizados', cost: 100, icon: Gift, description: 'Grave suas próprias palavras' },
    { id: 3, name: 'Avatar Premium', cost: 150, icon: Trophy, description: 'Personalize seu avatar' },
  ];

  const earnCoins = (amount: number, reason: string) => {
    onCoinsChange(currentCoins + amount);
    setShowAnimation(true);
    toast({
      title: `+${amount} FiveCoins!`,
      description: reason,
      duration: 3000,
    });
    setTimeout(() => setShowAnimation(false), 1000);
  };

  const spendCoins = (amount: number, item: string) => {
    if (currentCoins >= amount) {
      onCoinsChange(currentCoins - amount);
      toast({
        title: 'Recompensa desbloqueada!',
        description: `Você comprou: ${item}`,
        duration: 3000,
      });
    } else {
      toast({
        title: 'FiveCoins insuficientes',
        description: `Você precisa de ${amount - currentCoins} FiveCoins a mais`,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Coin Display */}
      <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-0 shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`relative ${showAnimation ? 'animate-bounce' : ''}`}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                <Coins className="w-6 h-6 text-white" />
              </div>
              {showAnimation && (
                <div className="absolute -inset-2 rounded-full bg-yellow-400/30 animate-ping"></div>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {currentCoins}
              </h3>
              <p className="text-sm text-slate-600">FiveCoins</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Ganhe moedas usando o app!</p>
          </div>
        </div>
      </Card>

      {/* Ways to earn coins */}
      <div>
        <h4 className="text-lg font-semibold text-slate-700 mb-3">Como ganhar FiveCoins:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto p-4 bg-blue-50 hover:bg-blue-100 border-blue-200"
            onClick={() => earnCoins(5, 'Por usar uma nova palavra!')}
          >
            <div className="text-left">
              <div className="font-medium text-blue-700">+5 Moedas</div>
              <div className="text-sm text-blue-600">Usar nova palavra</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-4 bg-green-50 hover:bg-green-100 border-green-200"
            onClick={() => earnCoins(10, 'Por completar uma frase!')}
          >
            <div className="text-left">
              <div className="font-medium text-green-700">+10 Moedas</div>
              <div className="text-sm text-green-600">Completar frase</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Rewards Store */}
      <div>
        <h4 className="text-lg font-semibold text-slate-700 mb-3">Loja de Recompensas:</h4>
        <div className="space-y-3">
          {rewards.map((reward) => (
            <Card key={reward.id} className="p-4 bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <reward.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-medium text-slate-700">{reward.name}</h5>
                    <p className="text-sm text-slate-500">{reward.description}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className={`${
                    currentCoins >= reward.cost
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600'
                      : 'bg-slate-300 cursor-not-allowed'
                  } text-white`}
                  onClick={() => spendCoins(reward.cost, reward.name)}
                  disabled={currentCoins < reward.cost}
                >
                  <Coins className="w-4 h-4 mr-1" />
                  {reward.cost}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
