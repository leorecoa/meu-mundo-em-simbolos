import { useState, useEffect } from 'react';
import { Upload, PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getCustomSymbols, addCustomSymbol, deleteSymbol, getCategories } from '@/lib/storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Category } from '@/db';
import { DynamicIcon } from '@/components/IconMap';

export const SymbolsTab = () => {
  const [symbolName, setSymbolName] = useState('');
  const [symbolCategory, setSymbolCategory] = useState<number | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Busca as categorias para o seletor
  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
      if (cats.length > 0) {
        setSymbolCategory(cats[0].id); // Define a primeira como padrão
      }
    };
    fetchCategories();
  }, []);

  const { data: customSymbols = [], isLoading } = useQuery({
    queryKey: ['customSymbols'],
    queryFn: getCustomSymbols
  });

  const addSymbolMutation = useMutation({
    mutationFn: (newSymbol: { name: string; imageUrl: string; categoryId: number }) => 
      addCustomSymbol(newSymbol.name, newSymbol.imageUrl, newSymbol.categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customSymbols'] });
      setSymbolName('');
      toast({ title: "Símbolo salvo", description: "O novo símbolo foi adicionado." });
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível salvar o símbolo.", variant: "destructive" });
    }
  });

  const deleteSymbolMutation = useMutation({
    mutationFn: (symbolId: number) => deleteSymbol(symbolId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customSymbols'] });
      toast({ title: "Símbolo excluído" });
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível excluir o símbolo.", variant: "destructive" });
    }
  });

  const handleAddSymbol = () => {
    if (!symbolName.trim() || symbolCategory === undefined) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e categoria do símbolo são necessários.",
        variant: "destructive",
      });
      return;
    }

    // Por enquanto, a imagem é um ícone padrão
    addSymbolMutation.mutate({ 
      name: symbolName.toUpperCase(), 
      imageUrl: 'PlusCircle', // Usar um ícone padrão ou implementar upload
      categoryId: symbolCategory 
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Adicionar Símbolo Personalizado</h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">Nome do símbolo</label>
            <Input 
              placeholder="Ex: Minha Bola Azul" 
              value={symbolName}
              onChange={(e) => setSymbolName(e.target.value)}
            />
          </div>
          
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">Categoria</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={symbolCategory}
              onChange={(e) => setSymbolCategory(Number(e.target.value))}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">Carregar imagem</p>
            <Button variant="outline" size="sm">Escolher arquivo</Button>
            <p className="text-xs text-gray-400 mt-2">Funcionalidade em desenvolvimento</p>
          </div>
        </div>
        
        <Button 
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={handleAddSymbol}
          disabled={addSymbolMutation.isPending}
        >
          <PlusCircle className="h-4 w-4 mr-2" /> 
          {addSymbolMutation.isPending ? 'Salvando...' : 'Salvar Símbolo'}
        </Button>
      </Card>
      
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Meus Símbolos</h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : customSymbols.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum símbolo personalizado criado.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {customSymbols.map((item) => (
              <div key={item.id} className="border rounded-lg p-2 flex flex-col items-center">
                <div className="h-16 w-16 bg-gray-100 rounded mb-2 flex items-center justify-center">
                  <DynamicIcon name={item.imageUrl} className="h-8 w-8 text-gray-600" />
                </div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {categories.find(c => c.id === item.categoryId)?.name || 'Geral'}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700 mt-1"
                  onClick={() => item.id && deleteSymbolMutation.mutate(item.id)}
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
