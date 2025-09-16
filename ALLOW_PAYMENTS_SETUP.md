# 🚀 Configuração Allow Payments

## ✅ Integração Implementada

A integração com Allow Payments foi implementada seguindo o padrão do projeto existente. Aqui está o que foi criado:

### 📁 Arquivos Criados/Modificados

1. **`src/controllers/allowpayments.ts`** - Controller principal para Allow Payments
2. **`src/controllers/webhook-allowpayments.ts`** - Webhook para receber confirmações
3. **`src/app/routes/routes.ts`** - Rotas adicionadas
4. **`src/models/api.ts`** - Credenciais Allow Payments
5. **`test-allowpayments.js`** - Arquivo de teste

### 🔧 Endpoints Disponíveis

#### POST `/allowpayments`
Cria uma transação PIX usando Allow Payments com lógica 7x3:
- **7 vendas** vão para o **cliente**
- **3 vendas** vão para **você** (se `useTax = true`)

**Exemplo de requisição:**
```json
{
  "credentials": {
    "token": "seu-token-cliente",
    "name": "Nome do Cliente",
    "offer": {
      "id": "oferta-001",
      "name": "Nome da Oferta"
    }
  },
  "amount": 97.00,
  "product": {
    "title": "Nome do Produto"
  },
  "customer": {
    "phone": "11999999999",
    "name": "Nome do Cliente",
    "email": "cliente@email.com",
    "document": {
      "type": "CPF",
      "number": "12345678901"
    }
  }
}
```

#### POST `/webhook-allowpayments`
Webhook para receber confirmações de pagamento da Allow Payments.

## ⚙️ Configuração Necessária

### 1. Credenciais Allow Payments

Edite o arquivo `src/models/api.ts` e substitua as credenciais:

```typescript
export const allowPaymentsCredentials = {
  apiUrl: "https://tracker-tracker-api.fbkpeh.easypanel.host/",
  apiKey: "SUA_CHAVE_API_REAL", // Substitua pela chave real
  secretKey: "SUA_CHAVE_SECRETA_REAL", // Substitua pela chave secreta real
  webhookSecret: "SEU_WEBHOOK_SECRET", // Para validar webhooks
};
```

### 2. Configurar Webhook na Allow Payments

Configure o webhook na Allow Payments para apontar para:
```
https://sua-api.com/webhook-allowpayments
```

### 3. Ajustar URL da API

No arquivo `src/controllers/allowpayments.ts`, linha 95, ajuste a URL da API:
```typescript
apiUrl = "https://tracker-tracker-api.fbkpeh.easypanel.host/";
```

## 🧪 Testando a Integração

### 1. Iniciar o Servidor
```bash
npm run dev
```

### 2. Executar Teste
```bash
node test-allowpayments.js
```

### 3. Testar Manualmente

**Teste de Criação de PIX:**
```bash
curl -X POST http://localhost:3434/allowpayments \
  -H "Content-Type: application/json" \
  -d '{
    "credentials": {
      "token": "test-token",
      "name": "Cliente Teste"
    },
    "amount": 97.00,
    "product": {
      "title": "Produto Teste"
    },
    "customer": {
      "phone": "11999999999",
      "name": "João Silva",
      "email": "joao@teste.com",
      "document": {
        "type": "CPF",
        "number": "12345678901"
      }
    }
  }'
```

**Teste de Webhook:**
```bash
curl -X POST http://localhost:3434/webhook-allowpayments \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-payment-123",
    "status": "APPROVED",
    "payment_id": "test-payment-123"
  }'
```

## 🔄 Lógica 7x3

O sistema implementa a seguinte lógica:

1. **Conta vendas** por oferta no banco de dados
2. **Aplica ciclo** de 10 vendas (0-9)
3. **Vendas 0-6**: Vão para o **cliente** (7 vendas)
4. **Vendas 7-9**: Vão para **você** (3 vendas) - se `useTax = true`

### Exemplo:
- Venda #1: Cliente
- Venda #2: Cliente
- ...
- Venda #7: Cliente
- Venda #8: Você (se useTax = true)
- Venda #9: Você (se useTax = true)
- Venda #10: Você (se useTax = true)
- Venda #11: Cliente (reinicia o ciclo)

## 📊 Monitoramento

O sistema inclui:

- ✅ **Logs detalhados** de cada transação
- ✅ **Integração UTMify** para tracking
- ✅ **Banco de dados** rastreia todas as vendas
- ✅ **Webhooks** garantem confirmação de pagamentos

## 🚨 Pontos de Atenção

1. **Credenciais**: Substitua todas as credenciais de teste pelas reais
2. **URLs**: Ajuste as URLs da API conforme necessário
3. **Webhook**: Configure o webhook na Allow Payments
4. **Testes**: Teste em ambiente de sandbox antes de produção
5. **Logs**: Monitore os logs para identificar problemas

## 🔧 Personalizações

### Alterar Lógica de Divisão
Para alterar a proporção (ex: 8x2), modifique no controller:
```typescript
const cycle = nextCount % 10;
if (cycle < 8) { // 8 vendas para cliente
  // ...
} else { // 2 vendas para você
  // ...
}
```

### Adicionar Novos Campos
Para adicionar campos específicos da Allow Payments, modifique o `paymentData` no controller.

## 📞 Suporte

Se precisar de ajuda:
1. Verifique os logs do servidor
2. Teste com dados de exemplo
3. Confirme as credenciais da Allow Payments
4. Verifique a configuração do webhook

---

**✅ Integração Allow Payments configurada com sucesso!**

