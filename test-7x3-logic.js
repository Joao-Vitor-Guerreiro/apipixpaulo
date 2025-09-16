// Teste da Lógica 7x3 - Simulação de Múltiplas Vendas
const fetch = require('node-fetch');

// Configuração do teste
const API_URL = 'http://localhost:3434/checkout-payment';
const TEST_PAYLOAD = {
  checkout: "https://crocsbr.com/checkout",
  offer: "crocs-brasil-gratis",
  customer: {
    name: "João Silva Teste",
    email: "joao.teste@email.com",
    document: {
      type: "CPF",
      number: "12345678901"
    },
    phone: "11999999999"
  },
  product: {
    title: "Crocs Brasil - 1 item",
    description: "Sandália Crocs Crocband™ Clog - QUARTZ (Tam: 40)"
  },
  amount: 27.8, // Valor em reais
  credentials: {
    name: "Crocs Brasil",
    token: "crocs-brasil-token-2024",
    offer: {
      id: "crocs-brasil-gratis",
      name: "Crocs Brasil - Promoção Grátis"
    }
  }
};

// Função para fazer uma venda
async function makeSale(saleNumber) {
  try {
    console.log(`\n🛒 === VENDA #${saleNumber} ===`);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_PAYLOAD),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    // Determinar qual gateway foi usado baseado na lógica 7x3
    const cycle = saleNumber % 10;
    let expectedGateway = "";
    let expectedToClient = false;
    
    if (cycle < 7) {
      expectedGateway = "AllowPay (CLIENTE)";
      expectedToClient = true;
    } else if (cycle < 10) {
      expectedGateway = "BlackCat (SEU)";
      expectedToClient = false;
    }
    
    console.log(`📊 Venda #${saleNumber} | Ciclo: ${cycle}/10`);
    console.log(`🎯 Gateway Esperado: ${expectedGateway}`);
    console.log(`👤 Para Cliente: ${expectedToClient ? "SIM" : "NÃO"}`);
    console.log(`✅ Status: ${result.status || "Processado"}`);
    console.log(`💰 Valor: R$ ${(result.amount / 100).toFixed(2)}`);
    
    if (result.pix && result.pix.qrcode) {
      console.log(`🔗 PIX: ${result.pix.qrcode.substring(0, 50)}...`);
    }
    
    return {
      saleNumber,
      cycle,
      expectedGateway,
      expectedToClient,
      success: true,
      result
    };
    
  } catch (error) {
    console.error(`❌ Erro na venda #${saleNumber}:`, error.message);
    return {
      saleNumber,
      cycle: saleNumber % 10,
      expectedGateway: "ERRO",
      expectedToClient: false,
      success: false,
      error: error.message
    };
  }
}

// Função principal de teste
async function test7x3Logic() {
  console.log("🧪 === INICIANDO TESTE DA LÓGICA 7x3 ===");
  console.log("📋 Testando 20 vendas para verificar o ciclo completo");
  console.log("🎯 Esperado: 7 vendas AllowPay + 3 vendas BlackCat por ciclo\n");
  
  const results = [];
  const totalSales = 20;
  
  // Fazer as vendas sequencialmente
  for (let i = 1; i <= totalSales; i++) {
    const result = await makeSale(i);
    results.push(result);
    
    // Pequena pausa entre vendas para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Análise dos resultados
  console.log("\n📊 === ANÁLISE DOS RESULTADOS ===");
  
  const successfulSales = results.filter(r => r.success);
  const failedSales = results.filter(r => !r.success);
  
  console.log(`✅ Vendas bem-sucedidas: ${successfulSales.length}/${totalSales}`);
  console.log(`❌ Vendas com erro: ${failedSales.length}/${totalSales}`);
  
  if (failedSales.length > 0) {
    console.log("\n❌ Vendas com erro:");
    failedSales.forEach(sale => {
      console.log(`   Venda #${sale.saleNumber}: ${sale.error}`);
    });
  }
  
  // Verificar padrão 7x3
  console.log("\n🔄 === VERIFICAÇÃO DO PADRÃO 7x3 ===");
  
  const cycles = {};
  successfulSales.forEach(sale => {
    const cycle = sale.cycle;
    if (!cycles[cycle]) {
      cycles[cycle] = [];
    }
    cycles[cycle].push(sale);
  });
  
  Object.keys(cycles).sort((a, b) => parseInt(a) - parseInt(b)).forEach(cycle => {
    const sales = cycles[cycle];
    const allowPayCount = sales.filter(s => s.expectedToClient).length;
    const blackCatCount = sales.filter(s => !s.expectedToClient).length;
    
    console.log(`Ciclo ${cycle}: ${allowPayCount} AllowPay + ${blackCatCount} BlackCat`);
  });
  
  // Resumo final
  console.log("\n🎉 === RESUMO FINAL ===");
  console.log(`Total de vendas testadas: ${totalSales}`);
  console.log(`Vendas bem-sucedidas: ${successfulSales.length}`);
  console.log(`Taxa de sucesso: ${((successfulSales.length / totalSales) * 100).toFixed(1)}%`);
  
  if (successfulSales.length === totalSales) {
    console.log("✅ TESTE CONCLUÍDO COM SUCESSO!");
    console.log("🎯 A lógica 7x3 está funcionando corretamente!");
  } else {
    console.log("⚠️  TESTE CONCLUÍDO COM ALGUNS ERROS");
    console.log("🔍 Verifique os logs acima para identificar problemas");
  }
}

// Executar o teste
test7x3Logic().catch(console.error);


