import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ProviderSelection } from './verification/ProviderSelection';
import { CustomerInfoForm } from './verification/CustomerInfoForm';
import { VerificationLoading } from './verification/VerificationLoading';
import { VerificationSuccess } from './verification/VerificationSuccess';
import { VerificationError } from './verification/VerificationError';

export type ModalStep = 'provider' | 'form' | 'loading' | 'success' | 'error';

export interface CustomerInfo {
  fullName: string;
  workEmail: string;
}

export interface VerificationResult {
  companyName?: string;
  companyEmail?: string;
}

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Provider ID for Gusto - XION
const GUSTO_PROVIDER_ID = '3f94ab34-a3b9-440b-8642-9d027aaaa1eb';

export const VerificationModal = ({ isOpen, onClose }: VerificationModalProps) => {
  const [step, setStep] = useState<ModalStep>('provider');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ fullName: '', workEmail: '' });
  const [verificationResult, setVerificationResult] = useState<VerificationResult>({});
  const [requestUrl, setRequestUrl] = useState<string>('');
  const [selectedProviderId, setSelectedProviderId] = useState<string>(GUSTO_PROVIDER_ID);

  const handleProviderSelect = (provider: string) => {
    if (provider === 'gusto') {
      setSelectedProviderId(GUSTO_PROVIDER_ID);
      setStep('form');
    }
  };

  const handleFormSubmit = (info: CustomerInfo) => {
    setCustomerInfo(info);
    setStep('loading');
  };

  const handleVerificationSuccess = (result: VerificationResult) => {
    setVerificationResult(result);
    setStep('success');
  };

  const handleVerificationError = () => {
    setStep('error');
  };

  const handleClose = () => {
    setStep('provider');
    setCustomerInfo({ fullName: '', workEmail: '' });
    setVerificationResult({});
    setRequestUrl('');
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 'provider':
        return <ProviderSelection onSelect={handleProviderSelect} />;
      case 'form':
        return <CustomerInfoForm onSubmit={handleFormSubmit} onBack={() => setStep('provider')} />;
      case 'loading':
        return (
          <VerificationLoading 
            customerInfo={customerInfo}
            providerId={selectedProviderId}
            onSuccess={handleVerificationSuccess}
            onError={handleVerificationError}
            onRequestUrl={setRequestUrl}
            requestUrl={requestUrl}
          />
        );
      case 'success':
        return <VerificationSuccess result={verificationResult} onClose={handleClose} />;
      case 'error':
        return <VerificationError onClose={handleClose} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Verification Flow</DialogTitle>
          <DialogDescription>Complete your payroll provider verification</DialogDescription>
        </DialogHeader>
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};
