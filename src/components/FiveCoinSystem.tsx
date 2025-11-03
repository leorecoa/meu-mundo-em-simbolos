import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent } from '@/components/ui/card';
import { Coins } from 'lucide-react';

export const FiveCoinSystem = () => {
  const { activeProfileId } = useProfile();
  
  const coins = useLiveQuery(
    async () => {
      const coin = await db.coins.get(1);
      return coin?.total || 0;
    },
    []
  );

  const dailyGoals = useLiveQuery(
    async () => await db.dailyGoals.toArray(),
    []
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span className="font-bold text-lg">{coins || 0} Moedas</span>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        <h3 className="font-semibold">Metas Diárias</h3>
        {dailyGoals?.map(goal => (
          <Card key={goal.id}>
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">{goal.name}</span>
                <span className="text-sm font-medium">
                  {goal.current}/{goal.target}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
