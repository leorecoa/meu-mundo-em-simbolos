import { db } from '@/db';
import { categoryData } from '@/data/categoryData';

export async function seedDatabase() {
  try {
    // Verificação robusta: só popula se a tabela de categorias estiver vazia.
    const categoryCount = await db.categories.count();
    if (categoryCount > 0) {
      console.log('Banco de dados principal já populado. Ignorando seed.');
      return;
    }

    console.log('Populando o banco de dados com categorias e símbolos...');

    await db.transaction('rw', db.categories, db.symbols, async () => {
      for (const categoryKey in categoryData) {
        const category = categoryData[categoryKey];
        const categoryId = await db.categories.add({
          key: categoryKey,
          name: category.title,
        });

        if (categoryId) {
          const symbolsToAdd = category.items.map(item => ({
            name: item.label,
            imageUrl: item.icon,
            categoryId: categoryId,
            isCustom: false,
          }));
          await db.symbols.bulkAdd(symbolsToAdd);
        }
      }
    });

    console.log('Banco de dados principal populado com sucesso!');
  } catch (error) {
    console.error('Erro ao popular o banco de dados principal:', error);
  }
}
