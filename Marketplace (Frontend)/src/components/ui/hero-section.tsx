export function HeroSection() {
  const scrollToLibrary = () => {
    const libraryElement = document.getElementById('library');
    if (libraryElement) {
      libraryElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* First Hero Section - Build. Share. Explore. */}
      <section className="h-[50vh] flex flex-col items-center justify-center text-center bg-gradient-to-br from-purple-800 via-primary to-secondary relative px-4 dark:from-purple-900 dark:via-primary dark:to-secondary">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.4)' }}>
          Build. Share. Explore.
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-6">
          Welcome to the future of CAD modeling – a marketplace where creativity meets collaboration.
        </p>

        {/* Search + Explore */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-xl">
          <input 
            type="text" 
            placeholder="Search CAD models..." 
            className="w-full md:w-3/4 px-5 py-3 rounded-full text-foreground bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary shadow-md"
          />
          <button
            onClick={scrollToLibrary}
            className="bg-background text-primary font-semibold px-6 py-3 rounded-full shadow hover:bg-muted transition-all duration-200"
          >
            Explore
          </button>
        </div>

        {/* Scroll Down Arrow */}
        <div className="absolute bottom-6 text-white text-2xl animate-bounce cursor-pointer" onClick={scrollToLibrary}>
          ↓
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-6 bg-muted/30 text-foreground" id="library">
        <h2 className="text-3xl font-bold text-center mb-10">Popular CAD Collections</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl shadow-card p-5 hover:shadow-card-hover transition-all border border-border">
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">Mechanical Parts</h3>
            <p className="text-sm text-muted-foreground">Explore gears, joints, bolts, and more...</p>
          </div>
          <div className="bg-card rounded-xl shadow-card p-5 hover:shadow-card-hover transition-all border border-border">
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">Architectural Blocks</h3>
            <p className="text-sm text-muted-foreground">Find building CADs, elevations & blueprints.</p>
          </div>
          <div className="bg-card rounded-xl shadow-card p-5 hover:shadow-card-hover transition-all border border-border">
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">3D Print Ready</h3>
            <p className="text-sm text-muted-foreground">Perfectly optimized models for printing.</p>
          </div>
        </div>
      </section>
    </>
  );
}