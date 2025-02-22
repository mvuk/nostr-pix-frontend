"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";

export default function Home() {
  const {
    userId,
    userDetails,
    loadingUserDetails,
    createUser,
    refreshUserDetails,
    logout,
  } = useUser();
  const [error, setError] = useState<string | null>(null);

  const handleCreateUser = async () => {
    try {
      await createUser();
    } catch (error) {
      setError("Failed to create user. Please try again.");
    }
  };

  const handleRefreshUserDetails = async () => {
    try {
      await refreshUserDetails();
    } catch (error) {
      setError("Failed to refresh user details. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      {!userId ? (
        <Button onClick={handleCreateUser}>Create Account</Button>
      ) : (
        <>
          <p className="text-lg">
            Available Balance:{" "}
            {loadingUserDetails
              ? "Refreshing..."
              : `${Number(userDetails?.user.balance_sats)} sats`}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button>
              <Link href="/top-up">Top Up Sats</Link>
            </Button>
            <Button
              onClick={handleRefreshUserDetails}
              disabled={loadingUserDetails}
            >
              {loadingUserDetails ? "Refreshing..." : "Refresh Balance"}
            </Button>
            <Button>
              <Link href="/qr-payment">Pay PIX (QR)</Link>
            </Button>
            <Button>
              <Link href="/manual-payment">Pay PIX (Manual)</Link>
            </Button>
            <Button disabled={true}>
              <Link href="/connect-nwc">Connect NWC</Link>
            </Button>
            <Button onClick={logout} variant="outline">
              Clear Session
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
