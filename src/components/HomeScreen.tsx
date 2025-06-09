
import { Heart, Home, Utensils, Gamepad2, Users, Settings, UserCheck, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface HomeScreenProps {
  onNavigateToCategory: (category: string) => void;
  onNavigateToPhrase: () => void;
  onNavigateToSettings: () => void;
  onNavigateToCaregiver: () => void;
}

export const HomeScreen = ({ onNavigateToCategory, onNavigateToPhrase, onNavigateToSettings, onNavigateToCaregiver }: HomeScreenProps) => {
  const mainCategories = [
    { id: 'quero', label: 'EU QUERO', icon: Heart, color: 'bg-green-100 hover:bg-green-200', textColor: 'text-green-800' },
    { id: 'sinto', label: 'EU SINTO', icon: Heart, color: 'bg-blue-100 hover:bg-blue-200', textColor: 'text-blue-800' },
    { id: 'preciso', label: 'EU PRECISO', icon: Users, color: 'bg-purple-100 hover:bg-purple-200', textColor: 'text-purple-800' },
  ];

  const subcategories = [
    { id: 'comida', label: 'COMIDA', icon: Utensils, color: 'bg-orange-100 hover:bg-orange-200', textColor: 'text-orange-800' },
    { id: 'brincar', label: 'BRINCAR', icon: Gamepad2, color: 'bg-pink-100 hover:bg-pink-200', textColor: 'text-pink-800' },
    { id: 'casa', label: 'CASA', icon: Home, color: 'bg-indigo-100 hover:bg-indigo-200', textColor: 'text-indigo-800' },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header com controles de acessibilidade */}
      <div className="flex justify-between items-center mb-6 bg-white rounded-lg p-3 shadow-sm">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-blue-50 hover:bg-blue-100" 
            aria-label="Pausar"
          >
            <Pause className="h-5 w-5 text-blue-800" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="bg-blue-50 hover:bg-blue-100" 
            aria-label="Ajustar som"
          >
            <Volume2 className="h-5 w-5 text-blue-800" />
          </Button>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-blue-50 hover:bg-blue-100"
            onClick={onNavigateToSettings}
            aria-label="Configurações"
          >
            <Settings className="h-5 w-5 text-blue-800" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-blue-50 hover:bg-blue-100"
            onClick={onNavigateToCaregiver}
            aria-label="Modo Cuidador"
          >
            <UserCheck className="h-5 w-5 text-blue-800" />
          </Button>
        </div>
      </div>

      {/* Botão para ir direto à montagem de frases */}
      <Button 
        className="w-full py-6 text-xl font-bold rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-800 shadow-md"
        onClick={onNavigateToPhrase}
      >
        MONTAR FRASE
      </Button>

      {/* Categorias principais */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Como me comunicar:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mainCategories.map((category) => (
            <Button
              key={category.id}
              className={`h-24 text-xl font-bold rounded-xl ${category.color} ${category.textColor} shadow-md flex flex-col items-center justify-center gap-2 p-4`}
              onClick={() => onNavigateToCategory(category.id)}
            >
              <category.icon className="h-8 w-8" />
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Subcategorias mais comuns */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Categorias:</h2>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {subcategories.map((category) => (
            <Card
              key={category.id}
              className={`min-w-[140px] h-32 ${category.color} shadow-md rounded-xl flex flex-col items-center justify-center gap-1 p-2 cursor-pointer`}
              onClick={() => onNavigateToCategory(category.id)}
            >
              <category.icon className={`h-10 w-10 ${category.textColor}`} />
              <div className={`text-lg font-bold ${category.textColor}`}>
                {category.label}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Barra de progresso - Gamificação */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="text-sm text-gray-600 mb-1">Você já usou 10 palavras hoje!</div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-blue-400 h-4 rounded-full animate-pulse" style={{ width: '40%' }}></div>
        </div>
      </div>
    </div>
  );
};
