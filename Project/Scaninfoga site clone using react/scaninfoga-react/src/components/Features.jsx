const Features = () => {
  const features = [
    'Real-time anomaly detection',
    'Automated incident response',
    'Deep packet inspection',
    'Zero-trust architecture',
    '24/7 Security Operations Center'
  ]

  return (
    <section id="features" className="features">
      <div className="container feature-container">
        <div className="feature-image">
          <div className="tech-graphic">
            <div className="scan-line"></div>
            <div className="data-point p1"></div>
            <div className="data-point p2"></div>
            <div className="data-point p3"></div>
          </div>
        </div>
        <div className="feature-content">
          <h2>Enterprise-Grade <span className="text-gradient">Security</span> Features</h2>
          <p>Scalable solutions designed for modern enterprises facing complex threat landscapes.</p>
          <ul className="feature-list">
            {features.map((feature, index) => (
              <li key={index}>
                <i className="fa-solid fa-check"></i> {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Features
