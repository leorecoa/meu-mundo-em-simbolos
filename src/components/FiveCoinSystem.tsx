import { useState, useEffect } from 'react';
import { Coins, Star, Gift, Trophy, CheckCircle, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getCoins, updateCoins, getTasks, updateTask, getAchievements, unlockAchievement } from '@/lib/storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const FiveCoinSystem = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: coins = 0 } = useQuery({ queryKey: ['coins'], queryFn: getCoins });
  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: getTasks });
  const { data: achievements = [] } = useQuery({ queryKey: ['achievements'], queryFn: getAchievements });

  const updateCoinsMutation = useMutation({
    mutationFn: (amount: number) => updateCoins(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coins'] });
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: (taskId: string) => updateTask(taskId, true),
    onSuccess: (taskId) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        updateCoinsMutation.mutate(10); // Recompensa padrão
        toast({ title: "Tarefa Concluída!", description: `Você ganhou 10 moedas.` });
      }
    }
  });

  const unlockAchievementMutation = useMutation({
    mutationFn: (achievementId: string) => unlockAchievement(achievementId),
    onSuccess: (achievementId) => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement) {
        updateCoinsMutation.mutate(20); // Recompensa padrão
        toast({ title: "Conquista Desbloqueada!", description: `Você ganhou 20 moedas.` });
      }
    }
  });

  const userLevel = Math.floor(coins / 100) + 1;
  const levelProgress = (coins % 100);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-green-50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{coins}</h3>
              <p className="text-sm text-gray-600">FiveCoins</p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              <Star className="w-3 h-3 mr-1" /> Nível {userLevel}
            </Badge>
          </div>
        </div>
        <Progress value={levelProgress} className="mt-4 h-2" />
      </Card>

      <Tabs defaultValue="tarefas" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
          <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
          <TabsTrigger value="loja">Loja</TabsTrigger>
        </TabsList>

        <TabsContent value="tarefas" className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className={`p-4 ${task.completed ? 'bg-green-50' : 'bg-white'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h5 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : ''}`}>{task.name}</h5>
                </div>
                <Button
                  size="sm"
                  onClick={() => !task.completed && updateTaskMutation.mutate(task.id)}
                  disabled={task.completed}
                >
                  {task.completed ? <CheckCircle className="w-4 h-4" /> : 'Completar'}
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="conquistas" className="space-y-3">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className={`p-4 ${achievement.unlocked ? 'bg-yellow-50' : 'bg-white'}`}>
              <div className="flex items-center">
                <Trophy className={`w-6 h-6 mr-3 ${achievement.unlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
                <div>
                  <h5 className={`font-medium ${achievement.unlocked ? '' : 'text-gray-500'}`}>{achievement.name}</h5>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="loja" className="text-center py-8">
          <Gift className="w-12 h-12 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-500">A loja de recompensas está em desenvolvimento.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};
