// Resetar contador para 0
const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function resetCounter() {
  try {
    console.log("🔧 Resetando contador para 0...\n");
    
    const updatedCheckout = await prisma.checkout.update({
      where: {
        offer: "crocs-brasil-gratis"
      },
      data: {
        lastClientCheckout: "0"
      }
    });
    
    console.log("✅ Contador resetado para 0!");
    console.log(`Próxima venda será: 1 (deve ir para AllowPay)`);
    console.log(`Ciclo: 1/10`);
    console.log(`Gateway esperado: AllowPay (CLIENTE)`);
    
  } catch (error) {
    console.error("❌ Erro ao resetar contador:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetCounter();






