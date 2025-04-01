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

// Replace with your actual deployed domain
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://YOUR_DOMAIN.com';
const defaultTitle = "Ringable - Anonymous Voting";
const defaultDescription = "A client-side anonymous voting platform using ring signatures.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: defaultTitle,
    template: `%s | Ringable`, // Template for page titles
  },
  description: defaultDescription,
  // Basic Open Graph and Twitter Card metadata
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: BASE_URL,
    siteName: 'Ringable',
    // Add a logo URL later if available
    // images: [
    //   {
    //     url: `${BASE_URL}/og-image.png`, // Must be absolute URL
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    // images: [`${BASE_URL}/og-image.png`], // Must be absolute URL
    // Optional: Add Twitter handle
    // creator: '@yourhandle',
  },
  // Icons (favicon, etc.)
  icons: {
    icon: '/favicon.ico', // Place favicon in public/
    // apple: '/apple-touch-icon.png', // Add other icons if needed
  },
  // Robots and Sitemap are handled by separate files/routes
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
      <body className={`${pressStart2P.className} bg-pixel-bg text-pixel-text text-sm`}> {/* Default text size */}
        <div className="container mx-auto p-3 md:p-4 border-4 border-pixel-border bg-pixel-container-bg shadow-pixel-lg max-w-3xl mt-4 mb-4"> {/* Thicker border, slightly less padding */}
          <header className="mb-4 pb-2 border-b-4 border-pixel-border flex justify-between items-center">
            <Link href="/" className="text-xl md:text-2xl font-normal hover:text-pixel-accent transition-colors">RINGABLE</Link>
            <nav className="flex gap-3 md:gap-4 items-center">
              <Link href="/rings" className="text-xs md:text-sm hover:text-pixel-accent hover:underline">Rings</Link>
              <Link href="/proposals/new" className="text-xs md:text-sm hover:text-pixel-accent hover:underline">New Proposal</Link>
              <Link href="/settings" className="text-xs md:text-sm hover:text-pixel-accent hover:underline">Settings</Link>
            </nav>
          </header>
          <main className="min-h-[60vh] py-2">{children}</main> {/* Added padding */}
          <footer className="mt-4 pt-2 border-t-4 border-pixel-border text-center text-xs">
            <p>&copy; {new Date().getFullYear()} Ringable</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
