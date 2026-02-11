import { BurntAttributeCertificate, VerificationRequestOptions } from '../types';

/**
 * Generic interface for a Verification Provider.
 * Adapters for Reclaim, Primus, etc., must implement this.
 */
export interface IVerificationProvider {
    /**
     * The name of the provider (e.g., 'reclaim', 'primus').
     */
    readonly name: string;

    /**
     * Initialize a verification session.
     * @param options Configuration for the verification request.
     * @returns A promise that resolves to the session URL or data needed to start the flow.
     */
    initializeSession(options: VerificationRequestOptions): Promise<{
        url: string;
        sessionId: string;
    }>;

    /**
     * Verify the result or listen for completion.
     * Some providers might need to poll or listen to a socket.
     * @param sessionId The ID of the session to verify.
     */
    // Note: Actual implementation might vary (callback vs promise). 
    // We define a standard way to retrieve the result.
    // This method might wait for the proof to be generated.
    waitForVerification(sessionId: string): Promise<BurntAttributeCertificate>;
}
