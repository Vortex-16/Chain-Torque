import { Navigation } from '@/components/ui/navigation';
import { HeroSection } from '@/components/ui/hero-section';
import { Footer } from '@/components/ui/footer';

const Index = () => {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      <Navigation />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default Index;
