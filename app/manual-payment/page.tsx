"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePayment } from "@/hooks/usePayment";
import Link from "next/link";

export default function ManualPayment() {
  const [userId, setUserId] = useState<string | null>(null);
  const [amountBrl, setAmountBrl] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { processing, makePixPaymentManual } = usePayment();

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    if (Number(amountBrl)) {
      if (Number(amountBrl) > 20) {
        setError("Amount must be less than 20 BRL");
      } elif (Number(amountBrl) < 0) {
        setError("Amount must be more than 0 BRL");
      } else {
        setError(null);
      }
    }
  }, [amountBrl]);

  const handlePasteAmount = () => {
    navigator.clipboard.readText().then((clipText) => setAmountBrl(clipText));
  };

  const handlePastePixKey = () => {
    navigator.clipboard.readText().then((clipText) => setPixKey(clipText));
  };

  const handleSubmit = async () => {
    if (!userId || !amountBrl || !pixKey) return;

    try {
      await makePixPaymentManual(userId, pixKey, Number(amountBrl));
      router.push("/success");
    } catch (error) {
      setError("Failed to make payment. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Manual Payment</h2>
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Amount (BRL)"
            value={amountBrl}
            max={20}
            min={0}
            onChange={(e) => setAmountBrl(e.target.value)}
          />
          <Button onClick={handlePasteAmount}>Paste</Button>
        </div>
        <div className="flex space-x-2">
          <Input
            placeholder="PIX Key"
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
          />
          <Button onClick={handlePastePixKey}>Paste</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handleSubmit}
            disabled={
              processing ||
              !pixKey ||
              Number(amountBrl) < 0 ||
              Number(amountBrl) > 20
            }
          >
            {processing ? "Processing..." : `Pay ${Number(amountBrl)} BRL`}
          </Button>
          <Link href="/">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
