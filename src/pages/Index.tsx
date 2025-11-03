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
import { StoreScreen } from '@/components/StoreScreen'; // Importar

// --- Componentes de Página ---

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <HomeScreen 
      onNavigateToCategory={(key) => navigate(`/categoria/${key}`)}
      onNavigateToPhrase={() => navigate('/frase-livre')}
      onNavigateToMyAT={() => navigate('/meu-painel')}
      onNavigateToAnalytics={() => navigate('/relatorio')}
      onNavigateToSettings={() => navigate('/configuracoes')}
      onNavigateToRewards={() => navigate('/recompensas')}
    />
  );
};

const RewardsPage = () => {
    const navigate = useNavigate();
    return <RewardsScreen onBack={() => navigate('/')} onNavigateToStore={() => navigate('/loja')} />;
}

const StorePage = () => {
    const navigate = useNavigate();
    return <StoreScreen onBack={() => navigate('/recompensas')} />;
}

// ... (outros componentes de página)

// --- Roteador Principal ---
const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* ... (outras rotas) */}
      <Route path="/recompensas" element={<RewardsPage />} />
      <Route path="/loja" element={<StorePage />} /> {/* Adicionar rota */}
      
      {/* Rotas protegidas */}
      <Route path="/meu-painel" element={<ProtectedPage />} />
      <Route path="/configuracoes" element={<ProtectedPage />} />
    </Routes>
  );
};

export default Index;
