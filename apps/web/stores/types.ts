import { type KeyPair as CryptoKeyPair } from "@repo/crypto";

// Re-exporting KeyPair from crypto if needed, or defining a specific UI/Store version
export type KeyPair = CryptoKeyPair;

export interface Ring {
  id: string; // Unique ID for the ring (e.g., UUID)
  name: string;
  memberPublicKeys: string[]; // Array of hex-encoded public keys
}

export interface ProposalOption {
  id: string; // Unique ID for the option within the proposal
  text: string;
}

export interface VoteRecord {
  proposalId: string;
  optionId: string;
  signature: string; // The bLSAG signature hex string
  // The key image can be derived from the signature if needed, or stored explicitly
  // keyImage?: string;
}

export interface Proposal {
  id: string; // Unique ID for the proposal
  title: string;
  options: ProposalOption[];
  ringId: string; // ID of the ring whose members can vote
  status: "open" | "closed";
  votes: VoteRecord[]; // Store individual vote records
}
