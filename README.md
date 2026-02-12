# @burnt-labs/verification

A white-label verification SDK for Burnt Labs, enabling seamless user attribute verification (KYC/KYB) powered by ZK proofs.

## Features

- **White-Label Abstraction**: Hide the complexity of underlying verification providers (like Reclaim Protocol).
- **Universal Compatibility**: Works out of the box in Browser (React/Vite) and Node.js environments.
- **Dynamic Data Extraction**: Automatically flattens and parses cryptographic proofs into easy-to-use JSON claims.
- **Multi-Proof Merging**: Automatically aggregates and merges claims from multiple proofs into a single unified certificate.
- **Improved Success Handling**: Reliable processing of both single and array-based proof responses.
- **Mock Mode**: Built-in mock adapter for rapid frontend development without external connectivity.
- **ZK Powered**: Integrated with Reclaim Protocol v4 for secure, private data verification.

## Installation

```bash
npm install @burnt-labs/verification
```

## Quick Start

### 1. Initialize the Verifier

```typescript
import { BurntVerifier } from '@burnt-labs/verification';

const verifier = new BurntVerifier({
  appId: 'YOUR_RECLAIM_APP_ID',
  appSecret: 'YOUR_RECLAIM_APP_SECRET'
});
```

### 2. Start a Verification Session

```typescript
const { url, sessionId } = await verifier.initializeSession({
  verificationTypeId: 'YOUR_PROVIDER_ID' // e.g. Gusto, LinkedIn, etc.
});

// redirect user to 'url' or display it as a QR code
```

### 3. Wait for Verification

```typescript
try {
  const certificate = await verifier.verify(sessionId);
  console.log('Verified Claims:', certificate.claims);
  // claims will contain tradeOrLegalName, email, etc.
} catch (error) {
  console.error('Verification failed', error);
}
```

## Mock Mode (Development)

To test your UI without connecting to real providers:

```typescript
const verifier = new BurntVerifier({
  mode: 'mock',
  appId: 'fake', 
  appSecret: 'fake'
});
```

## For Vite Users

If you are using Vite, you may need `vite-plugin-node-polyfills` to support Node.js globals required by the ZK SDK:

```typescript
// vite.config.ts
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    nodePolyfills({
      globals: { Buffer: true, process: true },
    }),
  ],
});
```

## How it Works (Technical)

The SDK utilizes a **Strategy Pattern** with a focus on **Privacy-Preserving Proofs**.

### 1. Zero-Knowledge Abstraction
The core of the SDK is the `IVerificationProvider` interface. This allows the system to swap out verification engines (e.g., Reclaim, TLSNotary, etc.) without changing the user-facing API.

### 2. The Verification Flow
- **Session Initiation**: When `initializeSession` is called, the SDK generates a cryptographically signed request. No user PII (Personally Identifiable Information) is sent to the verification cloud during this step.
- **ZK-Proof Extraction**: Users log in to their providers (like Gusto) via a secure, sandboxed environment. The underlying provider uses ZK-proofs to prove specific data points (like "This user is an employee") *without* revealing the user's password or full account data to Burnt Labs.
- **Dynamic Mapping**: The SDK flattens the complex, nested cryptographic responses into standardized "Claims". This ensures that developers can access verified data (like `tradeOrLegalName`) through a clean, flat JSON object.

### 3. Browser Compatibility
Verification protocols often rely on Node.js-specific modules (like `Buffer` or `crypto`). This SDK includes built-in safeguards and recommended configurations for modern frontend bundlers (Vite/Webpack) to ensure these protocols work seamlessly in the browser.

