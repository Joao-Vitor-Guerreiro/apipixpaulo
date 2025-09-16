// Teste de debug para entender qual provider está sendo usado
const testData = {
  credentials: {
    token: "test-client-token-123",
    name: "Cliente Teste BlackCat",
    offer: {
      id: "offer-blackcat-001",
      name: "Oferta BlackCat Teste"
    }
  },
  amount: 97.00,
  product: {
    title: "Produto Teste BlackCat"
  },
  customer: {
    phone: "11999999999",
    name: "João Silva Teste",
    email: "joao.teste@email.com",
    document: {
      type: "CPF",
      number: "12345678901"
    }
  }
};

async function testBlackCatDebug() {
  try {
    console.log("🧪 Testando BlackCat (debug)...");
    console.log("📤 Dados enviados:", JSON.stringify(testData, null, 2));
    
    // Vamos fazer várias requisições para simular o ciclo 7x3
    console.log("\n🔄 Simulando ciclo 7x3...");
    
    for (let i = 1; i <= 10; i++) {
      try {
        const response = await fetch("http://localhost:3434/allowpayments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...testData,
            credentials: {
              ...testData.credentials,
              token: `test-client-token-${i}`
            }
          })
        });

        const result = await response.json();
        
        console.log(`Venda ${i}: Status ${response.status}`);
        if (response.status === 200) {
          console.log(`  ✅ Sucesso! Provider: ${result.provider || 'N/A'}`);
        } else {
          console.log(`  ❌ Erro: ${result.error || 'N/A'}`);
        }
      } catch (error) {
        console.log(`Venda ${i}: Erro - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error("❌ Erro no teste:", error.message);
  }
}

// Executar teste
console.log("🚀 Iniciando teste debug BlackCat...\n");
testBlackCatDebug().catch(console.error);






