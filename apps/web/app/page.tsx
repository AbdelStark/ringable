"use client"; // Required for using hooks like useState or zustand stores

import * as React from "react"; // Ensure React is imported
import { Button, Card } from "@repo/ui"; // Import our UI components
import { useProposalsStore } from "../stores/useProposalsStore"; // Import proposal store
import Link from "next/link"; // Import Link

export default function HomePage(): React.ReactNode {
  const { proposals } = useProposalsStore();

  return (
    <div className="space-y-6">
      {" "}
      {/* Add spacing */}
      <div className="flex justify-between items-start">
        {" "}
        {/* Align items */}
        <h1 className="text-2xl font-bold uppercase tracking-wider">
          Proposals
        </h1>
        <Link href="/proposals/new">
          <Button>+ New Proposal</Button>
        </Link>
      </div>
      {proposals.length === 0 ? (
        <Card className="min-h-[100px] flex items-center justify-center">
          <p className="text-sm text-gray-500 italic">
            No proposals created yet.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <Link
              key={proposal.id}
              href={`/proposals/${proposal.id}`}
              className="block hover:no-underline"
            >
              <Card className="hover:border-pixel-accent transition-colors duration-150 ease-in-out">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-normal uppercase tracking-wider break-all mr-4">
                    {proposal.title}
                  </h3>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 border-2 ${
                      proposal.status === "open"
                        ? "border-green-500 text-green-600 bg-green-100"
                        : "border-pixel-disabled text-pixel-disabled bg-gray-200"
                    }`}
                  >
                    {proposal.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Options: {proposal.options.length} | Votes:{" "}
                  {proposal.votes.length}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
      {/* Moved keypair info to settings, can remove or keep for debug */}
      {/* <Card title="Your Identity (Debug)" className="mb-4 w-full max-w-md">
        ...
      </Card> */}
    </div>
  );
}
