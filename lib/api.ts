const API_BASE_URL = "https://nostrpix-api-production.up.railway.app";

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return response.json();
}

export interface User {
  id: string;
  public_key?: string;
  balance_sats: number; // integer
  created_at: string;
}

export interface UserPixPayment {
  id: string;
  amount_brl: number; // decimal, 2 places
  amount_sats: number; // integer
  payee_name: string;
  description?: string;
  pix_key?: string;
  pix_qr_code?: string;
  sqala_id: string;
  user_id: string; // foreign key to user.id
  paid: boolean;
  created_at: string;
}

export interface UserLightningDeposit {
  id: string;
  amount_sats: number; // integer
  lnurl: string;
  description?: string;
  strike_id: string;
  user_id: string; // foreign key to user.id
  paid: boolean;
  created_at: string;
}

export interface UserDetails {
  user: User;
  pix_payments: UserPixPayment[];
  lightning_deposits: UserLightningDeposit[];
}

export const api = {
  getAdminBalance: () =>
    fetchApi("/admin/balance") as Promise<{
      balance_brl: number;
    }>,
  getAdminDepositQr: (amountBrl: number) =>
    fetchApi(`/admin/deposit?amount_brl=${amountBrl}`) as Promise<{
      adjusted_amount_brl: number;
      deposit_qr_code: string;
    }>,
  getQuote: (amountBrl: number) =>
    fetchApi(`/quote?amount_brl=${amountBrl}`) as Promise<{
      amount_brl: number;
      amount_sats: number;
    }>,
  generateNewUser: () => fetchApi("/user/new") as Promise<User>,
  getUserDetails: (userId: string) =>
    fetchApi(`/user/${userId}/details`) as Promise<UserDetails>,
  refreshUserDetails: (userId: string) =>
    fetchApi(`/user/${userId}/details/refresh`) as Promise<{
      user: User;
      pix_payments: UserPixPayment[];
      lightning_deposits: UserLightningDeposit[];
    }>,
  generateLightningDeposit: (userId: string, amountSats: number) =>
    fetchApi(
      `/user/${userId}/deposit/new?amount_sats=${amountSats}`
    ) as Promise<UserLightningDeposit>,
  getLightningDepositStatus: (userId: string, lnurl: string) =>
    fetchApi(
      `/user/${userId}/deposit/${lnurl}`
    ) as Promise<UserLightningDeposit>,
  makePixPaymentQR: (userId: string, qrCode: string) =>
    fetchApi(
      `/user/${userId}/pay?qr_code=${encodeURIComponent(qrCode)}`
    ) as Promise<UserPixPayment>,
  makePixPaymentManual: (userId: string, pixKey: string, amountBrl: number) =>
    fetchApi(
      `/user/${userId}/pay?pix_key=${encodeURIComponent(
        pixKey
      )}&amount_brl=${amountBrl}`
    ) as Promise<UserPixPayment>,
};
