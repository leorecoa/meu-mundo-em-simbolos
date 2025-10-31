import { useState, useCallback, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Category, Symbol as DbSymbol } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Trash2, PlusCircle, Edit, Check, ImageUp, ImageOff, RefreshCcw, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

interface ManagementScreenProps {
  onBack: () => void;
}

const CategoryManager = () => {
  const { toast } = useToast();
  const categories = useLiveQuery(() => db.categories.toArray(), []);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('slate');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const handleAddCategory = useCallback(async () => {
    const name = newCategoryName.trim();
    if (!name) { toast({ title: 'Erro', description: 'O nome da categoria não pode ser vazio.', variant: 'destructive' }); return; }
    const key = name.toLowerCase().replace(/\s+/g, '-');
    await db.categories.add({ key, name, color: newCategoryColor });
    setNewCategoryName('');
    toast({ title: 'Sucesso', description: `Categoria "${name}" criada.` });
  }, [newCategoryName, newCategoryColor, toast]);

  const handleDeleteCategory = async (id: number) => {
    const category = await db.categories.get(id);
    if (category) {
      await db.symbols.where('categoryKey').equals(category.key).delete();
      await db.categories.delete(id);
      toast({ title: 'Sucesso', description: `Categoria "${category.name}" e seus símbolos foram apagados.`, variant: 'destructive' });
    }
  };

  const handleEditClick = (category: Category) => { setEditingCategoryId(category.id!); setEditingCategoryName(category.name); };
  const handleUpdateCategory = async () => {
    if (!editingCategoryId) return;
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
        <div className="flex gap-2 mb-4">
          <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nome da nova categoria" className="w-full bg-slate-100/80 rounded-lg px-3 text-slate-800" />
          <select value={newCategoryColor} onChange={(e) => setNewCategoryColor(e.target.value)} className="bg-slate-100/80 rounded-lg px-2 text-slate-800">
            <option value="slate">Cinza</option><option value="rose">Rosa</option><option value="amber">Âmbar</option><option value="sky">Céu</option><option value="emerald">Esmeralda</option>
          </select>
          <Button onClick={handleAddCategory} size="icon" className="bg-sky-500"><PlusCircle /></Button>
        </div>
        <ul className="space-y-2">
          {categories?.map(cat => (
            <li key={cat.id} className="flex items-center justify-between bg-black/20 p-2 rounded-md">
              {editingCategoryId === cat.id ? (<input type="text" value={editingCategoryName} onChange={(e) => setEditingCategoryName(e.target.value)} className="w-full bg-slate-100/80 rounded-lg px-2 text-slate-800" />) : (<span>{cat.name}</span>)}
              <div className="flex gap-2 ml-2">
                {editingCategoryId === cat.id ? (<Button onClick={handleUpdateCategory} size="icon" className="bg-green-500"><Check size={16} /></Button>) : (<Button onClick={() => handleEditClick(cat)} size="icon" className="bg-blue-500"><Edit size={16} /></Button>)}
                <AlertDialog><AlertDialogTrigger asChild><Button size="icon" variant="destructive" className="bg-red-600/80"><Trash2 size={16} /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita. Isso vai apagar permanentemente a categoria e todos os símbolos dentro dela.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteCategory(cat.id!)}>Apagar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

const SymbolManager = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de busca

  const data = useLiveQuery(async () => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const symbols = await db.symbols.filter(s => s.text.toLowerCase().includes(lowerSearchTerm)).toArray();
    const categories = await db.categories.toArray();
    return { symbols, categories };
  }, [searchTerm]); // Re-executa a query quando o termo de busca muda

  const [newSymbolText, setNewSymbolText] = useState('');
  const [newSymbolImage, setNewSymbolImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(data?.categories[0]?.key || '');
  const [editingSymbolId, setEditingSymbolId] = useState<number | null>(null);
  const [editingSymbolText, setEditingSymbolText] = useState('');

  useEffect(() => { if (data?.categories.length && !selectedCategoryKey) { setSelectedCategoryKey(data.categories[0].key); } }, [data?.categories, selectedCategoryKey]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) { setNewSymbolImage(file); setPreviewUrl(URL.createObjectURL(file)); } };
  const handleAddSymbol = useCallback(async () => {
    const text = newSymbolText.trim();
    if (!text || !selectedCategoryKey) { toast({ title: 'Erro', description: 'Texto e categoria são obrigatórios.', variant: 'destructive' }); return; }
    const symbolToAdd: DbSymbol = { text, categoryKey: selectedCategoryKey };
    if (newSymbolImage) { symbolToAdd.image = newSymbolImage; }
    await db.symbols.add(symbolToAdd);
    setNewSymbolText(''); setNewSymbolImage(null); setPreviewUrl(null);
    toast({ title: 'Sucesso', description: `Símbolo "${text}" criado.` });
  }, [newSymbolText, newSymbolImage, selectedCategoryKey, toast]);

  const handleDeleteSymbol = async (id: number) => { const symbol = await db.symbols.get(id); if (symbol) { await db.symbols.delete(id); toast({ title: 'Sucesso', description: `Símbolo "${symbol.text}" apagado.`, variant: 'destructive' }); } };
  const handleEditSymbolClick = (symbol: DbSymbol) => { setEditingSymbolId(symbol.id!); setEditingSymbolText(symbol.text); };
  const handleUpdateSymbol = async () => {
    if (!editingSymbolId) return;
    const text = editingSymbolText.trim();
    if (!text) { toast({ title: 'Erro', description: 'O texto do símbolo não pode ser vazio.', variant: 'destructive' }); return; }
    await db.symbols.update(editingSymbolId, { text });
    toast({ title: 'Sucesso', description: 'Símbolo atualizado.' });
    setEditingSymbolId(null); setEditingSymbolText('');
  };

  const handleUpdateImage = async (symbolId: number, file: File) => { await db.symbols.update(symbolId, { image: file }); toast({ title: 'Sucesso', description: 'Imagem do símbolo foi alterada.' }); };
  const handleRemoveImage = async (symbolId: number) => { await db.symbols.update(symbolId, { image: undefined }); toast({ title: 'Sucesso', description: 'Imagem do símbolo foi removida.', variant: 'destructive' }); };

  return (
    <Card className="bg-black/30 border-white/10 text-white mt-6">
      <CardHeader><CardTitle>Gerenciar Símbolos</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mb-4">
          <div className="flex flex-col gap-2"><input type="text" value={newSymbolText} onChange={(e) => setNewSymbolText(e.target.value)} placeholder="Texto do novo símbolo" className="w-full bg-slate-100/80 rounded-lg px-3 text-slate-800 h-10" /><select value={selectedCategoryKey} onChange={(e) => setSelectedCategoryKey(e.target.value)} className="w-full bg-slate-100/80 rounded-lg px-2 text-slate-800 h-10">{data?.categories.map(cat => <option key={cat.key} value={cat.key}>{cat.name}</option>)}</select></div>
          <div className="flex flex-col items-center gap-2"><label className="cursor-pointer flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-slate-400 rounded-lg text-slate-400 hover:bg-slate-700/50 hover:border-slate-300 hover:text-slate-300">{previewUrl ? <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg"/> : <ImageUp size={32} />}<input type="file" accept="image/*" onChange={handleImageChange} className="hidden" /></label><Button onClick={handleAddSymbol} className="w-full bg-sky-500"><PlusCircle size={16} className="mr-2"/>Adicionar</Button></div>
        </div>
        {/* Campo de Busca */}
        <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder="Buscar símbolo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-100/80 rounded-lg pl-10 pr-4 py-2 text-slate-800" /></div>
        <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {data?.symbols.map(sym => (
            <li key={sym.id} className="flex items-center justify-between bg-black/20 p-2 rounded-md">
              <div className="flex items-center gap-2">
                {sym.image && <img src={URL.createObjectURL(sym.image)} className="w-10 h-10 rounded-sm object-cover" alt={sym.text} />}
                {editingSymbolId === sym.id ? (<input type="text" value={editingSymbolText} onChange={(e) => setEditingSymbolText(e.target.value)} className="bg-slate-100/80 rounded-lg px-2 text-slate-800" />) : (<span>{sym.text}</span>)}
              </div>
              <div className="flex gap-2 ml-2">
                {editingSymbolId === sym.id ? (<Button onClick={handleUpdateSymbol} size="icon" className="bg-green-500"><Check size={16} /></Button>) : (<Button onClick={() => handleEditSymbolClick(sym)} size="icon" className="bg-blue-500"><Edit size={16} /></Button>)}
                {sym.image && <><input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => e.target.files && handleUpdateImage(sym.id!, e.target.files[0])} className="hidden" /><Button onClick={() => fileInputRef.current?.click()} size="icon" className="bg-purple-500"><RefreshCcw size={16} /></Button><Button onClick={() => handleRemoveImage(sym.id!)} size="icon" className="bg-orange-500"><ImageOff size={16} /></Button></>}
                <AlertDialog><AlertDialogTrigger asChild><Button size="icon" variant="destructive" className="bg-red-600/80"><Trash2 size={16} /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita. Isso vai apagar o símbolo permanentemente.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteSymbol(sym.id!)}>Apagar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export const ManagementScreen = ({ onBack }: ManagementScreenProps) => {
  return (
    <div className="p-2 sm:p-4 md:p-6 min-h-screen font-sans"><header className="flex items-center justify-between mb-4"><Button variant="ghost" onClick={onBack} className="flex items-center gap-1 text-sm sm:text-base text-slate-200 font-semibold"><ChevronLeft className="h-5 w-5" />Voltar</Button><h1 className="text-lg sm:text-xl font-bold text-white">Meu Painel</h1><div className="w-16 sm:w-24"></div></header><main><CategoryManager /><SymbolManager /></main></div>
  );
};
