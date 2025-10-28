import { useState } from 'react';
import { ArrowLeft, Settings, PlusCircle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FiveCoinSystem } from '@/components/FiveCoinSystem';
import { SymbolsTab } from '@/components/caregiver/SymbolsTab';
import { SettingsTab } from '@/components/caregiver/SettingsTab';

interface MyATScreenProps {
  onBack: () => void;
}

export const MyATScreen = ({ onBack }: MyATScreenProps) => {
  return (
    <div className="p-4 space-y-6 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="flex items-center gap-1 text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </Button>
        <h1 className="text-xl font-bold text-center text-gray-800">Painel do Usuário</h1>
        <div className="w-16"></div> {/* Espaçador para centralizar o título */}
      </div>

      <Tabs defaultValue="progresso" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="progresso">
            <Trophy className="w-4 h-4 mr-2" /> Meu Progresso
          </TabsTrigger>
          <TabsTrigger value="simbolos">
            <PlusCircle className="w-4 h-4 mr-2" /> Meus Símbolos
          </TabsTrigger>
          <TabsTrigger value="configuracoes">
            <Settings className="w-4 h-4 mr-2" /> Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progresso">
          <Card>
            <CardHeader>
              <CardTitle>Gamificação e Recompensas</CardTitle>
            </CardHeader>
            <div className="p-4">
              <FiveCoinSystem />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="simbolos">
          <SymbolsTab />
        </TabsContent>

        <TabsContent value="configuracoes">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
