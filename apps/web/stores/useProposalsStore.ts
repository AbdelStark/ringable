import { create, StateCreator } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
  wasm_sign_compact_blsag,
  wasm_key_images_match,
  wasm_deserialize_compact_blsag,
  wasm_verify_compact,
} from "@repo/crypto";
import { useUserStore } from "./useUserStore";
import { useRingStore } from "./useRingStore";
import { type Proposal, type ProposalOption, type VoteRecord } from "./types";

interface ProposalsState {
  proposals: Proposal[];
  createProposal: (
    title: string,
    options: string[],
    ringId: string,
  ) => Proposal;
  addVote: (
    proposalId: string,
    optionId: string,
    messageToSign: Uint8Array,
  ) => Promise<{ success: boolean; reason?: string }>;
  getProposalById: (id: string) => Proposal | undefined;
  getVotesForProposal: (proposalId: string) => VoteRecord[];
  getResults: (proposalId: string) => Promise<Record<string, number>>;
  closeProposal: (id: string) => void;
}

type ProposalsPersist = (
  config: StateCreator<ProposalsState>,
  options: PersistOptions<ProposalsState>,
) => StateCreator<ProposalsState>;

export const useProposalsStore = create<ProposalsState>(
  (persist as ProposalsPersist)(
    (set, get) => ({
      proposals: [],

      createProposal: (
        title: string,
        optionTexts: string[],
        ringId: string,
      ) => {
        const options: ProposalOption[] = optionTexts.map((text: string) => ({
          id: uuidv4(),
          text,
        }));
        const newProposal: Proposal = {
          id: uuidv4(),
          title,
          options,
          ringId,
          status: "open",
          votes: [],
        };
        set((state: ProposalsState) => ({
          proposals: [...state.proposals, newProposal],
        }));
        return newProposal;
      },

      addVote: async (
        proposalId: string,
        optionId: string,
        messageToSign: Uint8Array,
      ) => {
        const proposal = get().getProposalById(proposalId);
        const ring = useRingStore
          .getState()
          .getRingById(proposal?.ringId ?? "");
        const userKeyPair = useUserStore.getState().keyPair;

        if (!proposal || proposal.status !== "open") {
          return { success: false, reason: "Proposal not found or not open." };
        }
        if (!ring) {
          return { success: false, reason: "Voting ring not found." };
        }
        if (!userKeyPair || !userKeyPair.privateKeyHex) {
          return { success: false, reason: "User private key not available." };
        }
        if (!ring.memberPublicKeys.includes(userKeyPair.publicKeyHex)) {
          return { success: false, reason: "User not in the voting ring." };
        }

        try {
          const compact_signature_str = wasm_sign_compact_blsag(
            messageToSign,
            userKeyPair.privateKeyHex,
            ring.memberPublicKeys,
          );

          const signature = wasm_deserialize_compact_blsag(
            compact_signature_str,
          );

          const existingVotes = get().getVotesForProposal(proposalId);
          for (const existingVote of existingVotes) {
            const existingVoteCompactSignature = existingVote.signature;
            const existingVoteSignature = wasm_deserialize_compact_blsag(
              existingVoteCompactSignature,
            );
            const match = wasm_key_images_match(
              signature.key_image,
              existingVoteSignature.key_image,
            );
            if (match) {
              return { success: false, reason: "Duplicate vote detected." };
            }
          }

          const newVote: VoteRecord = {
            proposalId,
            optionId,
            signature: compact_signature_str,
          };

          set((state: ProposalsState) => ({
            proposals: state.proposals.map((p: Proposal) =>
              p.id === proposalId ? { ...p, votes: [...p.votes, newVote] } : p,
            ),
          }));
          return { success: true };
        } catch (error) {
          console.error("Failed to sign or add vote:", error);
          return {
            success: false,
            reason: "Failed to create vote signature.",
          };
        }
      },

      getProposalById: (id: string) => {
        return get().proposals.find((proposal: Proposal) => proposal.id === id);
      },

      getVotesForProposal: (proposalId: string) => {
        return get().getProposalById(proposalId)?.votes ?? [];
      },

      getResults: async (proposalId: string) => {
        const proposal = get().getProposalById(proposalId);
        const ring = useRingStore
          .getState()
          .getRingById(proposal?.ringId ?? "");
        if (!proposal || !ring) return {};

        const results: Record<string, number> = {};
        proposal.options.forEach(
          (opt: ProposalOption) => (results[opt.id] = 0),
        );

        const getMessageBytes = (pId: string, oId: string): Uint8Array => {
          return new TextEncoder().encode(pId + oId);
        };

        for (const vote of proposal.votes) {
          const message = getMessageBytes(proposalId, vote.optionId);
          try {
            const isValid = wasm_verify_compact(
              vote.signature,
              message,
              ring.memberPublicKeys,
            );
            if (isValid) {
              results[vote.optionId] = (results[vote.optionId] ?? 0) + 1;
            } else {
              console.warn(
                `Invalid signature found for vote on option ${vote.optionId}`,
              );
            }
          } catch (error) {
            console.error("Error verifying vote signature:", error);
          }
        }
        return results;
      },

      closeProposal: (id: string) => {
        set((state: ProposalsState) => ({
          proposals: state.proposals.map((p: Proposal) =>
            p.id === id ? { ...p, status: "closed" } : p,
          ),
        }));
      },
    }),
    {
      name: "ringable-proposals-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
