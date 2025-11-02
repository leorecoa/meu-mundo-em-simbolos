import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { MainCategoriesScreen } from '@/components/MainCategoriesScreen';
import { CategoryScreen } from '@/components/CategoryScreen';
import { PhraseBuilder } from '@/components/PhraseBuilder';
import { ManagementScreen } from '@/components/ManagementScreen';
import { AnalyticsScreen } from '@/components/AnalyticsScreen';
import { AddSymbolScreen } from '@/components/AddSymbolScreen'; // 1. Importar

// Componentes de Página para encapsular a lógica de navegação

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <MainCategoriesScreen 
      onNavigateToCategory={(key) => navigate(`/categoria/${key}`)}
      onNavigateToPhrase={() => navigate('/frase-livre')}
      onNavigateToMyAT={() => navigate('/meu-painel')}
      onNavigateToAnalytics={() => navigate('/relatorio')}
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
      onNavigateToPhrase={() => navigate('/frase-livre')} 
      // 3. Passar a função de navegação para a tela de adicionar símbolo
      onNavigateToAddSymbol={() => navigate(`/categoria/${key}/adicionar`)}
    />
  );
};

const PhraseBuilderPage = () => {
  const navigate = useNavigate();
  return <PhraseBuilder onBack={() => navigate('/')} />;
};

const ManagementPage = () => {
  const navigate = useNavigate();
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


// O componente Index agora é o nosso roteador principal
const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/categoria/:key" element={<CategoryPage />} />
      {/* 2. Adicionar a nova rota */}
      <Route path="/categoria/:key/adicionar" element={<AddSymbolPage />} />
      <Route path="/frase-livre" element={<PhraseBuilderPage />} />
      <Route path="/meu-painel" element={<ManagementPage />} />
      <Route path="/relatorio" element={<AnalyticsPage />} />
    </Routes>
  );
};

export default Index;
