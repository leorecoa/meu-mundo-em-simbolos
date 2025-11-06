import { db } from '@/lib/db';
import { categoryData } from '@/data/categoryData';

export async function seedDatabase(profileId: number) {
  try {
    // Verificação robusta: só popula se a tabela de categorias estiver vazia para este perfil.
    const categoryCount = await db.categories.where({ profileId }).count();
    if (categoryCount > 0) {
      console.log('Banco de dados principal já populado para este perfil. Ignorando seed.');
      return;
    }

    console.log('Populando o banco de dados com categorias e símbolos...');

    await db.transaction('rw', db.categories, db.symbols, async () => {
      for (const categoryKey in categoryData) {
        const category = categoryData[categoryKey];
        
        // Mapear cores corretas para cada categoria
        const colorMap: { [key: string]: string } = {
          'quero': 'sky',
          'sinto': 'emerald', 
          'preciso': 'rose',
          'comida': 'amber',
          'brincar': 'orange',
          'casa': 'slate'
        };
        
        // Adicionar categoria com cor correta
        await db.categories.add({
          profileId,
          key: categoryKey,
          name: category.title,
          color: colorMap[categoryKey] || 'sky'
        });
        
        // Popular os símbolos de cada categoria
        for (let i = 0; i < category.items.length; i++) {
          const item = category.items[i];
          await db.symbols.add({
            profileId,
            text: item.label,
            categoryKey: categoryKey,
            icon: item.icon,
            order: i
          });
        }
      }
    });

    console.log('Banco de dados principal populado com sucesso!');
  } catch (error) {
    console.error('Erro ao popular o banco de dados principal:', error);
  }
}
