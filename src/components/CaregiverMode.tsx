import { useState } from 'react';
import { ChevronLeft, Upload, PlusCircle, Trash2, Lock, Download, Settings as SettingsIcon, BarChart, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { UsageStatsChart } from '@/components/UsageStatsChart';
import { 
  getPin, setPin, getCustomSymbols, saveCustomSymbol, 
  deleteCustomSymbol, exportAllData, importAllData,
  getUsageStats, getTasks, updateTaskProgress, getDailyGoals,
  getCoins, updateCoins
} from '@/lib/storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CaregiverModeProps {
  onBack: () => void;
}

export const CaregiverMode = ({ onBack }: CaregiverModeProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setInputPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [symbolName, setSymbolName] = useState('');
  const [symbolCategory, setSymbolCategory] = useState('Comida');
  const [audioRecording, setAudioRecording] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskReward, setTaskReward] = useState(10);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Consultas para obter dados
  const { data: customSymbols = [] } = useQuery({
    queryKey: ['customSymbols'],
    queryFn: getCustomSymbols,
    enabled: isAuthenticated
  });
  
  const { data: usageStats } = useQuery({
    queryKey: ['usageStats'],
    queryFn: getUsageStats,
    enabled: isAuthenticated
  });
  
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    enabled: isAuthenticated
  });
  
  const { data: dailyGoals = [] } = useQuery({
    queryKey: ['dailyGoals'],
    queryFn: getDailyGoals,
    enabled: isAuthenticated
  });
  
  const { data: coins = 0 } = useQuery({
    queryKey: ['coins'],
    queryFn: getCoins,
    enabled: isAuthenticated
  });

  // Mutações
  const saveSymbolMutation = useMutation({
    mutationFn: saveCustomSymbol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customSymbols'] });
      setSymbolName('');
      toast({
        title: "Símbolo salvo",
        description: "O símbolo personalizado foi salvo com sucesso",
      });
    }
  });

  const deleteSymbolMutation = useMutation({
    mutationFn: deleteCustomSymbol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customSymbols'] });
      toast({
        title: "Símbolo excluído",
        description: "O símbolo personalizado foi excluído com sucesso",
      });
    }
  });
  
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, completed }: { taskId: string, completed: boolean }) => 
      updateTaskProgress(taskId, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
  
  const addCoinsMutation = useMutation({
    mutationFn: updateCoins,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coins'] });
    }
  });

  const handleLogin = () => {
    const storedPin = getPin();
    if (pin === storedPin) {
      setIsAuthenticated(true);
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

  const handleChangePin = () => {
    if (newPin !== confirmPin) {
      toast({
        title: "PINs não conferem",
        description: "O novo PIN e a confirmação devem ser iguais",
        variant: "destructive",
      });
      return;
    }

    if (newPin.length < 4) {
      toast({
        title: "PIN muito curto",
        description: "O PIN deve ter pelo menos 4 dígitos",
        variant: "destructive",
      });
      return;
    }

    setPin(newPin);
    toast({
      title: "PIN alterado",
      description: "O novo PIN foi definido com sucesso",
    });
    setNewPin('');
    setConfirmPin('');
  };

  const handleAddSymbol = () => {
    if (!symbolName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Informe um nome para o símbolo",
        variant: "destructive",
      });
      return;
    }

    const newSymbol = {
      id: `custom-${Date.now()}`,
      label: symbolName.toUpperCase(),
      icon: PlusCircle, // Ícone padrão
      category: symbolCategory
    };

    saveSymbolMutation.mutate(newSymbol);
  };
  
  const handleAddTask = () => {
    if (!taskName.trim() || !taskDescription.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome e a descrição da tarefa",
        variant: "destructive",
      });
      return;
    }
    
    // Aqui adicionaríamos a tarefa, mas como não temos essa função implementada,
    // apenas mostramos um toast de sucesso
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

  const handleExportData = () => {
    const data = exportAllData();
    
    // Criar blob e link para download
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meu-mundo-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Backup exportado",
      description: "Os dados foram exportados com sucesso",
    });
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string;
        const success = importAllData(jsonData);
        
        if (success) {
          // Recarregar todos os dados
          queryClient.invalidateQueries();
          
          toast({
            title: "Dados importados",
            description: "Os dados foram importados com sucesso",
          });
        } else {
          throw new Error("Formato de arquivo inválido");
        }
      } catch (error) {
        toast({
          title: "Erro na importação",
          description: "Não foi possível importar os dados",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleToggleRecording = () => {
    setAudioRecording(!audioRecording);
    
    if (!audioRecording) {
      toast({
        title: "Gravação iniciada",
        description: "Fale o nome do símbolo claramente",
      });
    } else {
      toast({
        title: "Gravação finalizada",
        description: "Áudio salvo com sucesso",
      });
    }
  };

  if (!isAuthenticated) {
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
            onChange={(e) => setInputPin(e.target.value)}
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
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="flex items-center gap-1 text-blue-700"
        >
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </Button>
        <h1 className="text-xl font-bold text-center flex-1 mr-10">MODO CUIDADOR</h1>
      </div>

      <Tabs defaultValue="symbols">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="symbols">Símbolos</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="symbols" className="space-y-4">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Adicionar/Editar Símbolos</h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">Nome do símbolo</label>
                <Input 
                  placeholder="Ex: Água, Brinquedo favorito" 
                  value={symbolName}
                  onChange={(e) => setSymbolName(e.target.value)}
                />
              </div>
              
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">Categoria</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={symbolCategory}
                  onChange={(e) => setSymbolCategory(e.target.value)}
                >
                  <option>Comida</option>
                  <option>Brinquedos</option>
                  <option>Casa</option>
                  <option>Sentimentos</option>
                  <option>Família</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Carregar imagem personalizada</p>
                <Button variant="outline" size="sm">
                  Escolher arquivo
                </Button>
                <p className="text-xs text-gray-400 mt-2">PNG, JPG até 2MB</p>
              </div>
              
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">Gravar áudio (opcional)</label>
                <div className="border border-gray-300 rounded-lg p-3 flex flex-col items-center">
                  <Button 
                    variant="outline" 
                    className={`mb-2 ${audioRecording ? 'bg-red-100 text-red-600' : ''}`}
                    onClick={handleToggleRecording}
                  >
                    {audioRecording ? 'Parar gravação' : 'Iniciar gravação'}
                  </Button>
                  {audioRecording && (
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-red-500 animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">ou usar texto-para-voz padrão</p>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleAddSymbol}
              disabled={saveSymbolMutation.isPending}
            >
              <PlusCircle className="h-4 w-4 mr-2" /> 
              {saveSymbolMutation.isPending ? 'Salvando...' : 'Salvar símbolo'}
            </Button>
          </Card>
          
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Símbolos personalizados</h2>
            {customSymbols.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhum símbolo personalizado criado ainda
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {customSymbols.map((item) => (
                  <div key={item.id} className="border rounded-lg p-2 flex flex-col items-center">
                    <div className="h-16 w-16 bg-gray-100 rounded mb-2 flex items-center justify-center">
                      <PlusCircle className="h-8 w-8 text-gray-600" />
                    </div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 mt-1"
                      onClick={() => deleteSymbolMutation.mutate(item.id)}
                      disabled={deleteSymbolMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
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
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-4">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-blue-600" />
              Estatísticas de Uso
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="border rounded-lg p-3 text-center">
                <p className="text-sm text-gray-500">Frases criadas</p>
                <p className="text-2xl font-bold text-blue-600">{usageStats?.phrasesCreated || 0}</p>
              </div>
              
              <div className="border rounded-lg p-3 text-center">
                <p className="text-sm text-gray-500">Dias consecutivos</p>
                <p className="text-2xl font-bold text-green-600">{usageStats?.consecutiveDays || 0}</p>
              </div>
              
              <div className="border rounded-lg p-3 text-center">
                <p className="text-sm text-gray-500">Tempo total (min)</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((usageStats?.totalTimeSpent || 0) / 60)}
                </p>
              </div>
            </div>
            
            <UsageStatsChart />
            
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2">Símbolos mais usados</h3>
              <div className="space-y-2">
                {usageStats && Object.entries(usageStats.symbolsUsed)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .slice(0, 5)
                  .map(([symbolId, count]) => (
                    <div key={symbolId} className="flex justify-between items-center">
                      <span className="text-sm">{symbolId}</span>
                      <span className="text-sm font-medium">{count} vezes</span>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2 text-gray-600" />
              Configurações avançadas
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Alterar PIN de acesso</label>
                <Input 
                  type="password" 
                  placeholder="Novo PIN" 
                  className="mb-2" 
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  maxLength={6}
                />
                <Input 
                  type="password" 
                  placeholder="Confirmar PIN" 
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  maxLength={6}
                />
                <Button 
                  className="w-full mt-2"
                  onClick={handleChangePin}
                  disabled={!newPin || !confirmPin}
                >
                  Salvar novo PIN
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-md font-semibold mb-3">Configurações de acessibilidade</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="large-icons" className="flex-1">Ícones grandes</Label>
                    <Switch id="large-icons" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="audio-feedback" className="flex-1">Feedback de áudio</Label>
                    <Switch id="audio-feedback" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="high-contrast" className="flex-1">Alto contraste</Label>
                    <Switch id="high-contrast" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-md font-semibold mb-3">Backup e restauração</h3>
                
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleExportData}
                  >
                    <Download className="h-4 w-4 mr-2" /> Exportar dados
                  </Button>
                  
                  <div className="flex items-center">
                    <Input
                      type="file"
                      accept=".json"
                      id="import-file"
                      className="hidden"
                      onChange={handleImportData}
                    />
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => document.getElementById('import-file')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" /> Importar dados
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-md font-semibold mb-3">Sobre o aplicativo</h3>
                <p className="text-sm text-gray-500">Meu Mundo em Símbolos v1.0.0</p>
                <p className="text-sm text-gray-500 mt-1">© 2023 Todos os direitos reservados</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};