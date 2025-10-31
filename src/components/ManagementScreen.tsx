import { useState, useCallback, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Category, Symbol as DbSymbol } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Trash2, PlusCircle, Edit, Check, ImageUp, ImageOff, RefreshCcw, Search, Download, Upload, GripVertical } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


interface ManagementScreenProps {
  onBack: () => void;
}

// Gerenciador de Categorias (sem alterações)
const CategoryManager = () => { 
  const { activeProfileId } = useProfile();
  const { toast } = useToast();
  const categories = useLiveQuery(() => activeProfileId ? db.categories.where('profileId').equals(activeProfileId).toArray() : [], [activeProfileId]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('slate');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const handleAddCategory = useCallback(async () => {
    if (!activeProfileId) return;
    const name = newCategoryName.trim();
    if (!name) { toast({ title: 'Erro', description: 'O nome da categoria não pode ser vazio.', variant: 'destructive' }); return; }
    const key = name.toLowerCase().replace(/\s+/g, '-');
    await db.categories.add({ profileId: activeProfileId, key, name, color: newCategoryColor });
    setNewCategoryName('');
    toast({ title: 'Sucesso', description: `Categoria "${name}" criada.` });
  }, [newCategoryName, newCategoryColor, activeProfileId, toast]);

  const handleDeleteCategory = async (id: number) => {
    const category = await db.categories.get(id);
    if (category && category.profileId === activeProfileId) {
      await db.symbols.where({ profileId: activeProfileId, categoryKey: category.key }).delete();
      await db.categories.delete(id);
      toast({ title: 'Sucesso', description: `Categoria "${category.name}" e seus símbolos foram apagados.`, variant: 'destructive' });
    }
  };

  const handleEditClick = (category: Category) => { setEditingCategoryId(category.id!); setEditingCategoryName(category.name); };
  const handleUpdateCategory = async () => {
    if (!editingCategoryId || !activeProfileId) return;
    const name = editingCategoryName.trim();
    if (!name) { toast({ title: 'Erro', description: 'O nome da categoria não pode ser vazio.', variant: 'destructive' }); return; }
    await db.categories.update(editingCategoryId, { name });
    toast({ title: 'Sucesso', description: `Categoria atualizada para "${name}".` });
    setEditingCategoryId(null); setEditingCategoryName('');
  };

  return (
    <Card className="bg-black/30 border-white/10 text-white">
      <CardHeader><CardTitle>Gerenciar Categorias</CardTitle></CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4"><input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nome da nova categoria" className="w-full bg-slate-100/80 rounded-lg px-3 text-slate-800" /><select value={newCategoryColor} onChange={(e) => setNewCategoryColor(e.target.value)} className="bg-slate-100/80 rounded-lg px-2 text-slate-800"><option value="slate">Cinza</option><option value="rose">Rosa</option><option value="amber">Âmbar</option><option value="sky">Céu</option><option value="emerald">Esmeralda</option></select><Button onClick={handleAddCategory} size="icon" className="bg-sky-500"><PlusCircle /></Button></div>
        <ul className="space-y-2">
          {categories?.map(cat => (<li key={cat.id} className="flex items-center justify-between bg-black/20 p-2 rounded-md">{editingCategoryId === cat.id ? (<input type="text" value={editingCategoryName} onChange={(e) => setEditingCategoryName(e.target.value)} className="w-full bg-slate-100/80 rounded-lg px-2 text-slate-800" />) : (<span>{cat.name}</span>)}<div className="flex gap-2 ml-2">{editingCategoryId === cat.id ? (<Button onClick={handleUpdateCategory} size="icon" className="bg-green-500"><Check size={16} /></Button>) : (<Button onClick={() => handleEditClick(cat)} size="icon" className="bg-blue-500"><Edit size={16} /></Button>)}<AlertDialog><AlertDialogTrigger asChild><Button size="icon" variant="destructive" className="bg-red-600/80"><Trash2 size={16} /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita. Isso vai apagar permanentemente a categoria e todos os símbolos dentro dela.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteCategory(cat.id!)}>Apagar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></li>))}
        </ul>
      </CardContent>
    </Card>
  );
 };

// --- Gerenciador de Símbolos com Reordenação ---
const SymbolManager = () => {
  const { activeProfileId } = useProfile();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOrganizeMode, setIsOrganizeMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const data = useLiveQuery(async () => {
    if (!activeProfileId) return { symbols: [], categories: [] };
    const lowerSearchTerm = searchTerm.toLowerCase();
    const symbolsQuery = db.symbols.where({ profileId: activeProfileId });
    const filteredSymbols = await symbolsQuery.filter(s => s.text.toLowerCase().includes(lowerSearchTerm)).toArray();
    const sortedSymbols = filteredSymbols.sort((a, b) => a.order - b.order);
    const categories = await db.categories.where({ profileId: activeProfileId }).toArray();
    return { symbols: sortedSymbols, categories };
  }, [activeProfileId, searchTerm]);

  const handleOnDragEnd = async (result: any) => {
    if (!result.destination || !data?.symbols) return;
    const items = Array.from(data.symbols);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((symbol, index) => ({ key: symbol.id!, changes: { order: index } }));
    await db.symbols.bulkUpdate(updates);
    toast({ title: 'Sucesso', description: 'Ordem dos símbolos atualizada.' });
  };

  const [newSymbolText, setNewSymbolText] = useState('');
  const [newSymbolImage, setNewSymbolImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(data?.categories[0]?.key || '');
  const [editingSymbolId, setEditingSymbolId] = useState<number | null>(null);
  const [editingSymbolText, setEditingSymbolText] = useState('');
  useEffect(() => { if (data?.categories.length && !selectedCategoryKey) { setSelectedCategoryKey(data.categories[0].key); } }, [data?.categories, selectedCategoryKey]);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) { setNewSymbolImage(file); setPreviewUrl(URL.createObjectURL(file)); } };
  const handleAddSymbol = useCallback(async () => {
    if (!activeProfileId) return;
    const text = newSymbolText.trim();
    if (!text || !selectedCategoryKey) { toast({ title: 'Erro', description: 'Texto e categoria são obrigatórios.', variant: 'destructive' }); return; }
    const maxOrder = (await db.symbols.where({ profileId: activeProfileId }).toArray()).reduce((max, s) => s.order > max ? s.order : max, 0);
    const symbolToAdd: DbSymbol = { profileId: activeProfileId, text, categoryKey: selectedCategoryKey, order: maxOrder + 1 };
    if (newSymbolImage) { symbolToAdd.image = newSymbolImage; }
    await db.symbols.add(symbolToAdd);
    setNewSymbolText(''); setNewSymbolImage(null); setPreviewUrl(null);
    toast({ title: 'Sucesso', description: `Símbolo "${text}" criado.` });
  }, [newSymbolText, newSymbolImage, selectedCategoryKey, activeProfileId, toast]);
  const handleDeleteSymbol = async (id: number) => { if ((await db.symbols.get(id))?.profileId === activeProfileId) { await db.symbols.delete(id); toast({ title: 'Sucesso', description: 'Símbolo apagado.', variant: 'destructive' }); } };
  const handleEditSymbolClick = (symbol: DbSymbol) => { setEditingSymbolId(symbol.id!); setEditingSymbolText(symbol.text); };
  const handleUpdateSymbol = async () => { if (!editingSymbolId || !activeProfileId) return; const text = editingSymbolText.trim(); if (!text) { toast({ title: 'Erro', description: 'O texto não pode ser vazio.', variant: 'destructive' }); return; } if ((await db.symbols.get(editingSymbolId))?.profileId === activeProfileId) { await db.symbols.update(editingSymbolId, { text }); toast({ title: 'Sucesso', description: 'Símbolo atualizado.' }); } setEditingSymbolId(null); setEditingSymbolText(''); };
  const handleUpdateImage = async (symbolId: number, file: File) => { if ((await db.symbols.get(symbolId))?.profileId === activeProfileId) { await db.symbols.update(symbolId, { image: file }); toast({ title: 'Sucesso', description: 'Imagem alterada.' }); } };
  const handleRemoveImage = async (symbolId: number) => { if ((await db.symbols.get(symbolId))?.profileId === activeProfileId) { await db.symbols.update(symbolId, { image: undefined }); toast({ title: 'Sucesso', description: 'Imagem removida.', variant: 'destructive' }); } };

  return (
    <Card className="bg-black/30 border-white/10 text-white mt-6">
      <CardHeader><div className="flex justify-between items-center"><CardTitle>Gerenciar Símbolos</CardTitle><Button onClick={() => setIsOrganizeMode(!isOrganizeMode)} variant={isOrganizeMode ? 'default' : 'outline'}>{isOrganizeMode ? 'Concluir Organização' : 'Organizar Símbolos'}</Button></div></CardHeader>
      <CardContent>
        {!isOrganizeMode && <> <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mb-4"><div className="flex flex-col gap-2"><input type="text" value={newSymbolText} onChange={(e) => setNewSymbolText(e.target.value)} placeholder="Texto do novo símbolo" className="w-full bg-slate-100/80 rounded-lg px-3 text-slate-800 h-10" /><select value={selectedCategoryKey} onChange={(e) => setSelectedCategoryKey(e.target.value)} className="w-full bg-slate-100/80 rounded-lg px-2 text-slate-800 h-10">{data?.categories.map(cat => <option key={cat.key} value={cat.key}>{cat.name}</option>)}</select></div><div className="flex flex-col items-center gap-2"><label className="cursor-pointer flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-slate-400 rounded-lg text-slate-400 hover:bg-slate-700/50 hover:border-slate-300 hover:text-slate-300">{previewUrl ? <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg"/> : <ImageUp size={32} />}<input type="file" accept="image/*" onChange={handleImageChange} className="hidden" /></label><Button onClick={handleAddSymbol} className="w-full bg-sky-500"><PlusCircle size={16} className="mr-2"/>Adicionar</Button></div></div><div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder="Buscar símbolo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-100/80 rounded-lg pl-10 pr-4 py-2 text-slate-800" /></div></>}
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="symbols">
            {(provided) => (
              <ul className="space-y-2 max-h-96 overflow-y-auto pr-2" {...provided.droppableProps} ref={provided.innerRef}>
                {data?.symbols.map((sym, index) => (
                  <Draggable key={sym.id} draggableId={sym.id!.toString()} index={index} isDragDisabled={!isOrganizeMode}>
                    {(provided, snapshot) => (
                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`flex items-center justify-between bg-black/20 p-2 rounded-md ${snapshot.isDragging ? 'bg-blue-600' : ''}`}>
                        <div className="flex items-center gap-2">
                          {isOrganizeMode && <GripVertical className="cursor-move" />}
                          {sym.image && <img src={URL.createObjectURL(sym.image)} className="w-10 h-10 rounded-sm object-cover" alt={sym.text} />}
                          {isOrganizeMode || editingSymbolId === sym.id ? (<input type="text" value={editingSymbolId === sym.id ? editingSymbolText : sym.text} onChange={(e) => setEditingSymbolText(e.target.value)} disabled={!isOrganizeMode && editingSymbolId !== sym.id} className="bg-slate-100/80 rounded-lg px-2 text-slate-800" />) : (<span>{sym.text}</span>)}
                        </div>
                        {!isOrganizeMode && <div className="flex gap-2 ml-2">{editingSymbolId === sym.id ? (<Button onClick={handleUpdateSymbol} size="icon" className="bg-green-500"><Check size={16} /></Button>) : (<Button onClick={() => handleEditSymbolClick(sym)} size="icon" className="bg-blue-500"><Edit size={16} /></Button>)}{sym.image && <><input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => e.target.files && handleUpdateImage(sym.id!, e.target.files[0])} className="hidden" /><Button onClick={() => fileInputRef.current?.click()} size="icon" className="bg-purple-500"><RefreshCcw size={16} /></Button><Button onClick={() => handleRemoveImage(sym.id!)} size="icon" className="bg-orange-500"><ImageOff size={16} /></Button></>}<AlertDialog><AlertDialogTrigger asChild><Button size="icon" variant="destructive" className="bg-red-600/80"><Trash2 size={16} /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita. Isso vai apagar o símbolo permanentemente.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteSymbol(sym.id!)}>Apagar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>}
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
}

const BackupManager = () => {
    const { activeProfileId } = useProfile();
    const { toast } = useToast();
    const importFileRef = useRef<HTMLInputElement>(null);
  
    const handleExport = async () => {
      if (!activeProfileId) return;
      try {
        const profile = await db.profiles.get(activeProfileId);
        const categories = await db.categories.where({ profileId: activeProfileId }).toArray();
        const symbols = await db.symbols.where({ profileId: activeProfileId }).toArray();
        const symbolsWithBase64 = await Promise.all(symbols.map(async (s) => { if (s.image) { const reader = new FileReader(); return new Promise(resolve => { reader.onloadend = () => resolve({ ...s, image: reader.result }); reader.readAsDataURL(s.image!); }); } return s; }));
        const backupData = JSON.stringify({ profile, categories, symbols: symbolsWithBase64 }, null, 2);
        const blob = new Blob([backupData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meu-mundo-em-simbolos_backup_${profile?.name}_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: 'Sucesso', description: 'Seu backup foi salvo.' });
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
          const backupData = JSON.parse(e.target?.result as string);
          const { categories, symbols } = backupData;
          const symbolsWithBlobs = await Promise.all((symbols as any[]).map(async (s) => { if (s.image) { const res = await fetch(s.image); const blob = await res.blob(); return { ...s, image: blob, profileId: activeProfileId }; } return { ...s, profileId: activeProfileId }; }));
          await db.transaction('rw', db.categories, db.symbols, async () => { await db.categories.where({ profileId: activeProfileId }).delete(); await db.symbols.where({ profileId: activeProfileId }).delete(); await db.categories.bulkAdd(categories.map((c: any) => ({...c, profileId: activeProfileId}))); await db.symbols.bulkAdd(symbolsWithBlobs); });
          toast({ title: 'Sucesso', description: 'Seus dados foram restaurados a partir do backup.' });
        } catch (error) {
          console.error("Erro ao importar dados:", error);
          toast({ title: 'Erro', description: 'O arquivo de backup é inválido ou está corrompido.', variant: 'destructive' });
        }
      };
      reader.readAsText(file);
    };
  
    return (
      <Card className="bg-black/30 border-white/10 text-white mt-6">
        <CardHeader><CardTitle>Backup e Restauração</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="file" accept=".json" ref={importFileRef} onChange={handleImport} className="hidden" />
          <Button onClick={handleExport} className="h-16 text-lg bg-blue-600 hover:bg-blue-700"><Download className="mr-2" />Exportar Dados</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild><Button variant="outline" className="h-16 text-lg bg-orange-600 hover:bg-orange-700 text-white"><Upload className="mr-2" />Importar Dados</Button></AlertDialogTrigger>
            <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Aviso Importante</AlertDialogTitle><AlertDialogDescription>A importação de um backup irá **substituir todos os dados atuais** (categorias e símbolos) deste perfil. Esta ação não pode ser desfeita. Deseja continuar?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => importFileRef.current?.click()}>Continuar</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    );
  };


export const ManagementScreen = ({ onBack }: ManagementScreenProps) => {
  return (
    <div className="p-2 sm:p-4 md:p-6 min-h-screen font-sans"><header className="flex items-center justify-between mb-4"><Button variant="ghost" onClick={onBack} className="flex items-center gap-1 text-sm sm:text-base text-slate-200 font-semibold"><ChevronLeft className="h-5 w-5" />Voltar</Button><h1 className="text-lg sm:text-xl font-bold text-white">Meu Painel</h1><div className="w-16 sm:w-24"></div></header>
      <main>
        <CategoryManager />
        <SymbolManager />
        <BackupManager />
      </main>
    </div>
  );
};
