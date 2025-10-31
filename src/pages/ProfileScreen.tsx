import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, User, Trash2 } from 'lucide-react';

interface ProfileScreenProps {
  onProfileSelect: (profileId: number) => void;
}

export const ProfileScreen = ({ onProfileSelect }: ProfileScreenProps) => {
  const profiles = useLiveQuery(() => db.profiles.toArray(), []);
  const [newProfileName, setNewProfileName] = useState('');

  const handleAddProfile = async () => {
    const name = newProfileName.trim();
    if (!name) return;

    // Adiciona o novo perfil e obtém seu ID
    const newProfileId = await db.profiles.add({ name });

    // Popula o banco de dados com os dados iniciais para este novo perfil
    await db.populateForProfile(newProfileId);

    // Seleciona o perfil recém-criado
    onProfileSelect(newProfileId);

    setNewProfileName('');
  };

  const handleDeleteProfile = async (id: number) => {
    if (window.confirm('Tem certeza que deseja apagar este perfil? Todos os seus dados (categorias e símbolos) serão perdidos para sempre.')) {
      await db.transaction('rw', db.profiles, db.categories, db.symbols, async () => {
        await db.categories.where('profileId').equals(id).delete();
        await db.symbols.where('profileId').equals(id).delete();
        await db.profiles.delete(id);
      });
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/30 border-white/10 text-white shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Quem está usando?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={newProfileName} 
              onChange={(e) => setNewProfileName(e.target.value)} 
              placeholder="Nome do novo perfil..."
              className="w-full bg-slate-100/80 rounded-lg px-3 text-slate-800 h-10"
            />
            <Button onClick={handleAddProfile} className="bg-sky-500 h-10"><PlusCircle className="mr-2" size={18}/>Criar</Button>
          </div>

          <div className="space-y-3">
            {profiles?.map(profile => (
              <div key={profile.id} className="flex items-center gap-2">
                <Button 
                  onClick={() => onProfileSelect(profile.id!)} 
                  className="flex-grow h-16 text-lg justify-start bg-black/20 hover:bg-black/40"
                >
                  <User className="mr-4 ml-2" />
                  {profile.name}
                </Button>
                <Button onClick={() => handleDeleteProfile(profile.id!)} size="icon" variant="destructive" className="h-16 bg-red-600/80"><Trash2 /></Button>
              </div>
            ))}
          </div>
          {profiles?.length === 0 && (
            <p className="text-center text-slate-400 mt-6">Nenhum perfil encontrado. Crie um para começar!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
