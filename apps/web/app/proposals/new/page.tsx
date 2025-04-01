"use client";

import * as React from "react";
import { Button, Card, Input } from "@repo/ui";
import { useRingStore } from "../../../stores/useRingStore";
import { useProposalsStore } from "../../../stores/useProposalsStore";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // To redirect after creation

export default function NewProposalPage() {
  const { rings } = useRingStore();
  const { createProposal } = useProposalsStore();
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [options, setOptions] = React.useState<string[]>(["", ""]); // Start with two empty options
  const [selectedRingId, setSelectedRingId] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      alert("A proposal must have at least two options.");
      return;
    }
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const trimmedTitle = title.trim();
    const validOptions = options.map(opt => opt.trim()).filter(opt => opt !== "");

    if (!trimmedTitle) {
      alert("Please enter a title for the proposal.");
      setIsSubmitting(false);
      return;
    }
    if (validOptions.length < 2) {
      alert("Please provide at least two valid options.");
      setIsSubmitting(false);
      return;
    }
    if (!selectedRingId) {
      alert("Please select a ring of eligible voters.");
      setIsSubmitting(false);
      return;
    }

    try {
      const newProposal = createProposal(trimmedTitle, validOptions, selectedRingId);
      console.log("Proposal created:", newProposal);
      alert("Proposal created successfully!");
      // Redirect to home page or proposal page after creation
      router.push('/'); // Redirect to home for now
    } catch (error) {
      console.error("Failed to create proposal:", error);
      alert("Failed to create proposal. See console for details.");
      setIsSubmitting(false);
    }
    // No need to set isSubmitting false here due to redirect
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold uppercase tracking-wider">Create New Proposal</h2>
        <Link href="/" className="text-sm text-pixel-accent hover:underline">
          &lt;- Back to Home
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="space-y-4">
          {/* Title Input */}
          <Input
            label="Proposal Title / Question"
            value={title}
            onChange={(e) => { setTitle(e.target.value); }}
            required
            maxLength={150}
            placeholder="E.g., What feature should we build next?"
          />

          {/* Options Input */}
          <div>
            <label className="block text-xs font-normal text-pixel-text mb-1 uppercase tracking-wider">Voting Options (at least 2)</label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => { handleOptionChange(index, e.target.value); }}
                    required
                    className="flex-grow"
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => { removeOption(index); }}
                      className="text-red-500 hover:text-red-700 text-xs px-1 py-0 leading-none shrink-0"
                      aria-label={`Remove Option ${index + 1}`}
                    >
                      X
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={addOption}
              className="text-xs mt-2"
            >
              + Add Option
            </Button>
          </div>

          {/* Ring Selection */}
          <div>
            <label htmlFor="ring-select" className="block text-xs font-normal text-pixel-text mb-1 uppercase tracking-wider">Select Voting Ring</label>
            {rings.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No rings available. <Link href="/rings" className="underline text-pixel-accent">Create a ring first</Link>.</p>
            ) : (
              <select
                id="ring-select"
                value={selectedRingId}
                onChange={(e) => { setSelectedRingId(e.target.value); }}
                required
                className="block w-full px-2 py-1 border-3 border-pixel-border bg-white text-pixel-text text-sm focus:ring-pixel-accent focus:border-pixel-accent focus:outline-none"
              >
                <option value="" disabled>-- Select a Ring --</option>
                {rings.map((ring) => (
                  <option key={ring.id} value={ring.id}>
                    {ring.name} ({ring.memberPublicKeys.length} members)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t-3 border-pixel-border">
            <Button type="submit" disabled={isSubmitting || rings.length === 0}>
              {isSubmitting ? "Creating..." : "Create Proposal"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
} 