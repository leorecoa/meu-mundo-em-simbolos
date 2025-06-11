import { useState, useEffect } from 'react';
import { Coins, Star, Gift, Trophy, Calendar, CheckCircle, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { 
  getCoins, 
  updateCoins, 
  getTasks, 
  updateTaskProgress, 
  getDailyGoals,
  addPurchasedReward,
  getPurchasedRewards
} from '@/lib/storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface FiveCoinSystemProps {
  currentCoins?: number;
  onCoinsChange?: (newAmount: number) => void;
}

export const FiveCoinSystem = ({ currentCoins: propCoins, onCoinsChange }: FiveCoinSystemProps) => {
  const { toast } = useToast();
  const [showAnimation, setShowAnimation] = useState(false);
  const queryClient = useQueryClient();
  
  // Consultas para obter dados
  const { data: coins = 0 } = useQuery({
    queryKey: ['coins'],
    queryFn: getCoins
  });
  
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks
  });
  
  const { data: dailyGoals = [] } = useQuery({
    queryKey: ['dailyGoals'],
    queryFn: getDailyGoals
  });
  
  const { data: purchasedRewards = [] } = useQuery({
    queryKey: ['purchasedRewards'],
    queryFn: getPurchasedRewards
  });
  
  // Usar moedas do prop se fornecido, caso contrário usar do localStorage
  const currentCoins = propCoins !== undefined ? propCoins : coins;
  
  // Mutações
  const updateCoinsMutation = useMutation({
    mutationFn: updateCoins,
    onSuccess: (newAmount) => {
      queryClient.setQueryData(['coins'], newAmount);
      if (onCoinsChange) onCoinsChange(newAmount);
    }
  });
  
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, completed }: { taskId: string, completed: boolean }) => 
      updateTaskProgress(taskId, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['coins'] });
    }
  });
  
  const purchaseRewardMutation = useMutation({
    mutationFn: ({ rewardId, cost }: { rewardId: string, cost: number }) => {
      updateCoins(-cost);
      addPurchasedReward(rewardId);
      return rewardId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchasedRewards'] });
      queryClient.invalidateQueries({ queryKey: ['coins'] });
    }
  });

  const rewards = [
    { 
      id: 'theme_special', 
      name: 'Tema Especial', 
      cost: 50, 
      icon: Star, 
      description: 'Desbloqueie um tema exclusivo com cores vibrantes'
    },
    { 
      id: 'custom_sounds', 
      name: 'Sons Personalizados', 
      cost: 100, 
      icon: Gift, 
      description: 'Grave suas próprias palavras para os símbolos'
    },
    { 
      id: 'premium_avatar', 
      name: 'Avatar Premium', 
      cost: 150, 
      icon: Trophy, 
      description: 'Personalize seu avatar com opções exclusivas'
    },
    { 
      id: 'extra_symbols', 
      name: 'Símbolos Extras', 
      cost: 75, 
      icon: Award, 
      description: 'Desbloqueie um pacote com 20 símbolos adicionais'
    },
  ];

  const earnCoins = (amount: number, reason: string) => {
    updateCoinsMutation.mutate(amount);
    setShowAnimation(true);
    toast({
      title: `+${amount} FiveCoins!`,
      description: reason,
      duration: 3000,
    });
    setTimeout(() => setShowAnimation(false), 1000);
  };

  const spendCoins = (amount: number, item: string, rewardId: string) => {
    if (currentCoins >= amount) {
      purchaseRewardMutation.mutate({ rewardId, cost: amount });
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
  
  const completeTask = (taskId: string) => {
    updateTaskMutation.mutate({ taskId, completed: true });
    toast({
      title: 'Tarefa concluída!',
      description: 'Você ganhou FiveCoins como recompensa',
      duration: 3000,
    });
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
            <p className="text-xs text-slate-500">Ganhe moedas completando tarefas!</p>
          </div>
        </div>
      </Card>

      {/* Daily Goals */}
      <div>
        <h4 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Metas Diárias
        </h4>
        <div className="space-y-3">
          {dailyGoals.map((goal) => (
            <Card key={goal.id} className="p-4 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  {goal.id === 'daily_symbols' && <Gift className="w-5 h-5 mr-2 text-blue-600" />}
                  {goal.id === 'daily_phrases' && <CheckCircle className="w-5 h-5 mr-2 text-green-600" />}
                  {goal.id === 'daily_time' && <Clock className="w-5 h-5 mr-2 text-purple-600" />}
                  <span className="font-medium">{goal.name}</span>
                </div>
                <div className="flex items-center">
                  <Coins className="w-4 h-4 mr-1 text-yellow-500" />
                  <span className="text-sm font-medium">{goal.reward}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Progresso: {goal.current}/{goal.target}</span>
                  <span>{Math.min(Math.round((goal.current / goal.target) * 100), 100)}%</span>
                </div>
                <Progress 
                  value={Math.min(Math.round((goal.current / goal.target) * 100), 100)} 
                  className={`h-2 ${goal.completed ? 'bg-green-200' : 'bg-slate-200'}`}
                />
              </div>
              {goal.completed && (
                <div className="mt-2 text-xs text-green-600 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Concluído! Recompensa recebida.
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div>
        <h4 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
          Tarefas
        </h4>
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className={`p-4 ${task.completed ? 'bg-green-50' : 'bg-white'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-slate-700 flex items-center">
                    {task.completed && <CheckCircle className="w-4 h-4 mr-1 text-green-600" />}
                    {task.name}
                  </h5>
                  <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                </div>
                <Button
                  size="sm"
                  className={`${
                    task.completed
                      ? 'bg-green-500 hover:bg-green-600 cursor-default'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                  onClick={() => !task.completed && completeTask(task.id)}
                  disabled={task.completed || updateTaskMutation.isPending}
                >
                  {task.completed ? (
                    <span className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Concluído
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Coins className="w-4 h-4 mr-1" />
                      {task.reward}
                    </span>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Rewards Store */}
      <div>
        <h4 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
          <Gift className="w-5 h-5 mr-2 text-purple-600" />
          Loja de Recompensas
        </h4>
        <div className="space-y-3">
          {rewards.map((reward) => {
            const isPurchased = purchasedRewards.includes(reward.id);
            
            return (
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
                      isPurchased
                        ? 'bg-green-500 hover:bg-green-500 cursor-default'
                        : currentCoins >= reward.cost
                        ? 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600'
                        : 'bg-slate-300 cursor-not-allowed'
                    } text-white`}
                    onClick={() => !isPurchased && spendCoins(reward.cost, reward.name, reward.id)}
                    disabled={isPurchased || currentCoins < reward.cost || purchaseRewardMutation.isPending}
                  >
                    {isPurchased ? (
                      <span className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Adquirido
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Coins className="w-4 h-4 mr-1" />
                        {reward.cost}
                      </span>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};