// Teste do servidor local com lógica 7x3
const testData = {
  credentials: {
    token: "test_token_123",
    name: "Cliente Teste",
    offer: {
      id: "offer_123",
      name: "Oferta Teste"
    }
  },
  amount: 97,
  product: {
    title: "Produto Teste 7x3"
  },
  customer: {
    phone: "11999999999",
    name: "João Silva",
    email: "joao@test.com",
    document: {
      type: "CPF",
      number: "12345678901"
    }
  }
};

async function testServidor() {
  console.log("🧪 TESTE DO SERVIDOR LOCAL - LÓGICA 7x3");
  console.log("=========================================");
  
  // Teste 1: Venda 1-7 (deve usar AllowPay - mas vai falhar por URL incorreta)
  console.log("\n📊 TESTE 1: Venda 1-7 (AllowPay)");
  console.log("=================================");
  
  try {
    const response1 = await fetch("http://localhost:3434/allowpayments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testData)
    });
    
    const result1 = await response1.json();
    console.log("Status:", response1.status);
    console.log("Resposta:", JSON.stringify(result1, null, 2));
  } catch (error) {
    console.log("❌ Erro:", error.message);
  }
  
  // Teste 2: Venda 8-10 (deve usar BlackCat)
  console.log("\n📊 TESTE 2: Venda 8-10 (BlackCat)");
  console.log("=================================");
  
  // Simular venda 8 (useTax = true)
  const testDataBlackCat = {
    ...testData,
    useTax: true
  };
  
  try {
    const response2 = await fetch("http://localhost:3434/allowpayments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testDataBlackCat)
    });
    
    const result2 = await response2.json();
    console.log("Status:", response2.status);
    console.log("Resposta:", JSON.stringify(result2, null, 2));
  } catch (error) {
    console.log("❌ Erro:", error.message);
  }
}

testServidor();

