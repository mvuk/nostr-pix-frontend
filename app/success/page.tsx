"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function Success() {
  const searchParams = useSearchParams();
  const amountBrl = searchParams.get("amountBrl");
  const amountSats = searchParams.get("amountSats");
  const type = searchParams.get("type");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h2 className="text-2xl font-bold">Payment Successful!</h2>
            {type === "pix" && amountBrl && (
              <p className="text-muted-foreground">
                PIX payment of {Number(amountBrl)} BRL has been sent
              </p>
            )}
            {type === "lightning" && amountSats && (
              <p className="text-muted-foreground">
                {Number(amountSats)} sats have been deposited to your account
              </p>
            )}
          </div>
          <Link href="/" className="block">
            <Button className="w-full">Return to Home</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
