import "./globals.css";
import "@repo/ui/styles.css";
import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Remove default font
import { Press_Start_2P } from "next/font/google"; // Import pixel font
import Link from "next/link"; // Import Link

// const inter = Inter({ subsets: ["latin"] });
const pressStart2P = Press_Start_2P({
  weight: "400", // Press Start 2P only has one weight
  subsets: ["latin"],
  display: "swap", // Use swap for better performance
});

export const metadata: Metadata = {
  title: "Ringable - Anonymous Voting",
  description: "Anonymous voting platform using ring signatures",
};

// Optional: Client component to handle initialization
// import { ClientInitializer } from "./client-initializer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      {/* <ClientInitializer /> Uncomment if using initializer component */}
      <body className={`${pressStart2P.className} bg-pixel-bg text-pixel-text`}> {/* Use themed colors */}
        <div className="container mx-auto p-4 border-3 border-pixel-border bg-pixel-container-bg shadow-pixel max-w-3xl mt-4 mb-4"> {/* Adjusted container */}
          <header className="mb-6 pb-3 border-b-3 border-pixel-border flex justify-between items-center">
            <Link href="/" className="text-2xl font-normal hover:text-pixel-accent transition-colors">RINGABLE</Link>
            <nav>
              <Link href="/settings" className="text-sm hover:text-pixel-accent hover:underline">Settings</Link>
              {/* Add other links here later (e.g., Rings, New Proposal) */} 
            </nav>
          </header>
          <main className="min-h-[60vh]">{children}</main> {/* Added min-height */}
          <footer className="mt-6 pt-3 border-t-3 border-pixel-border text-center text-xs">
            <p>&copy; {new Date().getFullYear()} Ringable. Anonymous votes FTW!</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
