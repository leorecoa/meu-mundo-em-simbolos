import { useState, useEffect } from 'react';
import { 
  Coins, Star, Gift, Trophy, Calendar, CheckCircle, Clock, Award, 
  Sparkles, Zap, Target, Medal, Crown, Rocket, Heart, Flame, Book, 
  Palette, Music, Gamepad2, Camera, Smile
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  getCoins, 
  updateCoins, 
  getTasks, 
  updateTaskProgress, 
  getDailyGoals,
  addPurchasedReward,
  getPurchasedRewards,
  updateTimeSpent
} from '@/lib/storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface FiveCoinSystemProps {
  currentCoins?: number;
  onCoinsChange?: (newAmount: number) => void;
}

// Interface para conquistas
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  rewardCoins: number;
  progress?: {
    current: number;
    target: number;
  };
}

// Interface para desafios diários
interface DailyChallenge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  reward: number;
  completed: boolean;
  difficulty: 'fácil' | 'médio' | 'difícil';
}

export const FiveCoinSystem = ({ currentCoins: propCoins, onCoinsChange }: FiveCoinSystemProps) => {
  const { toast } = useToast();
  const [showAnimation, setShowAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState('tarefas');
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
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
  
  // Conquistas do usuário
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'achievement_first_phrase',
      name: 'Primeira Comunicação',
      description: 'Criou sua primeira frase com símbolos',
      icon: Sparkles,
      unlocked: false,
      rewardCoins: 15
    },
    {
      id: 'achievement_10_phrases',
      name: 'Comunicador Iniciante',
      description: 'Criou 10 frases diferentes',
      icon: Medal,
      unlocked: false,
      rewardCoins: 25,
      progress: { current: 0, target: 10 }
    },
    {
      id: 'achievement_50_phrases',
      name: 'Comunicador Experiente',
      description: 'Criou 50 frases diferentes',
      icon: Trophy,
      unlocked: false,
      rewardCoins: 50,
      progress: { current: 0, target: 50 }
    },
    {
      id: 'achievement_all_categories',
      name: 'Explorador Completo',
      description: 'Usou símbolos de todas as categorias',
      icon: Rocket,
      unlocked: false,
      rewardCoins: 40
    },
    {
      id: 'achievement_7_days',
      name: 'Usuário Dedicado',
      description: 'Usou o app por 7 dias consecutivos',
      icon: Flame,
      unlocked: false,
      rewardCoins: 70,
      progress: { current: 0, target: 7 }
    },
    {
      id: 'achievement_custom_symbol',
      name: 'Criatividade',
      description: 'Criou seu primeiro símbolo personalizado',
      icon: Palette,
      unlocked: false,
      rewardCoins: 30
    }
  ]);
  
  // Desafios diários
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([
    {
      id: 'challenge_quick_phrases',
      name: 'Comunicação Rápida',
      description: 'Use 5 frases rápidas diferentes',
      icon: Zap,
      reward: 15,
      completed: false,
      difficulty: 'fácil'
    },
    {
      id: 'challenge_new_category',
      name: 'Nova Categoria',
      description: 'Use símbolos de uma categoria que você nunca usou antes',
      icon: Target,
      reward: 20,
      completed: false,
      difficulty: 'médio'
    },
    {
      id: 'challenge_long_phrase',
      name: 'Frase Complexa',
      description: 'Crie uma frase com pelo menos 6 símbolos',
      icon: Crown,
      reward: 25,
      completed: false,
      difficulty: 'difícil'
    }
  ]);
  
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

  // Categorias de recompensas
  const rewardCategories = [
    { id: 'visual', name: 'Visual', icon: Palette },
    { id: 'audio', name: 'Áudio', icon: Music },
    { id: 'funcional', name: 'Funcional', icon: Zap },
    { id: 'diversao', name: 'Diversão', icon: Gamepad2 },
    { id: 'premium', name: 'Premium', icon: Crown }
  ];

  // Lista expandida de recompensas
  const rewards = [
    // Categoria Visual
    { 
      id: 'theme_special', 
      name: 'Tema Especial', 
      cost: 50, 
      icon: Star, 
      description: 'Desbloqueie um tema exclusivo com cores vibrantes',
      category: 'visual'
    },
    { 
      id: 'dark_theme', 
      name: 'Tema Escuro', 
      cost: 40, 
      icon: Palette, 
      description: 'Tema escuro para uso noturno mais confortável',
      category: 'visual'
    },
    { 
      id: 'colorful_symbols', 
      name: 'Símbolos Coloridos', 
      cost: 60, 
      icon: Palette, 
      description: 'Adicione cores vibrantes a todos os símbolos',
      category: 'visual'
    },
    
    // Categoria Áudio
    { 
      id: 'custom_sounds', 
      name: 'Sons Personalizados', 
      cost: 100, 
      icon: Music, 
      description: 'Grave suas próprias palavras para os símbolos',
      category: 'audio'
    },
    { 
      id: 'sound_effects', 
      name: 'Efeitos Sonoros', 
      cost: 70, 
      icon: Music, 
      description: 'Adicione efeitos sonoros divertidos às interações',
      category: 'audio'
    },
    { 
      id: 'voice_pack', 
      name: 'Pacote de Vozes', 
      cost: 120, 
      icon: Music, 
      description: 'Novas vozes para leitura de frases',
      category: 'audio'
    },
    
    // Categoria Funcional
    { 
      id: 'extra_symbols', 
      name: 'Símbolos Extras', 
      cost: 75, 
      icon: Award, 
      description: 'Desbloqueie um pacote com 20 símbolos adicionais',
      category: 'funcional'
    },
    { 
      id: 'quick_phrases', 
      name: 'Frases Rápidas+', 
      cost: 90, 
      icon: Zap, 
      description: 'Dobre o número de frases rápidas disponíveis',
      category: 'funcional'
    },
    { 
      id: 'custom_categories', 
      name: 'Categorias Personalizadas', 
      cost: 110, 
      icon: Rocket, 
      description: 'Crie suas próprias categorias de símbolos',
      category: 'funcional'
    },
    
    // Categoria Diversão
    { 
      id: 'premium_avatar', 
      name: 'Avatar Premium', 
      cost: 150, 
      icon: Trophy, 
      description: 'Personalize seu avatar com opções exclusivas',
      category: 'diversao'
    },
    { 
      id: 'mini_games', 
      name: 'Mini Jogos', 
      cost: 130, 
      icon: Gamepad2, 
      description: 'Desbloqueie jogos educativos divertidos',
      category: 'diversao'
    },
    { 
      id: 'stickers', 
      name: 'Pacote de Stickers', 
      cost: 65, 
      icon: Smile, 
      description: 'Stickers animados para suas mensagens',
      category: 'diversao'
    },
    
    // Categoria Premium
    { 
      id: 'premium_bundle', 
      name: 'Pacote Premium', 
      cost: 300, 
      icon: Crown, 
      description: 'Acesso a todas as funcionalidades premium por um mês',
      category: 'premium'
    },
    { 
      id: 'photo_symbols', 
      name: 'Símbolos com Fotos', 
      cost: 200, 
      icon: Camera, 
      description: 'Use suas próprias fotos como símbolos',
      category: 'premium'
    },
    { 
      id: 'unlimited_storage', 
      name: 'Armazenamento Ilimitado', 
      cost: 250, 
      icon: Book, 
      description: 'Armazene um número ilimitado de frases e símbolos',
      category: 'premium'
    },
  ];

  // Mutação para completar desafios diários
  const completeDailyChallengeMutation = useMutation({
    mutationFn: (challengeId: string) => {
      const challenge = dailyChallenges.find(c => c.id === challengeId);
      if (challenge && !challenge.completed) {
        challenge.completed = true;
        updateCoins(challenge.reward);
        return challengeId;
      }
      return null;
    },
    onSuccess: (challengeId) => {
      if (challengeId) {
        const updatedChallenges = dailyChallenges.map(c => 
          c.id === challengeId ? {...c, completed: true} : c
        );
        setDailyChallenges(updatedChallenges);
        queryClient.invalidateQueries({ queryKey: ['coins'] });
      }
    }
  });

  // Mutação para desbloquear conquistas
  const unlockAchievementMutation = useMutation({
    mutationFn: (achievementId: string) => {
      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        updateCoins(achievement.rewardCoins);
        return achievementId;
      }
      return null;
    },
    onSuccess: (achievementId) => {
      if (achievementId) {
        const updatedAchievements = achievements.map(a => 
          a.id === achievementId ? {...a, unlocked: true} : a
        );
        setAchievements(updatedAchievements);
        queryClient.invalidateQueries({ queryKey: ['coins'] });
      }
    }
  });

  const earnCoins = (amount: number, reason: string) => {
    updateCoinsMutation.mutate(amount);
    setShowAnimation(true);
    
    // Selecionar uma frase motivacional aleatória
    const randomPhrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
    
    toast({
      title: `+${amount} FiveCoins!`,
      description: `${reason} ${randomPhrase}`,
      duration: 3000,
    });
    setTimeout(() => setShowAnimation(false), 1000);
    
    // Registrar tempo de uso para metas diárias
    updateTimeSpent(30); // 30 segundos por interação
    
    // Verificar conquistas após ganhar moedas
    checkAchievements();
  };

  const spendCoins = (amount: number, item: string, rewardId: string) => {
    if (currentCoins >= amount) {
      purchaseRewardMutation.mutate({ rewardId, cost: amount });
      toast({
        title: 'Recompensa desbloqueada!',
        description: `Você comprou: ${item}`,
        duration: 3000,
      });
      
      // Mostrar detalhes da recompensa
      setSelectedReward(rewardId);
      setTimeout(() => setSelectedReward(null), 5000);
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
    
    // Verificar se alguma conquista deve ser desbloqueada
    checkAchievements();
  };
  
  const completeChallenge = (challengeId: string) => {
    completeDailyChallengeMutation.mutate(challengeId);
    toast({
      title: 'Desafio concluído!',
      description: 'Você ganhou FiveCoins como recompensa',
      duration: 3000,
    });
  };
  
  const checkAchievements = () => {
    // Lógica para verificar conquistas baseadas nas atividades do usuário
    // Esta é uma função simulada que seria chamada após ações relevantes
    const completedTasks = tasks.filter(t => t.completed).length;
    
    // Exemplo: desbloquear conquista baseada no número de tarefas completadas
    if (completedTasks >= 5) {
      const achievement = achievements.find(a => a.id === 'achievement_10_phrases' && !a.unlocked);
      if (achievement) {
        unlockAchievementMutation.mutate(achievement.id);
        toast({
          title: 'Nova Conquista!',
          description: `Você desbloqueou: ${achievement.name}`,
          duration: 5000,
        });
      }
    }
  };

  // Obter informações de nível do usuário
  const userLevel = Math.floor(currentCoins / 100) + 1;
  const levelProgress = (currentCoins % 100) / 100;
  const nextLevelCoins = 100 - (currentCoins % 100);
  
  // Selecionar uma dica aleatória para exibir
  const [currentTip, setCurrentTip] = useState('');
  
  useEffect(() => {
    // Atualizar a dica a cada 60 segundos
    const randomTip = usefulTips[Math.floor(Math.random() * usefulTips.length)];
    setCurrentTip(randomTip);
    
    const tipInterval = setInterval(() => {
      const newTip = usefulTips[Math.floor(Math.random() * usefulTips.length)];
      setCurrentTip(newTip);
    }, 60000);
    
    return () => clearInterval(tipInterval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Coin Display - Melhorado com mais informações */}
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
            <div className="flex flex-col items-end">
              <p className="text-xs text-slate-500">Ganhe moedas completando tarefas!</p>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700 mr-1">
                  <Star className="w-3 h-3 mr-1" /> Nível {userLevel}
                </Badge>
                <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                  <Trophy className="w-3 h-3 mr-1" /> {achievements.filter(a => a.unlocked).length} Conquistas
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* Barra de progresso de nível */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Nível {userLevel}</span>
            <span>Próximo nível: {nextLevelCoins} moedas</span>
          </div>
          <Progress 
            value={Math.round(levelProgress * 100)} 
            className="h-2 bg-slate-200"
          />
        </div>
        
        {/* Dica útil */}
        <div className="mt-3 p-2 bg-blue-50 rounded-md border border-blue-100">
          <p className="text-xs text-slate-700 flex items-start">
            <Sparkles className="w-3 h-3 text-blue-500 mr-1 flex-shrink-0 mt-0.5" />
            <span>{currentTip}</span>
          </p>
        </div>
      </Card>

      {/* Sistema de abas para organizar o conteúdo */}
      <Tabs defaultValue="tarefas" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="tarefas" className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" /> Tarefas
          </TabsTrigger>
          <TabsTrigger value="metas" className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" /> Metas
          </TabsTrigger>
          <TabsTrigger value="desafios" className="flex items-center">
            <Target className="w-4 h-4 mr-1" /> Desafios
          </TabsTrigger>
          <TabsTrigger value="conquistas" className="flex items-center">
            <Medal className="w-4 h-4 mr-1" /> Conquistas
          </TabsTrigger>
          <TabsTrigger value="loja" className="flex items-center">
            <Gift className="w-4 h-4 mr-1" /> Loja
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo da aba Tarefas */}
        <TabsContent value="tarefas" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-slate-700 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Tarefas
            </h4>
            <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
              {tasks.filter(t => t.completed).length}/{tasks.length} Concluídas
            </Badge>
          </div>
          
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
                    {task.completed && task.dateCompleted && (
                      <p className="text-xs text-green-600 mt-1">
                        Concluída em: {new Date(task.dateCompleted).toLocaleDateString()}
                      </p>
                    )}
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
            
            {/* Botão para ganhar moedas extras */}
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-medium text-slate-700 flex items-center">
                    <Zap className="w-4 h-4 mr-1 text-blue-600" />
                    Tarefa Bônus
                  </h5>
                  <p className="text-sm text-slate-500 mt-1">
                    Use o app por 5 minutos seguidos para ganhar moedas extras!
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  onClick={() => earnCoins(5, "Bônus de uso contínuo!")}
                >
                  <span className="flex items-center">
                    <Coins className="w-4 h-4 mr-1" />
                    +5
                  </span>
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Conteúdo da aba Metas Diárias */}
        <TabsContent value="metas" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-slate-700 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Metas Diárias
            </h4>
            <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
              {dailyGoals.filter(g => g.completed).length}/{dailyGoals.length} Concluídas
            </Badge>
          </div>
          
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
            
            {/* Dica para metas diárias */}
            <Card className="p-3 bg-yellow-50 border-yellow-200">
              <div className="flex items-start">
                <Sparkles className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700">
                  As metas diárias são redefinidas todos os dias. Complete-as regularmente para ganhar bônus por dias consecutivos!
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        {/* Conteúdo da aba Desafios */}
        <TabsContent value="desafios" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-slate-700 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              Desafios Diários
            </h4>
            <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
              {dailyChallenges.filter(c => c.completed).length}/{dailyChallenges.length} Concluídos
            </Badge>
          </div>
          
          <div className="space-y-3">
            {dailyChallenges.map((challenge) => (
              <Card key={challenge.id} className={`p-4 ${challenge.completed ? 'bg-purple-50' : 'bg-white'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <challenge.icon className="w-5 h-5 mr-2 text-purple-600" />
                      <h5 className="font-medium text-slate-700 flex items-center">
                        {challenge.name}
                        <Badge className="ml-2 text-xs" variant="outline" 
                          style={{
                            backgroundColor: challenge.difficulty === 'fácil' ? '#e6f7e6' : 
                                           challenge.difficulty === 'médio' ? '#fff4e5' : '#fde8e8',
                            borderColor: challenge.difficulty === 'fácil' ? '#a3e0a3' : 
                                       challenge.difficulty === 'médio' ? '#ffd699' : '#f8b4b4',
                            color: challenge.difficulty === 'fácil' ? '#2c7a2c' : 
                                 challenge.difficulty === 'médio' ? '#b35900' : '#b91c1c'
                          }}>
                          {challenge.difficulty}
                        </Badge>
                      </h5>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{challenge.description}</p>
                  </div>
                  <Button
                    size="sm"
                    className={`${
                      challenge.completed
                        ? 'bg-purple-500 hover:bg-purple-600 cursor-default'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                    } text-white`}
                    onClick={() => !challenge.completed && completeChallenge(challenge.id)}
                    disabled={challenge.completed}
                  >
                    {challenge.completed ? (
                      <span className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Concluído
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Coins className="w-4 h-4 mr-1" />
                        {challenge.reward}
                      </span>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Conteúdo da aba Conquistas */}
        <TabsContent value="conquistas" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-slate-700 flex items-center">
              <Medal className="w-5 h-5 mr-2 text-amber-600" />
              Conquistas
            </h4>
            <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
              {achievements.filter(a => a.unlocked).length}/{achievements.length} Desbloqueadas
            </Badge>
          </div>
          
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`p-4 ${achievement.unlocked 
                  ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200' 
                  : 'bg-slate-50 border-slate-200'}`}
              >
                <div className="flex items-start">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-amber-400 to-yellow-500' 
                      : 'bg-slate-200'
                  }`}>
                    <achievement.icon className={`w-5 h-5 ${
                      achievement.unlocked ? 'text-white' : 'text-slate-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-slate-700">{achievement.name}</h5>
                      {achievement.unlocked ? (
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                          <Coins className="w-3 h-3 mr-1" /> +{achievement.rewardCoins}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-300">
                          Bloqueado
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{achievement.description}</p>
                    
                    {achievement.progress && !achievement.unlocked && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Progresso: {achievement.progress.current}/{achievement.progress.target}</span>
                          <span>{Math.round((achievement.progress.current / achievement.progress.target) * 100)}%</span>
                        </div>
                        <Progress 
                          value={Math.round((achievement.progress.current / achievement.progress.target) * 100)} 
                          className="h-1.5 bg-slate-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Conteúdo da aba Loja */}
        <TabsContent value="loja" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-slate-700 flex items-center">
              <Gift className="w-5 h-5 mr-2 text-purple-600" />
              Loja de Recompensas
            </h4>
            <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
              {purchasedRewards.length} Itens adquiridos
            </Badge>
          </div>
          
          {/* Categorias de recompensas */}
          <div className="flex overflow-x-auto pb-2 space-x-2">
            {rewardCategories.map(category => (
              <Button 
                key={category.id}
                variant="outline"
                size="sm"
                className={`flex items-center whitespace-nowrap ${
                  rewards.filter(r => r.category === category.id).some(r => purchasedRewards.includes(r.id))
                    ? 'border-green-300 bg-green-50 text-green-700'
                    : 'border-slate-200'
                }`}
                onClick={() => {
                  const rewardsInCategory = rewards.filter(r => r.category === category.id);
                  if (rewardsInCategory.length > 0) {
                    const element = document.getElementById(`reward-${rewardsInCategory[0].id}`);
                    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
              >
                <category.icon className="w-4 h-4 mr-1" />
                {category.name}
              </Button>
            ))}
          </div>
          
          <div className="space-y-4">
            {/* Agrupar recompensas por categoria */}
            {rewardCategories.map(category => {
              const categoryRewards = rewards.filter(r => r.category === category.id);
              if (categoryRewards.length === 0) return null;
              
              return (
                <div key={category.id} className="space-y-3">
                  <h5 className="font-medium text-slate-700 flex items-center border-b pb-2">
                    <category.icon className="w-4 h-4 mr-1 text-purple-600" />
                    {category.name}
                  </h5>
                  
                  {categoryRewards.map((reward) => {
                    const isPurchased = purchasedRewards.includes(reward.id);
                    const isSelected = selectedReward === reward.id;
                    
                    return (
                      <Card 
                        key={reward.id} 
                        id={`reward-${reward.id}`}
                        className={`p-4 transition-all duration-300 ${
                          isPurchased 
                            ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' 
                            : isSelected
                              ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-md'
                              : 'bg-gradient-to-r from-slate-50 to-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isPurchased 
                                ? 'bg-gradient-to-br from-green-400 to-green-600' 
                                : 'bg-gradient-to-br from-purple-400 to-purple-600'
                            }`}>
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
                        
                        {/* Detalhes extras quando selecionado */}
                        {isSelected && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-md text-sm text-blue-700 animate-pulse">
                            <p className="flex items-center">
                              <Sparkles className="w-4 h-4 mr-1" />
                              Recompensa desbloqueada! Acesse nas configurações para ativar.
                            </p>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              );
            })}
          </div>
          
          {/* Dica para economizar moedas */}
          <Card className="p-3 bg-blue-50 border-blue-200">
            <div className="flex items-start">
              <Sparkles className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700">
                Complete tarefas diárias e desafios para ganhar mais FiveCoins! Quanto mais dias consecutivos você usar o app, maiores serão os bônus.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
// Frases motivacionais para exibir quando o usuário ganha moedas
export const motivationalPhrases = [
  "Ótimo trabalho! Continue assim!",
  "Você está indo muito bem!",
  "Parabéns pelo seu progresso!",
  "Cada símbolo é um passo à frente!",
  "Sua dedicação está fazendo a diferença!",
  "Continue praticando, você está melhorando!",
  "Excelente! Você está dominando a comunicação!",
  "Que progresso incrível você está fazendo!",
  "Sua persistência está dando resultados!",
  "Você está superando seus limites!",
  "Cada conquista merece ser celebrada!",
  "Você está construindo habilidades importantes!",
  "Seu esforço está valendo a pena!",
  "Continue explorando novas possibilidades!",
  "Você está criando conexões valiosas!",
  "Sua jornada de comunicação está florescendo!",
  "Cada dia traz novas oportunidades de aprendizado!",
  "Você está no caminho certo para o sucesso!",
  "Sua evolução é notável!",
  "Celebre cada pequena vitória!"
];

// Dicas úteis para o usuário
export const usefulTips = [
  "Experimente criar frases curtas e diretas para comunicação mais eficiente.",
  "Salve suas frases mais usadas como favoritas para acesso rápido.",
  "Complete tarefas diárias para ganhar mais FiveCoins!",
  "Personalize seus símbolos para torná-los mais significativos para você.",
  "Use categorias para organizar seus símbolos e encontrá-los mais facilmente.",
  "Pratique regularmente para melhorar suas habilidades de comunicação.",
  "Compartilhe suas frases com pessoas próximas para facilitar a comunicação.",
  "Experimente diferentes combinações de símbolos para expressar ideias complexas.",
  "Mantenha uma rotina diária de uso para ganhar bônus por dias consecutivos.",
  "Verifique suas conquistas para descobrir novas metas a alcançar.",
  "Use o sistema de níveis para acompanhar seu progresso geral.",
  "Combine símbolos de diferentes categorias para criar frases mais expressivas.",
  "Complete desafios diários para ganhar recompensas extras!",
  "Invista suas FiveCoins em recompensas que melhoram sua experiência.",
  "Explore todas as categorias para descobrir novos símbolos úteis."
];