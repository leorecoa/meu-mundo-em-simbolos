
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CaregiverAuth } from '@/components/caregiver/CaregiverAuth';
import { SymbolsTab } from '@/components/caregiver/SymbolsTab';
import { TasksTab } from '@/components/caregiver/TasksTab';
import { StatsTab } from '@/components/caregiver/StatsTab';
import { SettingsTab } from '@/components/caregiver/SettingsTab';

interface CaregiverModeProps {
  onBack: () => void;
}

export const CaregiverMode = ({ onBack }: CaregiverModeProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <CaregiverAuth 
        onAuthenticated={() => setIsAuthenticated(true)}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="flex items-center gap-1 text-blue-700"
        >
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </Button>
        <h1 className="text-xl font-bold text-center flex-1 mr-10">MODO CUIDADOR</h1>
      </div>

      <Tabs defaultValue="symbols">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="symbols">Símbolos</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="symbols">
          <SymbolsTab />
        </TabsContent>
        
        <TabsContent value="tasks">
          <TasksTab />
        </TabsContent>
        
        <TabsContent value="stats">
          <StatsTab />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
