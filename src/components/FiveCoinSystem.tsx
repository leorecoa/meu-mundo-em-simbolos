import { useState } from 'react';
import { Coins, Star, Gift, Trophy, CheckCircle, Medal, Sparkles, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getCoins, getDailyGoals, getAchievements, getPurchasedRewards, updateGoalProgress, purchaseReward, unlockAchievement } from '@/lib/storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Definição estática das recompensas disponíveis na loja
const rewards = [
  { id: 'theme_special', name: 'Tema Galáxia', cost: 100, description: 'Um tema espacial para o app.' },
  { id: 'sound_effects', name: 'Efeitos Sonoros', cost: 150, description: 'Sons divertidos ao interagir.' },
  { id: 'extra_symbols', name: 'Pacote de Símbolos', cost: 200, description: '20 novos símbolos de animais.' },
];

export const FiveCoinSystem = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries para buscar dados de gamificação do banco de dados
  const { data: coins = 0 } = useQuery({ queryKey: ['coins'], queryFn: getCoins });
  const { data: goals = [] } = useQuery({ queryKey: ['dailyGoals'], queryFn: getDailyGoals });
  const { data: achievements = [] } = useQuery({ queryKey: ['achievements'], queryFn: getAchievements });
  const { data: purchasedRewards = [] } = useQuery({ queryKey: ['purchasedRewards'], queryFn: getPurchasedRewards });

  // Mutações para interagir com o banco de dados
  const goalMutation = useMutation({ 
    mutationFn: ({ goalId, amount }: { goalId: string, amount: number }) => updateGoalProgress(goalId, amount),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dailyGoals', 'coins'] })
  });

  const purchaseMutation = useMutation({ 
    mutationFn: ({ rewardId, cost }: { rewardId: string, cost: number }) => purchaseReward(rewardId, cost),
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['purchasedRewards', 'coins'] });
        toast({ title: 'Recompensa Desbloqueada!' });
      } else {
        toast({ title: 'Moedas insuficientes', variant: 'destructive' });
      }
    }
  });
  
  const userLevel = Math.floor(coins / 100) + 1;
  const levelProgress = (coins % 100);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Coins className="w-10 h-10 text-yellow-500" />
            <div>
              <h3 className="text-2xl font-bold">{coins}</h3>
              <p className="text-sm text-gray-600">FiveCoins</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-100 text-blue-800"><Star className="w-4 h-4 mr-1" />Nível {userLevel}</Badge>
        </div>
        <Progress value={levelProgress} className="mt-4 h-2" />
      </Card>

      <Tabs defaultValue="metas" className="w-full">
        <TabsList className="grid w-full grid-cols-3"> 
          <TabsTrigger value="metas">Metas Diárias</TabsTrigger>
          <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
          <TabsTrigger value="loja">Loja</TabsTrigger>
        </TabsList>

        <TabsContent value="metas" className="space-y-3">
          {goals.map(goal => (
            <Card key={goal.id} className={`p-4 ${goal.completed ? 'bg-green-50' : ''}`}>
              <h5 className="font-semibold">{goal.name}</h5>
              <Progress value={(goal.current / goal.target) * 100} className="my-2 h-2" />
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>{goal.current} / {goal.target}</span>
                <span className="flex items-center"><Coins className="w-4 h-4 mr-1" /> +{goal.reward}</span>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="conquistas" className="space-y-3">
           {achievements.map(ach => (
            <Card key={ach.id} className={`p-4 flex items-center gap-4 ${ach.unlocked ? 'bg-yellow-50' : ''}`}>
              <Trophy className={`w-6 h-6 ${ach.unlocked ? 'text-yellow-600' : 'text-gray-400'}`} />
              <div>
                <h5 className="font-semibold">{ach.name}</h5>
                <p className="text-sm text-gray-600">{ach.description}</p>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="loja" className="space-y-3">
          {rewards.map(reward => {
            const isPurchased = purchasedRewards.some(pr => pr.id === reward.id);
            return (
              <Card key={reward.id} className={`p-4 flex justify-between items-center ${isPurchased ? 'bg-gray-100' : ''}`}>
                <div>
                  <h5 className="font-semibold">{reward.name}</h5>
                  <p className="text-sm text-gray-600">{reward.description}</p>
                </div>
                <Button onClick={() => !isPurchased && purchaseMutation.mutate(reward)} disabled={isPurchased || purchaseMutation.isPending}>
                  {isPurchased ? <CheckCircle /> : `${reward.cost} Moedas`}
                </Button>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Botões de Ação para Simular Progresso (Temporário) */}
      <div className="p-4 border-t space-x-2">
        <Button size="sm" variant="outline" onClick={() => goalMutation.mutate({ goalId: 'goal_phrases', amount: 1 })}>+1 Frase</Button>
        <Button size="sm" variant="outline" onClick={() => goalMutation.mutate({ goalId: 'goal_symbols', amount: 1 })}>+1 Símbolo</Button>
        <Button size="sm" variant="outline" onClick={() => goalMutation.mutate({ goalId: 'goal_categories', amount: 1 })}>+1 Categoria</Button>
      </div>
    </div>
  );
};
