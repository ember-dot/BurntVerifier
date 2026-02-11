import { CheckCircle2, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VerificationResult } from '../VerificationModal';
interface VerificationSuccessProps {
  result: VerificationResult;
  onClose: () => void;
}
export const VerificationSuccess = ({
  result,
  onClose
}: VerificationSuccessProps) => {
  return <div className="animate-scale-in text-center py-8">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 bg-success/20 rounded-full animate-ping" />
        <div className="relative w-20 h-20 bg-success rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-success-foreground" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-2">
        <PartyPopper className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Success!</h2>
        <PartyPopper className="w-6 h-6 text-primary scale-x-[-1]" />
      </div>

      <p className="text-3xl font-extrabold text-primary mb-6">
        $2k Credits Unlocked
      </p>

      <div className="rounded-xl p-6 mb-6 bg-primary">
        <p className="text-sm text-muted-foreground mb-2">Verified Company</p>
        <p className="text-lg font-semibold text-foreground">
          {result.companyName || 'Your Company'}
        </p>
        {result.companyEmail && <>
            <p className="text-sm text-muted-foreground mt-4 mb-2">Verified Email</p>
            <p className="text-lg font-semibold text-foreground">
              {result.companyEmail}
            </p>
          </>}
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Your credits have been added to your account. You'll receive a confirmation email shortly.
      </p>

      <Button onClick={onClose} className="w-full" size="lg">
        Continue to Dashboard
      </Button>
    </div>;
};