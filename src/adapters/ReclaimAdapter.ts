import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';
import type { IVerificationProvider } from '../interfaces/IProvider';
import type { BurntAttributeCertificate, VerificationRequestOptions } from '../types';

/**
 * Adapter for Reclaim Protocol.
 * Hides the Reclaim implementation details from the rest of the application.
 */
export class ReclaimAdapter implements IVerificationProvider {
    public readonly name = 'reclaim';
    private appId: string;
    private appSecret: string;

    // Store active requests to manage callbacks/verification status
    private activeRequests: Map<string, any> = new Map(); // Using 'any' for ProofRequest as type export is tricky

    constructor(appId: string, appSecret: string) {
        this.appId = appId;
        this.appSecret = appSecret;
    }

    /**
     * Initializes a Reclaim verification session.
     */
    async initializeSession(options: VerificationRequestOptions): Promise<{ url: string; sessionId: string }> {
        const providerId = options.verificationTypeId;

        console.log('ReclaimAdapter: ReclaimProofRequest import:', ReclaimProofRequest);

        if (!ReclaimProofRequest) {
            throw new Error('ReclaimProofRequest is undefined. Check SDK import.');
        }

        // Initialize the Reclaim SDK v4 with user-preferred options for reliable loading
        const reclaimRequest = await ReclaimProofRequest.init(this.appId, this.appSecret, providerId, {
            useAppClip: false,
            log: true,
            customSharePageUrl: 'https://portal.reclaimprotocol.org/kernel'
        });

        // Set callback URL if provided
        if (options.callbackUrl) {
            reclaimRequest.setAppCallbackUrl(options.callbackUrl);
        }

        // Only add context if metadata is explicitly provided and non-empty
        if (options.metadata && Object.keys(options.metadata).length > 0) {
            reclaimRequest.addContext(
                `0x0`, // Context ID/Address
                JSON.stringify(options.metadata)
            );
        }

        // Get the request URL
        const requestUrl = await reclaimRequest.getRequestUrl();

        // Use the session ID from the request object if available (it is in v4)
        // casting to any because getSessionId might be missing in type definition but present in runtime
        const sessionId = (reclaimRequest as any).getSessionId ? (reclaimRequest as any).getSessionId() : `reclaim_session_${Date.now()}`;

        this.activeRequests.set(sessionId, reclaimRequest);

        return {
            url: requestUrl,
            sessionId: sessionId,
        };
    }

    /**
     * Waits for the verification to complete.
     * Returns a Promise that resolves with the BurntAttributeCertificate.
     */
    async waitForVerification(sessionId: string): Promise<BurntAttributeCertificate> {
        const request = this.activeRequests.get(sessionId);
        if (!request) {
            throw new Error(`Session ${sessionId} not found or expired.`);
        }

        return new Promise((resolve, reject) => {
            // Start the verification session with Reclaim
            request.startSession({
                onSuccess: (response: any) => {
                    console.log('ReclaimAdapter: Verification success response:', response);

                    // Reclaim v4 can return a single proof or an array of proofs
                    const proofs = Array.isArray(response) ? response : [response];

                    if (proofs.length === 0 || !proofs[0]) {
                        console.error('ReclaimAdapter: No proof found in success response');
                        reject(new Error('No proof received from Reclaim'));
                        return;
                    }

                    // Merge claims from all proofs
                    let allClaims = {};
                    proofs.forEach(proof => {
                        const { claims } = this.mapReclaimProofToCertificate(sessionId, proof);
                        allClaims = { ...allClaims, ...claims };
                    });

                    // Create the final certificate using the first proof for base metadata
                    const certificate = this.mapReclaimProofToCertificate(sessionId, proofs[0]);
                    certificate.claims = allClaims;

                    // If multiple proofs, store them all in context
                    if (proofs.length > 1) {
                        certificate.context = proofs;
                    }

                    // Cleanup
                    this.activeRequests.delete(sessionId);

                    resolve(certificate);
                },
                onError: (error: Error) => {
                    console.error('ReclaimAdapter: Verification error', error);
                    this.activeRequests.delete(sessionId);
                    reject(error);
                },
            });
        });
    }

    /**
     * Maps a Reclaim-specific proof to the standardized BurntAttributeCertificate.
     */
    private mapReclaimProofToCertificate(sessionId: string, proof: any): BurntAttributeCertificate {
        const timestampS = proof.timestampS || Math.floor(Date.now() / 1000);
        let claims: any = {};

        try {
            console.log('ReclaimAdapter: Mapping proof structure:', proof);

            // 1. Direct extracted values
            if (proof.extractedParameterValues) {
                claims = { ...claims, ...proof.extractedParameterValues };
            }

            // 2. Parse claimData.parameters (JSON string in v4)
            if (proof.claimData?.parameters) {
                try {
                    const params = typeof proof.claimData.parameters === 'string'
                        ? JSON.parse(proof.claimData.parameters)
                        : proof.claimData.parameters;

                    // Reclaim often nests in paramValues
                    if (params.paramValues) {
                        claims = { ...claims, ...params.paramValues };
                    }
                    // Also spread the rest of params
                    claims = { ...claims, ...params };
                } catch (e) { }
            }

            // 3. Parse claimData.context (contains metadata and extracted parameters)
            if (proof.claimData?.context) {
                try {
                    const context = typeof proof.claimData.context === 'string'
                        ? JSON.parse(proof.claimData.context)
                        : proof.claimData.context;

                    // Flatten extractedParameters if present
                    if (context.extractedParameters) {
                        claims = { ...claims, ...context.extractedParameters };
                    }

                    // Recover our metadata if needed
                    if (context.contextMessage) {
                        try {
                            const metadata = typeof context.contextMessage === 'string'
                                ? JSON.parse(context.contextMessage)
                                : context.contextMessage;
                            claims = { ...claims, ...metadata };
                        } catch (e) { }
                    }
                } catch (e) { }
            }

            // 4. Handle other potential nesting found in logs
            if (proof.paramValues) claims = { ...claims, ...proof.paramValues };
            if (proof.extractedParameters) claims = { ...claims, ...proof.extractedParameters };

            // Final safety: remove duplicate strings of objects
            delete claims.parameters;
            delete claims.context;

            console.log('ReclaimAdapter: Final flattened claims:', claims);
        } catch (e) {
            console.error('ReclaimAdapter: Mapping error', e);
        }

        return {
            verificationTypeId: proof.claimData?.provider || proof.providerId || 'unknown',
            sessionId: sessionId,
            claims: claims,
            timestampS: timestampS,
            createdAt: Date.now(),
            context: proof,
        };
    }
}
