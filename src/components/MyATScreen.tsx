import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, FileText, Star, Users, Activity, Settings, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { SessionPlanner } from './myat/SessionPlanner';
import { ProgressTracker } from './myat/ProgressTracker';
import { ResourceLibrary } from './myat/ResourceLibrary';
import { BehaviorTracker } from './myat/BehaviorTracker';
import { RoutineBuilder } from './myat/RoutineBuilder';

interface MyATScreenProps {
  onBack: () => void;
}

export const MyATScreen = ({ onBack }: MyATScreenProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('sessions');

  return (
    <div className="p-4 space-y-6 min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="flex items-center gap-1 text-indigo-700"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </Button>
          <h1 className="text-xl font-bold text-center ml-4">Meu AT</h1>
        </div>
        <Button
          variant="outline"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
          onClick={() => {
            toast({
              title: "Ajuda",
              description: "O módulo Meu AT ajuda a planejar, acompanhar e registrar sessões terapêuticas.",
              duration: 5000,
            });
          }}
        >
          Ajuda
        </Button>
      </div>

      {/* Resumo rápido */}
      <Card className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 border-none shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-indigo-800">Assistente Terapêutico</h2>
            <p className="text-sm text-indigo-600">Ferramentas para profissionais e cuidadores</p>
          </div>
          <div className="flex gap-2">
            <div className="text-center">
              <div className="bg-indigo-200 rounded-full p-2 mb-1">
                <Calendar className="h-5 w-5 text-indigo-700" />
              </div>
              <p className="text-xs font-medium">Hoje</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-200 rounded-full p-2 mb-1">
                <Activity className="h-5 w-5 text-purple-700" />
              </div>
              <p className="text-xs font-medium">Progresso</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Abas de funcionalidades */}
      <Tabs defaultValue="sessions" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="sessions" className="flex flex-col items-center py-2">
            <Calendar className="w-4 h-4 mb-1" />
            <span className="text-xs">Sessões</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex flex-col items-center py-2">
            <Activity className="w-4 h-4 mb-1" />
            <span className="text-xs">Progresso</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex flex-col items-center py-2">
            <FileText className="w-4 h-4 mb-1" />
            <span className="text-xs">Recursos</span>
          </TabsTrigger>
          <TabsTrigger value="behavior" className="flex flex-col items-center py-2">
            <Star className="w-4 h-4 mb-1" />
            <span className="text-xs">Comportamento</span>
          </TabsTrigger>
          <TabsTrigger value="routines" className="flex flex-col items-center py-2">
            <Clock className="w-4 h-4 mb-1" />
            <span className="text-xs">Rotinas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions">
          <SessionPlanner />
        </TabsContent>

        <TabsContent value="progress">
          <ProgressTracker />
        </TabsContent>

        <TabsContent value="resources">
          <ResourceLibrary />
        </TabsContent>

        <TabsContent value="behavior">
          <BehaviorTracker />
        </TabsContent>

        <TabsContent value="routines">
          <RoutineBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
};