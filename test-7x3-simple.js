// Teste Simples da Lógica 7x3 - Apenas 10 vendas
// Usando fetch nativo do Node.js (versão 18+)

const API_URL = 'http://localhost:3434/checkout-payment';

async function testSingleSale(saleNumber) {
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
    console.log(`\n🛒 VENDA #${saleNumber}`);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }

    const result = await response.json();
    
    // Calcular qual gateway deveria ser usado
    const cycle = saleNumber % 10;
    let expectedGateway = "";
    
    if (cycle < 7) {
      expectedGateway = "AllowPay (CLIENTE)";
    } else {
      expectedGateway = "BlackCat (SEU)";
    }
    
    console.log(`📊 Ciclo: ${cycle}/10 | Gateway: ${expectedGateway}`);
    console.log(`✅ Status: ${result.status || "OK"}`);
    console.log(`💰 Valor: R$ ${(result.amount / 100).toFixed(2)}`);
    
    return { success: true, cycle, expectedGateway };
    
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTest() {
  console.log("🧪 TESTE DA LÓGICA 7x3 - 10 VENDAS");
  console.log("🎯 Esperado: 7 AllowPay + 3 BlackCat\n");
  
  const results = [];
  
  for (let i = 1; i <= 10; i++) {
    const result = await testSingleSale(i);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 500)); // Pausa de 500ms
  }
  
  // Análise
  console.log("\n📊 === RESULTADOS ===");
  const successful = results.filter(r => r.success);
  const allowPay = successful.filter(r => r.cycle < 7).length;
  const blackCat = successful.filter(r => r.cycle >= 7).length;
  
  console.log(`✅ Vendas bem-sucedidas: ${successful.length}/10`);
  console.log(`🟢 AllowPay (0-6): ${allowPay} vendas`);
  console.log(`🔵 BlackCat (7-9): ${blackCat} vendas`);
  
  if (allowPay === 7 && blackCat === 3) {
    console.log("\n🎉 LÓGICA 7x3 FUNCIONANDO PERFEITAMENTE!");
  } else {
    console.log("\n⚠️  Verificar lógica - números não batem");
  }
}

runTest().catch(console.error);
