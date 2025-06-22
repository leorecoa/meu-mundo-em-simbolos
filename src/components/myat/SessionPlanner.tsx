import { useState } from 'react';
import { Calendar, Clock, PlusCircle, Edit, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Session {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  objectives: string[];
  materials: string[];
  notes: string;
}

export const SessionPlanner = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('myat-sessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [newSession, setNewSession] = useState<Partial<Session>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 60,
    objectives: [],
    materials: [],
    notes: ''
  });
  
  const [newObjective, setNewObjective] = useState('');
  const [newMaterial, setNewMaterial] = useState('');

  const handleSaveSession = () => {
    if (!newSession.title || !newSession.date || !newSession.time) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título, data e hora da sessão",
        variant: "destructive",
      });
      return;
    }

    if (editingSession) {
      // Editar sessão existente
      const updatedSessions = sessions.map(session => 
        session.id === editingSession.id ? { ...newSession, id: session.id } as Session : session
      );
      setSessions(updatedSessions);
      localStorage.setItem('myat-sessions', JSON.stringify(updatedSessions));
      toast({
        title: "Sessão atualizada",
        description: "As alterações foram salvas com sucesso",
      });
    } else {
      // Criar nova sessão
      const newSessionWithId = {
        ...newSession,
        id: Date.now().toString()
      } as Session;
      
      const updatedSessions = [...sessions, newSessionWithId];
      setSessions(updatedSessions);
      localStorage.setItem('myat-sessions', JSON.stringify(updatedSessions));
      toast({
        title: "Sessão criada",
        description: "Nova sessão adicionada com sucesso",
      });
    }
    
    setIsDialogOpen(false);
    setEditingSession(null);
    resetForm();
  };

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    setNewSession({ ...session });
    setIsDialogOpen(true);
  };

  const handleDeleteSession = (id: string) => {
    const updatedSessions = sessions.filter(session => session.id !== id);
    setSessions(updatedSessions);
    localStorage.setItem('myat-sessions', JSON.stringify(updatedSessions));
    toast({
      title: "Sessão removida",
      description: "A sessão foi excluída com sucesso",
    });
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setNewSession(prev => ({
        ...prev,
        objectives: [...(prev.objectives || []), newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setNewSession(prev => ({
      ...prev,
      objectives: prev.objectives?.filter((_, i) => i !== index)
    }));
  };

  const addMaterial = () => {
    if (newMaterial.trim()) {
      setNewSession(prev => ({
        ...prev,
        materials: [...(prev.materials || []), newMaterial.trim()]
      }));
      setNewMaterial('');
    }
  };

  const removeMaterial = (index: number) => {
    setNewSession(prev => ({
      ...prev,
      materials: prev.materials?.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setNewSession({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: 60,
      objectives: [],
      materials: [],
      notes: ''
    });
    setNewObjective('');
    setNewMaterial('');
  };

  // Agrupar sessões por data
  const groupedSessions = sessions.reduce((groups: Record<string, Session[]>, session) => {
    const date = session.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(session);
    return groups;
  }, {});

  // Ordenar datas
  const sortedDates = Object.keys(groupedSessions).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-indigo-800">Planejador de Sessões</h2>
        <Button 
          onClick={() => {
            resetForm();
            setEditingSession(null);
            setIsDialogOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Sessão
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card className="p-8 text-center bg-slate-50">
          <Calendar className="h-12 w-12 mx-auto text-slate-400 mb-2" />
          <h3 className="text-lg font-medium text-slate-700">Nenhuma sessão planejada</h3>
          <p className="text-slate-500 mb-4">Crie sua primeira sessão para começar</p>
          <Button 
            onClick={() => {
              resetForm();
              setEditingSession(null);
              setIsDialogOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Criar Sessão
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date} className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <h3 className="font-medium text-indigo-800">
                  {new Date(date).toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long'
                  })}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {groupedSessions[date].map(session => (
                  <Card key={session.id} className="p-4 bg-white hover:shadow-md transition-shadow">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-indigo-900">{session.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{session.time} • {session.duration} min</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-slate-500"
                          onClick={() => handleEditSession(session)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-slate-500"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {session.objectives && session.objectives.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-slate-500 mb-1">Objetivos:</p>
                        <div className="flex flex-wrap gap-1">
                          {session.objectives.slice(0, 3).map((objective, i) => (
                            <Badge key={i} variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                              {objective}
                            </Badge>
                          ))}
                          {session.objectives.length > 3 && (
                            <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200">
                              +{session.objectives.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog para criar/editar sessão */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSession ? 'Editar Sessão' : 'Nova Sessão'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">Título da Sessão</label>
              <Input 
                id="title" 
                value={newSession.title} 
                onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                placeholder="Ex: Terapia de Linguagem"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <label htmlFor="date" className="text-sm font-medium">Data</label>
                <Input 
                  id="date" 
                  type="date" 
                  value={newSession.date} 
                  onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="time" className="text-sm font-medium">Hora</label>
                <Input 
                  id="time" 
                  type="time" 
                  value={newSession.time} 
                  onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="duration" className="text-sm font-medium">Duração (minutos)</label>
              <Input 
                id="duration" 
                type="number" 
                value={newSession.duration} 
                onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value) || 60})}
                min="15"
                step="15"
              />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Objetivos</label>
              <div className="flex gap-2">
                <Input 
                  value={newObjective} 
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Adicionar objetivo"
                  onKeyDown={(e) => e.key === 'Enter' && addObjective()}
                />
                <Button type="button" onClick={addObjective} className="shrink-0">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              
              {newSession.objectives && newSession.objectives.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newSession.objectives.map((objective, index) => (
                    <Badge key={index} className="pl-2 pr-1 py-1 flex items-center gap-1 bg-indigo-50 text-indigo-700 border-indigo-200">
                      {objective}
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0 rounded-full hover:bg-indigo-100"
                        onClick={() => removeObjective(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Materiais Necessários</label>
              <div className="flex gap-2">
                <Input 
                  value={newMaterial} 
                  onChange={(e) => setNewMaterial(e.target.value)}
                  placeholder="Adicionar material"
                  onKeyDown={(e) => e.key === 'Enter' && addMaterial()}
                />
                <Button type="button" onClick={addMaterial} className="shrink-0">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              
              {newSession.materials && newSession.materials.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newSession.materials.map((material, index) => (
                    <Badge key={index} className="pl-2 pr-1 py-1 flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200">
                      {material}
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0 rounded-full hover:bg-purple-100"
                        onClick={() => removeMaterial(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="notes" className="text-sm font-medium">Observações</label>
              <Textarea 
                id="notes" 
                value={newSession.notes} 
                onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                placeholder="Observações adicionais sobre a sessão"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveSession} className="bg-indigo-600 hover:bg-indigo-700">
              {editingSession ? 'Salvar Alterações' : 'Criar Sessão'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};