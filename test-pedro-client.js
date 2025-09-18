const fetch = require('node-fetch');

const testPayload = {
  "checkout": "https://crocsbr.com/checkout",
  "offer": "crocs-brasil-pedro",
  "customer": {
    "name": "Pedro Cliente",
    "email": "pedro@cliente.com",
    "document": {
      "type": "CPF",
      "number": "12345678901"
    },
    "phone": "11999999999"
  },
  "product": {
    "title": "Crocs Brasil - Pedro",
    "description": "Produto para teste do cliente Pedro"
  },
  "amount": 25.50,
  "credentials": {
    "name": "Pedro - BlackCat API",
    "token": "crocs-brasil-token-pedro",
    "offer": {
      "id": "crocs-brasil-pedro",
      "name": "Crocs Brasil Pedro"
    }
  },
  "paymentProvider": "blackcat",
  "gateway": "blackcat",
  "blackcat": {
    "publicKey": "pk_N85R4tzIst5Q3GiFKXgPFmMqhbdDGq4riT6CbaxOtAT4srk0",
    "secretKey": "sk_o36muB0mB5FMjGsyIXiqioz0qIbR5lkBT3_PyprjW3JJpstN",
    "baseUrl": "https://api.blackcatpagamentos.com/v1"
  }
};

async function testPedroClient() {
  try {
    console.log('🧪 Testando cliente Pedro...');
    console.log('👤 Cliente:', testPayload.credentials.name);
    console.log('🔑 Token:', testPayload.credentials.token);
    console.log('🆔 Offer ID:', testPayload.credentials.offer.id);
    console.log('💰 Valor:', testPayload.amount);
    
    const response = await fetch('https://tracker-tracker-api.fbkpeh.easypanel.host/checkout-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    const result = await response.text();
    console.log('\n📥 Status:', response.status);
    
    if (response.status === 200) {
      const data = JSON.parse(result);
      console.log('✅ Sucesso! PIX gerado com ID:', data.id);
      console.log('✅ Cliente Pedro funcionando corretamente!');
      console.log('✅ Credenciais dinâmicas funcionando!');
    } else {
      console.log('❌ Erro:', result);
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testPedroClient();
