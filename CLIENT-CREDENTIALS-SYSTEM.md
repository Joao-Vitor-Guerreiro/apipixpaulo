# Sistema Dinâmico de Credenciais por Cliente

## Como Funciona

O sistema agora identifica automaticamente qual cliente usar baseado no **token** enviado no checkout.

## Mapeamento de Tokens

| Token | Cliente | Credenciais |
|-------|---------|-------------|
| `crocs-brasil-token-2024` | Gustavo | BLACKCAT_GUSTAVO_* |
| `crocs-brasil-token-matheus` | Matheus | BLACKCAT_MATHEUS_* |

## Variáveis de Ambiente Necessárias

### EasyPanel Environment Variables

```env
# Credenciais do Paulo (sempre as mesmas)
BLACKCAT_SECRET_KEY=sk_paulo_secret_key_aqui
BLACKCAT_PUBLIC_KEY=pk_paulo_public_key_aqui

# Credenciais do Gustavo
BLACKCAT_GUSTAVO_SECRET_KEY=sk_gustavo_secret_key_aqui
BLACKCAT_GUSTAVO_PUBLIC_KEY=pk_gustavo_public_key_aqui

# Credenciais do Matheus
BLACKCAT_MATHEUS_SECRET_KEY=sk_matheus_secret_key_aqui
BLACKCAT_MATHEUS_PUBLIC_KEY=pk_matheus_public_key_aqui

# Outras variáveis
DATABASE_URL=postgresql://...
ALLOWPAY_SECRET_KEY=sk_allowpay_secret_key_aqui
ALLOWPAY_COMPANY_ID=93b610dd-202b-498f-9007-57195f5eb67b
```

## Lógica 7x3

- **7 vendas** → Cliente (Gustavo ou Matheus, baseado no token)
- **3 vendas** → Paulo (sempre as mesmas credenciais)

## Como Adicionar Novo Cliente

1. **Adicionar credenciais** no `api.ts`:
```typescript
export const novoClienteBlackCatCredentials = {
  apiUrl: "https://api.blackcatpagamentos.com/v1",
  secretKey: process.env.BLACKCAT_NOVO_CLIENTE_SECRET_KEY || "sk_xxx",
  publicKey: process.env.BLACKCAT_NOVO_CLIENTE_PUBLIC_KEY || "pk_xxx",
};
```

2. **Adicionar no switch** da função `getClientCredentials`:
```typescript
case "token-do-novo-cliente":
  return novoClienteBlackCatCredentials;
```

3. **Adicionar variáveis** no EasyPanel:
```env
BLACKCAT_NOVO_CLIENTE_SECRET_KEY=sk_xxx
BLACKCAT_NOVO_CLIENTE_PUBLIC_KEY=pk_xxx
```

## Tratamento de Erro

Se o token não for reconhecido, o sistema retorna um erro HTTP 400 com a mensagem:

```json
{
  "error": "Token de cliente inválido",
  "details": "Token de cliente não reconhecido: token-invalido. Tokens válidos: crocs-brasil-token-2024, crocs-brasil-token-matheus",
  "validTokens": ["crocs-brasil-token-2024", "crocs-brasil-token-matheus"]
}
```
