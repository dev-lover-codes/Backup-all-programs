import { useEffect, useState } from 'react'

const Hero = () => {
  const [typedText, setTypedText] = useState('')
  const textToType = 'Google Profile & We_'

  useEffect(() => {
    let index = 0
    const type = () => {
      if (index < textToType.length) {
        setTypedText(textToType.substring(0, index + 1))
        index++
        setTimeout(type, 100)
      }
    }
    type()
  }, [])

  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fa-solid fa-shield-halved"></i> Leading Cybersecurity Solutions
          </div>
          <h1>Welcome to <br /><span className="text-green">Scaninfoga</span></h1>
          <h2 className="hero-subtitle">The Future of Cyber</h2>
          
          <p className="hero-description">
            Accelerate every investigation. The all-in-one platform for cybercrime, telecom, dark web, 
            and financial intelligence and evidence <span className="text-green">99x faster</span>, with one powerful tool.
          </p>
          
          <div className="terminal-input-display">
            <span className="prompt">&gt;</span> 
            <span id="typing-text">{typedText}</span>
            <span className="cursor">|</span>
          </div>

          <div className="hero-buttons">
            <a href="#start" className="btn btn-primary">Start Investigation</a>
            <a href="#demo" className="btn btn-outline">Explore Services</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="tech-circle-bg"></div>
          <div className="glowing-orb">
            <div className="crystal-wrapper">
              <div className="crystal"></div>
              <div className="crystal-shine"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
