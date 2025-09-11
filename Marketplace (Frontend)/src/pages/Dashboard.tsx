import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  ShoppingBag,
  Upload,
  DollarSign,
  Eye,
  Download,
  TrendingUp,
  Clock,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/hooks/useAuth';
import apiService from '@/services/apiService';

const Dashboard = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalModels: 0,
      totalSales: 0,
      totalEarnings: '0 ETH',
      totalViews: 0,
      balance: '0 ETH',
    },
    userNFTs: [],
    marketplaceStats: null,
  });

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get user's wallet address from metadata or use default for demo
      const walletAddress =
        user.unsafeMetadata?.walletAddress ||
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Default wallet address for Archis

      const promises = [
        // Get marketplace stats
        apiService.getMarketplaceStats(),
        // Get user's NFTs if wallet address is available
        walletAddress
          ? apiService.getUserNFTs(walletAddress)
          : Promise.resolve({ success: true, data: [], total: 0 }),
        // Get wallet balance if address is available
        walletAddress
          ? apiService
              .getBalance(walletAddress)
              .catch(() => ({ success: false, balance: '0' }))
          : Promise.resolve({ success: false, balance: '0' }),
      ];

      const [marketplaceResponse, userNFTsResponse, balanceResponse] =
        await Promise.all(promises);

      // Process user NFTs data - backend returns {success: true, nfts: [...]}
      const userNFTs =
        userNFTsResponse.success && Array.isArray(userNFTsResponse.nfts)
          ? userNFTsResponse.nfts
          : [];

      // Calculate user stats from NFTs
      const totalModels = userNFTs.length;
      const totalSales = userNFTs.reduce(
        (acc, nft) => acc + (nft.sold ? 1 : 0),
        0
      );
      const totalViews = userNFTs.reduce(
        (acc, nft) => acc + (nft.views || 0),
        0
      );

      // Get balance - backend returns {success: true, data: {address: "...", balance: "...", balanceETH: "...", balanceWei: "..."}}
      const balance =
        balanceResponse.success &&
        balanceResponse.data &&
        balanceResponse.data.balance
          ? `${balanceResponse.data.balance} ETH`
          : '0 ETH';

      setDashboardData({
        stats: {
          totalModels,
          totalSales,
          totalEarnings: balance,
          totalViews,
          balance,
        },
        userNFTs: userNFTs.slice(0, 5), // Show only recent 5
        marketplaceStats: marketplaceResponse.success
          ? marketplaceResponse.stats
          : null,
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration when no real data is available
  const getMockData = () => ({
    recentPurchases: [
      {
        id: 1,
        title: 'Industrial Robot Arm',
        price: '0.12 ETH',
        date: '2024-03-15',
        seller: 'TechDesigner',
      },
      {
        id: 2,
        title: 'Automotive Part',
        price: '0.07 ETH',
        date: '2024-03-12',
        seller: 'CarParts3D',
      },
    ],
    recentTransactions: [
      {
        id: 1,
        type: 'sale',
        title: 'Gear Assembly',
        amount: '+0.05 ETH',
        date: '2024-03-16',
      },
      {
        id: 2,
        type: 'purchase',
        title: 'Robot Arm',
        amount: '-0.12 ETH',
        date: '2024-03-15',
      },
      {
        id: 3,
        type: 'sale',
        title: 'Drone Frame',
        amount: '+0.03 ETH',
        date: '2024-03-14',
      },
    ],
  });

  const mockData = getMockData();

  if (loading) {
    return (
      <div className='min-h-screen bg-background'>
        <Navigation />
        <div className='container mx-auto px-4 py-8 pt-24'>
          <div className='flex items-center justify-center h-64'>
            <div className='flex items-center gap-3 text-muted-foreground'>
              <Loader2 className='h-6 w-6 animate-spin' />
              <span>Loading dashboard data...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-background'>
        <Navigation />
        <div className='container mx-auto px-4 py-8 pt-24'>
          <div className='flex items-center justify-center h-64'>
            <div className='flex items-center gap-3 text-destructive'>
              <AlertCircle className='h-6 w-6' />
              <div>
                <p className='font-medium'>Failed to load dashboard</p>
                <p className='text-sm text-muted-foreground'>{error}</p>
                <Button
                  onClick={loadDashboardData}
                  variant='outline'
                  size='sm'
                  className='mt-2'
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <Navigation />

      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold mb-2'>Dashboard</h1>
            <p className='text-muted-foreground'>
              Manage your models, track sales, and view your marketplace
              activity
            </p>
          </div>

          {/* Stats Overview */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Total Models
                    </p>
                    <p className='text-2xl font-bold'>
                      {dashboardData.stats.totalModels}
                    </p>
                  </div>
                  <Upload className='h-8 w-8 text-blue-500' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Total Sales
                    </p>
                    <p className='text-2xl font-bold'>
                      {dashboardData.stats.totalSales}
                    </p>
                  </div>
                  <ShoppingBag className='h-8 w-8 text-green-500' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Wallet Balance
                    </p>
                    <p className='text-2xl font-bold'>
                      {dashboardData.stats.balance}
                    </p>
                  </div>
                  <DollarSign className='h-8 w-8 text-yellow-500' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Total Views
                    </p>
                    <p className='text-2xl font-bold'>
                      {dashboardData.stats.totalViews.toLocaleString()}
                    </p>
                  </div>
                  <Eye className='h-8 w-8 text-purple-500' />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* My Models */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <span>My Models</span>
                  <Button size='sm'>
                    <Upload className='h-4 w-4 mr-2' />
                    Upload New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {dashboardData.userNFTs.length > 0 ? (
                    dashboardData.userNFTs.map(nft => (
                      <div
                        key={nft.tokenId || nft.id}
                        className='flex items-center justify-between p-4 border rounded-lg'
                      >
                        <div className='flex-1'>
                          <h4 className='font-medium'>
                            {nft.name || nft.title || `Model #${nft.tokenId}`}
                          </h4>
                          <div className='flex items-center gap-4 mt-2 text-sm text-muted-foreground'>
                            <span className='flex items-center gap-1'>
                              <Eye className='h-4 w-4' />
                              {nft.views || 0} views
                            </span>
                            <span className='flex items-center gap-1'>
                              <Download className='h-4 w-4' />
                              {nft.downloads || 0} downloads
                            </span>
                          </div>
                        </div>
                        <div className='text-right'>
                          <p className='font-medium'>
                            {nft.price ? `${nft.price} ETH` : 'Free'}
                          </p>
                          <Badge
                            variant={nft.sold ? 'secondary' : 'default'}
                            className='mt-2'
                          >
                            {nft.sold ? 'sold' : 'active'}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-8 text-muted-foreground'>
                      <Upload className='h-12 w-12 mx-auto mb-4 opacity-50' />
                      <p>No models uploaded yet</p>
                      <p className='text-sm'>
                        Upload your first 3D model to get started!
                      </p>
                    </div>
                  )}
                </div>
                <Button variant='outline' className='w-full mt-4'>
                  {dashboardData.userNFTs.length > 0
                    ? 'View All Models'
                    : 'Upload First Model'}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Purchases */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {mockData.recentPurchases.map(purchase => (
                    <div
                      key={purchase.id}
                      className='flex items-center justify-between p-4 border rounded-lg'
                    >
                      <div className='flex-1'>
                        <h4 className='font-medium'>{purchase.title}</h4>
                        <p className='text-sm text-muted-foreground'>
                          by {purchase.seller}
                        </p>
                        <p className='text-xs text-muted-foreground mt-1'>
                          {purchase.date}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium'>{purchase.price}</p>
                        <Button size='sm' variant='outline' className='mt-2'>
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant='outline' className='w-full mt-4'>
                  View All Purchases
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className='mt-8'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <TrendingUp className='h-5 w-5' />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {mockData.recentTransactions.map(transaction => (
                  <div
                    key={transaction.id}
                    className='flex items-center justify-between p-4 border rounded-lg'
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === 'sale'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {transaction.type === 'sale' ? (
                          <TrendingUp className='h-4 w-4' />
                        ) : (
                          <ShoppingBag className='h-4 w-4' />
                        )}
                      </div>
                      <div>
                        <h4 className='font-medium'>{transaction.title}</h4>
                        <p className='text-sm text-muted-foreground flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`font-medium ${
                        transaction.type === 'sale'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant='outline' className='w-full mt-4'>
                View All Transactions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
