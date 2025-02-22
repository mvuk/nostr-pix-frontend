"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePayment } from "@/hooks/usePayment";
import Link from "next/link";
import Layout from "@/components/layout";

export default function QRPayment() {
  const [userId, setUserId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { processing, makePixPaymentQR } = usePayment();

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  const handlePaste = () => {
    navigator.clipboard.readText().then((clipText) => setQrCode(clipText));
  };

  const handleSubmit = async () => {
    if (!userId || !qrCode) return;

    try {
      await makePixPaymentQR(userId, qrCode);
      router.push("/success");
    } catch (error) {
      setError("Failed to make payment. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">QR Payment</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="PIX QR Code"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
            />
            <Button variant="outline" disabled>
              <Camera className="w-4 h-4 mr-2" />
              Scan QR
            </Button>
            <Button onClick={handlePaste}>Paste</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleSubmit} disabled={processing || !qrCode}>
              {processing ? "Processing..." : "Pay PIX QR"}
            </Button>
            <Link href="/">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
