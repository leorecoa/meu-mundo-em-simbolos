import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';

interface AnalyticsScreenProps {
  onBack: () => void;
}

export const AnalyticsScreen = ({ onBack }: AnalyticsScreenProps) => {
  // Fetch usage events, ordered by most recent first
  const usageEvents = useLiveQuery(() => 
    db.usageEvents.orderBy('timestamp').reverse().toArray()
  , []);

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <header className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1">
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </Button>
        <h1 className="text-xl font-bold">Relatório de Uso</h1>
        <div className="w-16"></div> {/* Spacer */}
      </header>

      <main>
        <Card>
          <CardHeader>
            <CardTitle>Símbolos Utilizados Recentemente</CardTitle>
          </CardHeader>
          <CardContent>
            {(!usageEvents || usageEvents.length === 0) ? (
              <p className="text-gray-500">Nenhum dado de uso registrado ainda. Comece a usar os símbolos!</p>
            ) : (
              <ul className="space-y-2">
                {usageEvents.map(event => (
                  <li key={event.id} className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
                    <span className="font-semibold">{event.itemId}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
