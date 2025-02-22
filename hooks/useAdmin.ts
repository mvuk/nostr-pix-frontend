"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export function useAdmin() {
  const [adminBalanceBrl, setAdminBalanceBrl] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    fetchAdminBalance();
  }, []);

  const fetchAdminBalance = async () => {
    setLoadingBalance(true);
    try {
      const { balance_brl } = await api.getAdminBalance();
      setAdminBalanceBrl(balance_brl);
    } catch (error) {
      console.error("Failed to fetch Brl balance:", error);
    } finally {
      setLoadingBalance(false);
    }
  };

  const getAdminDepositQr = async (amount: number) => {
    try {
      const { deposit_qr_code, adjusted_amount_brl } =
        await api.getAdminDepositQr(amount);
      return { deposit_qr_code, adjusted_amount_brl };
    } catch (error) {
      console.error("Failed to generate admin deposit QR:", error);
      throw error;
    }
  };

  return {
    adminBalanceBrl,
    loadingBalance,
    getAdminDepositQr,
  };
}
