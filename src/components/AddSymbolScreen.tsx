import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Camera, Image as ImageIcon, Award } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { useToast } from '@/hooks/use-toast';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';

interface AddSymbolScreenProps {
  onBack: () => void;
}

export const AddSymbolScreen = ({ onBack }: AddSymbolScreenProps) => {
  const { activeProfileId } = useProfile();
  const { toast } = useToast();
  const [symbolText, setSymbolText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const categories = useLiveQuery(() => 
    activeProfileId ? db.categories.where({ profileId: activeProfileId }).toArray() : []
  , [activeProfileId]);

  const handleImageSelected = (blob: Blob) => {
    setImageBlob(blob);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(blob));
  };

  const selectImage = async (source: CameraSource) => {
    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: source,
      });

      if (image.webPath) {
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        handleImageSelected(blob);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      toast({ title: 'Erro ao selecionar imagem', description: 'Não foi possível carregar a imagem. Verifique as permissões do app.', variant: 'destructive' });
    }
  };
  
  const checkAndAwardAchievement = async () => {
    const achievementId = 'achievement_custom_symbol';
    try {
      const achievement = await db.achievements.get(achievementId);
      if (achievement && !achievement.unlocked) {
        await db.achievements.update(achievementId, { unlocked: true });
        await db.coins.where('id').equals(1).modify(c => { c.total += achievement.reward; });
        
        toast({
          title: 'Conquista Desbloqueada!',
          description: `${achievement.name} (+${achievement.reward} moedas)`,
          action: <Award className="h-5 w-5 text-yellow-500" />
        });
      }
    } catch (error) {
      console.error("Failed to award achievement:", error);
    }
  };

  const handleSave = async () => {
    if (!activeProfileId || !symbolText || !selectedCategory || !imageBlob) {
      toast({ title: 'Erro', description: 'Por favor, preencha todos os campos e selecione uma imagem.', variant: 'destructive' });
      return;
    }

    try {
      const maxOrderSymbol = await db.symbols.where({ profileId: activeProfileId, categoryKey: selectedCategory }).reverse().sortBy('order');
      const newOrder = maxOrderSymbol.length > 0 ? maxOrderSymbol[0].order + 1 : 1;

      await db.symbols.add({
        profileId: activeProfileId,
        text: symbolText,
        categoryKey: selectedCategory,
        image: imageBlob,
        order: newOrder,
      });
      
      await checkAndAwardAchievement(); // Checa e concede a conquista

      toast({ title: 'Sucesso!', description: `Símbolo "${symbolText}" adicionado com sucesso.` });
      onBack(); // Go back after saving
    } catch (error) {
      console.error('Failed to save custom symbol:', error);
      toast({ title: 'Erro no Banco de Dados', description: 'Não foi possível salvar o símbolo.', variant: 'destructive' });
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <header className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1"><ChevronLeft className="h-5 w-5" />Voltar</Button>
        <h1 className="text-xl font-bold">Adicionar Símbolo</h1>
        <div className="w-16"></div>
      </header>

      <main className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Detalhes do Símbolo</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder="Nome do símbolo (ex: Bola, Gato)" 
              value={symbolText} 
              onChange={(e) => setSymbolText(e.target.value)}
            />
            <Select onValueChange={setSelectedCategory} value={selectedCategory || ''}>
              <SelectTrigger><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
              <SelectContent>
                {categories?.map(cat => <SelectItem key={cat.key} value={cat.key}>{cat.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Imagem</CardTitle></Header>
          <CardContent className="space-y-4">
            <div className="flex justify-around">
              <Button variant="outline" onClick={() => selectImage(CameraSource.Camera)} className="flex flex-col h-24 w-24 items-center justify-center gap-2"><Camera className="h-8 w-8" />Tirar Foto</Button>
              <Button variant="outline" onClick={() => selectImage(CameraSource.Photos)} className="flex flex-col h-24 w-24 items-center justify-center gap-2"><ImageIcon className="h-8 w-8" />Galeria</Button>
            </div>
            {previewUrl && (
              <div className="mt-4 flex flex-col items-center">
                <p className="font-semibold mb-2">Pré-visualização:</p>
                <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg shadow-md" />
              </div>
            )}
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full py-4 text-lg">Salvar Símbolo</Button>
      </main>
    </div>
  );
};
