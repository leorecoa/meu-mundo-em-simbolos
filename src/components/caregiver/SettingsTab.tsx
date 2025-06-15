
import { useState } from 'react';
import { Settings as SettingsIcon, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { setPin, exportAllData, importAllData } from '@/lib/storage';
import { useQueryClient } from '@tanstack/react-query';

export const SettingsTab = () => {
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleChangePin = () => {
    if (newPin !== confirmPin) {
      toast({
        title: "PINs não conferem",
        description: "O novo PIN e a confirmação devem ser iguais",
        variant: "destructive",
      });
      return;
    }

    if (newPin.length < 4) {
      toast({
        title: "PIN muito curto",
        description: "O PIN deve ter pelo menos 4 dígitos",
        variant: "destructive",
      });
      return;
    }

    setPin(newPin);
    toast({
      title: "PIN alterado",
      description: "O novo PIN foi definido com sucesso",
    });
    setNewPin('');
    setConfirmPin('');
  };

  const handleExportData = () => {
    const data = exportAllData();
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meu-mundo-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Backup exportado",
      description: "Os dados foram exportados com sucesso",
    });
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string;
        const success = importAllData(jsonData);
        
        if (success) {
          queryClient.invalidateQueries();
          
          toast({
            title: "Dados importados",
            description: "Os dados foram importados com sucesso",
          });
        } else {
          throw new Error("Formato de arquivo inválido");
        }
      } catch (error) {
        toast({
          title: "Erro na importação",
          description: "Não foi possível importar os dados",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <SettingsIcon className="h-5 w-5 mr-2 text-gray-600" />
          Configurações avançadas
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Alterar PIN de acesso</label>
            <Input 
              type="password" 
              placeholder="Novo PIN" 
              className="mb-2" 
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              maxLength={6}
            />
            <Input 
              type="password" 
              placeholder="Confirmar PIN" 
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              maxLength={6}
            />
            <Button 
              className="w-full mt-2"
              onClick={handleChangePin}
              disabled={!newPin || !confirmPin}
            >
              Salvar novo PIN
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-md font-semibold mb-3">Configurações de acessibilidade</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="large-icons" className="flex-1">Ícones grandes</Label>
                <Switch id="large-icons" />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="audio-feedback" className="flex-1">Feedback de áudio</Label>
                <Switch id="audio-feedback" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="flex-1">Alto contraste</Label>
                <Switch id="high-contrast" />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-md font-semibold mb-3">Backup e restauração</h3>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleExportData}
              >
                <Download className="h-4 w-4 mr-2" /> Exportar dados
              </Button>
              
              <div className="flex items-center">
                <Input
                  type="file"
                  accept=".json"
                  id="import-file"
                  className="hidden"
                  onChange={handleImportData}
                />
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => document.getElementById('import-file')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" /> Importar dados
                </Button>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-md font-semibold mb-3">Sobre o aplicativo</h3>
            <p className="text-sm text-gray-500">Meu Mundo em Símbolos v1.0.0</p>
            <p className="text-sm text-gray-500 mt-1">© 2023 Todos os direitos reservados</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
