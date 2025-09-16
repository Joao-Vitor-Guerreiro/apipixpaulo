// Teste da lógica 7x3 com a nova oferta
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/checkout-payment';

// Dados de teste
const testData = {
  checkout: "https://minha-oferta.com/checkout",
  offer: "minha-oferta-teste",
  customer: {
    name: "João Silva",
    email: "joao@email.com",
    document: {
      type: "CPF",
      number: "12345678901"
    },
    phone: "11999999999"
  },
  product: {
    title: "Produto da Minha Oferta",
    description: "Descrição do produto"
  },
  amount: 97.00,
  credentials: {
    name: "Cliente Teste",
    token: "token-cliente-teste",
    offer: {
      id: "minha-oferta-teste",
      name: "Minha Oferta Teste"
    }
  }
};

async function testarVenda(numeroVenda) {
  console.log(`\n🔄 Testando venda #${numeroVenda}:`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok) {
      const cycle = numeroVenda % 10;
      const gateway = cycle >= 7 ? 'BlackCat (SUAS VENDAS)' : 'AllowPay (CLIENTE)';
      
      console.log(`✅ Venda #${numeroVenda} processada:`);
      console.log(`   Ciclo: ${cycle}/10`);
      console.log(`   Gateway: ${gateway}`);
      console.log(`   PIX Code: ${result.pixCode ? 'Gerado' : 'Não gerado'}`);
      console.log(`   Transaction ID: ${result.transactionId || 'N/A'}`);
    } else {
      console.log(`❌ Erro na venda #${numeroVenda}:`, result.error);
    }
  } catch (error) {
    console.log(`❌ Erro de conexão na venda #${numeroVenda}:`, error.message);
  }
}

async function testarLógica7x3() {
  console.log('🧪 Testando lógica 7x3 com 15 vendas...\n');
  
  // Testa 15 vendas para ver 1 ciclo completo + 5 vendas do próximo
  for (let i = 1; i <= 15; i++) {
    await testarVenda(i);
    
    // Pequena pausa entre as vendas
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 Resumo da lógica 7x3:');
  console.log('Vendas 1-7: AllowPay (CLIENTE)');
  console.log('Vendas 8-10: BlackCat (SUAS VENDAS)');
  console.log('Vendas 11-17: AllowPay (CLIENTE)');
  console.log('Vendas 18-20: BlackCat (SUAS VENDAS)');
  console.log('E assim por diante...');
}

// Executa o teste
testarLógica7x3().catch(console.error);




