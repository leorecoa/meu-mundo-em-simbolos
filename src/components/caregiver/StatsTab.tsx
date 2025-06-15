
import { BarChart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { UsageStatsChart } from '@/components/UsageStatsChart';
import { getUsageStats } from '@/lib/storage';
import { useQuery } from '@tanstack/react-query';

export const StatsTab = () => {
  const { data: usageStats } = useQuery({
    queryKey: ['usageStats'],
    queryFn: getUsageStats
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
            <p className="text-2xl font-bold text-blue-600">{usageStats?.phrasesCreated || 0}</p>
          </div>
          
          <div className="border rounded-lg p-3 text-center">
            <p className="text-sm text-gray-500">Dias consecutivos</p>
            <p className="text-2xl font-bold text-green-600">{usageStats?.consecutiveDays || 0}</p>
          </div>
          
          <div className="border rounded-lg p-3 text-center">
            <p className="text-sm text-gray-500">Tempo total (min)</p>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round((usageStats?.totalTimeSpent || 0) / 60)}
            </p>
          </div>
        </div>
        
        <UsageStatsChart />
        
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Símbolos mais usados</h3>
          <div className="space-y-2">
            {usageStats && Object.entries(usageStats.symbolsUsed)
              .sort(([, a], [, b]) => (b as number) - (a as number))
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
