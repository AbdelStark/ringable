import "./globals.css";
import "@repo/ui/styles.css";
import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Remove default font
import { Press_Start_2P } from "next/font/google"; // Import pixel font

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
      <body className={`${pressStart2P.className} bg-blue-100 text-gray-900`}> {/* Apply pixel font, change background */}
        <div className="container mx-auto p-4 border-4 border-black bg-blue-50 shadow-lg pixel-shadow"> {/* Retro container */}
          <header className="mb-8 pb-4 border-b-4 border-black">
            <h1 className="text-3xl text-center font-bold">RINGABLE</h1>
          </header>
          <main>{children}</main>
          <footer className="mt-8 pt-4 border-t-4 border-black text-center text-xs">
            <p>&copy; {new Date().getFullYear()} Ringable. Anonymous votes FTW!</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
