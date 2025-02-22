"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export function useAdmin() {
  const [adminBalanceBrl, setAdminBalanceBrl] = useState<number | null>(null);
  const [loadingAdminBalance, setLoadingAdminBalance] = useState(false);

  useEffect(() => {
    fetchAdminBalance();
  }, []);

  const fetchAdminBalance = async () => {
    setLoadingAdminBalance(true);
    try {
      const { balance_brl } = await api.getAdminBalance();
      setAdminBalanceBrl(balance_brl);
    } catch (error) {
      console.error("Failed to fetch BRL balance:", error);
    } finally {
      setLoadingAdminBalance(false);
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
    loadingAdminBalance,
    getAdminDepositQr,
    refreshAdminBalance: fetchAdminBalance,
  };
}
