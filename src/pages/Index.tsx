import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { MainCategoriesScreen } from '@/components/MainCategoriesScreen';
import { CategoryScreen } from '@/components/CategoryScreen';
import { PhraseBuilder } from '@/components/PhraseBuilder';
import { ManagementScreen } from '@/components/ManagementScreen';
import { AnalyticsScreen } from '@/components/AnalyticsScreen';
import { AddSymbolScreen } from '@/components/AddSymbolScreen';

// Componentes de Página para encapsular a lógica de navegação

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
      onNavigateToPhrase={(symbolId) => navigate(`/frase-livre/${symbolId}`)} // Passa o ID do símbolo
      onNavigateToAddSymbol={() => navigate(`/categoria/${key}/adicionar`)}
    />
  );
};

const PhraseBuilderPage = () => {
  const navigate = useNavigate();
  const { symbolId } = useParams<{ symbolId?: string }>(); // Recebe o ID do símbolo
  return <PhraseBuilder onBack={() => navigate('/')} initialSymbolId={symbolId ? Number(symbolId) : undefined} />;
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
      <Route path="/categoria/:key/adicionar" element={<AddSymbolPage />} />
      <Route path="/frase-livre" element={<PhraseBuilderPage />} />
      <Route path="/frase-livre/:symbolId" element={<PhraseBuilderPage />} /> {/* Nova rota */}
      <Route path="/meu-painel" element={<ManagementPage />} />
      <Route path="/configuracoes" element={<ManagementPage />} />
      <Route path="/relatorio" element={<AnalyticsPage />} />
    </Routes>
  );
};

export default Index;
