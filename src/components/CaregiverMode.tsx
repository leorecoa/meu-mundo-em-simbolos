
import { useState } from 'react';
import { ChevronLeft, Upload, PlusCircle, Trash2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CaregiverModeProps {
  onBack: () => void;
}

export const CaregiverMode = ({ onBack }: CaregiverModeProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');

  const handleLogin = () => {
    // Em uma implementação real, isto teria uma validação adequada
    if (pin === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('PIN inválido');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center mb-8">
          <Lock className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-2xl font-bold">Modo Cuidador</h1>
          <p className="text-gray-600 mt-2">
            Digite o PIN para acessar as configurações avançadas
          </p>
        </div>
        
        <div className="w-full max-w-xs">
          <Input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Digite o PIN"
            className="text-center text-xl tracking-widest mb-4"
            maxLength={4}
          />
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleLogin}
          >
            Entrar
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full mt-4"
            onClick={onBack}
          >
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="flex items-center gap-1 text-blue-700"
        >
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </Button>
        <h1 className="text-xl font-bold text-center flex-1 mr-10">MODO CUIDADOR</h1>
      </div>

      {/* Nota para desenvolvedores */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
        <p className="text-sm text-yellow-700">
          <strong>Nota:</strong> Esta seção é protegida por PIN e permite que cuidadores 
          personalizem os símbolos, adicionem novos elementos e configurem opções avançadas.
        </p>
      </div>

      <Tabs defaultValue="symbols">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="symbols">Símbolos</TabsTrigger>
          <TabsTrigger value="phrases">Frases</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="symbols" className="space-y-4">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Adicionar/Editar Símbolos</h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">Nome do símbolo</label>
                <Input placeholder="Ex: Água, Brinquedo favorito" />
              </div>
              
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">Categoria</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Comida</option>
                  <option>Brinquedos</option>
                  <option>Casa</option>
                  <option>Sentimentos</option>
                  <option>Família</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Carregar imagem personalizada</p>
                <Button variant="outline" size="sm">
                  Escolher arquivo
                </Button>
                <p className="text-xs text-gray-400 mt-2">PNG, JPG até 2MB</p>
              </div>
              
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">Gravar áudio (opcional)</label>
                <div className="border border-gray-300 rounded-lg p-3 flex flex-col items-center">
                  <Button variant="outline" className="mb-2">
                    Iniciar gravação
                  </Button>
                  <p className="text-xs text-gray-500">ou usar texto-para-voz padrão</p>
                </div>
              </div>
            </div>
            
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <PlusCircle className="h-4 w-4 mr-2" /> Salvar símbolo
            </Button>
          </Card>
          
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Símbolos personalizados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Brinquedo favorito', 'Avó', 'Parquinho', 'Cachorro'].map((item) => (
                <div key={item} className="border rounded-lg p-2 flex flex-col items-center">
                  <div className="h-16 w-16 bg-gray-100 rounded mb-2"></div>
                  <p className="text-sm font-medium">{item}</p>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 mt-1">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="phrases" className="space-y-4">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Frases salvas</h2>
            <div className="space-y-3">
              {['Eu quero água', 'Eu quero brincar', 'Eu estou feliz', 'Eu preciso ir ao banheiro'].map((phrase) => (
                <div key={phrase} className="flex justify-between items-center border-b pb-2">
                  <p>{phrase}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="h-4 w-4 mr-2" /> Criar nova frase
            </Button>
          </Card>
          
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Frases frequentes</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Configure as frases que aparecerão como sugestões frequentes na interface principal:</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {['Preciso ir ao banheiro', 'Estou com fome', 'Quero água', 'Estou cansado'].map((phrase) => (
                  <div 
                    key={phrase} 
                    className="bg-blue-100 px-3 py-1 rounded-full text-blue-800 text-sm flex items-center gap-1"
                  >
                    {phrase}
                    <button className="text-blue-500 hover:text-blue-700">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Configurações avançadas</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Alterar PIN de acesso</label>
                <Input type="password" placeholder="Novo PIN" className="mb-2" />
                <Input type="password" placeholder="Confirmar PIN" />
              </div>
              
              <div className="pt-2">
                <label className="block mb-1 text-sm font-medium">Fazer backup dos dados</label>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" /> Exportar dados
                </Button>
              </div>
              
              <div className="pt-2">
                <label className="block mb-1 text-sm font-medium">Restaurar backup</label>
                <Button variant="outline" className="w-full justify-start">
                  Importar dados
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Registros de uso</h2>
            <p className="text-sm text-gray-600 mb-3">
              Acompanhe o histórico de comunicação e progresso:
            </p>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Palavras mais usadas:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">água (15)</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">brincar (12)</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">comida (8)</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Estatísticas:</p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5 mt-1">
                  <li>Frases montadas hoje: 8</li>
                  <li>Símbolos usados hoje: 24</li>
                  <li>Tempo total de uso: 45 minutos</li>
                </ul>
              </div>
            </div>
            
            <Button className="w-full mt-4">Ver relatório completo</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
