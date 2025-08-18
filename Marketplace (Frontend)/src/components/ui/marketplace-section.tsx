import { CadCard } from "@/components/ui/cad-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Grid, List, Loader2, AlertCircle } from "lucide-react";
import { useMarketplace, useWeb3Status } from "@/hooks/useWeb3";
import { useEffect, useState } from "react";

// Import the generated images (fallback)
import cadGear from "@/assets/cad-gear.jpg";
import cadDrone from "@/assets/cad-drone.jpg";
import cadEngine from "@/assets/cad-engine.jpg";
import cadRobot from "@/assets/cad-robot.jpg";

const featuredModels = [
  {
    id: 1,
    title: "Professional Gear Assembly System",
    image: cadGear,
    price: "$49.99",
    seller: "MechDesign Pro",
    rating: 4.8,
    downloads: 1245,
    fileTypes: ["STEP", "IGES", "STL"],
    software: ["SolidWorks", "AutoCAD", "Fusion360"]
  },
  {
    id: 2,
    title: "Carbon Fiber Drone Frame V2",
    image: cadDrone,
    price: "$29.99",
    seller: "AeroTech Solutions",
    rating: 4.9,
    downloads: 856,
    fileTypes: ["STEP", "STL", "DWG"],
    software: ["CATIA", "SolidWorks", "Inventor"]
  },
  {
    id: 3,
    title: "Automotive Engine Cylinder Head",
    image: cadEngine,
    price: "$89.99",
    seller: "AutoCAD Masters",
    rating: 4.7,
    downloads: 2134,
    fileTypes: ["STEP", "IGES", "SLDPRT"],
    software: ["SolidWorks", "NX", "CATIA"]
  },
  {
    id: 4,
    title: "Industrial Robotic Arm Joint",
    image: cadRobot,
    price: "$75.00",
    seller: "RoboDesign Inc",
    rating: 4.9,
    downloads: 967,
    fileTypes: ["STEP", "IGES", "STL"],
    software: ["Inventor", "SolidWorks", "Fusion360"]
  }
];

const categories = [
  "All Categories",
  "Mechanical Parts",
  "Automotive",
  "Aerospace",
  "Robotics",
  "Consumer Products",
  "Industrial Equipment"
];

export function MarketplaceSection() {
  const { items, stats, loading, error, refreshMarketplace } = useMarketplace();
  const { initialized, network, contract } = useWeb3Status();
  const [displayItems, setDisplayItems] = useState(featuredModels); // Fallback data

  useEffect(() => {
    // If we have real NFT items from the blockchain, use them
    if (items && items.length > 0) {
      const nftItems = items.map((item, index) => ({
        id: item.tokenId || index,
        title: item.name || `NFT Model #${item.tokenId}`,
        image: item.previewHash ? `https://gateway.pinata.cloud/ipfs/${item.previewHash}` : featuredModels[index % featuredModels.length].image,
        price: item.price ? `${(parseInt(item.price) / 1e18).toFixed(4)} ETH` : "0.001 ETH",
        seller: item.seller || "Unknown",
        rating: 4.5 + Math.random() * 0.5, // Random rating for demo
        downloads: parseInt(item.downloads) || 0,
        fileTypes: ["GLB", "GLTF", "STL"],
        software: ["Blender", "Three.js", "Web3D"],
        category: item.category || "3D Model",
        tokenId: item.tokenId,
        modelHash: item.modelHash,
        isBlockchain: true
      }));
      setDisplayItems(nftItems);
    }
  }, [items]);

  const handleRefresh = () => {
    refreshMarketplace();
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Web3 Status Banner */}
        {!initialized && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Web3 Backend Status:</span>
              <span className="text-sm">
                {loading ? "Checking connection..." : 
                 error ? `Connection failed: ${error}` :
                 "Not connected to blockchain"}
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {initialized ? "Blockchain NFT Models" : "Featured CAD Models"}
            </h2>
            <p className="text-muted-foreground">
              {initialized ? 
                `Discover NFT 3D models on ${network?.networkName || 'blockchain'}` :
                "Discover high-quality models from professional engineers"
              }
            </p>
            {stats && (
              <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                <span>Total: {stats.market?.totalTokens || 0}</span>
                <span>Sold: {stats.market?.totalSold || 0}</span>
                <span>Active: {stats.market?.activeListings || 0}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-border text-foreground hover:bg-accent"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Filter className="h-4 w-4 mr-2" />}
              {loading ? "Loading..." : "Refresh"}
            </Button>
            <div className="flex border border-border rounded-lg p-1 bg-card">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:bg-accent">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:bg-accent">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full bg-muted">
            {categories.map((category, index) => (
              <TabsTrigger 
                key={index} 
                value={category.toLowerCase().replace(" ", "-")} 
                className="text-xs text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-primary"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading marketplace...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Marketplace</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={handleRefresh} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayItems.map((model) => (
                  <CadCard
                    key={model.id}
                    id={model.id}
                    title={model.title}
                    image={model.image}
                    price={model.price}
                    seller={model.seller}
                    rating={model.rating}
                    downloads={model.downloads}
                    fileTypes={model.fileTypes}
                    software={model.software}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Load More Models
          </Button>
        </div>
      </div>
    </section>
  );
}