import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/useAdmin";

export default function Layout({ children }: { children: ReactNode }) {
  const { adminBalanceBrl, loadingBalance, getAdminDepositQr } = useAdmin();

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
        <h1 className="text-2xl font-bold">NostrPIX</h1>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-secondary text-secondary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <p>
            BRL Available:{" "}
            {loadingBalance ? "Refreshing..." : Number(adminBalanceBrl)}
          </p>
          <Button variant="outline" onClick={handleAdminDeposit}>
            Deposit (Admin)
          </Button>
        </div>
      </footer>
    </div>
  );
}
