export default function Gallery() {
    // Using placeholder images - replace with actual CAD images
    const images = [
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1581092160607-ee67df30d0b6?w=400&h=350&fit=crop',
        'https://images.unsplash.com/photo-1581093458791-9d42cc050e93?w=400&h=450&fit=crop',
    ]

    return (
        <section className="py-32 px-6 relative overflow-hidden">
            {/* Decorative blurred blobs */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 reveal">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        Masterpieces of <span className="text-gradient">Design</span>
                    </h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Experience the pinnacle of engineering creativity from our global community of makers.
                    </p>
                </div>

                <div className="columns-1 sm:columns-2 md:columns-4 gap-6 space-y-6">
                    {images.map((src, index) => (
                        <div key={index} className="gallery-card glass-card overflow-hidden reveal hover-lift">
                            <img
                                src={src}
                                alt={`CAD Model ${index + 1}`}
                                className="w-full h-auto object-cover hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
