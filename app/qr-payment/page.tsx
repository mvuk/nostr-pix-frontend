"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePayment } from "@/hooks/usePayment";
import { QRReader } from "@/components/qr-reader";
import Link from "next/link";

export default function QRPayment() {
  const [userId, setUserId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">QR Payment</h2>
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      <div className="space-y-4">
        {scanning ? (
          <>
            <QRReader
              onResult={(result) => {
                setQrCode(result);
                setScanning(false);
              }}
              onError={(err) => setError(err)}
            />
            <Button variant="outline" onClick={() => setScanning(false)}>
              Cancel Scan
            </Button>
          </>
        ) : (
          <>
            <div className="flex space-x-2">
              <Input
                placeholder="PIX QR Code"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
              />
              <Button variant="outline" onClick={() => setScanning(true)}>
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
          </>
        )}
      </div>
    </div>
  );
}
