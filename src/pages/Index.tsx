import { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

import { HomeScreen } from '@/components/HomeScreen';
import { CategoryScreen } from '@/components/CategoryScreen';
import { PhraseBuilder } from '@/components/PhraseBuilder';
import { ManagementScreen } from '@/components/ManagementScreen';
import { AnalyticsScreen } from '@/components/AnalyticsScreen';
import { AddSymbolScreen } from '@/components/AddSymbolScreen';
import { PinScreen } from '@/components/PinScreen';
import { RewardsScreen } from '@/components/RewardsScreen';
import { StoreScreen } from '@/components/StoreScreen';

// --- Páginas ---

const HomePage = () => {
  const navigate = useNavigate();
  return <HomeScreen onNavigateToCategory={(key) => navigate(`/categoria/${key}`)} onNavigateToPhrase={() => navigate('/frase-livre')} onNavigateToMyAT={() => navigate('/meu-painel')} onNavigateToAnalytics={() => navigate('/relatorio')} onNavigateToSettings={() => navigate('/configuracoes')} onNavigateToRewards={() => navigate('/recompensas')} />;
};

const CategoryPage = () => {
  const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  if (!key) return null;
  return <CategoryScreen category={key} onBack={() => navigate('/')} onNavigateToPhrase={(symbolId) => navigate(`/frase-livre/${symbolId}`)} onNavigateToAddSymbol={() => navigate(`/categoria/${key}/adicionar`)} />;
};

const PhraseBuilderPage = () => {
  const navigate = useNavigate();
  return <PhraseBuilder onBack={() => navigate('/')} />;
};

const ProtectedPage = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(sessionStorage.getItem('pinVerified') === 'true');
  const security = useLiveQuery(() => db.security.get(1));
  const handlePinVerified = () => {
    sessionStorage.setItem('pinVerified', 'true');
    setIsVerified(true);
  };
  if (!security) return <div>Carregando...</div>;
  if (!isVerified) return <PinScreen storedPin={security.pin} onPinVerified={handlePinVerified} />;
  return <ManagementScreen onBack={() => navigate('/')} />;
};

const AnalyticsPage = () => {
    const navigate = useNavigate();
    return <AnalyticsScreen onBack={() => navigate('/')} />
}

const RewardsPage = () => {
  const navigate = useNavigate();
  return <RewardsScreen onBack={() => navigate('/')} onNavigateToStore={() => navigate('/loja')} />;
};

const StorePage = () => {
  const navigate = useNavigate();
  return <StoreScreen onBack={() => navigate('/recompensas')} />;
};

const AddSymbolPage = () => {
  const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  if (!key) return null;
  return <AddSymbolScreen onBack={() => navigate(`/categoria/${key}`)} />;
};

// --- Roteador Principal ---
const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/categoria/:key" element={<CategoryPage />} />
      <Route path="/categoria/:key/adicionar" element={<AddSymbolPage />} />
      <Route path="/frase-livre" element={<PhraseBuilderPage />} />
      <Route path="/frase-livre/:symbolId" element={<PhraseBuilderPage />} />
      <Route path="/recompensas" element={<RewardsPage />} />
      <Route path="/loja" element={<StorePage />} />
      <Route path="/relatorio" element={<AnalyticsPage />} />
      <Route path="/meu-painel" element={<ProtectedPage />} />
      <Route path="/configuracoes" element={<ProtectedPage />} />
    </Routes>
  );
};

export default Index;
