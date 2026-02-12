import type { IVerificationProvider } from './interfaces/IProvider';
import { ReclaimAdapter } from './adapters/ReclaimAdapter';
import { MockAdapter } from './adapters/MockAdapter';
import type { VerificationRequestOptions, BurntAttributeCertificate } from './types';

export interface BurntVerifierConfig {
    /**
     * Your Application ID (from Reclaim or Burnt admin panel).
     */
    appId: string;

    /**
     * Your Application Secret.
     */
    appSecret: string;

    /**
     * Optional: Select a specific provider if multiple are supported in future.
     * Defaults to 'reclaim'.
     */
    defaultProvider?: 'reclaim' | 'primus' | string;

    /**
     * Optional: Enable mock mode for testing
     */
    mode?: 'reclaim' | 'mock';
}

/**
 * The main entry point for the Burnt Verification SDK.
 * 
 * Usage:
 * const verifier = new BurntVerifier({ appId: '...', appSecret: '...' });
 * const { url, sessionId } = await verifier.initializeSession({ verificationTypeId: '...' });
 */
export class BurntVerifier {
    private adapter: IVerificationProvider;

    constructor(config: BurntVerifierConfig) {
        // Strategy pattern to select the adapter
        // Currently hardcoded/defaulted to Reclaim as per requirements
        // but structure allows easy extension.
        if (config.defaultProvider === 'primus') {
            // Future: this.adapter = new PrimusAdapter(config.appId, config.appSecret);
            throw new Error("Primus provider not yet implemented");
        } else if (config.defaultProvider === 'mock' || config.mode === 'mock') {
            this.adapter = new MockAdapter();
        } else {
            // Default to Reclaim
            this.adapter = new ReclaimAdapter(config.appId, config.appSecret);
        }
    }

    /**
     * Starts a new verification session.
     * @param options Configuration for the verification request.
     * @returns The verification URL (typically a QR code or deep link) and a Session ID.
     */
    public async initializeSession(options: VerificationRequestOptions): Promise<{ url: string; sessionId: string }> {
        return this.adapter.initializeSession(options);
    }

    /**
     * Sets up a listener for the verification result.
     * @param sessionId The session ID returned from initializeSession.
     * @returns A promise that resolves with the BurntAttributeCertificate when verification succeeds.
     */
    public async verify(sessionId: string): Promise<BurntAttributeCertificate> {
        return this.adapter.waitForVerification(sessionId);
    }
}
