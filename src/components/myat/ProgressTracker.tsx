import { useState } from 'react';
import { Activity, PlusCircle, Edit, Trash2, ChevronDown, ChevronUp, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SkillArea {
  id: string;
  name: string;
  skills: Skill[];
}

interface Skill {
  id: string;
  name: string;
  description: string;
  level: number; // 0-5
  notes: string;
  lastUpdated: string;
  history: ProgressEntry[];
}

interface ProgressEntry {
  date: string;
  level: number;
  notes: string;
}

export const ProgressTracker = () => {
  const { toast } = useToast();
  const [skillAreas, setSkillAreas] = useState<SkillArea[]>(() => {
    const saved = localStorage.getItem('myat-skill-areas');
    if (saved) return JSON.parse(saved);
    
    // Default skill areas if none exist
    return [
      {
        id: '1',
        name: 'Comunicação',
        skills: []
      },
      {
        id: '2',
        name: 'Habilidades Sociais',
        skills: []
      },
      {
        id: '3',
        name: 'Autonomia',
        skills: []
      },
      {
        id: '4',
        name: 'Motricidade',
        skills: []
      }
    ];
  });
  
  const [expandedArea, setExpandedArea] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAreaDialogOpen, setIsAreaDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<{areaId: string, skill: Skill} | null>(null);
  const [editingArea, setEditingArea] = useState<SkillArea | null>(null);
  const [newSkill, setNewSkill] = useState({
    name: '',
    description: '',
    level: 0,
    notes: ''
  });
  const [newArea, setNewArea] = useState({
    name: ''
  });
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  
  const handleSaveSkill = () => {
    if (!newSkill.name || !selectedAreaId) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome da habilidade e selecione uma área",
        variant: "destructive",
      });
      return;
    }

    const updatedAreas = [...skillAreas];
    const areaIndex = updatedAreas.findIndex(area => area.id === selectedAreaId);
    
    if (areaIndex === -1) return;
    
    if (editingSkill) {
      // Update existing skill
      const skillIndex = updatedAreas[areaIndex].skills.findIndex(
        skill => skill.id === editingSkill.skill.id
      );
      
      if (skillIndex !== -1) {
        const currentLevel = updatedAreas[areaIndex].skills[skillIndex].level;
        const newLevel = parseInt(newSkill.level.toString());
        
        // Create history entry if level changed
        let history = [...updatedAreas[areaIndex].skills[skillIndex].history];
        if (currentLevel !== newLevel) {
          history.push({
            date: new Date().toISOString(),
            level: newLevel,
            notes: newSkill.notes
          });
        }
        
        updatedAreas[areaIndex].skills[skillIndex] = {
          ...updatedAreas[areaIndex].skills[skillIndex],
          name: newSkill.name,
          description: newSkill.description,
          level: newLevel,
          notes: newSkill.notes,
          lastUpdated: new Date().toISOString(),
          history
        };
      }
    } else {
      // Create new skill
      const newSkillWithId = {
        id: Date.now().toString(),
        name: newSkill.name,
        description: newSkill.description,
        level: parseInt(newSkill.level.toString()),
        notes: newSkill.notes,
        lastUpdated: new Date().toISOString(),
        history: [{
          date: new Date().toISOString(),
          level: parseInt(newSkill.level.toString()),
          notes: newSkill.notes
        }]
      };
      
      updatedAreas[areaIndex].skills.push(newSkillWithId);
    }
    
    setSkillAreas(updatedAreas);
    localStorage.setItem('myat-skill-areas', JSON.stringify(updatedAreas));
    
    toast({
      title: editingSkill ? "Habilidade atualizada" : "Habilidade adicionada",
      description: editingSkill ? "As alterações foram salvas com sucesso" : "Nova habilidade adicionada com sucesso",
    });
    
    setIsDialogOpen(false);
    setEditingSkill(null);
    resetForm();
  };
  
  const handleSaveArea = () => {
    if (!newArea.name) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha o nome da área",
        variant: "destructive",
      });
      return;
    }
    
    let updatedAreas = [...skillAreas];
    
    if (editingArea) {
      // Update existing area
      updatedAreas = updatedAreas.map(area => 
        area.id === editingArea.id ? { ...area, name: newArea.name } : area
      );
    } else {
      // Create new area
      updatedAreas.push({
        id: Date.now().toString(),
        name: newArea.name,
        skills: []
      });
    }
    
    setSkillAreas(updatedAreas);
    localStorage.setItem('myat-skill-areas', JSON.stringify(updatedAreas));
    
    toast({
      title: editingArea ? "Área atualizada" : "Área adicionada",
      description: editingArea ? "As alterações foram salvas com sucesso" : "Nova área adicionada com sucesso",
    });
    
    setIsAreaDialogOpen(false);
    setEditingArea(null);
    setNewArea({ name: '' });
  };
  
  const handleEditSkill = (areaId: string, skill: Skill) => {
    setEditingSkill({ areaId, skill });
    setSelectedAreaId(areaId);
    setNewSkill({
      name: skill.name,
      description: skill.description,
      level: skill.level,
      notes: skill.notes
    });
    setIsDialogOpen(true);
  };
  
  const handleDeleteSkill = (areaId: string, skillId: string) => {
    const updatedAreas = [...skillAreas];
    const areaIndex = updatedAreas.findIndex(area => area.id === areaId);
    
    if (areaIndex !== -1) {
      updatedAreas[areaIndex].skills = updatedAreas[areaIndex].skills.filter(
        skill => skill.id !== skillId
      );
      
      setSkillAreas(updatedAreas);
      localStorage.setItem('myat-skill-areas', JSON.stringify(updatedAreas));
      
      toast({
        title: "Habilidade removida",
        description: "A habilidade foi excluída com sucesso",
      });
    }
  };
  
  const handleEditArea = (area: SkillArea) => {
    setEditingArea(area);
    setNewArea({ name: area.name });
    setIsAreaDialogOpen(true);
  };
  
  const handleDeleteArea = (areaId: string) => {
    const updatedAreas = skillAreas.filter(area => area.id !== areaId);
    setSkillAreas(updatedAreas);
    localStorage.setItem('myat-skill-areas', JSON.stringify(updatedAreas));
    
    toast({
      title: "Área removida",
      description: "A área e todas as suas habilidades foram excluídas",
    });
  };
  
  const resetForm = () => {
    setNewSkill({
      name: '',
      description: '',
      level: 0,
      notes: ''
    });
    setSelectedAreaId(null);
  };
  
  const getLevelLabel = (level: number) => {
    switch(level) {
      case 0: return "Não iniciado";
      case 1: return "Iniciante";
      case 2: return "Em desenvolvimento";
      case 3: return "Progredindo";
      case 4: return "Avançado";
      case 5: return "Dominado";
      default: return "Desconhecido";
    }
  };
  
  const getLevelColor = (level: number) => {
    switch(level) {
      case 0: return "bg-slate-200";
      case 1: return "bg-red-400";
      case 2: return "bg-orange-400";
      case 3: return "bg-yellow-400";
      case 4: return "bg-green-400";
      case 5: return "bg-emerald-500";
      default: return "bg-slate-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-indigo-800">Acompanhamento de Progresso</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              setEditingArea(null);
              setNewArea({ name: '' });
              setIsAreaDialogOpen(true);
            }}
            variant="outline"
            className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Área
          </Button>
          <Button 
            onClick={() => {
              resetForm();
              setEditingSkill(null);
              setIsDialogOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Habilidade
          </Button>
        </div>
      </div>

      {skillAreas.length === 0 ? (
        <Card className="p-8 text-center bg-slate-50">
          <Activity className="h-12 w-12 mx-auto text-slate-400 mb-2" />
          <h3 className="text-lg font-medium text-slate-700">Nenhuma área de habilidade</h3>
          <p className="text-slate-500 mb-4">Adicione áreas para acompanhar o progresso</p>
          <Button 
            onClick={() => {
              setEditingArea(null);
              setNewArea({ name: '' });
              setIsAreaDialogOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Área
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {skillAreas.map((area) => (
            <Card key={area.id} className="overflow-hidden">
              <div 
                className="p-4 bg-indigo-50 flex justify-between items-center cursor-pointer"
                onClick={() => setExpandedArea(expandedArea === area.id ? null : area.id)}
              >
                <div className="flex items-center">
                  <h3 className="font-medium text-indigo-800">{area.name}</h3>
                  <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                    {area.skills.length} habilidades
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-slate-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditArea(area);
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
                      handleDeleteArea(area.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {expandedArea === area.id ? (
                    <ChevronUp className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
              </div>
              
              {expandedArea === area.id && (
                <div className="p-4">
                  {area.skills.length === 0 ? (
                    <div className="text-center py-6 text-slate-500">
                      <p>Nenhuma habilidade adicionada nesta área</p>
                      <Button 
                        variant="link" 
                        className="text-indigo-600 mt-2"
                        onClick={() => {
                          resetForm();
                          setSelectedAreaId(area.id);
                          setEditingSkill(null);
                          setIsDialogOpen(true);
                        }}
                      >
                        Adicionar habilidade
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {area.skills.map((skill) => (
                        <div key={skill.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-indigo-900">{skill.name}</h4>
                              {skill.description && (
                                <p className="text-sm text-slate-600 mt-1">{skill.description}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-slate-500"
                                onClick={() => handleEditSkill(area.id, skill)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-slate-500"
                                onClick={() => handleDeleteSkill(area.id, skill.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                              <span>Nível: {getLevelLabel(skill.level)}</span>
                              <span>Atualizado: {new Date(skill.lastUpdated).toLocaleDateString()}</span>
                            </div>
                            <Progress 
                              value={skill.level * 20} 
                              className="h-2"
                              indicatorClassName={getLevelColor(skill.level)}
                            />
                          </div>
                          
                          {skill.notes && (
                            <div className="mt-3 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                              <p className="text-xs font-medium text-slate-500 mb-1">Observações:</p>
                              <p>{skill.notes}</p>
                            </div>
                          )}
                          
                          {skill.history.length > 1 && (
                            <div className="mt-3">
                              <Button 
                                variant="link" 
                                className="text-xs text-indigo-600 p-0 h-auto flex items-center"
                                onClick={() => {
                                  toast({
                                    title: "Histórico de Progresso",
                                    description: `${skill.history.length} registros de progresso disponíveis`,
                                  });
                                }}
                              >
                                <BarChart className="h-3 w-3 mr-1" />
                                Ver histórico de progresso
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Dialog para criar/editar habilidade */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingSkill ? 'Editar Habilidade' : 'Nova Habilidade'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="area" className="text-sm font-medium">Área</label>
              <Select 
                value={selectedAreaId || ''} 
                onValueChange={(value) => setSelectedAreaId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma área" />
                </SelectTrigger>
                <SelectContent>
                  {skillAreas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Nome da Habilidade</label>
              <Input 
                id="name" 
                value={newSkill.name} 
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                placeholder="Ex: Comunicação verbal"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Descrição</label>
              <Textarea 
                id="description" 
                value={newSkill.description} 
                onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
                placeholder="Descreva a habilidade"
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="level" className="text-sm font-medium">Nível Atual</label>
              <Select 
                value={newSkill.level.toString()} 
                onValueChange={(value) => setNewSkill({...newSkill, level: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - Não iniciado</SelectItem>
                  <SelectItem value="1">1 - Iniciante</SelectItem>
                  <SelectItem value="2">2 - Em desenvolvimento</SelectItem>
                  <SelectItem value="3">3 - Progredindo</SelectItem>
                  <SelectItem value="4">4 - Avançado</SelectItem>
                  <SelectItem value="5">5 - Dominado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="notes" className="text-sm font-medium">Observações</label>
              <Textarea 
                id="notes" 
                value={newSkill.notes} 
                onChange={(e) => setNewSkill({...newSkill, notes: e.target.value})}
                placeholder="Observações sobre o progresso atual"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveSkill} className="bg-indigo-600 hover:bg-indigo-700">
              {editingSkill ? 'Salvar Alterações' : 'Adicionar Habilidade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog para criar/editar área */}
      <Dialog open={isAreaDialogOpen} onOpenChange={setIsAreaDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{editingArea ? 'Editar Área' : 'Nova Área'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="areaName" className="text-sm font-medium">Nome da Área</label>
              <Input 
                id="areaName" 
                value={newArea.name} 
                onChange={(e) => setNewArea({...newArea, name: e.target.value})}
                placeholder="Ex: Comunicação"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAreaDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveArea} className="bg-indigo-600 hover:bg-indigo-700">
              {editingArea ? 'Salvar Alterações' : 'Adicionar Área'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};