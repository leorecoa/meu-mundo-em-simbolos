import { useState } from 'react';
import { Star, PlusCircle, Calendar, Clock, BarChart2, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface BehaviorEvent {
  id: string;
  date: string;
  time: string;
  behavior: string;
  trigger: string;
  response: string;
  outcome: string;
  intensity: 'low' | 'medium' | 'high';
  notes: string;
}

export const BehaviorTracker = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<BehaviorEvent[]>(() => {
    const saved = localStorage.getItem('myat-behavior-events');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<BehaviorEvent>>({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    behavior: '',
    trigger: '',
    response: '',
    outcome: '',
    intensity: 'medium',
    notes: ''
  });
  
  const [behaviors, setBehaviors] = useState<string[]>(() => {
    const saved = localStorage.getItem('myat-behaviors');
    return saved ? JSON.parse(saved) : [
      'Agitação',
      'Choro',
      'Autoagressão',
      'Recusa',
      'Estereotipia',
      'Isolamento'
    ];
  });
  
  const [triggers, setTriggers] = useState<string[]>(() => {
    const saved = localStorage.getItem('myat-triggers');
    return saved ? JSON.parse(saved) : [
      'Mudança de rotina',
      'Barulho alto',
      'Multidão',
      'Frustração',
      'Cansaço',
      'Fome'
    ];
  });
  
  const [responses, setResponses] = useState<string[]>(() => {
    const saved = localStorage.getItem('myat-responses');
    return saved ? JSON.parse(saved) : [
      'Redirecionamento',
      'Tempo de pausa',
      'Suporte sensorial',
      'Comunicação alternativa',
      'Reforço positivo'
    ];
  });
  
  const handleSaveEvent = () => {
    if (!newEvent.behavior || !newEvent.date) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o comportamento e a data",
        variant: "destructive",
      });
      return;
    }

    // Add behavior, trigger and response to their respective lists if they don't exist
    if (newEvent.behavior && !behaviors.includes(newEvent.behavior)) {
      const updatedBehaviors = [...behaviors, newEvent.behavior];
      setBehaviors(updatedBehaviors);
      localStorage.setItem('myat-behaviors', JSON.stringify(updatedBehaviors));
    }
    
    if (newEvent.trigger && !triggers.includes(newEvent.trigger)) {
      const updatedTriggers = [...triggers, newEvent.trigger];
      setTriggers(updatedTriggers);
      localStorage.setItem('myat-triggers', JSON.stringify(updatedTriggers));
    }
    
    if (newEvent.response && !responses.includes(newEvent.response)) {
      const updatedResponses = [...responses, newEvent.response];
      setResponses(updatedResponses);
      localStorage.setItem('myat-responses', JSON.stringify(updatedResponses));
    }

    const newEventWithId = {
      ...newEvent,
      id: Date.now().toString()
    } as BehaviorEvent;
    
    const updatedEvents = [...events, newEventWithId];
    setEvents(updatedEvents);
    localStorage.setItem('myat-behavior-events', JSON.stringify(updatedEvents));
    
    toast({
      title: "Evento registrado",
      description: "Novo evento de comportamento adicionado com sucesso",
    });
    
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewEvent({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      behavior: '',
      trigger: '',
      response: '',
      outcome: '',
      intensity: 'medium',
      notes: ''
    });
  };

  // Group events by date
  const groupedEvents = events.reduce((groups: Record<string, BehaviorEvent[]>, event) => {
    const date = event.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {});

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Get behavior frequency
  const behaviorCounts = events.reduce((counts: Record<string, number>, event) => {
    if (!counts[event.behavior]) {
      counts[event.behavior] = 0;
    }
    counts[event.behavior]++;
    return counts;
  }, {});

  // Sort behaviors by frequency
  const sortedBehaviors = Object.entries(behaviorCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-indigo-800">Rastreador de Comportamento</h2>
        <Button 
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Registrar Comportamento
        </Button>
      </div>

      {/* Dashboard */}
      {events.length > 0 && (
        <Card className="p-4 bg-indigo-50">
          <h3 className="font-medium text-indigo-800 mb-3">Resumo</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-indigo-700 mb-2">Comportamentos mais frequentes:</p>
              <div className="space-y-2">
                {sortedBehaviors.map(([behavior, count]) => (
                  <div key={behavior} className="flex items-center justify-between">
                    <span className="text-sm">{behavior}</span>
                    <Badge className="bg-indigo-100 text-indigo-800">{count}x</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-indigo-700 mb-2">Estatísticas:</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total de registros:</span>
                  <Badge className="bg-indigo-100 text-indigo-800">{events.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Último registro:</span>
                  <Badge className="bg-indigo-100 text-indigo-800">
                    {new Date(events[events.length - 1].date).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
              <Button 
                variant="link" 
                className="text-xs text-indigo-600 p-0 h-auto flex items-center mt-2"
                onClick={() => {
                  toast({
                    title: "Análise de Comportamento",
                    description: "Funcionalidade de análise detalhada em desenvolvimento",
                  });
                }}
              >
                <BarChart2 className="h-3 w-3 mr-1" />
                Ver análise completa
              </Button>
            </div>
          </div>
        </Card>
      )}

      {events.length === 0 ? (
        <Card className="p-8 text-center bg-slate-50">
          <Star className="h-12 w-12 mx-auto text-slate-400 mb-2" />
          <h3 className="text-lg font-medium text-slate-700">Nenhum comportamento registrado</h3>
          <p className="text-slate-500 mb-4">Registre comportamentos para identificar padrões</p>
          <Button 
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Registrar Comportamento
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
                {groupedEvents[date].map(event => (
                  <Card key={event.id} className="p-4 bg-white hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={`
                              ${event.intensity === 'low' ? 'bg-green-100 text-green-800' : 
                                event.intensity === 'medium' ? 'bg-amber-100 text-amber-800' : 
                                'bg-red-100 text-red-800'}
                            `}
                          >
                            {event.intensity === 'low' ? 'Baixa' : 
                             event.intensity === 'medium' ? 'Média' : 'Alta'} intensidade
                          </Badge>
                          <div className="flex items-center text-sm text-slate-500">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>{event.time}</span>
                          </div>
                        </div>
                        
                        <h4 className="font-medium text-indigo-900 mt-2">{event.behavior}</h4>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
                          {event.trigger && (
                            <div>
                              <p className="text-xs font-medium text-slate-500">Gatilho:</p>
                              <p className="text-slate-700">{event.trigger}</p>
                            </div>
                          )}
                          
                          {event.response && (
                            <div>
                              <p className="text-xs font-medium text-slate-500">Resposta:</p>
                              <p className="text-slate-700">{event.response}</p>
                            </div>
                          )}
                          
                          {event.outcome && (
                            <div className="col-span-2 mt-1">
                              <p className="text-xs font-medium text-slate-500">Resultado:</p>
                              <p className="text-slate-700 flex items-center gap-1">
                                {event.outcome === 'positivo' ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : event.outcome === 'negativo' ? (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                ) : (
                                  <Info className="h-4 w-4 text-amber-500" />
                                )}
                                {event.outcome === 'positivo' ? 'Positivo' : 
                                 event.outcome === 'negativo' ? 'Negativo' : 'Neutro'}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {event.notes && (
                          <div className="mt-3 text-sm bg-slate-50 p-2 rounded">
                            <p className="text-xs font-medium text-slate-500 mb-1">Observações:</p>
                            <p className="text-slate-600">{event.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog para registrar comportamento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Comportamento</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <label htmlFor="date" className="text-sm font-medium">Data</label>
                <Input 
                  id="date" 
                  type="date" 
                  value={newEvent.date} 
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="time" className="text-sm font-medium">Hora</label>
                <Input 
                  id="time" 
                  type="time" 
                  value={newEvent.time} 
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="behavior" className="text-sm font-medium">Comportamento</label>
              <Select 
                value={newEvent.behavior} 
                onValueChange={(value) => setNewEvent({...newEvent, behavior: value})}
              >
                <SelectTrigger id="behavior" className="w-full">
                  <SelectValue placeholder="Selecione ou digite um comportamento" />
                </SelectTrigger>
                <SelectContent>
                  {behaviors.map((behavior) => (
                    <SelectItem key={behavior} value={behavior}>{behavior}</SelectItem>
                  ))}
                  <SelectItem value="outro">Outro (digite abaixo)</SelectItem>
                </SelectContent>
              </Select>
              {newEvent.behavior === 'outro' && (
                <Input 
                  placeholder="Digite o comportamento" 
                  value=""
                  onChange={(e) => setNewEvent({...newEvent, behavior: e.target.value})}
                  className="mt-2"
                />
              )}
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="intensity" className="text-sm font-medium">Intensidade</label>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant={newEvent.intensity === 'low' ? 'default' : 'outline'}
                  className={`flex-1 ${newEvent.intensity === 'low' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => setNewEvent({...newEvent, intensity: 'low'})}
                >
                  Baixa
                </Button>
                <Button 
                  type="button" 
                  variant={newEvent.intensity === 'medium' ? 'default' : 'outline'}
                  className={`flex-1 ${newEvent.intensity === 'medium' ? 'bg-amber-600 hover:bg-amber-700' : ''}`}
                  onClick={() => setNewEvent({...newEvent, intensity: 'medium'})}
                >
                  Média
                </Button>
                <Button 
                  type="button" 
                  variant={newEvent.intensity === 'high' ? 'default' : 'outline'}
                  className={`flex-1 ${newEvent.intensity === 'high' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                  onClick={() => setNewEvent({...newEvent, intensity: 'high'})}
                >
                  Alta
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="trigger" className="text-sm font-medium">Gatilho (opcional)</label>
              <Select 
                value={newEvent.trigger || ''} 
                onValueChange={(value) => setNewEvent({...newEvent, trigger: value})}
              >
                <SelectTrigger id="trigger" className="w-full">
                  <SelectValue placeholder="O que causou o comportamento?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Não identificado</SelectItem>
                  {triggers.map((trigger) => (
                    <SelectItem key={trigger} value={trigger}>{trigger}</SelectItem>
                  ))}
                  <SelectItem value="outro">Outro (digite abaixo)</SelectItem>
                </SelectContent>
              </Select>
              {newEvent.trigger === 'outro' && (
                <Input 
                  placeholder="Digite o gatilho" 
                  value=""
                  onChange={(e) => setNewEvent({...newEvent, trigger: e.target.value})}
                  className="mt-2"
                />
              )}
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="response" className="text-sm font-medium">Resposta (opcional)</label>
              <Select 
                value={newEvent.response || ''} 
                onValueChange={(value) => setNewEvent({...newEvent, response: value})}
              >
                <SelectTrigger id="response" className="w-full">
                  <SelectValue placeholder="Como você respondeu?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Não especificado</SelectItem>
                  {responses.map((response) => (
                    <SelectItem key={response} value={response}>{response}</SelectItem>
                  ))}
                  <SelectItem value="outro">Outro (digite abaixo)</SelectItem>
                </SelectContent>
              </Select>
              {newEvent.response === 'outro' && (
                <Input 
                  placeholder="Digite a resposta" 
                  value=""
                  onChange={(e) => setNewEvent({...newEvent, response: e.target.value})}
                  className="mt-2"
                />
              )}
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="outcome" className="text-sm font-medium">Resultado (opcional)</label>
              <Select 
                value={newEvent.outcome || ''} 
                onValueChange={(value) => setNewEvent({...newEvent, outcome: value})}
              >
                <SelectTrigger id="outcome" className="w-full">
                  <SelectValue placeholder="Qual foi o resultado?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Não especificado</SelectItem>
                  <SelectItem value="positivo">Positivo</SelectItem>
                  <SelectItem value="neutro">Neutro</SelectItem>
                  <SelectItem value="negativo">Negativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="notes" className="text-sm font-medium">Observações (opcional)</label>
              <Textarea 
                id="notes" 
                value={newEvent.notes || ''} 
                onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                placeholder="Observações adicionais sobre o comportamento"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEvent} className="bg-indigo-600 hover:bg-indigo-700">
              Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};