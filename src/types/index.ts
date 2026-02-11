/**
 * @burnt-labs/verification
 * Public Type Definitions
 */

/**
 * Unique identifier for the type of verification (e.g., "Twitter Follower Count > 100").
 * Previously known as "Provider ID" in other contexts.
 */
export type VerificationTypeId = string;

/**
 * A standardized certificate proving a user's attribute.
 * This is the "Burnt" standardized format for what might be a zk-proof or signed claim.
 */
export interface BurntAttributeCertificate {
  /**
   * The ID of the verification type this certificate validates.
   */
  verificationTypeId: VerificationTypeId;

  /**
   * The raw claim data or parameters verified.
   * content is generic as it depends on the provider but sanitized for Burnt usage.
   */
  claims: Record<string, any>;

  /**
   * The timestamp when this verification was performed.
   */
  timestampS: number;

  /**
   * The unique identifier for this specific verification session/instance.
   */
  sessionId: string;

  /**
   * Creation timestamp of the proof
   */
  createdAt: number;
  
  /**
   * Context info/metadata about the verification
   */
  context?: any;
}

/**
 * Configuration for initializing a verification request.
 */
export interface VerificationRequestOptions {
  /**
   * The specific type of verification to perform.
   */
  verificationTypeId: VerificationTypeId;

  /**
   * Optional callback URL for redirects or webhooks.
   */
  callbackUrl?: string;

  /**
   * Custom metadata to attach to the verification session.
   */
  metadata?: Record<string, any>;
  
  /**
   * Optional function called on success
   */
   onSuccess?: (certificate: BurntAttributeCertificate) => void;

   /**
    * Optional function called on failure
    */
   onError?: (error: Error) => void;
}
