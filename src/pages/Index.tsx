import { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { MainCategoriesScreen } from '@/components/MainCategoriesScreen';
import { CategoryScreen } from '@/components/CategoryScreen';
import { PhraseBuilder } from '@/components/PhraseBuilder';
import { ManagementScreen } from '@/components/ManagementScreen';
import { AnalyticsScreen } from '@/components/AnalyticsScreen';
import { AddSymbolScreen } from '@/components/AddSymbolScreen';
import { PinScreen } from '@/components/PinScreen'; // Importar

// --- Componentes de Página ---

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <MainCategoriesScreen 
      onNavigateToCategory={(key) => navigate(`/categoria/${key}`)}
      onNavigateToPhrase={() => navigate('/frase-livre')}
      onNavigateToMyAT={() => navigate('/meu-painel')}
      onNavigateToAnalytics={() => navigate('/relatorio')}
      onNavigateToSettings={() => navigate('/configuracoes')}
    />
  );
};

const CategoryPage = () => {
  const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  if (!key) return <div>Categoria não encontrada</div>;
  return (
    <CategoryScreen 
      category={key} 
      onBack={() => navigate('/')} 
      onNavigateToPhrase={(symbolId) => navigate(`/frase-livre/${symbolId}`)}
      onNavigateToAddSymbol={() => navigate(`/categoria/${key}/adicionar`)}
    />
  );
};

const PhraseBuilderPage = () => {
  const navigate = useNavigate();
  const { symbolId } = useParams<{ symbolId?: string }>();
  return <PhraseBuilder onBack={() => navigate('/')} initialSymbolId={symbolId ? Number(symbolId) : undefined} />;
};

// Página protegida que requer PIN
const ProtectedPage = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const security = useLiveQuery(() => db.security.get(1));

  if (!security) return <div>Carregando segurança...</div>;

  if (!isVerified) {
    return <PinScreen storedPin={security.pin} onPinVerified={() => setIsVerified(true)} />;
  }

  return <ManagementScreen onBack={() => navigate('/')} />;
};

const AnalyticsPage = () => {
  const navigate = useNavigate();
  return <AnalyticsScreen onBack={() => navigate('/')} />;
};

const AddSymbolPage = () => {
    const { key } = useParams<{ key: string }>();
    const navigate = useNavigate();
    return <AddSymbolScreen onBack={() => navigate(`/categoria/${key}`)} />;
}

// --- Roteador Principal ---
const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/categoria/:key" element={<CategoryPage />} />
      <Route path="/categoria/:key/adicionar" element={<AddSymbolPage />} />
      <Route path="/frase-livre" element={<PhraseBuilderPage />} />
      <Route path="/frase-livre/:symbolId" element={<PhraseBuilderPage />} />
      <Route path="/relatorio" element={<AnalyticsPage />} />
      
      {/* Rotas protegidas */}
      <Route path="/meu-painel" element={<ProtectedPage />} />
      <Route path="/configuracoes" element={<ProtectedPage />} />
    </Routes>
  );
};

export default Index;
