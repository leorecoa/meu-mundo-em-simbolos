
import { useState } from 'react';
import { Upload, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getCustomSymbols, saveCustomSymbol, deleteCustomSymbol } from '@/lib/storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const SymbolsTab = () => {
  const [symbolName, setSymbolName] = useState('');
  const [symbolCategory, setSymbolCategory] = useState('Comida');
  const [audioRecording, setAudioRecording] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: customSymbols = [] } = useQuery({
    queryKey: ['customSymbols'],
    queryFn: getCustomSymbols
  });

  const saveSymbolMutation = useMutation({
    mutationFn: async (symbolData: any) => {
      return await saveCustomSymbol(symbolData);
    },
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
    mutationFn: async (symbolId: string) => {
      return await deleteCustomSymbol(symbolId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customSymbols'] });
      toast({
        title: "Símbolo excluído",
        description: "O símbolo personalizado foi excluído com sucesso",
      });
    }
  });

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
      icon: PlusCircle,
      category: symbolCategory
    };

    saveSymbolMutation.mutate(newSymbol);
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

  return (
    <div className="space-y-4">
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
                <p className="text-xs text-gray-500">Geral</p>
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
    </div>
  );
};
