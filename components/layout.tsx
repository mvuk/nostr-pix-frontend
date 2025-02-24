import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/useAdmin";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Layout({ children }: { children: ReactNode }) {
  const {
    adminBalanceBrl,
    loadingAdminBalance,
    getAdminDepositQr,
    refreshAdminBalance,
  } = useAdmin();

  const handleAdminDeposit = async () => {
    const amount = prompt("Enter deposit amount in BRL:");
    if (amount) {
      try {
        const { deposit_qr_code, adjusted_amount_brl } =
          await getAdminDepositQr(Number(amount));
        prompt(
          `Admin deposit QR generated for ${adjusted_amount_brl} BRL`,
          deposit_qr_code
        );
      } catch (error) {
        alert("Failed to generate admin deposit QR");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <Link href="/">
          <h1 className="text-2xl font-bold">NostrPIX</h1>
        </Link>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <p className="text-red-500">
          Warning: NostrPIX is an alpha project built in under 36 hours at a
          hackathon. <br />
          <br />
          Due to high demand, our fiat float is regularly running out,
          preventing PIX payments even when our users have enough sats.
          <br />
          <br />
          Some users have also reported failed top-ups, which we are
          investigating.
          <br />
          <br />
          In the meantime, please be cautious and only top up what you need for
          low-value test purchases. <br />
          <br />
          For support, contact @gringokiwi on Telegram, Discord, or X,
          @gringokiwi.21 on Signal, @Octavio_Lucca on Telegram/X
          <br />
          <br />
        </p>
        {children}
      </main>
      <footer className="bg-secondary text-secondary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <p>
              BRL Available:{" "}
              {loadingAdminBalance ? "Refreshing..." : Number(adminBalanceBrl)}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={refreshAdminBalance}
              disabled={loadingAdminBalance}
            >
              <RefreshCw
                className={cn("h-4 w-4", loadingAdminBalance && "animate-spin")}
              />
            </Button>
          </div>
          <Button variant="outline" onClick={handleAdminDeposit}>
            Deposit (Admin)
          </Button>
        </div>
      </footer>
    </div>
  );
}
