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
        await db.categories.add({
          profileId,
          key: categoryKey,
          name: category.title,
          color: 'blue' // cor padrão
        });
      }
    });

    console.log('Banco de dados principal populado com sucesso!');
  } catch (error) {
    console.error('Erro ao popular o banco de dados principal:', error);
  }
}
