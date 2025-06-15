
import { useState } from 'react';
import { CheckCircle, Calendar, PlusCircle, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { getTasks, updateTaskProgress, getDailyGoals, getCoins, updateCoins } from '@/lib/storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const TasksTab = () => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskReward, setTaskReward] = useState(10);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks
  });
  
  const { data: dailyGoals = [] } = useQuery({
    queryKey: ['dailyGoals'],
    queryFn: getDailyGoals
  });
  
  const { data: coins = 0 } = useQuery({
    queryKey: ['coins'],
    queryFn: getCoins
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string, completed: boolean }) => {
      return await updateTaskProgress(taskId, completed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
  
  const addCoinsMutation = useMutation({
    mutationFn: async (amount: number) => {
      return await updateCoins(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coins'] });
    }
  });

  const handleAddTask = () => {
    if (!taskName.trim() || !taskDescription.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome e a descrição da tarefa",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Tarefa adicionada",
      description: "A nova tarefa foi adicionada com sucesso",
    });
    
    setTaskName('');
    setTaskDescription('');
    setTaskReward(10);
  };
  
  const handleAddCoins = (amount: number) => {
    addCoinsMutation.mutate(amount);
    toast({
      title: "Moedas adicionadas",
      description: `${amount} FiveCoins foram adicionadas com sucesso`,
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
          Gerenciar Tarefas
        </h2>
        
        <div className="mb-6">
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Nome da tarefa</label>
            <Input 
              placeholder="Ex: Usar 10 símbolos diferentes" 
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Descrição</label>
            <Input 
              placeholder="Ex: Use 10 símbolos diferentes em frases" 
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Recompensa (FiveCoins)</label>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setTaskReward(Math.max(5, taskReward - 5))}
              >
                -
              </Button>
              <span className="mx-4 font-medium">{taskReward}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setTaskReward(taskReward + 5)}
              >
                +
              </Button>
            </div>
          </div>
          
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 mt-2"
            onClick={handleAddTask}
          >
            <PlusCircle className="h-4 w-4 mr-2" /> 
            Adicionar tarefa
          </Button>
        </div>
        
        <h3 className="text-md font-semibold mb-2">Tarefas atuais</h3>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="border rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{task.name}</p>
                <p className="text-sm text-gray-500">{task.description}</p>
              </div>
              <div className="flex items-center">
                <div className="mr-3 text-sm">
                  <span className="font-medium">{task.reward}</span> <Coins className="h-3 w-3 inline" />
                </div>
                <Switch 
                  checked={task.completed} 
                  onCheckedChange={(checked) => 
                    updateTaskMutation.mutate({ taskId: task.id, completed: checked })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Metas Diárias
        </h2>
        
        <div className="space-y-3">
          {dailyGoals.map((goal) => (
            <div key={goal.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">{goal.name}</p>
                <div className="text-sm">
                  <span className="font-medium">{goal.reward}</span> <Coins className="h-3 w-3 inline" />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                <span>Progresso: {goal.current}/{goal.target}</span>
                <span>{Math.min(Math.round((goal.current / goal.target) * 100), 100)}%</span>
              </div>
              <Progress 
                value={Math.min(Math.round((goal.current / goal.target) * 100), 100)} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </Card>
      
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Coins className="h-5 w-5 mr-2 text-yellow-500" />
          Gerenciar FiveCoins
        </h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Saldo atual: <span className="font-bold">{coins}</span> FiveCoins</p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Button 
              variant="outline"
              className="border-green-200 bg-green-50 hover:bg-green-100"
              onClick={() => handleAddCoins(10)}
            >
              +10 Moedas
            </Button>
            <Button 
              variant="outline"
              className="border-green-200 bg-green-50 hover:bg-green-100"
              onClick={() => handleAddCoins(25)}
            >
              +25 Moedas
            </Button>
            <Button 
              variant="outline"
              className="border-green-200 bg-green-50 hover:bg-green-100"
              onClick={() => handleAddCoins(50)}
            >
              +50 Moedas
            </Button>
            <Button 
              variant="outline"
              className="border-red-200 bg-red-50 hover:bg-red-100"
              onClick={() => handleAddCoins(-10)}
              disabled={coins < 10}
            >
              -10 Moedas
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
