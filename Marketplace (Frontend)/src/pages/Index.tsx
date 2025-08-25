import { Navigation } from '@/components/ui/navigation';
import { HeroSection } from '@/components/ui/hero-section';
import { MarketplaceSection } from '@/components/ui/marketplace-section';
import { Footer } from '@/components/ui/footer';
import WalletConnect from '../components/WalletConnect';
import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user } = useUser();

  const hasWallet = !!user?.unsafeMetadata?.walletAddress;

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <Navigation />
      <HeroSection />
      {!hasWallet && <WalletConnect />}
      {hasWallet && <MarketplaceSection />}
      <Footer />
    </div>
  );
};

export default Index;
