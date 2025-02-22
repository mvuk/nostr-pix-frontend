"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout";
import { api } from "@/lib/api";

export default function TopUpPayment() {
  const [userId, setUserId] = useState<string | null>(null);
  const [invoice, setInvoice] = useState("");
  const [loadingInvoice, setLoadingInvoice] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const amountSats = searchParams.get("amountSats");
  const [copyInvoiceText, setCopyInvoiceText] = useState("Copy Invoice");

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    if (amountSats && userId) {
      generateInvoice(userId, Number.parseInt(amountSats));
    }
  }, [amountSats, userId]);

  const generateInvoice = async (userId: string, amountSats: number) => {
    try {
      const result = await api.generateLightningDeposit(userId, amountSats);
      setInvoice(result.lnurl);
    } catch (error) {
      console.error("Failed to generate invoice:", error);
      alert("Failed to generate invoice. Please try again.");
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
    if (!userId) return;

    try {
      const result = await api.getLightningDepositStatus(userId, invoice);
      if (result.paid) {
        router.push("/success");
      } else {
        alert("Payment not received yet. Please try again.");
      }
    } catch (error) {
      console.error("Failed to check payment:", error);
      alert("Failed to check payment. Please try again.");
    }
  };

  if (loadingInvoice) {
    return (
      <Layout>
        <div>Loading invoice...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Top Up Sats</h2>
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
        <Button className="w-full" onClick={handleCheckPayment}>
          Check Payment
        </Button>
      </div>
    </Layout>
  );
}
