import { useState } from 'react';
import { Clock, PlusCircle, Edit, Trash2, MoveUp, MoveDown, Image, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface RoutineStep {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  duration?: number;
}

interface Routine {
  id: string;
  title: string;
  description: string;
  steps: RoutineStep[];
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'any';
}

export const RoutineBuilder = () => {
  const { toast } = useToast();
  const [routines, setRoutines] = useState<Routine[]>(() => {
    const saved = localStorage.getItem('myat-routines');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStepDialogOpen, setIsStepDialogOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [editingStep, setEditingStep] = useState<{routineId: string, step: RoutineStep} | null>(null);
  const [activeRoutine, setActiveRoutine] = useState<string | null>(null);
  
  const [newRoutine, setNewRoutine] = useState<Partial<Routine>>({
    title: '',
    description: '',
    steps: [],
    timeOfDay: 'morning'
  });
  
  const [newStep, setNewStep] = useState<Partial<RoutineStep>>({
    title: '',
    description: '',
    imageUrl: '',
    duration: 5
  });

  const handleSaveRoutine = () => {
    if (!newRoutine.title) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha o título da rotina",
        variant: "destructive",
      });
      return;
    }

    if (editingRoutine) {
      // Update existing routine
      const updatedRoutines = routines.map(routine => 
        routine.id === editingRoutine.id ? { ...newRoutine, id: routine.id, steps: routine.steps } as Routine : routine
      );
      setRoutines(updatedRoutines);
      localStorage.setItem('myat-routines', JSON.stringify(updatedRoutines));
      toast({
        title: "Rotina atualizada",
        description: "As alterações foram salvas com sucesso",
      });
    } else {
      // Create new routine
      const newRoutineWithId = {
        ...newRoutine,
        id: Date.now().toString(),
        steps: []
      } as Routine;
      
      const updatedRoutines = [...routines, newRoutineWithId];
      setRoutines(updatedRoutines);
      localStorage.setItem('myat-routines', JSON.stringify(updatedRoutines));
      
      // Set as active routine
      setActiveRoutine(newRoutineWithId.id);
      
      toast({
        title: "Rotina criada",
        description: "Nova rotina adicionada com sucesso",
      });
    }
    
    setIsDialogOpen(false);
    setEditingRoutine(null);
    resetRoutineForm();
  };

  const handleSaveStep = () => {
    if (!newStep.title || !activeRoutine) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título do passo",
        variant: "destructive",
      });
      return;
    }

    const updatedRoutines = [...routines];
    const routineIndex = updatedRoutines.findIndex(r => r.id === activeRoutine);
    
    if (routineIndex === -1) return;
    
    if (editingStep) {
      // Update existing step
      const stepIndex = updatedRoutines[routineIndex].steps.findIndex(
        step => step.id === editingStep.step.id
      );
      
      if (stepIndex !== -1) {
        updatedRoutines[routineIndex].steps[stepIndex] = {
          ...updatedRoutines[routineIndex].steps[stepIndex],
          title: newStep.title || '',
          description: newStep.description || '',
          imageUrl: newStep.imageUrl,
          duration: newStep.duration
        };
      }
    } else {
      // Create new step
      const newStepWithId = {
        id: Date.now().toString(),
        title: newStep.title || '',
        description: newStep.description || '',
        imageUrl: newStep.imageUrl,
        duration: newStep.duration
      };
      
      updatedRoutines[routineIndex].steps.push(newStepWithId);
    }
    
    setRoutines(updatedRoutines);
    localStorage.setItem('myat-routines', JSON.stringify(updatedRoutines));
    
    toast({
      title: editingStep ? "Passo atualizado" : "Passo adicionado",
      description: editingStep ? "As alterações foram salvas com sucesso" : "Novo passo adicionado com sucesso",
    });
    
    setIsStepDialogOpen(false);
    setEditingStep(null);
    resetStepForm();
  };

  const handleDeleteRoutine = (id: string) => {
    const updatedRoutines = routines.filter(routine => routine.id !== id);
    setRoutines(updatedRoutines);
    localStorage.setItem('myat-routines', JSON.stringify(updatedRoutines));
    
    if (activeRoutine === id) {
      setActiveRoutine(null);
    }
    
    toast({
      title: "Rotina removida",
      description: "A rotina foi excluída com sucesso",
    });
  };

  const handleDeleteStep = (routineId: string, stepId: string) => {
    const updatedRoutines = [...routines];
    const routineIndex = updatedRoutines.findIndex(r => r.id === routineId);
    
    if (routineIndex !== -1) {
      updatedRoutines[routineIndex].steps = updatedRoutines[routineIndex].steps.filter(
        step => step.id !== stepId
      );
      
      setRoutines(updatedRoutines);
      localStorage.setItem('myat-routines', JSON.stringify(updatedRoutines));
      
      toast({
        title: "Passo removido",
        description: "O passo foi excluído com sucesso",
      });
    }
  };

  const handleMoveStep = (routineId: string, stepId: string, direction: 'up' | 'down') => {
    const updatedRoutines = [...routines];
    const routineIndex = updatedRoutines.findIndex(r => r.id === routineId);
    
    if (routineIndex === -1) return;
    
    const steps = [...updatedRoutines[routineIndex].steps];
    const stepIndex = steps.findIndex(step => step.id === stepId);
    
    if (stepIndex === -1) return;
    
    if (direction === 'up' && stepIndex > 0) {
      // Move step up
      [steps[stepIndex - 1], steps[stepIndex]] = [steps[stepIndex], steps[stepIndex - 1]];
    } else if (direction === 'down' && stepIndex < steps.length - 1) {
      // Move step down
      [steps[stepIndex], steps[stepIndex + 1]] = [steps[stepIndex + 1], steps[stepIndex]];
    }
    
    updatedRoutines[routineIndex].steps = steps;
    setRoutines(updatedRoutines);
    localStorage.setItem('myat-routines', JSON.stringify(updatedRoutines));
  };

  const resetRoutineForm = () => {
    setNewRoutine({
      title: '',
      description: '',
      steps: [],
      timeOfDay: 'morning'
    });
  };

  const resetStepForm = () => {
    setNewStep({
      title: '',
      description: '',
      imageUrl: '',
      duration: 5
    });
  };

  const getTimeOfDayLabel = (timeOfDay: string) => {
    switch(timeOfDay) {
      case 'morning': return "Manhã";
      case 'afternoon': return "Tarde";
      case 'evening': return "Noite";
      case 'any': return "Qualquer hora";
      default: return timeOfDay;
    }
  };

  const getTimeOfDayColor = (timeOfDay: string) => {
    switch(timeOfDay) {
      case 'morning': return "bg-amber-100 text-amber-800";
      case 'afternoon': return "bg-blue-100 text-blue-800";
      case 'evening': return "bg-indigo-100 text-indigo-800";
      case 'any': return "bg-green-100 text-green-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  // Calculate total duration of a routine
  const getRoutineDuration = (steps: RoutineStep[]) => {
    return steps.reduce((total, step) => total + (step.duration || 0), 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-indigo-800">Construtor de Rotinas</h2>
        <Button 
          onClick={() => {
            resetRoutineForm();
            setEditingRoutine(null);
            setIsDialogOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Rotina
        </Button>
      </div>

      {routines.length === 0 ? (
        <Card className="p-8 text-center bg-slate-50">
          <Clock className="h-12 w-12 mx-auto text-slate-400 mb-2" />
          <h3 className="text-lg font-medium text-slate-700">Nenhuma rotina criada</h3>
          <p className="text-slate-500 mb-4">Crie rotinas visuais para ajudar na organização do dia</p>
          <Button 
            onClick={() => {
              resetRoutineForm();
              setEditingRoutine(null);
              setIsDialogOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Criar Rotina
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Routine list */}
          <div className="space-y-4">
            <h3 className="font-medium text-indigo-800">Minhas Rotinas</h3>
            {routines.map(routine => (
              <Card 
                key={routine.id} 
                className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                  activeRoutine === routine.id ? 'border-2 border-indigo-500' : ''
                }`}
                onClick={() => setActiveRoutine(routine.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-indigo-900">{routine.title}</h4>
                    {routine.description && (
                      <p className="text-sm text-slate-600 mt-1">{routine.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getTimeOfDayColor(routine.timeOfDay)}>
                        {getTimeOfDayLabel(routine.timeOfDay)}
                      </Badge>
                      <Badge variant="outline" className="bg-slate-50">
                        <Clock className="h-3 w-3 mr-1" />
                        {getRoutineDuration(routine.steps)} min
                      </Badge>
                      <Badge variant="outline" className="bg-slate-50">
                        {routine.steps.length} passos
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-slate-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingRoutine(routine);
                        setNewRoutine({
                          title: routine.title,
                          description: routine.description,
                          timeOfDay: routine.timeOfDay
                        });
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-slate-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoutine(routine.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Routine steps */}
          <div className="space-y-4">
            {activeRoutine ? (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-indigo-800">
                    Passos da Rotina
                  </h3>
                  <Button 
                    onClick={() => {
                      resetStepForm();
                      setEditingStep(null);
                      setIsStepDialogOpen(true);
                    }}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Adicionar Passo
                  </Button>
                </div>
                
                {routines.find(r => r.id === activeRoutine)?.steps.length === 0 ? (
                  <Card className="p-6 text-center bg-slate-50">
                    <p className="text-slate-500 mb-3">Esta rotina ainda não tem passos</p>
                    <Button 
                      onClick={() => {
                        resetStepForm();
                        setEditingStep(null);
                        setIsStepDialogOpen(true);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Adicionar Primeiro Passo
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {routines.find(r => r.id === activeRoutine)?.steps.map((step, index, steps) => (
                      <Card key={step.id} className="p-4 bg-white">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium text-indigo-900">{step.title}</h4>
                              {step.description && (
                                <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                              )}
                              {step.duration && (
                                <div className="flex items-center text-xs text-slate-500 mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{step.duration} min</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {index > 0 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 text-slate-500"
                                onClick={() => handleMoveStep(activeRoutine, step.id, 'up')}
                              >
                                <MoveUp className="h-4 w-4" />
                              </Button>
                            )}
                            {index < steps.length - 1 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 text-slate-500"
                                onClick={() => handleMoveStep(activeRoutine, step.id, 'down')}
                              >
                                <MoveDown className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0 text-slate-500"
                              onClick={() => {
                                setEditingStep({ routineId: activeRoutine, step });
                                setNewStep({
                                  title: step.title,
                                  description: step.description,
                                  imageUrl: step.imageUrl,
                                  duration: step.duration
                                });
                                setIsStepDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0 text-slate-500"
                              onClick={() => handleDeleteStep(activeRoutine, step.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {step.imageUrl && (
                          <div className="mt-3 flex justify-center">
                            <img 
                              src={step.imageUrl} 
                              alt={step.title} 
                              className="max-h-32 rounded-md object-contain"
                            />
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Card className="p-6 text-center bg-slate-50">
                <p className="text-slate-500">Selecione uma rotina para ver seus passos</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Dialog para criar/editar rotina */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingRoutine ? 'Editar Rotina' : 'Nova Rotina'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">Título da Rotina</label>
              <Input 
                id="title" 
                value={newRoutine.title} 
                onChange={(e) => setNewRoutine({...newRoutine, title: e.target.value})}
                placeholder="Ex: Rotina da Manhã"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Descrição (opcional)</label>
              <Textarea 
                id="description" 
                value={newRoutine.description} 
                onChange={(e) => setNewRoutine({...newRoutine, description: e.target.value})}
                placeholder="Descreva a rotina"
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="timeOfDay" className="text-sm font-medium">Momento do Dia</label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  type="button" 
                  variant={newRoutine.timeOfDay === 'morning' ? 'default' : 'outline'}
                  className={newRoutine.timeOfDay === 'morning' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                  onClick={() => setNewRoutine({...newRoutine, timeOfDay: 'morning'})}
                >
                  Manhã
                </Button>
                <Button 
                  type="button" 
                  variant={newRoutine.timeOfDay === 'afternoon' ? 'default' : 'outline'}
                  className={newRoutine.timeOfDay === 'afternoon' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  onClick={() => setNewRoutine({...newRoutine, timeOfDay: 'afternoon'})}
                >
                  Tarde
                </Button>
                <Button 
                  type="button" 
                  variant={newRoutine.timeOfDay === 'evening' ? 'default' : 'outline'}
                  className={newRoutine.timeOfDay === 'evening' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                  onClick={() => setNewRoutine({...newRoutine, timeOfDay: 'evening'})}
                >
                  Noite
                </Button>
                <Button 
                  type="button" 
                  variant={newRoutine.timeOfDay === 'any' ? 'default' : 'outline'}
                  className={newRoutine.timeOfDay === 'any' ? 'bg-green-600 hover:bg-green-700' : ''}
                  onClick={() => setNewRoutine({...newRoutine, timeOfDay: 'any'})}
                >
                  Qualquer hora
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveRoutine} className="bg-indigo-600 hover:bg-indigo-700">
              {editingRoutine ? 'Salvar Alterações' : 'Criar Rotina'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog para criar/editar passo */}
      <Dialog open={isStepDialogOpen} onOpenChange={setIsStepDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingStep ? 'Editar Passo' : 'Novo Passo'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="stepTitle" className="text-sm font-medium">Título do Passo</label>
              <Input 
                id="stepTitle" 
                value={newStep.title} 
                onChange={(e) => setNewStep({...newStep, title: e.target.value})}
                placeholder="Ex: Escovar os dentes"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="stepDescription" className="text-sm font-medium">Descrição (opcional)</label>
              <Textarea 
                id="stepDescription" 
                value={newStep.description} 
                onChange={(e) => setNewStep({...newStep, description: e.target.value})}
                placeholder="Instruções para este passo"
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="imageUrl" className="text-sm font-medium">URL da Imagem (opcional)</label>
              <div className="flex gap-2">
                <Input 
                  id="imageUrl" 
                  value={newStep.imageUrl || ''} 
                  onChange={(e) => setNewStep({...newStep, imageUrl: e.target.value})}
                  placeholder="https://..."
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="shrink-0"
                  onClick={() => {
                    toast({
                      title: "Seleção de imagem",
                      description: "Funcionalidade de upload de imagem em desenvolvimento",
                    });
                  }}
                >
                  <Image className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="duration" className="text-sm font-medium">Duração (minutos)</label>
              <Input 
                id="duration" 
                type="number" 
                value={newStep.duration} 
                onChange={(e) => setNewStep({...newStep, duration: parseInt(e.target.value) || 5})}
                min="1"
                max="60"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStepDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveStep} className="bg-indigo-600 hover:bg-indigo-700">
              {editingStep ? 'Salvar Alterações' : 'Adicionar Passo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};