import { useState } from 'react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleNavClick = (e) => {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href'))
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="header">
      <div className="container header-container">
        <a href="#" className="logo">
          <i className="fa-solid fa-feather-pointed"></i> scaninfoga
        </a>
        <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-list">
            <li><a href="#home" className="active" onClick={handleNavClick}>Home</a></li>
            <li><a href="#tools" onClick={handleNavClick}>Tools</a></li>
            <li><a href="#services" onClick={handleNavClick}>Services</a></li>
            <li><a href="#pricing" onClick={handleNavClick}>Pricing</a></li>
            <li><a href="#contact" onClick={handleNavClick}>Contact</a></li>
            <li><a href="#about" onClick={handleNavClick}>About us</a></li>
          </ul>
        </nav>
        <div className="header-actions">
          <a href="#get-started" className="btn btn-primary">
            <i className="fa-solid fa-wand-magic-sparkles"></i> Get Started
          </a>
        </div>
        <button className="menu-toggle" aria-label="Toggle Menu" onClick={toggleMenu}>
          <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>
    </header>
  )
}

export default Header
