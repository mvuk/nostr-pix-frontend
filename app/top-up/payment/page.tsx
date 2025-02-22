"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

function TopUpPaymentContent() {
  const [userId, setUserId] = useState<string | null>(null);
  const [invoice, setInvoice] = useState("");
  const [loadingInvoice, setLoadingInvoice] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const amountSats = searchParams.get("amountSats");
  const [copyInvoiceText, setCopyInvoiceText] = useState("Copy Invoice");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [nextCheckIn, setNextCheckIn] = useState(15);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    if (amountSats && userId) {
      generateInvoice(userId, Number.parseInt(amountSats));
    }
  }, [amountSats, userId]);

  useEffect(() => {
    if (!invoice || !userId) return;

    const checkInterval = setInterval(() => {
      handleCheckPayment();
      setNextCheckIn(15); // Reset countdown after check
    }, 15000);

    // Add countdown timer
    const countdownInterval = setInterval(() => {
      setNextCheckIn((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(checkInterval);
      clearInterval(countdownInterval);
    };
  }, [invoice, userId, router]);

  const generateInvoice = async (userId: string, amountSats: number) => {
    try {
      const { lnurl } = await api.generateLightningDeposit(userId, amountSats);
      setInvoice(lnurl);
    } catch (error) {
      if ((error as any).message) {
        setError((error as any).message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoadingInvoice(false);
    }
  };

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(invoice);
    setCopyInvoiceText("Copied!");
    setTimeout(() => setCopyInvoiceText("Copy Invoice"), 2000);
  };

  const handleOpenWallet = () => {
    window.open(`lightning:${invoice}`, "_blank");
  };

  const handleCheckPayment = async () => {
    setChecking(true);
    try {
      const { paid, amount_sats } = await api.getLightningDepositStatus(
        userId!,
        invoice
      );
      if (paid) {
        router.push(`/success?type=lightning&amountSats=${amount_sats}`);
      }
    } catch (error) {
      if ((error as any).message) {
        setError((error as any).message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setChecking(false);
    }
  };

  if (loadingInvoice) {
    return <div>Loading invoice...</div>;
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Top Up Sats</h2>
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      <div className="aspect-square w-full bg-white p-4 flex items-center justify-center rounded-lg shadow-inner">
        {invoice && (
          <QRCodeSVG
            value={invoice}
            size={300}
            level="H"
            className="w-full h-full"
          />
        )}
      </div>
      <div className="bg-muted/50 p-3 rounded-lg">
        <Input
          readOnly
          value={invoice}
          className="font-mono text-sm"
          onClick={handleCopyInvoice}
        />
      </div>
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          className="flex-1 active:scale-95"
          onClick={handleCopyInvoice}
        >
          {copyInvoiceText}
        </Button>
        <Button
          variant="outline"
          className="flex-1 active:scale-95"
          onClick={handleOpenWallet}
        >
          Open in Wallet
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={handleCheckPayment}
          disabled={checking}
        >
          {checking ? "Checking Payment..." : "Check Payment Now"}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          Checking in {nextCheckIn + 1} seconds...
        </p>
      </div>
    </div>
  );
}

export default function TopUpPayment() {
  return (
    <Suspense fallback={<div>Loading invoice...</div>}>
      <TopUpPaymentContent />
    </Suspense>
  );
}
