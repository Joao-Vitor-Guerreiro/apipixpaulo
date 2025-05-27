export interface CreatePixBody {
  credentials: {
    token: string;
    name: string;
  };
  amount: number;
  product: {
    title: string;
  };
  customer: {
    phone: string;
    name: string;
    email: string;
    document: {
      type: "CPF" | "CNPJ";
      number: string;
    };
  };
}
