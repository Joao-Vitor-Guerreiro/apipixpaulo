// Teste simples para BlackCat - forçando provider = "blackcat"
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

async function testBlackCatSimple() {
  try {
    console.log("🧪 Testando BlackCat (teste simples)...");
    console.log("📤 Dados enviados:", JSON.stringify(testData, null, 2));
    
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
      console.log("✅ Teste BlackCat simples bem-sucedido!");
    } else {
      console.log("❌ Teste BlackCat simples falhou!");
    }
  } catch (error) {
    console.error("❌ Erro no teste:", error.message);
  }
}

// Executar teste
console.log("🚀 Iniciando teste simples BlackCat...\n");
testBlackCatSimple().catch(console.error);





