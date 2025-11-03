import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Star, Award, Trophy, Store } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

interface RewardsScreenProps {
  onBack: () => void;
  onNavigateToStore: () => void; // Novo
}

export const RewardsScreen = ({ onBack, onNavigateToStore }: RewardsScreenProps) => {
  const { activeProfileId } = useProfile();

  const coins = useLiveQuery(() => db.coins.get(1), []);
  const achievements = useLiveQuery(() => db.achievements.toArray(), []);
  const dailyGoals = useLiveQuery(() => db.dailyGoals.toArray(), []);

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <header className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack}><ChevronLeft /> Voltar</Button>
        <h1 className="text-2xl font-bold text-yellow-600"><Trophy /> Minhas Recompensas</h1>
        <Button onClick={onNavigateToStore}><Store className="mr-2"/> Loja</Button>
      </header>

      <main className="space-y-6">
        {/* ... (código do corpo da tela) */}
      </main>
    </div>
  );
};
