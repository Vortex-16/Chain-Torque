import { CadCard } from "@/components/ui/cad-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Grid, List } from "lucide-react";

// Import the generated images
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
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Featured CAD Models</h2>
            <p className="text-muted-foreground">Discover high-quality models from professional engineers</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <div className="flex border rounded-lg p-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full">
            {categories.map((category, index) => (
              <TabsTrigger key={index} value={category.toLowerCase().replace(" ", "-")} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredModels.map((model) => (
                <CadCard
                  key={model.id}
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
          </TabsContent>
        </Tabs>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="hover:bg-primary hover:text-primary-foreground">
            Load More Models
          </Button>
        </div>
      </div>
    </section>
  );
}