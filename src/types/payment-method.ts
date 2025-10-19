export interface BankTypes {
  id: number;
  name: string;
  code: string;
  account_name: string;
  account_number: string;
  logo: string;
}

export interface EwalletTypes {
  id: number;
  name: string;
  // code: string;
  account_username: string;
  phone: string;
  logo: string;
}

export interface PaymentGatewayTypes {
  provider: string;
  client_key: string;
  fee: number; // flat fee in currency unit
}
