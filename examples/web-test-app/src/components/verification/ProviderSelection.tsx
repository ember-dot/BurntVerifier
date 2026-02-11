import { Building2, Lock } from 'lucide-react';
interface Provider {
  id: string;
  name: string;
  icon: React.ReactNode;
  disabled: boolean;
}
const providers: Provider[] = [{
  id: 'gusto',
  name: 'Gusto',
  icon: <div className="w-10 h-10 bg-[#F45D48] rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">G</span>
      </div>,
  disabled: false
}, {
  id: 'adp',
  name: 'ADP',
  icon: <div className="w-10 h-10 bg-[#D0271D] rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">ADP</span>
      </div>,
  disabled: true
}, {
  id: 'paychex',
  name: 'Paychex',
  icon: <div className="w-10 h-10 bg-[#004B87] rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-xs">PX</span>
      </div>,
  disabled: true
}];
interface ProviderSelectionProps {
  onSelect: (provider: string) => void;
}
export const ProviderSelection = ({
  onSelect
}: ProviderSelectionProps) => {
  return <div className="animate-fade-in">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Select your current provider</h2>
        <p className="text-muted-foreground">Choose your payroll provider to verify your account</p>
      </div>

      <div className="space-y-3">
        {providers.map(provider => <button key={provider.id} onClick={() => !provider.disabled && onSelect(provider.id)} disabled={provider.disabled} className={`w-full provider-card ${provider.disabled ? 'provider-card-disabled' : 'provider-card-active'}`}>
            {provider.icon}
            <span className="flex-1 text-left font-medium text-[hsl(var(--background))]">
              {provider.name}
            </span>
            {provider.disabled && <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                <span>Coming soon</span>
              </div>}
          </button>)}
      </div>
    </div>;
};