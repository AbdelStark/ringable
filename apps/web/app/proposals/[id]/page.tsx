"use client";

import * as React from "react";
import { Button, Card } from "@repo/ui";
import { useProposalsStore } from "../../../stores/useProposalsStore";
import { useRingStore } from "../../../stores/useRingStore";
import { useUserStore } from "../../../stores/useUserStore";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type VoteRecord } from "../../../stores/types";

// Note: Stores are client-side. For server-side metadata generation,
// you'd typically fetch proposal data from an API or DB.
// Since this app is client-only, we CANNOT dynamically generate
// metadata on the server based on the specific proposal ID using stores.
// The metadata generation would need a different data source or be static.

// Placeholder for dynamic metadata if data source existed
// export async function generateMetadata(
//   { params }: { params: { id: string } },
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const proposalId = params.id;
//   // Fetch proposal data based on ID here (e.g., from API)
//   // const proposal = await fetchProposalById(proposalId);
//   const proposal = { title: `Proposal ${proposalId}`, description: `Vote on proposal ${proposalId}` }; // Placeholder
//
//   // optionally access and extend (rather than replace) parent metadata
//   // const previousImages = (await parent).openGraph?.images || []
//
//   return {
//     title: proposal.title,
//     description: proposal.description,
//     openGraph: {
//       title: proposal.title,
//       description: proposal.description,
//       // images: ['/some-specific-page-image.jpg', ...previousImages],
//     },
//   }
// }

export default function ProposalDetailsPage() {
  const params = useParams();
  const proposalId = params.id as string;

  const { getProposalById, addVote, getResults, closeProposal } =
    useProposalsStore();
  const { getRingById } = useRingStore();
  const { keyPair } = useUserStore();

  const proposal = getProposalById(proposalId);
  const ring = getRingById(proposal?.ringId ?? "");

  const [voteCounts, setVoteCounts] = React.useState<Record<string, number>>(
    {},
  );
  const [eligibility, setEligibility] = React.useState<{
    eligible: boolean;
    reason: string;
  }>({ eligible: false, reason: "Checking eligibility..." });
  const [isVoting, setIsVoting] = React.useState(false);
  const [isLoadingResults, setIsLoadingResults] = React.useState(false);

  // Effect to check eligibility and find user's vote
  React.useEffect(() => {
    if (!proposal || !ring || !keyPair) {
      setEligibility({
        eligible: false,
        reason: !keyPair
          ? "Generate a keypair first."
          : !proposal
          ? "Proposal not found."
          : "Voting ring not found.",
      });
      return;
    }

    if (!ring.memberPublicKeys.includes(keyPair.publicKeyHex)) {
      setEligibility({
        eligible: false,
        reason: "Your key is not in the voting ring for this proposal.",
      });
      return;
    }

    // Check if user already voted (using mock key image check)
    // This check needs refinement when using real crypto
    const checkVote = async () => {
      const foundVote: VoteRecord | null = null;
      // Our mock `keyImagesMatch` only matches identical signatures.
      // In a real scenario, we need a more robust way or store the key image.
      // For mock: we just find the first vote cast if any (assuming only one key per user)
      if (proposal.votes.length > 0) {
        // Simplified mock check: Assume *any* vote means this user voted.
        // This isn't correct but suffices for UI mock.
        // foundVote = proposal.votes[0];
        // A slightly better mock: Check if any vote signature contains user pubkey start? No, bad idea.
        // Let's assume no prior vote for mock purposes until crypto is real.
        console.warn(
          "MOCK: Cannot reliably check for prior vote. Assuming not voted.",
        );
      }

      if (foundVote) {
        setEligibility({
          eligible: false,
          reason: "You have already voted on this proposal.",
        });
      } else if (proposal.status === "closed") {
        setEligibility({
          eligible: false,
          reason: "Voting for this proposal is closed.",
        });
      } else {
        setEligibility({ eligible: true, reason: "You are eligible to vote." });
      }
    };
    void checkVote();
  }, [proposal, ring, keyPair]); // proposal.votes removed as dep for mock

  // Effect to fetch results
  React.useEffect(() => {
    if (proposal) {
      setIsLoadingResults(true);
      getResults(proposal.id)
        .then(setVoteCounts)
        .catch((err) => console.error("Failed to get results:", err))
        .finally(() => {
          setIsLoadingResults(false);
        });
    }
  }, [proposal, getResults]); // Re-fetch if proposal votes change (e.g., after voting)

  const handleVote = async (optionId: string) => {
    if (!proposal || !keyPair || !eligibility.eligible || isVoting) return;
    setIsVoting(true);

    // Construct message to sign (CONSISTENCY IS KEY!)
    const message = new TextEncoder().encode(proposal.id + optionId);

    try {
      const result = await addVote(proposal.id, optionId, message);
      if (result.success) {
        alert("Vote cast successfully!");
        setEligibility({
          eligible: false,
          reason: "Vote successfully recorded.",
        });
        // Re-fetch results after voting
        setIsLoadingResults(true);
        getResults(proposal.id)
          .then(setVoteCounts)
          .catch((err) => console.error("Failed to get results:", err))
          .finally(() => {
            setIsLoadingResults(false);
          });
      } else {
        alert(`Failed to cast vote: ${result.reason ?? "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error casting vote:", error);
      alert("An unexpected error occurred while casting your vote.");
    } finally {
      setIsVoting(false);
    }
  };

  const handleCloseProposal = () => {
    if (!proposal) return;
    if (
      window.confirm(
        "Are you sure you want to close voting for this proposal? This cannot be undone.",
      )
    ) {
      closeProposal(proposal.id);
      // State should update automatically via zustand subscription
    }
  };

  if (!proposal) {
    return <div>Loading proposal... or proposal not found.</div>;
  }

  const totalVotes = Object.values(voteCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-xl font-bold uppercase tracking-wider break-all mr-4">
          {proposal.title}
        </h2>
        <Link
          href="/"
          className="text-sm text-pixel-accent hover:underline shrink-0"
        >
          &lt;- Back to Home
        </Link>
      </div>
      <p
        className={`text-xs font-bold px-2 py-0.5 border-2 inline-block ${
          proposal.status === "open"
            ? "border-green-500 text-green-600 bg-green-100"
            : "border-pixel-disabled text-pixel-disabled bg-gray-200"
        }`}
      >
        Status: {proposal.status.toUpperCase()}
      </p>

      {/* Voting Section */}
      <Card title="Cast Your Vote">
        {!eligibility.eligible ? (
          <p className="text-sm text-gray-500 italic">{eligibility.reason}</p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm">Select one option:</p>
            {proposal.options.map((option) => (
              <Button
                key={option.id}
                onClick={() => {
                  void handleVote(option.id);
                }}
                disabled={isVoting}
                className="w-full justify-start text-left"
              >
                {isVoting ? "Processing..." : option.text}
              </Button>
            ))}
          </div>
        )}
      </Card>

      {/* Results Section */}
      <Card title="Results">
        {isLoadingResults ? (
          <p className="text-sm text-gray-500 italic">Loading results...</p>
        ) : totalVotes === 0 ? (
          <p className="text-sm text-gray-500 italic">No votes cast yet.</p>
        ) : (
          <div className="space-y-3">
            {proposal.options.map((option) => {
              const count = voteCounts[option.id] ?? 0;
              const percentage =
                totalVotes === 0 ? 0 : (count / totalVotes) * 100;
              return (
                <div key={option.id} className="text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="break-all mr-2">{option.text}</span>
                    <span className="font-bold shrink-0">
                      {count} vote{count !== 1 ? "s" : ""} (
                      {percentage.toFixed(0)}%)
                    </span>
                  </div>
                  {/* Pixel-style Progress Bar */}
                  <div className="w-full bg-white border-4 border-pixel-border h-5 p-0.5">
                    <div
                      className="bg-pixel-accent h-full transition-width duration-300 ease-in-out"
                      style={{ width: `${percentage}%` }}
                      title={`${percentage.toFixed(1)}%`}
                    />
                  </div>
                </div>
              );
            })}
            <p className="text-xs pt-3 border-t-4 border-pixel-border mt-3">
              Total Votes: {totalVotes}
            </p>
          </div>
        )}
      </Card>

      {/* Admin Actions (Example) */}
      {proposal.status === "open" && (
        <Card title="Admin Actions">
          <Button
            variant="secondary"
            className="text-pixel-accent"
            onClick={handleCloseProposal}
          >
            Close Voting
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Closing voting prevents further votes and finalizes results.
          </p>
        </Card>
      )}
    </div>
  );
}
