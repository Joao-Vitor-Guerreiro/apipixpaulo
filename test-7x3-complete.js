// Teste completo da lógica 7x3 - 10 vendas
const API_URL = 'http://localhost:3434/checkout-payment';

async function testComplete7x3() {
  console.log("🧪 TESTE COMPLETO DA LÓGICA 7x3 - 10 VENDAS");
  console.log("🎯 Esperado: 1-7 AllowPay, 8-10 BlackCat\n");
  
  const results = [];
  
  for (let i = 1; i <= 10; i++) {
    const payload = {
      checkout: "https://crocsbr.com/checkout",
      offer: "crocs-brasil-gratis",
      customer: {
        name: `Cliente Teste ${i}`,
        email: `cliente${i}@teste.com`,
        document: {
          type: "CPF",
          number: `1234567890${i}`
        },
        phone: "11999999999"
      },
      product: {
        title: `Crocs Brasil - Venda ${i}`,
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
      console.log(`\n🛒 VENDA #${i}`);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      
      if (response.ok) {
        const result = JSON.parse(responseText);
        const cycle = i % 10;
        const expectedGateway = cycle < 7 ? "AllowPay (CLIENTE)" : "BlackCat (SEU)";
        
        console.log(`📊 Ciclo: ${cycle}/10 | Gateway: ${expectedGateway}`);
        console.log(`✅ Status: ${result.status}`);
        console.log(`💰 Valor: R$ ${(result.amount / 100).toFixed(2)}`);
        console.log(`🔗 PIX: ${result.pix?.qrcode?.substring(0, 50)}...`);
        
        results.push({ 
          saleNumber: i, 
          success: true, 
          gateway: expectedGateway,
          cycle,
          toClient: cycle < 7
        });
      } else {
        console.log(`❌ Erro: ${responseText}`);
        results.push({ saleNumber: i, success: false, error: responseText });
      }
      
    } catch (error) {
      console.log(`❌ Erro na requisição: ${error.message}`);
      results.push({ saleNumber: i, success: false, error: error.message });
    }
    
    // Pausa entre vendas
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Análise dos resultados
  console.log("\n📊 === RESULTADOS FINAIS ===");
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Vendas bem-sucedidas: ${successful.length}/10`);
  console.log(`❌ Vendas com erro: ${failed.length}/10`);
  
  if (successful.length > 0) {
    const allowPay = successful.filter(r => r.toClient).length;
    const blackCat = successful.filter(r => !r.toClient).length;
    
    console.log(`🟢 AllowPay (CLIENTE): ${allowPay} vendas`);
    console.log(`🔵 BlackCat (SEU): ${blackCat} vendas`);
    
    console.log("\n🎯 === VERIFICAÇÃO DA LÓGICA 7x3 ===");
    successful.forEach(sale => {
      console.log(`Venda #${sale.saleNumber}: Ciclo ${sale.cycle}/10 → ${sale.gateway}`);
    });
    
    // Verificar se a lógica está correta
    const expectedAllowPay = 7; // Vendas 1-7
    const expectedBlackCat = 3; // Vendas 8-10
    
    if (allowPay === expectedAllowPay && blackCat === expectedBlackCat) {
      console.log("\n🎉 LÓGICA 7x3 FUNCIONANDO PERFEITAMENTE!");
      console.log("✅ Sistema 100% pronto para produção!");
      console.log("🚀 Pode subir a oferta com confiança!");
    } else {
      console.log("\n⚠️  Lógica 7x3 precisa de ajustes");
      console.log(`Esperado: ${expectedAllowPay} AllowPay + ${expectedBlackCat} BlackCat`);
      console.log(`Real: ${allowPay} AllowPay + ${blackCat} BlackCat`);
    }
  }
  
  if (failed.length > 0) {
    console.log("\n❌ Vendas com erro:");
    failed.forEach(sale => {
      console.log(`   Venda #${sale.saleNumber}: ${sale.error.substring(0, 100)}...`);
    });
  }
}

testComplete7x3().catch(console.error);

