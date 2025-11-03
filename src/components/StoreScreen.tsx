import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Star, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { rewardPacks } from '@/lib/expansionPacks'; // Importar pacotes

interface StoreScreenProps {
  onBack: () => void;
}

export const StoreScreen = ({ onBack }: StoreScreenProps) => {
  const { toast } = useToast();
  const { activeProfileId } = useProfile();
  const coins = useLiveQuery(() => db.coins.get(1));
  const rewards = useLiveQuery(() => db.rewards.toArray());

  const handlePurchase = async (rewardId: string, cost: number) => {
    if (!activeProfileId) return;

    const currentCoins = coins?.total ?? 0;
    if (currentCoins < cost) {
      toast({ title: 'Moedas Insuficientes', variant: 'destructive' });
      return;
    }

    try {
      const pack = rewardPacks[rewardId];
      if (!pack) {
          throw new Error('Pacote de recompensa não encontrado.');
      }

      await db.transaction('rw', db.coins, db.rewards, db.categories, db.symbols, async () => {
        // 1. Deduzir moedas e marcar como comprado
        await db.coins.update(1, { total: currentCoins - cost });
        await db.rewards.update(rewardId, { purchased: true });

        // 2. Adicionar nova categoria (se não existir)
        const existingCategory = await db.categories.get({ key: pack.category.key, profileId: activeProfileId });
        if (!existingCategory) {
          await db.categories.add({ ...pack.category, profileId: activeProfileId });
        }

        // 3. Adicionar novos símbolos
        const symbolsToAdd = pack.symbols.map(s => ({ ...s, profileId: activeProfileId }));
        await db.symbols.bulkAdd(symbolsToAdd);
      });
      
      toast({ title: 'Compra realizada com sucesso!', description: `O pacote "${pack.category.name}" foi desbloqueado.` });

    } catch (error) {
      console.error('Erro na compra:', error);
      toast({ title: 'Erro na compra', variant: 'destructive' });
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <header className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack}><ChevronLeft /> Voltar</Button>
        <h1 className="text-2xl font-bold">Loja de Recompensas</h1>
        <div className="flex items-center gap-2 font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
          <Star />
          <span>{coins?.total ?? 0}</span>
        </div>
      </header>

      <main className="space-y-4">
        {rewards?.map(reward => (
          <Card key={reward.id} className={reward.purchased ? 'bg-green-50' : ''}>
            <CardHeader>
              <CardTitle>{reward.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-gray-600">{reward.description}</p>
              {reward.purchased ? (
                <div className="flex items-center gap-2 text-green-600 font-semibold"><CheckCircle2 /> Comprado</div>
              ) : (
                <Button onClick={() => handlePurchase(reward.id, reward.cost)} disabled={!activeProfileId}>
                  <Star className="mr-2 h-4 w-4" /> {reward.cost}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        {(!rewards || rewards.length === 0) && (
            <p className="text-center text-gray-500 py-10">Nenhum item na loja no momento.</p>
        )}
      </main>
    </div>
  );
};
