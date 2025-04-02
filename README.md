# 💍 Ringable

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A client-side anonymous voting platform using Nostr-compatible ring signatures.**

Ringable allows users to create proposals and vote anonymously as part of a predefined group (a "ring" of public keys). It leverages the cryptographic power of **bLSAG ring signatures** to ensure that while votes are verified as coming from a valid member of the ring, the specific voter's identity remains hidden.

The cryptographic functions are powered by the [Nostringer Rust library](https://github.com/AbdelStark/nostringer-rs), compiled to WebAssembly (WASM) for use in the browser.

Built with a fun, **retro pixel-art aesthetic**, Ringable demonstrates modern cryptography in an engaging, user-friendly way.

## ✨ Key Features

- **True Anonymity:** Votes are cryptographically signed by a ring member without revealing _which_ member signed.
- **Linkability (Duplicate Prevention):** Uses bLSAG signatures, which generate a unique "key image" per voter per proposal, preventing the same person from voting multiple times anonymously.
- **Client-Side Only:** No backend server required! All data (keys, rings, proposals, votes) is stored locally in the browser's `localStorage`, managed via Zustand.
- **Retro Pixel-Art UI:** A unique, game-inspired interface built with React and Tailwind CSS.
- **Nostr Compatible Keys:** Uses secp256k1 keys, compatible with the Nostr ecosystem.
- **Monorepo Structure:** Organized using Turborepo for better code sharing and maintainability.

## 🛠️ Tech Stack

- **Monorepo:** [Turborepo](https://turbo.build/repo)
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (with `persist` middleware for `localStorage`)
- **UI Components:** [React](https://reactjs.org/) (within shared `packages/ui`)
- **Cryptography:** [Nostringer](https://github.com/AbdelStark/nostringer-rs) (Rust library supporting WASM)
- **Package Manager:** [pnpm](https://pnpm.io/)
- **Linting/Formatting:** ESLint, Prettier

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

- [Node.js](https://nodejs.org/) (Version specified in root `package.json` engines field, e.g., >=18)
- [pnpm](https://pnpm.io/) (Version specified in root `package.json` packageManager field, e.g., 8.x)
- **(Future Step)** Rust toolchain and `wasm-pack` for compiling the `nostringer` library if replacing mocks.

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with love by [AbdelStark](https://github.com/AbdelStark) 🧡

Feel free to follow me on Nostr if you'd like, using my public key:

```text
npub1hr6v96g0phtxwys4x0tm3khawuuykz6s28uzwtj5j0zc7lunu99snw2e29
```

Or just **scan this QR code** to find me:

![Nostr Public Key QR Code](https://hackmd.io/_uploads/SkAvwlYYC.png)