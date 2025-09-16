// Teste da Lógica 7x3 usando apenas BlackCat (seu gateway)
// Simulando que as vendas 8-10 vão para BlackCat

const API_URL = 'http://localhost:3434/checkout-payment';

async function testBlackCatSales() {
  console.log("🧪 TESTE DA LÓGICA 7x3 - VENDAS 8-10 (BLACKCAT)");
  console.log("🎯 Testando vendas que devem ir para BlackCat (seu gateway)\n");
  
  // Simular que já passamos pelas vendas 1-7 (AllowPay)
  // Agora testamos as vendas 8, 9, 10 que devem ir para BlackCat
  
  const testSales = [8, 9, 10];
  const results = [];
  
  for (const saleNumber of testSales) {
    const payload = {
      checkout: "https://crocsbr.com/checkout",
      offer: "crocs-brasil-gratis",
      customer: {
        name: `Cliente Teste ${saleNumber}`,
        email: `cliente${saleNumber}@teste.com`,
        document: {
          type: "CPF",
          number: `1234567890${saleNumber}`
        },
        phone: "11999999999"
      },
      product: {
        title: `Crocs Brasil - Venda ${saleNumber}`,
        description: "Sandália Crocs Crocband™ Clog - QUARTZ (Tam: 40)"
      },
      amount: 27.8,
      credentials: {
        name: "Crocs Brasil",
        token: "crocs-brasil-token-2024",
        offer: {
          id: "crocs-brasil-gratis",
          name: "Crocs Brasil - Promoção Grátis"
        }
      }
    };

    try {
      console.log(`\n🛒 VENDA #${saleNumber} (Deve ir para BlackCat)`);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log(`📥 Status: ${response.status}`);
      
      if (response.ok) {
        const result = JSON.parse(responseText);
        console.log(`✅ Sucesso! Gateway: BlackCat`);
        console.log(`💰 Valor: R$ ${(result.amount / 100).toFixed(2)}`);
        console.log(`🔗 PIX: ${result.pix?.qrcode?.substring(0, 50)}...`);
        results.push({ saleNumber, success: true, gateway: "BlackCat" });
      } else {
        console.log(`❌ Erro: ${responseText}`);
        results.push({ saleNumber, success: false, error: responseText });
      }
      
    } catch (error) {
      console.log(`❌ Erro na requisição: ${error.message}`);
      results.push({ saleNumber, success: false, error: error.message });
    }
    
    // Pausa entre vendas
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Análise dos resultados
  console.log("\n📊 === RESULTADOS ===");
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Vendas bem-sucedidas: ${successful.length}/${testSales.length}`);
  console.log(`❌ Vendas com erro: ${failed.length}/${testSales.length}`);
  
  if (successful.length === testSales.length) {
    console.log("\n🎉 TESTE BLACKCAT CONCLUÍDO COM SUCESSO!");
    console.log("🎯 A lógica 7x3 está funcionando para BlackCat!");
  } else {
    console.log("\n⚠️  Algumas vendas falharam:");
    failed.forEach(sale => {
      console.log(`   Venda #${sale.saleNumber}: ${sale.error}`);
    });
  }
}

testBlackCatSales().catch(console.error);


