"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function TopUpIntent() {
  const [amountSats, setAmountSats] = useState("10000");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleTopUp = async () => {
    if (!amountSats) return;
    try {
      router.push(`/top-up/payment?amountSats=${amountSats}`);
    } catch (error) {
      setError("Failed to get quote. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Top Up</h2>
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      <Input
        type="number"
        placeholder="Amount (Sats)"
        value={amountSats}
        onChange={(e) => setAmountSats(e.target.value)}
      />
      <div className="flex flex-wrap gap-4">
        <Button onClick={handleTopUp}>
          {`Top Up ${Number(amountSats)} Sats`}
        </Button>
        <Link href="/">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
    </div>
  );
}
