import { useState, useCallback, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Category, Symbol as DbSymbol } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Trash2, PlusCircle, Edit, Check, ImageUp, Search, Download, Upload, GripVertical, FileText, Settings, ShieldCheck, LineChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { AnalyticsScreen } from './AnalyticsScreen';
import { SettingsScreen } from './SettingsScreen';

// #region Sub-componentes de Gerenciamento (Lógica Restaurada)

const CategoryManager = () => {
    const { activeProfileId } = useProfile();
    const { toast } = useToast();
    const categories = useLiveQuery(() => activeProfileId ? db.categories.where('profileId').equals(activeProfileId).toArray() : [], [activeProfileId]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');

    const handleAddCategory = useCallback(async () => {
        if (!activeProfileId || !newCategoryName.trim()) return;
        const name = newCategoryName.trim();
        const key = name.toLowerCase().replace(/\s+/g, '-').slice(0, 50);
        await db.categories.add({ profileId: activeProfileId, key, name, color: 'slate' });
        setNewCategoryName('');
        toast({ title: 'Sucesso', description: `Categoria "${name}" criada.` });
    }, [newCategoryName, activeProfileId, toast]);

    const handleDeleteCategory = async (id: number) => {
        const category = await db.categories.get(id);
        if (category && category.profileId === activeProfileId) {
            await db.transaction('rw', db.categories, db.symbols, async () => {
                await db.symbols.where({ profileId: activeProfileId, categoryKey: category.key }).delete();
                await db.categories.delete(id);
            });
            toast({ title: 'Sucesso', description: `Categoria e seus símbolos foram apagados.`, variant: 'destructive' });
        }
    };
    
    const handleEditClick = (category: Category) => { setEditingCategoryId(category.id!); setEditingCategoryName(category.name); };
    const handleUpdateCategory = async () => {
        if (!editingCategoryId || !editingCategoryName.trim()) return;
        await db.categories.update(editingCategoryId, { name: editingCategoryName.trim() });
        toast({ title: 'Sucesso', description: `Categoria atualizada.` });
        setEditingCategoryId(null); setEditingCategoryName('');
    };

    return (
        <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader><CardTitle>Gerenciar Categorias</CardTitle></CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-4">
                    <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nome da nova categoria" className="w-full bg-slate-100/80 rounded-lg px-3" />
                    <Button onClick={handleAddCategory} size="icon"><PlusCircle /></Button>
                </div>
                <ul className="space-y-2">
                    {categories?.map(cat => (<li key={cat.id} className="flex items-center justify-between bg-black/5 p-2 rounded-md">{editingCategoryId === cat.id ? (<input type="text" value={editingCategoryName} onChange={(e) => setEditingCategoryName(e.target.value)} className="w-full" />) : (<span>{cat.name}</span>)}<div className="flex gap-2 ml-2">{editingCategoryId === cat.id ? (<Button onClick={handleUpdateCategory} size="icon" className="bg-green-500"><Check size={16} /></Button>) : (<Button onClick={() => handleEditClick(cat)} size="icon" className="bg-blue-500"><Edit size={16} /></Button>)}<AlertDialog><AlertDialogTrigger asChild><Button size="icon" variant="destructive"><Trash2 size={16} /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Apagar Categoria?</AlertDialogTitle><AlertDialogDescription>Isso vai apagar permanentemente a categoria e TODOS os símbolos dentro dela.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteCategory(cat.id!)}>Apagar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></li>))}
                </ul>
            </CardContent>
        </Card>
    );
};

const SymbolManager = () => {
    const { activeProfileId } = useProfile();
    const { toast } = useToast();
    const [isOrganizeMode, setIsOrganizeMode] = useState(false);
    const [symbols, setSymbols] = useState<DbSymbol[]>([]);
    const allSymbols = useLiveQuery(() => activeProfileId ? db.symbols.where({ profileId: activeProfileId }).toArray() : [], [activeProfileId]);
    
    useEffect(() => { if (allSymbols) setSymbols(allSymbols.sort((a, b) => a.order - b.order)); }, [allSymbols]);

    const handleOnDragEnd = async (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(symbols);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setSymbols(items);
        const updates = items.map((symbol, index) => ({ key: symbol.id!, changes: { order: index } }));
        await db.symbols.bulkUpdate(updates);
        toast({ title: 'Sucesso', description: 'Ordem dos símbolos atualizada.' });
    };

    return (
        <Card className="bg-white/80 backdrop-blur-sm mt-6">
            <CardHeader><div className="flex justify-between items-center"><CardTitle>Gerenciar Símbolos</CardTitle><Button onClick={() => setIsOrganizeMode(!isOrganizeMode)} variant={isOrganizeMode ? 'default' : 'outline'}>{isOrganizeMode ? 'Concluir' : 'Organizar'}</Button></div></CardHeader>
            <CardContent>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="symbols">
                        {(provided) => (
                            <ul className="space-y-2 max-h-96 overflow-y-auto" {...provided.droppableProps} ref={provided.innerRef}>
                                {symbols.map((sym, index) => (
                                    <Draggable key={sym.id} draggableId={sym.id!.toString()} index={index} isDragDisabled={!isOrganizeMode}>
                                        {(provided, snapshot) => (
                                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`flex items-center justify-between p-2 rounded-md ${snapshot.isDragging ? 'bg-blue-100' : 'bg-black/5'}`}>
                                                <div className="flex items-center gap-2">
                                                    {isOrganizeMode && <GripVertical className="cursor-move" />}
                                                    <span>{sym.text}</span>
                                                </div>
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            </CardContent>
        </Card>
    );
};

const ContentManager = ({ onBack }: { onBack: () => void }) => (
    <div>
        <header className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack}><ChevronLeft /> Voltar</Button>
            <h1 className="text-xl font-bold">Gerenciar Conteúdo</h1>
            <div className="w-24"></div>
        </header>
        <CategoryManager />
        <SymbolManager />
    </div>
);

const BackupManager = ({ onBack }: { onBack: () => void }) => {
    const { activeProfileId, activeProfile } = useProfile();
    const { toast } = useToast();
    const importFileRef = useRef<HTMLInputElement>(null);

    const handleExport = useCallback(async () => {
        if (!activeProfileId || !activeProfile) return;
        try {
            const categories = await db.categories.where({ profileId: activeProfileId }).toArray();
            const symbols = await db.symbols.where({ profileId: activeProfileId }).toArray();
            const backupData = JSON.stringify({ profileName: activeProfile.name, categories, symbols }, null, 2);
            const blob = new Blob([backupData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mms_backup_${activeProfile.name.replace(/\s/g, '_')}.json`;
            a.click();
            URL.revokeObjectURL(a.href);
            toast({ title: 'Sucesso', description: 'Backup salvo no seu dispositivo.' });
        } catch (e) { toast({ title: 'Erro', description: 'Não foi possível exportar os dados.', variant: 'destructive' }); }
    }, [activeProfileId, activeProfile, toast]);

    const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !activeProfileId) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const backup = JSON.parse(e.target?.result as string);
                if (!backup.categories || !backup.symbols) throw new Error("Arquivo inválido");
                await db.transaction('rw', db.categories, db.symbols, async () => {
                    await db.categories.where({ profileId: activeProfileId }).delete();
                    await db.symbols.where({ profileId: activeİd }).delete();
                    await db.categories.bulkAdd(backup.categories.map((c: Category) => ({ ...c, profileId: activeProfileId })));
                    await db.symbols.bulkAdd(backup.symbols.map((s: DbSymbol) => ({ ...s, profileId: activeProfileId })));
                });
                toast({ title: 'Sucesso!', description: 'Dados restaurados a partir do backup.' });
            } catch (err) { toast({ title: 'Erro', description: 'Arquivo de backup inválido ou corrompido.', variant: 'destructive' }); }
        };
        reader.readAsText(file);
        event.target.value = '';
    }, [activeProfileId, toast]);

    return (
        <div>
             <header className="flex items-center justify-between mb-4"><Button variant="ghost" onClick={onBack}><ChevronLeft /> Voltar</Button><h1 className="text-xl font-bold">Backup</h1><div className="w-24"></div></header>
             <Card><CardHeader><CardTitle>Backup e Restauração</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-4"><input type="file" accept=".json" ref={importFileRef} onChange={handleImport} className="hidden" /><Button onClick={handleExport}><Download className="mr-2" />Exportar</Button><AlertDialog><AlertDialogTrigger asChild><Button variant="outline"><Upload className="mr-2" />Importar</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Importar Backup?</AlertDialogTitle><AlertDialogDescription>Isso substituirá TODOS os dados atuais deste perfil. Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => importFileRef.current?.click()}>Continuar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></CardContent></Card>
        </div>
    );
};

const ReportsManager = ({ onBack }: { onBack: () => void }) => <AnalyticsScreen onBack={onBack} />;
const AppSettingsManager = ({ onBack }: { onBack: () => void }) => <SettingsScreen onBack={onBack} />;

// #endregion

// --- Tela Principal do Painel ---

interface ManagementScreenProps {
  onBack: () => void;
}

type View = 'menu' | 'content' | 'backup' | 'reports' | 'settings';

export const ManagementScreen = ({ onBack }: ManagementScreenProps) => {
  const [view, setView] = useState<View>('menu');

  const renderContent = () => {
    switch (view) {
      case 'content': return <ContentManager onBack={() => setView('menu')} />;
      case 'backup': return <BackupManager onBack={() => setView('menu')} />;
      case 'reports': return <ReportsManager onBack={() => setView('menu')} />;
      case 'settings': return <AppSettingsManager onBack={() => setView('menu')} />;
      default: return <MainMenu setView={setView} onBack={onBack} />;
    }
  };

  return <div className="p-4">{renderContent()}</div>;
};

const MainMenu = ({ setView, onBack }: { setView: (view: View) => void; onBack: () => void }) => (
    <div>
        <header className="flex items-center justify-between mb-6"><Button variant="ghost" onClick={onBack}><ChevronLeft /> Voltar</Button><h1 className="text-xl font-bold">Meu Painel</h1><div className="w-24"></div></header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MenuButton icon={FileText} title="Gerenciar Conteúdo" description="Edite, apague e reorganize categorias e símbolos." onClick={() => setView('content')} />
            <MenuButton icon={ShieldCheck} title="Backup e Restauração" description="Salve ou recupere os dados de um perfil." onClick={() => setView('backup')} />
            <MenuButton icon={LineChart} title="Relatórios de Uso" description="Veja o progresso e as palavras mais usadas." onClick={() => setView('reports')} />
            <MenuButton icon={Settings} title="Configurações do App" description="Ajuste voz, aparência e outras opções." onClick={() => setView('settings')} />
        </div>
    </div>
);

const MenuButton = ({ icon: Icon, title, description, onClick }: { icon: React.ElementType, title: string, description: string, onClick: () => void }) => (
    <Card onClick={onClick} className="hover:bg-gray-100 cursor-pointer"><CardHeader className="flex-row items-center gap-4"><Icon className="h-8 w-8 text-sky-600" /><div><CardTitle>{title}</CardTitle><p className="text-sm text-gray-600">{description}</p></div></CardHeader></Card>
);
