// Criar cliente "Crocs Brasil" no banco de dados
const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function createClient() {
  try {
    console.log("🔧 Criando cliente 'Crocs Brasil'...\n");
    
    // Verificar se o cliente já existe
    const existingClient = await prisma.client.findUnique({
      where: {
        token: "crocs-brasil-token-2024"
      }
    });
    
    if (existingClient) {
      console.log("✅ Cliente 'Crocs Brasil' já existe!");
      console.log(`ID: ${existingClient.id}`);
      console.log(`Nome: ${existingClient.name}`);
      console.log(`Token: ${existingClient.token}`);
      console.log(`UseTax: ${existingClient.useTax}`);
      return existingClient;
    }
    
    // Criar o cliente
    const newClient = await prisma.client.create({
      data: {
        name: "Crocs Brasil",
        description: "Cliente Crocs Brasil para teste da lógica 7x3",
        token: "crocs-brasil-token-2024",
        useTax: true
      }
    });
    
    console.log("✅ Cliente 'Crocs Brasil' criado com sucesso!");
    console.log(`ID: ${newClient.id}`);
    console.log(`Nome: ${newClient.name}`);
    console.log(`Token: ${newClient.token}`);
    console.log(`UseTax: ${newClient.useTax}`);
    
    // Criar a oferta
    console.log("\n🔧 Criando oferta 'Crocs Brasil - Promoção Grátis'...");
    
    const newOffer = await prisma.offer.create({
      data: {
        name: "Crocs Brasil - Promoção Grátis",
        description: "Oferta especial Crocs Brasil com lógica 7x3",
        useTax: true,
        clientId: newClient.id
      }
    });
    
    console.log("✅ Oferta criada com sucesso!");
    console.log(`ID: ${newOffer.id}`);
    console.log(`Nome: ${newOffer.name}`);
    console.log(`Cliente ID: ${newOffer.clientId}`);
    
    return { client: newClient, offer: newOffer };
    
  } catch (error) {
    console.error("❌ Erro ao criar cliente:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createClient();


