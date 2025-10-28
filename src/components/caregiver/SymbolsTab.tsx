import { useState, useEffect } from 'react';
import { Upload, PlusCircle, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
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
  const [symbolImage, setSymbolImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
      if (cats.length > 0) setSymbolCategory(cats[0].id);
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
      setSymbolImage(null);
      toast({ title: "Símbolo salvo com sucesso!" });
    }
  });

  const deleteSymbolMutation = useMutation({
    mutationFn: (symbolId: number) => deleteSymbol(symbolId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customSymbols'] });
      toast({ title: "Símbolo excluído." });
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSymbolImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSymbol = () => {
    if (!symbolName.trim() || symbolCategory === undefined) {
      toast({ title: "Nome e categoria são obrigatórios", variant: 'destructive' });
      return;
    }

    addSymbolMutation.mutate({ 
      name: symbolName.toUpperCase(), 
      imageUrl: symbolImage || 'PlusCircle', // Usa a imagem ou um ícone padrão
      categoryId: symbolCategory 
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Adicionar Símbolo</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Input placeholder="Nome do símbolo" value={symbolName} onChange={(e) => setSymbolName(e.target.value)} />
          <select className="w-full p-2 border rounded-md" value={symbolCategory} onChange={(e) => setSymbolCategory(Number(e.target.value))}>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)} 
          </select>
        </div>
        <Card className="flex flex-col items-center justify-center border-2 border-dashed p-6 mb-6">
          {symbolImage ? (
            <img src={symbolImage} alt="Preview" className="h-24 w-24 object-cover rounded-lg mb-4" />
          ) : (
            <ImageIcon className="h-16 w-16 text-gray-300 mb-2" />
          )}
          <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <label htmlFor="imageUpload" className="cursor-pointer">
            <Button as="span" variant="outline">Escolher Imagem</Button>
          </label>
        </Card>
        <Button className="w-full" onClick={handleAddSymbol} disabled={addSymbolMutation.isPending}>
          {addSymbolMutation.isPending ? <Loader2 className="animate-spin"/> : <PlusCircle className="mr-2"/>} Salvar Símbolo
        </Button>
      </Card>
      
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Meus Símbolos</h2>
        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {customSymbols.map((item) => (
              <div key={item.id} className="border rounded-lg p-2 flex flex-col items-center text-center">
                <div className="h-20 w-20 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                  <DynamicIcon name={item.imageUrl} className="h-16 w-16 text-gray-600 object-cover" />
                </div>
                <p className="text-sm font-medium break-all">{item.name}</p>
                <Button variant="ghost" size="sm" className="text-red-500 mt-1" onClick={() => item.id && deleteSymbolMutation.mutate(item.id)}>
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
