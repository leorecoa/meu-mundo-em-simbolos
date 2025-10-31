import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { MainCategoriesScreen } from '@/components/MainCategoriesScreen';
import { CategoryScreen } from '@/components/CategoryScreen';
import { PhraseBuilder } from '@/components/PhraseBuilder';
import { ManagementScreen } from '@/components/ManagementScreen';

// Componentes de Página para encapsular a lógica de navegação

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <MainCategoriesScreen 
      onNavigateToCategory={(key) => navigate(`/categoria/${key}`)}
      onNavigateToPhrase={() => navigate('/frase-livre')}
      onNavigateToMyAT={() => navigate('/meu-painel')}
    />
  );
};

const CategoryPage = () => {
  const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  if (!key) return <div>Categoria não encontrada</div>; // Tratamento de erro
  return <CategoryScreen category={key} onBack={() => navigate('/')} onNavigateToPhrase={() => navigate('/frase-livre')} />;
};

const PhraseBuilderPage = () => {
  const navigate = useNavigate();
  return <PhraseBuilder onBack={() => navigate('/')} />;
};

const ManagementPage = () => {
  const navigate = useNavigate();
  return <ManagementScreen onBack={() => navigate('/')} />;
};

// O componente Index agora é o nosso roteador principal
const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/categoria/:key" element={<CategoryPage />} />
      <Route path="/frase-livre" element={<PhraseBuilderPage />} />
      <Route path="/meu-painel" element={<ManagementPage />} />
    </Routes>
  );
};

export default Index;
