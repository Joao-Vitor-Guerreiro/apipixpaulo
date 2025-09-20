// 🔐 EXEMPLO: COMO O CLIENTE DEVE ENVIAR AS CREDENCIAIS

// ========================================
// 1️⃣ CONFIGURAÇÕES DO CLIENTE
// ========================================

const CLIENT_CONFIG = {
  // Credenciais do cliente (obtidas do gateway do cliente)
  credentials: {
    token: 'sk_cliente_123456789',        // Secret key do gateway do cliente
    name: 'João Silva',                   // Nome do cliente
    organizationId: 'org_123',            // ID da organização (opcional)
  },
  
  // Configurações da API
  api: {
    baseUrl: 'https://sua-api-pix.com',
    endpoints: {
      gerarpix: '/gerarpix',
      checkout: '/checkout'
    }
  }
};

// ========================================
// 2️⃣ EXEMPLO DE REQUISIÇÃO COMPLETA
// ========================================

async function processarVenda(dadosVenda) {
  try {
    console.log('🔄 Processando venda...');
    
    // 1️⃣ Primeiro, obter checkout (sistema 7x3)
    const checkoutUrl = await obterCheckout(dadosVenda.produto);
    
    // 2️⃣ Se for checkout do Paulo, processar com BlackCat
    if (checkoutUrl.includes('sua-api-pix.com') || checkoutUrl.includes('checkout-paulo')) {
      return await processarComBlackCat(dadosVenda);
    } else {
      // 3️⃣ Se for checkout do cliente, processar com gateway do cliente
      return await processarComGatewayCliente(dadosVenda, checkoutUrl);
    }
    
  } catch (error) {
    console.error('❌ Erro ao processar venda:', error);
    throw error;
  }
}

// ========================================
// 3️⃣ OBTER CHECKOUT (SISTEMA 7x3)
// ========================================

async function obterCheckout(nomeProduto) {
  try {
    const response = await fetch(`${CLIENT_CONFIG.api.baseUrl}${CLIENT_CONFIG.api.endpoints.checkout}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkout: 'https://meusite.com/checkout',  // Checkout do cliente
        offer: nomeProduto                         // Nome da oferta
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Checkout obtido:', data.checkout);
    return data.checkout;
    
  } catch (error) {
    console.error('❌ Erro ao obter checkout:', error);
    // Fallback para checkout do cliente
    return 'https://meusite.com/checkout';
  }
}

// ========================================
// 4️⃣ PROCESSAR COM BLACKCAT (PAULO)
// ========================================

async function processarComBlackCat(dadosVenda) {
  try {
    console.log('💳 Processando com BlackCat...');
    
    const response = await fetch(`${CLIENT_CONFIG.api.baseUrl}${CLIENT_CONFIG.api.endpoints.gerarpix}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // 🔑 CREDENCIAIS DO CLIENTE
        credentials: {
          token: CLIENT_CONFIG.credentials.token,        // Secret key do cliente
          name: CLIENT_CONFIG.credentials.name,          // Nome do cliente
          organizationId: CLIENT_CONFIG.credentials.organizationId, // ID da organização
          offer: {                                       // Informações da oferta (opcional)
            id: 'offer_123',
            name: dadosVenda.produto
          }
        },
        
        // 💰 DADOS DA VENDA
        amount: dadosVenda.valor,
        product: {
          title: dadosVenda.produto
        },
        
        // 👤 DADOS DO CLIENTE
        customer: {
          name: dadosVenda.cliente.nome,
          email: dadosVenda.cliente.email,
          phone: dadosVenda.cliente.telefone,
          document: {
            type: dadosVenda.cliente.tipoDocumento, // 'CPF' ou 'CNPJ'
            number: dadosVenda.cliente.documento
          }
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro HTTP: ${response.status} - ${errorData.error}`);
    }
    
    const pixData = await response.json();
    console.log('✅ PIX criado com BlackCat:', pixData);
    
    return {
      success: true,
      gateway: 'BlackCat',
      data: pixData,
      redirectUrl: pixData.payment_url || pixData.checkout_url
    };
    
  } catch (error) {
    console.error('❌ Erro ao processar com BlackCat:', error);
    throw error;
  }
}

// ========================================
// 5️⃣ PROCESSAR COM GATEWAY DO CLIENTE
// ========================================

async function processarComGatewayCliente(dadosVenda, checkoutUrl) {
  try {
    console.log('💳 Processando com gateway do cliente...');
    
    // Exemplo com PagSeguro
    const response = await fetch('https://api.pagseguro.com/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLIENT_CONFIG.credentials.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: dadosVenda.valor,
        customer: {
          name: dadosVenda.cliente.nome,
          email: dadosVenda.cliente.email,
          phone: dadosVenda.cliente.telefone,
          document: dadosVenda.cliente.documento
        },
        items: [{
          name: dadosVenda.produto,
          price: dadosVenda.valor,
          quantity: 1
        }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const paymentData = await response.json();
    console.log('✅ Pagamento criado com gateway do cliente:', paymentData);
    
    return {
      success: true,
      gateway: 'Cliente',
      data: paymentData,
      redirectUrl: paymentData.checkout_url || checkoutUrl
    };
    
  } catch (error) {
    console.error('❌ Erro ao processar com gateway do cliente:', error);
    throw error;
  }
}

// ========================================
// 6️⃣ EXEMPLO DE USO
// ========================================

// Dados de exemplo
const dadosVendaExemplo = {
  produto: 'Pix do Milhão',
  valor: 97,
  cliente: {
    nome: 'Maria Santos',
    email: 'maria@email.com',
    telefone: '11999999999',
    tipoDocumento: 'CPF',
    documento: '12345678901'
  }
};

// Processar venda
processarVenda(dadosVendaExemplo)
  .then(resultado => {
    console.log('🎉 Venda processada com sucesso!', resultado);
    
    // Redirecionar para página de pagamento
    if (resultado.redirectUrl) {
      window.location.href = resultado.redirectUrl;
    }
  })
  .catch(erro => {
    console.error('💥 Erro ao processar venda:', erro);
    alert('Erro ao processar venda. Tente novamente.');
  });

// ========================================
// 7️⃣ CONFIGURAÇÕES POR GATEWAY
// ========================================

const GATEWAY_CONFIGS = {
  // BlackCat (Paulo)
  blackcat: {
    name: 'BlackCat',
    authType: 'Basic',
    requiresPublicKey: true
  },
  
  // PagSeguro
  pagseguro: {
    name: 'PagSeguro',
    authType: 'Bearer',
    requiresPublicKey: false
  },
  
  // Mercado Pago
  mercadopago: {
    name: 'Mercado Pago',
    authType: 'Bearer',
    requiresPublicKey: false
  },
  
  // iExperience
  iexperience: {
    name: 'iExperience',
    authType: 'Bearer',
    requiresPublicKey: false
  }
};

// ========================================
// 8️⃣ FUNÇÃO DE CONFIGURAÇÃO
// ========================================

function configurarCliente(credenciais) {
  // Validar credenciais
  if (!credenciais.token) {
    throw new Error('Token é obrigatório');
  }
  
  if (!credenciais.name) {
    throw new Error('Nome é obrigatório');
  }
  
  // Atualizar configurações
  CLIENT_CONFIG.credentials = {
    ...CLIENT_CONFIG.credentials,
    ...credenciais
  };
  
  console.log('✅ Cliente configurado:', CLIENT_CONFIG.credentials);
}

// ========================================
// 9️⃣ EXEMPLO DE CONFIGURAÇÃO
// ========================================

// Configurar cliente
configurarCliente({
  token: 'sk_novo_token_123',
  name: 'Novo Cliente',
  organizationId: 'org_456'
});

// ========================================
// 🔟 LOGS E MONITORAMENTO
// ========================================

function logVenda(dadosVenda, resultado) {
  console.log('📊 Log da venda:', {
    timestamp: new Date().toISOString(),
    produto: dadosVenda.produto,
    valor: dadosVenda.valor,
    cliente: dadosVenda.cliente.nome,
    gateway: resultado.gateway,
    success: resultado.success
  });
}

// ========================================
// 📋 CHECKLIST DE IMPLEMENTAÇÃO
// ========================================

/*
✅ Configurar credenciais do cliente
✅ Configurar URL da API
✅ Implementar função de checkout
✅ Implementar função de pagamento
✅ Tratar erros adequadamente
✅ Implementar logs
✅ Testar com diferentes cenários
✅ Configurar fallbacks
*/

console.log('🚀 Sistema de credenciais configurado!');

