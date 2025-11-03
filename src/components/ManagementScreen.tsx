import { useState, useCallback, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Category, Symbol as DbSymbol } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Trash2, PlusCircle, Edit, Check, ImageUp, ImageOff, RefreshCcw, Search, Download, Upload, GripVertical, FileText, Settings, ShieldCheck, LineChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AnalyticsScreen } from '@/components/AnalyticsScreen';
import { SettingsScreen } from '@/components/SettingsScreen'; // Importar

// --- Telas de Gerenciamento (Sub-componentes) ---

const ContentManager = ({ onBack }: { onBack: () => void }) => { /* ...código... */ return <div/>; };
const BackupManager = ({ onBack }: { onBack: () => void }) => { /* ...código... */ return <div/>; };
const ReportsManager = ({ onBack }: { onBack: () => void }) => <AnalyticsScreen onBack={onBack} />;
const AppSettingsManager = ({ onBack }: { onBack: () => void }) => <SettingsScreen onBack={onBack} />; // Novo

// --- Componentes Internos (reutilizados) ---
const CategoryManager = () => { /* ...código... */ return <div/>; };
const SymbolManager = () => { /* ...código... */ return <div/>; };


// --- Tela Principal do Painel ---

interface ManagementScreenProps {
  onBack: () => void;
}

type View = 'menu' | 'content' | 'backup' | 'reports' | 'settings';

export const ManagementScreen = ({ onBack }: ManagementScreenProps) => {
  const [view, setView] = useState<View>('menu');

  const renderContent = () => {
    switch (view) {
      case 'content':
        return <ContentManager onBack={() => setView('menu')} />;
      case 'backup':
        return <BackupManager onBack={() => setView('menu')} />;
      case 'reports':
        return <ReportsManager onBack={() => setView('menu')} />;
      case 'settings': // Novo
        return <AppSettingsManager onBack={() => setView('menu')} />;
      default:
        return <MainMenu setView={setView} onBack={onBack} />;
    }
  };

  return <div className="p-2 sm:p-4 md:p-6 min-h-screen font-sans">{renderContent()}</div>;
};

// --- Menu Principal ---

const MainMenu = ({ setView, onBack }: { setView: (view: View) => void; onBack: () => void }) => (
    <div>
        <header className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-1 text-sm sm:text-base text-gray-800 font-semibold"><ChevronLeft className="h-5 w-5" />Voltar</Button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-700">Meu Painel</h1>
            <div className="w-16 sm:w-24"></div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MenuButton 
                icon={FileText} 
                title="Gerenciar Conteúdo" 
                description="Edite, apague ou reorganize categorias e símbolos."
                onClick={() => setView('content')}
            />
            <MenuButton 
                icon={ShieldCheck} 
                title="Backup e Restauração" 
                description="Salve ou recupere os dados do aplicativo."
                onClick={() => setView('backup')}
            />
            <MenuButton 
                icon={LineChart} 
                title="Relatórios de Uso" 
                description="Veja o progresso e as palavras mais usadas."
                onClick={() => setView('reports')}
            />
            <MenuButton 
                icon={Settings} 
                title="Configurações do App" 
                description="Ajuste voz, aparência e outras opções."
                onClick={() => setView('settings')} // Conectado
            />
        </div>
    </div>
);

const MenuButton = ({ icon: Icon, title, description, onClick }: { icon: React.ElementType, title: string, description: string, onClick: () => void }) => (
    <Card onClick={onClick} className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg text-gray-800 hover:bg-white/100 cursor-pointer transition-all duration-300 transform hover:scale-105">
        <CardHeader className="flex flex-row items-center gap-4">
            <Icon className="h-10 w-10 text-sky-600" />
            <div>
                <CardTitle>{title}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
        </CardHeader>
    </Card>
);
