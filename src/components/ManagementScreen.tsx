import { useState, useCallback, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Category, Symbol as DbSymbol } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Trash2, PlusCircle, Edit, Check, ImageUp, ImageOff, RefreshCcw, Search, Download, Upload, GripVertical, FileText, Settings, ShieldCheck, LineChart } from 'lucide-react'; // Adicionado LineChart
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// --- Telas de Gerenciamento (Sub-componentes) ---

const ContentManager = ({ onBack }: { onBack: () => void }) => (
    <div>
        <header className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-1 text-sm sm:text-base text-gray-800 font-semibold"><ChevronLeft className="h-5 w-5" />Voltar</Button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-700">Gerenciar Conteúdo</h1>
            <div className="w-16 sm:w-24"></div>
        </header>
        <CategoryManager />
        <SymbolManager />
    </div>
);

const BackupManager = ({ onBack }: { onBack: () => void }) => {
    const { activeProfile, activeProfileId } = useProfile();
    const { toast } = useToast();
    const importFileRef = useRef<HTMLInputElement>(null);

    const handleExport = async () => {
      if (!activeProfileId || !activeProfile) return;
      try {
        const categories = await db.categories.where({ profileId: activeProfileId }).toArray();
        const symbols = await db.symbols.where({ profileId: activeProfileId }).toArray();
        const symbolsWithBase64 = await Promise.all(symbols.map(async (s) => {
          if (s.image instanceof Blob) {
            const reader = new FileReader();
            return new Promise(resolve => {
              reader.onloadend = () => resolve({ ...s, image: reader.result });
              reader.readAsDataURL(s.image);
            });
          }
          return s;
        }));
        const backupData = JSON.stringify({ profileName: activeProfile.name, categories, symbols: symbolsWithBase64 }, null, 2);
        const blob = new Blob([backupData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mms_backup_${activeProfile.name.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: 'Sucesso', description: 'Seu backup foi salvo no dispositivo.' });
      } catch (error) {
        console.error("Erro ao exportar dados:", error);
        toast({ title: 'Erro', description: 'Não foi possível criar o backup.', variant: 'destructive' });
      }
    };
  
    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!activeProfileId) return;
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const backup = JSON.parse(e.target?.result as string);
          if (!backup.profileName || !Array.isArray(backup.categories) || !Array.isArray(backup.symbols)) {
            throw new Error('Arquivo de backup inválido.');
          }
          const symbolsWithBlobs = await Promise.all((backup.symbols as any[]).map(async (s) => {
            if (typeof s.image === 'string' && s.image.startsWith('data:image')) {
              const res = await fetch(s.image);
              const blob = await res.blob();
              return { ...s, image: blob, profileId: activeProfileId };
            }
            return { ...s, image: undefined, profileId: activeProfileId };
          }));
          const categoriesToImport = backup.categories.map((c: any) => ({ ...c, profileId: activeProfileId }));
          await db.transaction('rw', db.categories, db.symbols, async () => {
            await db.categories.where({ profileId: activeProfileId }).delete();
            await db.symbols.where({ profileId: activeProfileId }).delete();
            await db.categories.bulkAdd(categoriesToImport);
            await db.symbols.bulkAdd(symbolsWithBlobs);
          });
          toast({ title: 'Sucesso!', description: 'Seus dados foram restaurados.' });
        } catch (error) {
          console.error("Erro ao importar dados:", error);
          toast({ title: 'Erro', description: 'O arquivo de backup é inválido ou está corrompido.', variant: 'destructive' });
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    };

    return (
        <div>
            <header className="flex items-center justify-between mb-4">
                <Button variant="ghost" onClick={onBack} className="flex items-center gap-1 text-sm sm:text-base text-gray-800 font-semibold"><ChevronLeft className="h-5 w-5" />Voltar</Button>
                <h1 className="text-lg sm:text-xl font-bold text-gray-700">Backup e Restauração</h1>
                <div className="w-16 sm:w-24"></div>
            </header>
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg text-gray-800">
                <CardHeader><CardTitle>Backup e Restauração</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="file" accept=".json" ref={importFileRef} onChange={handleImport} className="hidden" />
                    <Button onClick={handleExport} className="h-16 text-lg bg-blue-600 hover:bg-blue-700 text-white"><Download className="mr-2" />Exportar Dados</Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="outline" className="h-16 text-lg bg-orange-600 hover:bg-orange-700 text-white"><Upload className="mr-2" />Importar Dados</Button></AlertDialogTrigger>
                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Aviso Importante</AlertDialogTitle><AlertDialogDescription>A importação de um backup irá **substituir todos os dados atuais** (categorias e símbolos) deste perfil. Esta ação não pode ser desfeita. Deseja continuar?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => importFileRef.current?.click()}>Continuar</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    );
};

// --- Componentes Internos (reutilizados) ---
const CategoryManager = () => { /* ...código do CategoryManager... */ return <div/>; };
const SymbolManager = () => { /* ...código do SymbolManager... */ return <div/>; };


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
      // Adicionar casos para 'reports' e 'settings' no futuro
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
                onClick={() => alert('Navegar para Relatórios')} // Placeholder
            />
            <MenuButton 
                icon={Settings} 
                title="Configurações do App" 
                description="Ajuste voz, aparência e outras opções."
                onClick={() => alert('Navegar para Configurações')} // Placeholder
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
