// Teste de uma única venda para debug
const API_URL = 'http://localhost:3434/checkout-payment';

async function testSingleSale() {
  const payload = {
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
    console.log("🛒 Testando uma única venda...");
    console.log("📤 Payload:", JSON.stringify(payload, null, 2));
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log("📥 Status da resposta:", response.status);
    console.log("📥 Headers:", Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log("📥 Resposta (texto):", responseText);

    if (response.ok) {
      const result = JSON.parse(responseText);
      console.log("✅ Sucesso!");
      console.log("📊 Resultado:", JSON.stringify(result, null, 2));
    } else {
      console.log("❌ Erro na resposta");
    }
    
  } catch (error) {
    console.error("❌ Erro na requisição:", error.message);
  }
}

testSingleSale();


