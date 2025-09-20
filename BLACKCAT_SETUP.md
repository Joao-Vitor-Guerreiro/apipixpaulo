# 🐱 Configuração BlackCat Pagamentos + AllowPay

## ✅ Integração Implementada

A integração com BlackCat Pagamentos (SEU gateway) e AllowPay (gateway do cliente) foi implementada seguindo o padrão do projeto existente. Aqui está o que foi criado:

### 📁 Arquivos Criados/Modificados

1. **`src/models/api.ts`** - Credenciais BlackCat adicionadas
2. **`src/controllers/allowpayments.ts`** - Atualizado para usar BlackCat
3. **`src/controllers/webhook-blackcat.ts`** - Webhook para receber confirmações
4. **`src/app/routes/routes.ts`** - Rota do webhook adicionada
5. **`test-blackcat.js`** - Arquivo de teste

### 🔧 Endpoints Disponíveis

#### POST `/allowpayments`
Cria uma transação PIX usando a lógica 7x3 com gateways específicos:
- **7 vendas** vão para o **cliente** → **AllowPay** (gateway do cliente)
- **3 vendas** vão para **você** → **BlackCat** (seu gateway)

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

#### POST `/webhook-blackcat`
Webhook para receber confirmações de pagamento da BlackCat.

## ⚙️ Configuração Necessária

### 1. Credenciais BlackCat

As credenciais já estão configuradas no arquivo `src/models/api.ts`:

```typescript
export const credentials = {
  secret: "sk_3vbubUgktoXLnTUWVcWixEig2oNelGYXEaiC-S9et8yDhUGl", // BlackCat Secret Key
  public: "pk_kFHKtjIthC9PhGDuInP_GAoxqSzY1LKkeXxj9YCmvMgJPHOH", // BlackCat Public Key
};

export const blackCatCredentials = {
  apiUrl: "https://app.blackcatpagamentos.com/api/v1",
  secretKey: "sk_3vbubUgktoXLnTUWVcWixEig2oNelGYXEaiC-S9et8yDhUGl",
  publicKey: "pk_kFHKtjIthC9PhGDuInP_GAoxqSzY1LKkeXxj9YCmvMgJPHOH",
  webhookSecret: "YOUR_BLACKCAT_WEBHOOK_SECRET", // Configure conforme necessário
};
```

### 2. Configurar Webhook na BlackCat

Configure o webhook na BlackCat para apontar para:
```
https://tracker-tracker-api.fbkpeh.easypanel.host/webhook-blackcat
```

### 3. Documentação BlackCat

Consulte a documentação oficial: https://app.blackcatpagamentos.com/docs/intro/first-steps

## 🧪 Testando a Integração

### 1. Iniciar o Servidor
```bash
npm run dev
```

### 2. Executar Teste
```bash
node test-blackcat.js
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
curl -X POST http://localhost:3434/webhook-blackcat \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-payment-123",
    "status": "APPROVED",
    "payment_id": "test-payment-123",
    "event": "payment.approved"
  }'
```

## 🔄 Lógica 7x3 com Gateways Específicos

O sistema implementa a seguinte lógica:

1. **Conta vendas** por oferta no banco de dados
2. **Aplica ciclo** de 10 vendas (0-9)
3. **Vendas 0-6**: Vão para o **cliente** (7 vendas) → **AllowPay**
4. **Vendas 7-9**: Vão para **você** (3 vendas) → **BlackCat** (se `useTax = true`)

### Exemplo:
- Venda #1: Cliente → **AllowPay**
- Venda #2: Cliente → **AllowPay**
- ...
- Venda #7: Cliente → **AllowPay**
- Venda #8: Você → **BlackCat** (se useTax = true)
- Venda #9: Você → **BlackCat** (se useTax = true)
- Venda #10: Você → **BlackCat** (se useTax = true)
- Venda #11: Cliente → **AllowPay** (reinicia o ciclo)

## 📊 Monitoramento

O sistema inclui:

- ✅ **Logs detalhados** de cada transação
- ✅ **Integração UTMify** para tracking
- ✅ **Banco de dados** rastreia todas as vendas
- ✅ **Webhooks** garantem confirmação de pagamentos

## 🚨 Pontos de Atenção

1. **Credenciais**: As credenciais BlackCat já estão configuradas
2. **URLs**: URLs da API já estão corretas
3. **Webhook**: Configure o webhook na BlackCat
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
Para adicionar campos específicos da BlackCat, modifique o `paymentData` no controller.

## 📞 Suporte

Se precisar de ajuda:
1. Verifique os logs do servidor
2. Teste com dados de exemplo
3. Confirme as credenciais da BlackCat
4. Verifique a configuração do webhook
5. Consulte a documentação oficial: https://app.blackcatpagamentos.com/docs

---

**✅ Integração BlackCat Pagamentos configurada com sucesso!**
