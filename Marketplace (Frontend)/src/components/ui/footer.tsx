export function Footer() {
  return (
    <footer className='bg-card border-t border-border pt-10 pb-6 mt-auto'>
      <div className='max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
        {/* Brand */}
        <div>
          <h3 className='text-foreground text-xl font-semibold mb-4'>
            ChainTorque
          </h3>
          <p className='text-sm text-muted-foreground'>
            A platform to upload, explore, and download 3D CAD models easily.
            Connect with designers and engineers across the globe.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className='text-foreground font-semibold mb-4'>Quick Links</h4>
          <ul className='space-y-2 text-sm'>
            <li>
              <a
                href='/'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                Home
              </a>
            </li>
            <li>
              <a
                href='/library'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                Library
              </a>
            </li>
            <li>
              <a
                href='/upload'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                Upload Model
              </a>
            </li>
            <li>
              <a
                href='/contact'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className='text-foreground font-semibold mb-4'>Resources</h4>
          <ul className='space-y-2 text-sm'>
            <li>
              <a
                href='#'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                Documentation
              </a>
            </li>
            <li>
              <a
                href='#'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                API Access
              </a>
            </li>
            <li>
              <a
                href='#'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                License Info
              </a>
            </li>
            <li>
              <a
                href='#'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h4 className='text-foreground font-semibold mb-4'>Follow Us</h4>
          <ul className='space-y-2 text-sm'>
            <li>
              <a
                href='#'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href='#'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href='#'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href='#'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                X (Twitter)
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className='border-t border-border mt-10 pt-4 text-center text-sm text-muted-foreground'>
        &copy; 2025 ChainTorque. All rights reserved.
      </div>
    </footer>
  );
}
