import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VerificationModal } from '@/components/VerificationModal';
import ripplingLogo from '@/assets/rippling-logo.png';
import { Shield, CheckCircle2 } from 'lucide-react';
const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="w-full px-[20px] py-[20px]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img src={ripplingLogo} alt="Rippling" className="h-8 brightness-0 invert" />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Products</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Solutions</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="flex flex-col items-center text-center animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Limited Time Offer</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground max-w-4xl leading-[1.1] tracking-tight text-balance mb-6">
            Get <span className="text-primary">$2,000</span> in Rippling credits instantly.
          </h1>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12">
            Verify your current payroll provider account to unlock your offer.
          </p>

          {/* CTA Button */}
          <Button variant="hero" size="xl" onClick={() => setIsModalOpen(true)} className="animate-fade-in">
            Verify my payroll provider
          </Button>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-16 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-sm">Secure verification</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-sm">Instant credits</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-sm">No credit card required</span>
            </div>
          </div>
        </div>
      </main>

      {/* Verification Modal */}
      <VerificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>;
};
export default Index;