// Teste apenas da lógica 7x3 sem chamadas para APIs externas
const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function test7x3LogicOnly() {
  try {
    console.log("🧪 TESTE DA LÓGICA 7x3 - APENAS LÓGICA");
    console.log("🎯 Testando a lógica de distribuição sem chamadas para APIs\n");
    
    // Simular 20 vendas para testar a lógica
    const totalSales = 20;
    const results = [];
    
    for (let i = 1; i <= totalSales; i++) {
      // Simular a lógica 7x3
      const cycle = i % 10;
      let gateway = "";
      let toClient = false;
      
      if (cycle < 7) {
        gateway = "AllowPay (CLIENTE)";
        toClient = true;
      } else if (cycle < 10) {
        gateway = "BlackCat (SEU)";
        toClient = false;
      }
      
      results.push({
        saleNumber: i,
        cycle,
        gateway,
        toClient
      });
      
      console.log(`Venda #${i} | Ciclo: ${cycle}/10 | Gateway: ${gateway} | Para Cliente: ${toClient ? "SIM" : "NÃO"}`);
    }
    
    // Análise dos resultados
    console.log("\n📊 === ANÁLISE DA LÓGICA 7x3 ===");
    
    const allowPaySales = results.filter(r => r.toClient).length;
    const blackCatSales = results.filter(r => !r.toClient).length;
    
    console.log(`Total de vendas: ${totalSales}`);
    console.log(`🟢 AllowPay (CLIENTE): ${allowPaySales} vendas`);
    console.log(`🔵 BlackCat (SEU): ${blackCatSales} vendas`);
    
    // Verificar se a proporção está correta
    const expectedAllowPay = Math.floor(totalSales / 10) * 7 + Math.min(totalSales % 10, 7);
    const expectedBlackCat = Math.floor(totalSales / 10) * 3 + Math.max(0, (totalSales % 10) - 7);
    
    console.log(`\n🎯 === VERIFICAÇÃO ===`);
    console.log(`Esperado AllowPay: ${expectedAllowPay}`);
    console.log(`Esperado BlackCat: ${expectedBlackCat}`);
    console.log(`Real AllowPay: ${allowPaySales}`);
    console.log(`Real BlackCat: ${blackCatSales}`);
    
    if (allowPaySales === expectedAllowPay && blackCatSales === expectedBlackCat) {
      console.log("\n✅ LÓGICA 7x3 FUNCIONANDO PERFEITAMENTE!");
      console.log("🎉 A distribuição está correta!");
    } else {
      console.log("\n❌ LÓGICA 7x3 COM PROBLEMAS!");
      console.log("🔍 Verificar implementação");
    }
    
    // Mostrar ciclos
    console.log("\n🔄 === CICLOS COMPLETOS ===");
    const cycles = {};
    results.forEach(sale => {
      const cycleGroup = Math.floor((sale.saleNumber - 1) / 10);
      if (!cycles[cycleGroup]) {
        cycles[cycleGroup] = { allowPay: 0, blackCat: 0 };
      }
      if (sale.toClient) {
        cycles[cycleGroup].allowPay++;
      } else {
        cycles[cycleGroup].blackCat++;
      }
    });
    
    Object.keys(cycles).forEach(cycle => {
      const cycleData = cycles[cycle];
      console.log(`Ciclo ${parseInt(cycle) + 1}: ${cycleData.allowPay} AllowPay + ${cycleData.blackCat} BlackCat`);
    });
    
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test7x3LogicOnly();
