import { useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import Interconnected from './components/Interconnected'
import Services from './components/Services'
import Features from './components/Features'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import CTA from './components/CTA'
import Footer from './components/Footer'

function App() {
  useEffect(() => {
    // Scroll Animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    const animatedElements = document.querySelectorAll(
      '.service-card, .feature-content, .hero-content, .section-header'
    )
    animatedElements.forEach((el) => {
      el.classList.add('fade-up')
      observer.observe(el)
    })

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <StatsBar />
        <Interconnected />
        <Services />
        <Features />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

export default App
