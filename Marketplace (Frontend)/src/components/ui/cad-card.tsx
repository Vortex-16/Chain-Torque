import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Download, Star, ShoppingCart, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

interface CadCardProps {
  id: string | number | { tokenId: string | number };
  title: string;
  image: string;
  price: string;
  seller: string;
  rating: number;
  downloads: number;
  fileTypes: string[];
  software: string[];
  className?: string;
  onWalletRequired?: () => void;
}

export function CadCard({
  id = 1,
  title,
  image,
  price,
  seller,
  rating,
  downloads,
  fileTypes,
  software,
  className,
  onWalletRequired,
}: CadCardProps) {
  const navigate = useNavigate();
  const { user } = useUser();

  // Check if user has wallet connected
  const hasWallet = !!user?.unsafeMetadata?.walletAddress;

  const handleCardClick = () => {
    // Prefer tokenId if present, fallback to id
    let detailId: string | number = '';
    if (id && typeof id === 'object' && 'tokenId' in id && id.tokenId != null) {
      detailId = id.tokenId;
    } else if (id != null && (typeof id === 'string' || typeof id === 'number')) {
      detailId = id;
    }
    navigate(`/product/${detailId}`);
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the button
    
    if (!hasWallet) {
      // If no wallet connected, trigger wallet connection popup
      if (onWalletRequired) {
        onWalletRequired();
      } else {
        alert('Please connect your wallet to purchase items');
      }
      return;
    }
    
    // Add to cart logic here (only if wallet is connected)
    console.log(`Added ${title} to cart`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the button
    // Wishlist logic here
    console.log(`Toggled wishlist for ${title}`);
  };
  return (
    <Card
      className={cn(
        'group cursor-pointer bg-gradient-card border-border/50 hover:animate-card-hover transition-all duration-300 hover:shadow-glow hover:border-primary/20',
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className='p-0'>
        {/* Image */}
        <div className='relative overflow-hidden rounded-t-lg'>
          <img
            src={image}
            alt={title}
            className='w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105'
          />
          <div className='absolute top-3 right-3'>
            <Button
              size='sm'
              variant='secondary'
              className='h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-secondary hover:scale-110 transition-all'
              onClick={handleToggleWishlist}
              aria-label='Add to wishlist'
            >
              <Heart className='h-4 w-4 transition-colors group-hover:text-secondary' />
            </Button>
          </div>
          {/* File type badges */}
          <div className='absolute bottom-3 left-3 flex gap-1 flex-wrap'>
            {fileTypes.map((type, index) => (
              <Badge
                key={type}
                variant='secondary'
                className='text-xs bg-background/80 backdrop-blur-sm transition-all hover:bg-accent hover:text-background'
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className='p-4'>
          <h3 className='font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors'>
            {title}
          </h3>

          <div className='flex items-center justify-between text-sm text-muted-foreground mb-3'>
            <span>by {seller}</span>
            <div className='flex items-center gap-1'>
              <Star className='h-3 w-3 fill-warning text-warning' />
              <span>{rating}</span>
            </div>
          </div>

          {/* Software compatibility */}
          <div className='flex gap-1 mb-3 flex-wrap'>
            {software.map(sw => (
              <Badge key={sw} variant='outline' className='text-xs'>
                {sw}
              </Badge>
            ))}
          </div>

          {/* Price and actions */}
          <div className='flex items-center justify-between'>
            <div className='flex flex-col'>
              <span className='text-lg font-bold text-primary'>{price}</span>
              <span className='text-xs text-muted-foreground flex items-center gap-1'>
                <Download className='h-3 w-3' />
                {downloads} downloads
              </span>
            </div>
            <Button
              size='sm'
              className={cn(
                'transition-all hover:scale-105',
                hasWallet 
                  ? 'bg-gradient-primary hover:bg-primary-hover animate-glow-pulse' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
              )}
              onClick={handleAddToCart}
              aria-label={hasWallet ? 'Add to cart' : 'Connect wallet to purchase'}
              disabled={!hasWallet}
            >
              {hasWallet ? (
                <>
                  <ShoppingCart className='h-4 w-4 mr-1' />
                  Add
                </>
              ) : (
                <>
                  <Wallet className='h-4 w-4 mr-1' />
                  Connect
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
