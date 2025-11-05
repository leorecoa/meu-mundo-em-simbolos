import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { PlusCircle, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { db, Category, Symbol as DbSymbol } from '@/lib/db';
import { useProfile } from '@/contexts/ProfileContext';

export const SymbolsTab = () => {
  const [symbolName, setSymbolName] = useState('');
  const [symbolCategory, setSymbolCategory] = useState('');
  const [symbolImage, setSymbolImage] = useState<Blob | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { activeProfileId } = useProfile();

  // Buscar categorias do perfil ativo
  const categories = useLiveQuery(() => 
    activeProfileId ? db.categories.where({ profileId: activeProfileId }).toArray() : [],
    [activeProfileId]
  );

  // Buscar símbolos personalizados
  const customSymbols = useLiveQuery(() => 
    activeProfileId ? db.symbols.where({ profileId: activeProfileId }).toArray() : [],
    [activeProfileId]
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSymbolImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSymbol = async () => {
    if (!symbolName.trim() || !symbolCategory || !activeProfileId) {
      toast({ title: "Nome e categoria são obrigatórios" });
      return;
    }

    try {
      // Obter próximo order
      const existingSymbols = await db.symbols.where({ profileId: activeProfileId, categoryKey: symbolCategory }).toArray();
      const nextOrder = existingSymbols.length > 0 ? Math.max(...existingSymbols.map(s => s.order)) + 1 : 1;
      
      await db.symbols.add({
        text: symbolName.toUpperCase(),
        categoryKey: symbolCategory,
        profileId: activeProfileId,
        order: nextOrder,
        image: symbolImage || undefined
      });
      
      setSymbolName('');
      setSymbolImage(null);
      setImagePreview(null);
      toast({ title: "Símbolo salvo com sucesso!" });
    } catch (error) {
      console.error('Erro ao salvar símbolo:', error);
      toast({ title: "Erro ao salvar símbolo" });
    }
  };

  const handleDeleteSymbol = async (symbolId: number | undefined) => {
    if (!symbolId) return;
    
    try {
      await db.symbols.delete(symbolId);
      toast({ title: "Símbolo excluído." });
    } catch (error) {
      console.error('Erro ao excluir símbolo:', error);
      toast({ title: "Erro ao excluir símbolo" });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Adicionar Símbolo</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Input 
            placeholder="Nome do símbolo" 
            value={symbolName} 
            onChange={(e) => setSymbolName(e.target.value)} 
          />
          <select 
            className="w-full p-2 border rounded-md" 
            value={symbolCategory} 
            onChange={(e) => setSymbolCategory(e.target.value)}
          >
            <option value="">Selecione uma categoria</option>
            {categories?.map(cat => (
              <option key={cat.id} value={cat.key}>{cat.name}</option>
            ))} 
          </select>
        </div>
        <Card className="flex flex-col items-center justify-center border-2 border-dashed p-6 mb-6">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-lg mb-4" />
          ) : (
            <ImageIcon className="h-16 w-16 text-gray-300 mb-2" />
          )}
          <input 
            type="file" 
            id="imageUpload" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="hidden" 
          />
          <Button asChild variant="outline">
            <label htmlFor="imageUpload" className="cursor-pointer">
              Escolher Imagem
            </label>
          </Button>
        </Card>
        <Button className="w-full" onClick={handleAddSymbol}>
          <PlusCircle className="mr-2"/> Salvar Símbolo
        </Button>
      </Card>
      
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Meus Símbolos</h2>
        {!customSymbols ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {customSymbols.map((item) => (
              <div key={item.id} className="border rounded-lg p-2 flex flex-col items-center text-center">
                <div className="h-20 w-20 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                  {item.image ? (
                    <img 
                      src={typeof item.image === 'string' ? item.image : URL.createObjectURL(item.image)} 
                      alt={item.text} 
                      className="h-16 w-16 object-cover rounded" 
                    />
                  ) : (
                    <span className="text-2xl">{item.text.charAt(0)}</span>
                  )}
                </div>
                <p className="text-sm font-medium break-all">{item.text}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 mt-1" 
                  onClick={() => handleDeleteSymbol(item.id)}
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
