export const credentials = {
  secret: process.env.BLACKCAT_SECRET_KEY || "", // BlackCat Secret Key
  public: process.env.BLACKCAT_PUBLIC_KEY || "", // BlackCat Public Key
};

// Credenciais BlackCat PAULO
export const blackCatCredentials = {
  apiUrl: "https://api.blackcatpagamentos.com/v1",
  secretKey: process.env.BLACKCAT_SECRET_KEY || "",
  publicKey: process.env.BLACKCAT_PUBLIC_KEY || "",
  webhookSecret: process.env.BLACKCAT_WEBHOOK_SECRET || "", // Para validar webhooks - configure conforme necessário
};

// Credenciais BlackCat do CLIENTE GUSTAVO
export const gustavoBlackCatCredentials = {
  apiUrl: "https://api.blackcatpagamentos.com/v1",
  secretKey: process.env.BLACKCAT_GUSTAVO_SECRET_KEY || "sk_GPv5q3wJMCcWeFL4jPKB3nbTnEQuTJJmYWt2fGzroiJmd0cD",
  publicKey: process.env.BLACKCAT_GUSTAVO_PUBLIC_KEY || "pk_OpCieCtR0F9qJ0Zn9mLddqfacYMxV83LxK5mazKiU-3PzEy_",
};

// Credenciais BlackCat do CLIENTE MATHEUS
export const matheusBlackCatCredentials = {
  apiUrl: "https://api.blackcatpagamentos.com/v1",
  secretKey: process.env.BLACKCAT_MATHEUS_SECRET_KEY || "sk_GPv5q3wJMCcWeFL4jPKB3nbTnEQuTJJmYWt2fGzroiJmd0cD",
  publicKey: process.env.BLACKCAT_MATHEUS_PUBLIC_KEY || "pk_OpCieCtR0F9qJ0Zn9mLddqfacYMxV83LxK5mazKiU-3PzEy_",
};

// Função para obter credenciais baseado no token do cliente
export const getClientCredentials = (clientToken: string) => {
  switch (clientToken) {
    case "crocs-brasil-token-2024":
      return gustavoBlackCatCredentials;
    case "crocs-brasil-token-matheus":
      return matheusBlackCatCredentials;
    default:
      throw new Error(`Token de cliente não reconhecido: ${clientToken}.`);
  }
};

// Credenciais para Allow Payments
export const allowPaymentsCredentials = {
  apiUrl: "https://api.allowpay.online/functions/v1", // URL correta da AllowPay
  secretKey: process.env.ALLOWPAY_SECRET_KEY || "", // Secret Key da AllowPay
  companyId: process.env.ALLOWPAY_COMPANY_ID || "", // Company ID da AllowPay
  webhookSecret: process.env.ALLOWPAY_WEBHOOK_SECRET || "", // Chave secreta para validar webhooks
};
