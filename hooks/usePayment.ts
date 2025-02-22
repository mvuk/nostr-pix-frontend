"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export function usePayment() {
  const [processing, setProcessing] = useState(false);

  const makePixPaymentQR = async (userId: string, qrCode: string) => {
    setProcessing(true);
    try {
      return await api.makePixPaymentQR(userId, qrCode);
    } finally {
      setProcessing(false);
    }
  };

  const makePixPaymentManual = async (
    userId: string,
    pixKey: string,
    amountBrl: number
  ) => {
    setProcessing(true);
    try {
      return await api.makePixPaymentManual(userId, pixKey, amountBrl);
    } finally {
      setProcessing(false);
    }
  };

  return { processing, makePixPaymentQR, makePixPaymentManual };
}
