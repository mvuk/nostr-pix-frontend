"use client";

import { Button } from "@/components/ui/button";
import Layout from "@/components/layout";
import Link from "next/link";

export default function Success() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Success!</h2>
          <Link href="/">
            <Button>Back</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
