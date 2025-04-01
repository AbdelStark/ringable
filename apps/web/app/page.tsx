"use client"; // Required for using hooks like useState or zustand stores

import { Button, Card } from "@repo/ui"; // Import our UI components
import { useUserStore } from "../stores/useUserStore"; // Import user store
import Link from "next/link"; // Import Link

export default function HomePage(): JSX.Element {
  const { keyPair, generateAndSetKeyPair, isLoadingKeyPair } = useUserStore();

  return (
    <div className="space-y-6"> {/* Add spacing */}
      <div className="flex justify-between items-start"> {/* Align items */} 
        <h1 className="text-2xl font-bold uppercase tracking-wider">Proposals</h1>
        <Link href="/proposals/new">
          <Button>+ New Proposal</Button>
        </Link>
      </div>

      {/* Placeholder for proposal list */}
      <Card className="min-h-[200px]">
        <p className="text-sm text-gray-500 italic text-center pt-8">
          Proposals will be listed here...
        </p>
      </Card>

      {/* Moved keypair info to settings, can remove or keep for debug */}
      {/* <Card title="Your Identity (Debug)" className="mb-4 w-full max-w-md">
        ...
      </Card> */}

    </div>
  );
}
