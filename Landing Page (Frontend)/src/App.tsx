import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ModelShowcase from './components/ModelShowcase'
import Collections from './components/Collections'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import DetailedFeatures from './components/DetailedFeatures'
import Pricing from './components/Pricing'
import Footer from './components/Footer'

function App() {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark'
        }
        return false
    })

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [darkMode])

    const toggleDarkMode = () => setDarkMode(!darkMode)

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <main>
                <Hero />
                <ModelShowcase />
                <Collections />
                <Features />
                <HowItWorks />
                <Gallery />
                <Testimonials />
                <DetailedFeatures />
                <Pricing />
            </main>
            <Footer />
        </div>
    )
}

export default App
