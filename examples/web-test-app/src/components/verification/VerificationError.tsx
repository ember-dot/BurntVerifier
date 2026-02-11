import { AlertCircle, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VerificationErrorProps {
  onClose: () => void;
}

export const VerificationError = ({ onClose }: VerificationErrorProps) => {
  return (
    <div className="animate-scale-in text-center py-8">
      <div className="w-20 h-20 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-10 h-10 text-warning" />
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">
        Verification couldn't be completed
      </h2>

      <p className="text-muted-foreground mb-6">
        Sorry about that. Here's something for your time instead.
      </p>

      <div className="bg-gradient-to-br from-[#00704A] to-[#1E3932] rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Coffee className="w-8 h-8" />
          <span className="text-2xl font-bold">$20 Gift Card</span>
        </div>
        <p className="text-white/80 text-sm">
          Check your email for your Starbucks gift card code.
        </p>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        You can try again later or contact support if you continue to experience issues.
      </p>

      <div className="space-y-3">
        <Button onClick={onClose} className="w-full" size="lg">
          Close
        </Button>
        <Button variant="ghost" className="w-full" onClick={onClose}>
          Try Again Later
        </Button>
      </div>
    </div>
  );
};
