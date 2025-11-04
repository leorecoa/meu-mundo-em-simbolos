import { useLiveQuery } from 'dexie-react-hooks';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/db';
import { useTheme } from '@/hooks/useTheme';
import { useProfile } from '@/contexts/ProfileContext';

interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const UsageStatsChart = () => {
  const { currentTheme } = useTheme();
  const { activeProfileId } = useProfile();
  
  // Obter eventos de uso do banco de dados
  const usageEvents = useLiveQuery(() => 
    activeProfileId ? db.usageEvents.where({ type: 'symbol_used' }).toArray() : [],
    [activeProfileId]
  );
  
  // Preparar dados para o gráfico
  const prepareChartData = (): ChartData[] => {
    if (!usageEvents || usageEvents.length === 0) return [];
    
    // Contar uso de cada símbolo
    const symbolCount: Record<string, number> = {};
    usageEvents.forEach(event => {
      const symbol = event.itemId;
      symbolCount[symbol] = (symbolCount[symbol] || 0) + 1;
    });
    
    // Converter objeto de contagem em array para o gráfico
    const chartData = Object.entries(symbolCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
    
    return chartData;
  };
  
  const chartData = prepareChartData();
  
  // Calcular estatísticas gerais
  const phrasesCreated = useLiveQuery(() => 
    db.usageEvents.where({ type: 'phrase_created' }).count(), 
    []
  );
  
  const totalSymbolsUsed = usageEvents?.length || 0;
  const uniqueSymbolsUsed = chartData.length;
  const averagePerPhrase = phrasesCreated && phrasesCreated > 0 
    ? (totalSymbolsUsed / phrasesCreated).toFixed(1) 
    : '0';
  
  // Calcular tempo total (estimativa: 2 segundos por evento)
  const totalTimeSpent = (usageEvents?.length || 0) * 2;
  
  // Formatar tempo total
  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  // Renderizar gráfico de barras
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end"
          height={70}
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" name="Frequência de uso" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
  
  // Renderizar gráfico de pizza
  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} usos`, 'Frequência']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <Card className={`p-4 ${currentTheme.cardBg}`}>
      <h2 className={`text-lg font-semibold ${currentTheme.textColor} mb-4`}>
        Estatísticas de Uso
      </h2>
      
      {/* Resumo de estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-600">Frases criadas</p>
          <p className="text-2xl font-bold text-blue-700">{phrasesCreated || 0}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-600">Símbolos usados</p>
          <p className="text-2xl font-bold text-green-700">{totalSymbolsUsed}</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-600">Média por frase</p>
          <p className="text-2xl font-bold text-purple-700">{averagePerPhrase}</p>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-600">Tempo total</p>
          <p className="text-2xl font-bold text-orange-700">{formatTimeSpent(totalTimeSpent)}</p>
        </div>
      </div>
      
      {/* Seleção de tipo de gráfico */}
      <div className="mb-4">
        <Tabs defaultValue="bar">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bar">Gráfico de Barras</TabsTrigger>
            <TabsTrigger value="pie">Gráfico de Pizza</TabsTrigger>
          </TabsList>
          <TabsContent value="bar">
            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">Símbolos mais utilizados</h3>
              {chartData.length > 0 ? renderBarChart() : (
                <p className="text-gray-500 text-center py-10">
                  Nenhum dado disponível para exibir
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="pie">
            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">Distribuição de uso</h3>
              {chartData.length > 0 ? renderPieChart() : (
                <p className="text-gray-500 text-center py-10">
                  Nenhum dado disponível para exibir
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Nota informativa */}
      <p className="text-xs text-gray-500 mt-2">
        Última atualização: {new Date().toLocaleDateString()}
      </p>
    </Card>
  );
};
