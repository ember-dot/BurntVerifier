import { useEffect, useState, useRef } from 'react';
import { Loader2, ExternalLink, Smartphone } from 'lucide-react';
import { CustomerInfo, VerificationResult } from '@/components/VerificationModal';
import { Button } from '@/components/ui/button';
import { BurntVerifier } from '../../../../../src/BurntVerifier'; // Import local SDK
// import { supabase } from '@/integrations/supabase/client'; // Supabase removed for this standalone test

interface VerificationLoadingProps {
  customerInfo: CustomerInfo;
  providerId: string;
  onSuccess: (result: VerificationResult) => void;
  onError: () => void;
  onRequestUrl: (url: string) => void;
  requestUrl: string;
}

export const VerificationLoading = ({
  customerInfo,
  providerId,
  onSuccess,
  onError,
  onRequestUrl,
  requestUrl
}: VerificationLoadingProps) => {
  const [status, setStatus] = useState<'initializing' | 'waiting' | 'verifying'>('initializing');
  const [error, setError] = useState<string | null>(null);
  const proofWindowRef = useRef<Window | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (initRef.current) return;
    initRef.current = true;

    const initializeVerification = async () => {
      try {
        console.log('Initializing Burnt verification...');

        // Initialize BurntVerifier
        // In a real app, these secrets should not be hardcoded on the client.
        // For this test app, we'll hardcode or use generic placeholders that work with the test provider.
        // Assuming the user has a valid Reclaim App ID/Secret for testing.
        const verifier = new BurntVerifier({
          appId: '0x715DcADb8884D6D3E17898d81F82257c2733E46d',
          appSecret: '0x902a478cd3c1a27cc415d6910c8173e4ba670d3360a7a55dfa96dd4562059104'
          // mode: 'mock' // Commented out to test real Reclaim flow
        });

        // Initialize session
        const { url, sessionId } = await verifier.initializeSession({
          verificationTypeId: providerId,
          metadata: {
            ...customerInfo,
            context: "Burnt Verification Test"
          }
        });

        console.log('Session initialized:', sessionId);
        setStatus('waiting');
        onRequestUrl(url);

        // Wait for verification
        const certificate = await verifier.verify(sessionId);

        console.log('Verification successful:', certificate);
        setStatus('verifying');

        // Close popup if open
        if (proofWindowRef.current && !proofWindowRef.current.closed) {
          proofWindowRef.current.close();
        }

        // Process certificate claims
        // Mapping generic claims to the app's specific expectation
        // In a production app, this logic might be more specific to the provider type
        const extractedParams = certificate.claims || {};
        console.log('VerificationLoading: Extracted params from certificate:', extractedParams);

        let companyName = extractedParams.tradeOrLegalName || extractedParams.companyName || extractedParams.employer || 'Verified Company';
        let companyEmail = extractedParams.email || customerInfo.workEmail;

        console.log('VerificationLoading: Final Success Data -> Company:', companyName, 'Email:', companyEmail);

        setTimeout(() => {
          onSuccess({
            companyName,
            companyEmail
          });
        }, 1000);

      } catch (err: any) {
        console.error('Verification initialization error:', err);
        setError(err.message || 'An error occurred');

        // Close popup if open
        if (proofWindowRef.current && !proofWindowRef.current.closed) {
          proofWindowRef.current.close();
        }

        setTimeout(() => onError(), 2000);
      }
    };

    initializeVerification();

    // Cleanup
    return () => {
      if (proofWindowRef.current && !proofWindowRef.current.closed) {
        proofWindowRef.current.close();
      }
    };
  }, [customerInfo, providerId, onSuccess, onError, onRequestUrl]);

  const handleOpenVerificationLink = () => {
    if (requestUrl) {
      // Pre-emptively open a blank tab for iOS Safari + localhost compatibility
      proofWindowRef.current = window.open(requestUrl, '_blank');
      if (!proofWindowRef.current || proofWindowRef.current.closed) {
        setError('Popup was blocked. Please allow popups for this site and try again.');
      }
    }
  };

  return (
    <div className="animate-fade-in text-center py-8">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        {status === 'verifying' ? (
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        ) : (
          <Smartphone className="w-8 h-8 text-primary animate-pulse-soft" />
        )}
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">
        {status === 'initializing' && 'Preparing verification...'}
        {status === 'waiting' && 'Ready to verify your account'}
        {status === 'verifying' && 'Verifying your account...'}
      </h2>

      <p className="text-muted-foreground mb-6">
        {status === 'initializing' && 'Please wait while we set up your verification.'}
        {status === 'waiting' && 'Click the button below to open the verification page.'}
        {status === 'verifying' && "Almost done! We're confirming your details."}
      </p>

      {requestUrl && status === 'waiting' && (
        <div className="space-y-4">
          <div className="p-4 bg-secondary rounded-xl">
            <p className="text-sm mb-3 text-background">
              Click the button below to verify your payroll account:
            </p>
            <Button variant="default" className="w-full" onClick={handleOpenVerificationLink}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Verification Page
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Verification powered by Burnt Labs.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-destructive/10 rounded-lg text-left">
          <p className="text-sm font-bold text-destructive">Error Details:</p>
          <p className="text-sm text-destructive font-mono break-all">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">Check console for more details.</p>
        </div>
      )}

      {status !== 'verifying' && !error && (
        <div className="flex justify-center gap-1 mt-8">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </div>
  );
};