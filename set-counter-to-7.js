// Definir contador para 7 para testar vendas 8-10 (BlackCat)
const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function setCounterTo7() {
  try {
    console.log("🔧 Definindo contador para 7...\n");
    
    // Atualizar o checkout para simular que já passamos pelas vendas 1-7
    const updatedCheckout = await prisma.checkout.update({
      where: {
        offer: "crocs-brasil-gratis"
      },
      data: {
        lastClientCheckout: "7"
      }
    });
    
    console.log("✅ Contador atualizado para 7!");
    console.log(`Próxima venda será: 8 (deve ir para BlackCat)`);
    console.log(`Ciclo: 8/10`);
    console.log(`Gateway esperado: BlackCat (SEU)`);
    
  } catch (error) {
    console.error("❌ Erro ao atualizar contador:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setCounterTo7();






