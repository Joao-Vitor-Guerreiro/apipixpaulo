## Tracker API - Guia de Uso

Este documento explica como configurar, usar e integrar o Tracker com o checkout, incluindo a lógica 7x3, webhooks e testes.

### 1) Visão Geral
- **Objetivo**: Intermediar a criação de cobranças PIX roteando vendas entre gateways conforme a lógica 7x3.
- **Gateways**: AllowPay ou qualquer outro (cliente) e BlackCat (você).
- **Roteamento 7x3**: A cada ciclo de 10 vendas por oferta: 7 vão para AllowPay ou qualquer outro gateway (Cliente) e 3 vão para BlackCat. Atualmente a contagem é por vendas geradas (PIX criado), não apenas aprovadas.

### 2) Ambiente / Deploy
- Variáveis no EasyPanel (produção):
  - `DATABASE_URL`
  - `BLACKCAT_PUBLIC_KEY`, `BLACKCAT_SECRET_KEY`, `BLACKCAT_WEBHOOK_SECRET` (se aplicável)
  - `ALLOWPAY_SECRET_KEY`, `ALLOWPAY_COMPANY_ID`, `ALLOWPAY_WEBHOOK_SECRET` (se aplicável)
- URL pública do Tracker: `https://tracker-tracker-api.fbkpeh.easypanel.host`
- Porta interna: definida no servidor do projeto (`src/app/server.ts`).

### 3) Endpoints Principais
- `POST /checkout-payment`
  - Cria uma cobrança e decide o gateway conforme 7x3.
  - Body esperado (exemplo):
    ```json
    {
      "checkout": "pb-1699999999999",
      "offer": { "id": "pudimbeauty-offer-1", "name": "Pudim Beauty", "price": 129.9, "useTax": true },
      "amount": 129.9,
      "customer": {
        "name": "Maria Silva",
        "email": "maria@example.com",
        "phone": "11999999999",
        "document": { "type": "CPF", "number": "12345678909" }
      },
      "product": { "title": "Pedido com 2 itens" },
      "credentials": { "token": "web", "name": "Loja X" }
    }
    ```
  - Resposta: depende do gateway; normalmente inclui identificadores da transação e dados de PIX (brcode/qr).

- Webhooks (recebidos do gateway):
  - `POST /webhook-allowpayments`
  - `POST /webhook-blackcat`
  - Localizam a venda por `ghostId` e atualizam status (campos como `approved`).

### 4) Lógica 7x3 (por oferta)
- Implementação em `src/controllers/allowpayments.ts`.
- Contagem por oferta (`offer.id`) usando total de vendas já criadas daquela oferta:
  - `totalSales = prisma.sale.count({ where: { offerId } })`
  - `nextCount = totalSales + 1`
  - `cycle = nextCount % 10`
  - Se `cycle < 7` → AllowPay (cliente) (`toClient = true`)
  - Senão → BlackCat (você) (`toClient = false`)
- Importante: use um `offer.id` estável por oferta para manter o ciclo.

### 5) Integração no Frontend (Next.js)
- Chame o endpoint do Tracker diretamente (URL pública), sem `.env` no frontend se preferir expor a URL.
  ```ts
  const TRACKER_API = "https://tracker-tracker-api.fbkpeh.easypanel.host";
  const payload = { /* conforme exemplo do endpoint */ };
  const resp = await fetch(`${TRACKER_API}/checkout-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await resp.json();
  // Trate id/pix, redirecione etc.
  ```

### 6) Configuração de Webhooks nos Gateways
- AllowPay: aponte para `https://tracker-tracker-api.fbkpeh.easypanel.host/webhook-allowpayments`
- BlackCat: aponte para `https://tracker-tracker-api.fbkpeh.easypanel.host/webhook-blackcat`
- Garanta autenticação/segredo se o gateway fornecer (e valide no código se necessário).

### 7) Testes Rápidos
- Criar 10 vendas para mesma oferta (PowerShell):
  ```powershell
  $offerId = "teste-offer-1"
  for ($i=1; $i -le 10; $i++) {
    $body = @{ checkout="t-$i"; offer=@{id=$offerId;name="Oferta Teste";price=100;useTax=$true}; amount=100; customer=@{name="Cliente $i";email="c$i@ex.com";phone="11999999999";document=@{type="CPF";number="12345678909"}}; product=@{title="Produto $i"}; credentials=@{token="web";name="Loja"} } | ConvertTo-Json -Depth 4
    Invoke-WebRequest -Uri "https://tracker-tracker-api.fbkpeh.easypanel.host/checkout-payment" -Method POST -Body $body -ContentType "application/json" | Out-Null
    Start-Sleep -Milliseconds 400
  }
  ```
- Conferir distribuição no DB (DBeaver):
  ```sql
  SELECT "toClient", COUNT(*) AS total
  FROM "Sale"
  WHERE "offerId" = 'teste-offer-1'
  GROUP BY "toClient";
  ```

### 8) Troubleshooting
- 401 Unauthorized: conferir chaves em `src/models/api.ts` e variáveis no EasyPanel.
- 404 na rota: use `POST /checkout-payment` na raiz da API pública.
- CORS: adicione o domínio da loja no CORS do servidor.
- Contagem não alterna: confirme `offer.id` estável e entradas em `Sale` sendo criadas; verifique concorrência (múltiplas requisições simultâneas).

### 9) Observações
- Caso deseje que a contagem seja por vendas aprovadas, mude a consulta para `approved = true` (já existe suporte no código e pode ser alternado conforme necessidade).
- Avalie implementar endpoint `/stats/:offerId` para inspeção rápida (aprovadas por gateway, próximo destino do ciclo).



