import { useState } from 'react';
import { FileText, PlusCircle, Search, Link, Download, ExternalLink, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Resource {
  id: string;
  title: string;
  type: 'link' | 'note' | 'file';
  content: string;
  tags: string[];
  dateAdded: string;
}

export const ResourceLibrary = () => {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem('myat-resources');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    title: '',
    type: 'link',
    content: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  
  const handleSaveResource = () => {
    if (!newResource.title || !newResource.content) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e o conteúdo do recurso",
        variant: "destructive",
      });
      return;
    }

    const newResourceWithId = {
      ...newResource,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString()
    } as Resource;
    
    const updatedResources = [...resources, newResourceWithId];
    setResources(updatedResources);
    localStorage.setItem('myat-resources', JSON.stringify(updatedResources));
    
    toast({
      title: "Recurso adicionado",
      description: "Novo recurso adicionado com sucesso",
    });
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteResource = (id: string) => {
    const updatedResources = resources.filter(resource => resource.id !== id);
    setResources(updatedResources);
    localStorage.setItem('myat-resources', JSON.stringify(updatedResources));
    
    toast({
      title: "Recurso removido",
      description: "O recurso foi excluído com sucesso",
    });
  };

  const addTag = () => {
    if (newTag.trim() && !newResource.tags?.includes(newTag.trim())) {
      setNewResource(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setNewResource(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag)
    }));
  };

  const resetForm = () => {
    setNewResource({
      title: '',
      type: 'link',
      content: '',
      tags: []
    });
    setNewTag('');
  };

  // Filter resources based on search query
  const filteredResources = resources.filter(resource => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      resource.title.toLowerCase().includes(query) ||
      resource.content.toLowerCase().includes(query) ||
      resource.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  // Group resources by type
  const linkResources = filteredResources.filter(r => r.type === 'link');
  const noteResources = filteredResources.filter(r => r.type === 'note');
  const fileResources = filteredResources.filter(r => r.type === 'file');

  // Get all unique tags
  const allTags = Array.from(new Set(resources.flatMap(r => r.tags)));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-indigo-800">Biblioteca de Recursos</h2>
        <Button 
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Recurso
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Buscar recursos..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {resources.length === 0 ? (
        <Card className="p-8 text-center bg-slate-50">
          <FileText className="h-12 w-12 mx-auto text-slate-400 mb-2" />
          <h3 className="text-lg font-medium text-slate-700">Nenhum recurso adicionado</h3>
          <p className="text-slate-500 mb-4">Adicione links, notas e arquivos úteis</p>
          <Button 
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Recurso
          </Button>
        </Card>
      ) : (
        <>
          {/* Tags filter */}
          {allTags.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-slate-500 mb-2">Filtrar por tags:</p>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className={`cursor-pointer ${
                      searchQuery.includes(tag) 
                        ? 'bg-indigo-100 text-indigo-700 border-indigo-300' 
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                    onClick={() => {
                      if (searchQuery.includes(tag)) {
                        setSearchQuery(searchQuery.replace(tag, '').trim());
                      } else {
                        setSearchQuery(searchQuery ? `${searchQuery} ${tag}` : tag);
                      }
                    }}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos ({filteredResources.length})</TabsTrigger>
              <TabsTrigger value="links">Links ({linkResources.length})</TabsTrigger>
              <TabsTrigger value="notes">Notas ({noteResources.length})</TabsTrigger>
              <TabsTrigger value="files">Arquivos ({fileResources.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map(resource => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    onDelete={handleDeleteResource} 
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="links">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {linkResources.map(resource => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    onDelete={handleDeleteResource} 
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="notes">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {noteResources.map(resource => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    onDelete={handleDeleteResource} 
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="files">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fileResources.map(resource => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    onDelete={handleDeleteResource} 
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Dialog para adicionar recurso */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Recurso</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">Título</label>
              <Input 
                id="title" 
                value={newResource.title} 
                onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                placeholder="Ex: Atividades de comunicação"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium">Tipo de Recurso</label>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant={newResource.type === 'link' ? 'default' : 'outline'}
                  className={newResource.type === 'link' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                  onClick={() => setNewResource({...newResource, type: 'link'})}
                >
                  <Link className="h-4 w-4 mr-2" />
                  Link
                </Button>
                <Button 
                  type="button" 
                  variant={newResource.type === 'note' ? 'default' : 'outline'}
                  className={newResource.type === 'note' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                  onClick={() => setNewResource({...newResource, type: 'note'})}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Nota
                </Button>
                <Button 
                  type="button" 
                  variant={newResource.type === 'file' ? 'default' : 'outline'}
                  className={newResource.type === 'file' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                  onClick={() => setNewResource({...newResource, type: 'file'})}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Arquivo
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="content" className="text-sm font-medium">
                {newResource.type === 'link' ? 'URL' : 
                 newResource.type === 'note' ? 'Conteúdo da Nota' : 
                 'Link para o Arquivo'}
              </label>
              {newResource.type === 'note' ? (
                <Textarea 
                  id="content" 
                  value={newResource.content} 
                  onChange={(e) => setNewResource({...newResource, content: e.target.value})}
                  placeholder="Digite o conteúdo da sua nota aqui..."
                  rows={5}
                />
              ) : (
                <Input 
                  id="content" 
                  value={newResource.content} 
                  onChange={(e) => setNewResource({...newResource, content: e.target.value})}
                  placeholder={newResource.type === 'link' ? 'https://...' : 'Link para o arquivo'}
                />
              )}
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex gap-2">
                <Input 
                  value={newTag} 
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Adicionar tag"
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" onClick={addTag} className="shrink-0">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              
              {newResource.tags && newResource.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newResource.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="bg-indigo-50 text-indigo-700 border-indigo-200 flex items-center gap-1"
                    >
                      {tag}
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0 rounded-full hover:bg-indigo-100"
                        onClick={() => removeTag(tag)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveResource} className="bg-indigo-600 hover:bg-indigo-700">
              Adicionar Recurso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente de cartão de recurso
interface ResourceCardProps {
  resource: Resource;
  onDelete: (id: string) => void;
}

const ResourceCard = ({ resource, onDelete }: ResourceCardProps) => {
  const getResourceIcon = () => {
    switch (resource.type) {
      case 'link': return <Link className="h-5 w-5 text-blue-600" />;
      case 'note': return <FileText className="h-5 w-5 text-amber-600" />;
      case 'file': return <Download className="h-5 w-5 text-green-600" />;
    }
  };
  
  const getResourceColor = () => {
    switch (resource.type) {
      case 'link': return 'border-l-4 border-l-blue-500';
      case 'note': return 'border-l-4 border-l-amber-500';
      case 'file': return 'border-l-4 border-l-green-500';
    }
  };
  
  const handleResourceAction = () => {
    if (resource.type === 'link' || resource.type === 'file') {
      window.open(resource.content, '_blank');
    }
  };
  
  return (
    <Card className={`p-4 hover:shadow-md transition-shadow ${getResourceColor()}`}>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          {getResourceIcon()}
          <h4 className="font-medium text-indigo-900">{resource.title}</h4>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-slate-500"
          onClick={() => onDelete(resource.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      {resource.type === 'note' ? (
        <div className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded max-h-32 overflow-y-auto">
          {resource.content}
        </div>
      ) : (
        <div className="mt-2">
          <Button 
            variant="link" 
            className="p-0 h-auto text-sm text-blue-600 flex items-center"
            onClick={handleResourceAction}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            {resource.type === 'link' ? 'Abrir link' : 'Baixar arquivo'}
          </Button>
        </div>
      )}
      
      {resource.tags && resource.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {resource.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-slate-50">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="mt-2 text-xs text-slate-400">
        Adicionado em {new Date(resource.dateAdded).toLocaleDateString()}
      </div>
    </Card>
  );
};