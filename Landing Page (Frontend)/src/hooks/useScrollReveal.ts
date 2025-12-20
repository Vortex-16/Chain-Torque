import { useEffect } from 'react';

export function useScrollReveal() {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add a small delay for staggered effect if data-delay is present
                    const delay = entry.target.getAttribute('data-delay') || '0';
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, parseInt(delay));
                    // Once revealed, no need to observe anymore
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all reveal elements
        const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        revealEls.forEach(el => revealObserver.observe(el));

        return () => {
            revealEls.forEach(el => revealObserver.unobserve(el));
        };
    }, []);
}
