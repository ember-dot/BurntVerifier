import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Mail } from 'lucide-react';
import { CustomerInfo } from '../VerificationModal';

interface CustomerInfoFormProps {
  onSubmit: (info: CustomerInfo) => void;
  onBack: () => void;
}

export const CustomerInfoForm = ({ onSubmit, onBack }: CustomerInfoFormProps) => {
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; workEmail?: string }>({});

  const validateForm = () => {
    const newErrors: { fullName?: string; workEmail?: string } = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.length > 100) {
      newErrors.fullName = 'Name must be less than 100 characters';
    }
    
    if (!workEmail.trim()) {
      newErrors.workEmail = 'Work email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) {
      newErrors.workEmail = 'Please enter a valid email address';
    } else if (workEmail.length > 255) {
      newErrors.workEmail = 'Email must be less than 255 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ fullName: fullName.trim(), workEmail: workEmail.trim().toLowerCase() });
    }
  };

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">One last step before verification</h2>
        <p className="text-muted-foreground">We need a few details to complete your verification</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Full Name
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Smith"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={errors.fullName ? 'border-destructive' : ''}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="workEmail" className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Work Email Address
          </Label>
          <Input
            id="workEmail"
            type="email"
            placeholder="john@company.com"
            value={workEmail}
            onChange={(e) => setWorkEmail(e.target.value)}
            className={errors.workEmail ? 'border-destructive' : ''}
          />
          {errors.workEmail && (
            <p className="text-sm text-destructive">{errors.workEmail}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg">
          Continue to Verification
        </Button>
      </form>
    </div>
  );
};
