import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Star, Award, Trophy } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

interface RewardsScreenProps {
  onBack: () => void;
}

export const RewardsScreen = ({ onBack }: RewardsScreenProps) => {
  const { activeProfileId } = useProfile();

  const coins = useLiveQuery(() => db.coins.get(1), []);
  const achievements = useLiveQuery(() => db.achievements.toArray(), []);
  const dailyGoals = useLiveQuery(() => db.dailyGoals.toArray(), []);

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <header className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1"><ChevronLeft />Voltar</Button>
        <h1 className="text-2xl font-bold text-yellow-600 flex items-center gap-2"><Trophy /> Minhas Recompensas</h1>
        <div className="w-20"></div>
      </header>

      <main className="space-y-6">
        {/* Moedas */}
        <Card className="bg-yellow-400 text-yellow-900 shadow-lg">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Minhas Moedas</CardTitle>
            <Star className="h-8 w-8" />
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold">{coins?.total ?? 0}</p>
          </CardContent>
        </Card>

        {/* Metas Diárias */}
        <Card>
          <CardHeader><CardTitle>Metas de Hoje</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {dailyGoals?.map(goal => (
              <div key={goal.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{goal.name}</span>
                  <span className="text-sm font-bold">{goal.current}/{goal.target}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full ${goal.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Conquistas */}
        <Card>
          <CardHeader><CardTitle>Conquistas</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {achievements?.map(ach => (
              <div key={ach.id} className={`flex flex-col items-center text-center p-3 rounded-lg ${ach.unlocked ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'}`}>
                <Award className={`h-10 w-10 mb-2 ${ach.unlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
                <p className="font-bold text-sm">{ach.name}</p>
                {ach.unlocked && <p className="text-xs">+ {ach.reward} moedas</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
