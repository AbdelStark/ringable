# 💍 Ringable

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
<!-- Add other badges later if desired, e.g., build status -->

**A client-side anonymous voting platform using Nostr-compatible ring signatures.**

Ringable allows users to create proposals and vote anonymously as part of a predefined group (a "ring" of public keys). It leverages the cryptographic power of **bLSAG ring signatures** to ensure that while votes are verified as coming from a valid member of the ring, the specific voter's identity remains hidden.

Built with a fun, **retro pixel-art aesthetic**, Ringable demonstrates modern cryptography in an engaging, user-friendly way.

**Important Note:** This implementation currently uses **mocked cryptography** functions for UI development and demonstration purposes. The core ring signature logic needs to be integrated by compiling the underlying Rust library ([Nostringer](https://github.com/AbdelStark/nostringer)) to WebAssembly.

## ✨ Key Features

*   **True Anonymity:** Votes are cryptographically signed by a ring member without revealing *which* member signed.
*   **Linkability (Duplicate Prevention):** Uses bLSAG signatures, which generate a unique "key image" per voter per proposal, preventing the same person from voting multiple times anonymously.
*   **Client-Side Only:** No backend server required! All data (keys, rings, proposals, votes) is stored locally in the browser's `localStorage`, managed via Zustand.
*   **Retro Pixel-Art UI:** A unique, game-inspired interface built with React and Tailwind CSS.
*   **Nostr Compatible Keys:** Uses secp256k1 keys, compatible with the Nostr ecosystem.
*   **Monorepo Structure:** Organized using Turborepo for better code sharing and maintainability.

## 🛠️ Tech Stack

*   **Monorepo:** [Turborepo](https://turbo.build/repo)
*   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (with `persist` middleware for `localStorage`)
*   **UI Components:** [React](https://reactjs.org/) (within shared `packages/ui`)
*   **Cryptography:** [Nostringer](https://github.com/AbdelStark/nostringer) (Rust library, intended for WASM compilation - *currently mocked*)
*   **Package Manager:** [pnpm](https://pnpm.io/)
*   **Linting/Formatting:** ESLint, Prettier

## 📂 Project Structure

This project uses a Turborepo monorepo structure:

```plaintext
.
├── apps
│   ├── web/        # Main Next.js web application (Ringable UI)
│   └── docs/       # (Optional) Placeholder for documentation site
├── packages
│   ├── crypto/     # Wrapper for cryptography functions (Nostringer WASM - currently mocked)
│   ├── eslint-config/ # Shared ESLint configuration
│   ├── tailwind-config/ # Shared Tailwind CSS configuration
│   ├── tsconfig/   # Shared TypeScript configuration
│   └── ui/         # Shared React UI components (Button, Card, Input, etc.)
└── package.json    # Root configuration
```

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (Version specified in root `package.json` engines field, e.g., >=18)
*   [pnpm](https://pnpm.io/) (Version specified in root `package.json` packageManager field, e.g., 8.x)
*   **(Future Step)** Rust toolchain and `wasm-pack` for compiling the `nostringer` library if replacing mocks.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/AbdelStark/ringable.git
    cd ringable
    ```
2.  Install dependencies from the root directory:
    ```bash
    pnpm install
    ```

### Running the Development Server

1.  Start the development server (this will run the Next.js app and watch for changes in shared packages):
    ```bash
    pnpm run dev
    ```
2.  Open your browser to [`http://localhost:3000`](http://localhost:3000) to see the Ringable web application.

## 🚧 Current Status & Next Steps

*   **Core UI Complete:** Pages for managing keys, rings, creating proposals, listing proposals, voting, and viewing results are implemented.
*   **Retro Styling:** Basic pixel-art theme applied using Tailwind CSS and a pixel font.
*   **State Management:** Zustand stores with `localStorage` persistence are functional.
*   **Deployment Prep:** Basic SEO, sitemap, robots.txt, and Vercel configuration added.
*   **Cryptography Mocked:** All ring signature operations (`generateKeyPair`, `signBlsag`, `verifyBlsag`, `keyImagesMatch`) are currently using mock functions in `packages/crypto`.

**Next major step:**

1.  **Integrate Real Cryptography:**
    -   Compile the [Nostringer](https://github.com/AbdelStark/nostringer) Rust library to WebAssembly (`wasm-pack build --target web --features wasm`).
    -   Place the generated `nostringer.js`, `nostringer_bg.wasm`, and `nostringer.d.ts` files into `apps/web/public/`.
    -   Copy `nostringer.d.ts` to `packages/crypto/src/types/`.
    -   Set `MOCK_CRYPTO = false` in `packages/crypto/src/nostringer.ts`.
    -   Thoroughly test the key generation, signing, verification, and duplicate vote detection logic.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
