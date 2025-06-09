import { useState } from 'react';
import { ChevronLeft, Upload, PlusCircle, Trash2, Lock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { UsageStatsChart } from '@/components/UsageStatsChart';
import { 
  getPin, setPin, getCustomSymbols, saveCustomSymbol, 
  deleteCustomSymbol, exportAllData, importAllData 
} from '@/lib/storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Consulta para obter símbolos personalizados
  const { data: customSymbols = [] } = useQuery({
    queryKey: ['customSymbols'],
    queryFn: getCustomSymbols,
    enabled: isAuthenticated
  });

  // Mutação para salvar símbolo personalizado
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

  // Mutação para excluir símbolo personalizado
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
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="symbols">Símbolos</TabsTrigger>
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
                  <Button variant="outline" className="mb-2">
                    Iniciar gravação
                  </Button>
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
        
        <TabsContent value="stats" className="space-y-4">
          <UsageStatsChart />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Configurações avançadas</h2>
            
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
              
              <div className="pt-2">
                <label className="block mb-1 text-sm font-medium">Fazer backup dos dados</label>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleExportData}
                >
                  <Download className="h-4 w-4 mr-2" /> Exportar dados
                </Button>
              </div>
              
              <div className="pt-2">
                <label className="block mb-1 text-sm font-medium">Restaurar backup</label>
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
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};