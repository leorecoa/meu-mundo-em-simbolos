import { useLiveQuery } from 'dexie-react-hooks';
import { BarChart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { UsageStatsChart } from '@/components/UsageStatsChart';
import { db } from '@/lib/db';
import { useProfile } from '@/contexts/ProfileContext';

export const StatsTab = () => {
  const { activeProfileId } = useProfile();
  
  // Obter eventos de uso
  const phrasesCreated = useLiveQuery(() => 
    db.usageEvents.where({ type: 'phrase_created' }).count(),
    []
  );
  
  const symbolsUsed = useLiveQuery(() => 
    db.usageEvents.where({ type: 'symbol_used' }).toArray(),
    []
  );
  
  // Calcular dias consecutivos (simplificado)
  const consecutiveDays = 1;
  
  // Calcular tempo total (estimativa: 2 segundos por evento)
  const totalTimeSpent = (symbolsUsed?.length || 0) * 2;
  
  // Contar símbolos mais usados
  const symbolCount: Record<string, number> = {};
  symbolsUsed?.forEach(event => {
    const symbol = event.itemId;
    symbolCount[symbol] = (symbolCount[symbol] || 0) + 1;
  });

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart className="h-5 w-5 mr-2 text-blue-600" />
          Estatísticas de Uso
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-lg p-3 text-center">
            <p className="text-sm text-gray-500">Frases criadas</p>
            <p className="text-2xl font-bold text-blue-600">{phrasesCreated || 0}</p>
          </div>
          
          <div className="border rounded-lg p-3 text-center">
            <p className="text-sm text-gray-500">Dias consecutivos</p>
            <p className="text-2xl font-bold text-green-600">{consecutiveDays}</p>
          </div>
          
          <div className="border rounded-lg p-3 text-center">
            <p className="text-sm text-gray-500">Tempo total (min)</p>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(totalTimeSpent / 60)}
            </p>
          </div>
        </div>
        
        <UsageStatsChart />
        
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Símbolos mais usados</h3>
          <div className="space-y-2">
            {Object.entries(symbolCount)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([symbolId, count]) => (
                <div key={symbolId} className="flex justify-between items-center">
                  <span className="text-sm">{symbolId}</span>
                  <span className="text-sm font-medium">{count} vezes</span>
                </div>
              ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
