// Teste forçado para BlackCat (suas vendas)
// Este teste simula a venda #8 (que vai para você usando BlackCat)

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

async function testBlackCatForced() {
  try {
    console.log("🧪 Testando BlackCat (vendas para você)...");
    console.log("📤 Dados enviados:", JSON.stringify(testData, null, 2));
    
    // Primeiro, vamos criar algumas vendas para simular o ciclo 7x3
    // Vamos fazer 7 requisições para simular vendas 1-7 (cliente)
    console.log("\n🔄 Simulando vendas 1-7 (cliente)...");
    for (let i = 1; i <= 7; i++) {
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
        console.log(`Venda ${i}: Status ${response.status}`);
      } catch (error) {
        console.log(`Venda ${i}: Erro - ${error.message}`);
      }
    }
    
    // Agora a venda #8 deve ir para você (BlackCat)
    console.log("\n🐱 Testando venda #8 (deve ir para BlackCat)...");
    const response = await fetch("http://localhost:3434/allowpayments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log("📥 Resposta recebida:");
    console.log("Status:", response.status);
    console.log("Dados:", JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log("✅ Teste BlackCat bem-sucedido!");
    } else {
      console.log("❌ Teste BlackCat falhou!");
    }
  } catch (error) {
    console.error("❌ Erro no teste:", error.message);
  }
}

// Executar teste
console.log("🚀 Iniciando teste forçado BlackCat...\n");
testBlackCatForced().catch(console.error);





