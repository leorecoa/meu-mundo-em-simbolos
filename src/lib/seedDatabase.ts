import { db } from '@/db';
import { categoryData } from '@/data/categoryData';

export async function seedDatabase() {
  try {
    const dbExists = await Dexie.exists('meuMundoEmSimbolosDB');
    if (!dbExists) {
      console.log('Banco de dados não encontrado, criando e populando...');
    } else {
      const categoryCount = await db.categories.count();
      if (categoryCount > 0) {
        console.log('Banco de dados já populado.');
        return;
      }
    }

    await db.transaction('rw', db.categories, db.symbols, async () => {
      for (const categoryKey in categoryData) {
        const category = categoryData[categoryKey];
        
        const categoryId = await db.categories.add({
          key: categoryKey,
          name: category.title,
        });

        if (categoryId) {
          for (const item of category.items) {
            await db.symbols.add({
              name: item.label,
              imageUrl: item.icon,
              categoryId: categoryId,
              isCustom: false, // Marcar símbolos padrão
            });
          }
        }
      }
    });

    console.log('Banco de dados populado com sucesso!');
  } catch (error) {
    console.error('Erro ao popular o banco de dados:', error);
    // Em caso de erro na versão, pode ser útil limpar o banco
    // await db.delete();
    // console.log('Banco de dados limpo após erro.');
  }
}
