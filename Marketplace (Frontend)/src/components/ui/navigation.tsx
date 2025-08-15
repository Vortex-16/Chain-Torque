import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { User, LogOut, Activity } from "lucide-react";
import { useAuthContext } from "@/hooks/useAuth";
import { useBackendHealth } from "@/hooks/useWeb3";

export function Navigation() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { user, isAuthenticated, signOut } = useAuthContext();
  const health = useBackendHealth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // User will be redirected to landing page automatically by Clerk
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <nav className="bg-background border-b border-border shadow-sm p-4 flex justify-between items-center">
        <a href="/" className="text-xl font-bold text-primary">ChainTorque</a>
        <div className="flex items-center gap-6">
          <ul className="flex gap-6">
            <li><a href="/" className="text-foreground hover:text-primary transition-colors">Home</a></li>
            <li><a href="/library" className="text-foreground hover:text-primary transition-colors">Library</a></li>
            <li><a href="/models" className="text-foreground hover:text-primary transition-colors">Models</a></li>
            <li><a href="/upload" className="text-foreground hover:text-primary transition-colors">Upload</a></li>
          </ul>
          <div className="flex items-center gap-3">
            {/* Backend Status Indicator */}
            <div className="flex items-center gap-2">
              <Activity className={`h-4 w-4 ${
                health.status === 'OK' ? 'text-green-500' : 
                health.loading ? 'text-yellow-500 animate-pulse' : 
                'text-red-500'
              }`} />
              <span className="text-xs text-muted-foreground hidden md:inline">
                {health.loading ? 'Checking...' : health.status}
              </span>
            </div>
            <ThemeToggle />
            {isAuthenticated && user && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{user.firstName} {user.lastName}</span>
                  <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded">
                    {String(user.publicMetadata?.userType) || 'Member'}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="h-8"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline ml-1">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Scroll To Top Button */}
      <button 
        className={`fixed bottom-5 right-5 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary-hover z-50 transition-all ${
          showScrollButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={scrollToTop}
      >
        ↑
      </button>
    </>
  );
}