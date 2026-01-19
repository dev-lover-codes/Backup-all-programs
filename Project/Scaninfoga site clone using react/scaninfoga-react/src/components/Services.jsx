const Services = () => {
  const services = [
    {
      icon: 'fa-bug',
      title: 'AI Threat Detection',
      description: 'Advanced machine learning algorithms that predict and neutralize threats before they impact your system.'
    },
    {
      icon: 'fa-network-wired',
      title: 'Network Infrastructure',
      description: 'Secure specific network architectures designed to withstand sophisticated cyber attacks.'
    },
    {
      icon: 'fa-fingerprint',
      title: 'Identity Management',
      description: 'Robust IAM solutions ensuring that only authorized personnel have access to critical data.'
    },
    {
      icon: 'fa-database',
      title: 'Data Encryption',
      description: 'End-to-end encryption standards that keep your sensitive information unreadable to intruders.'
    },
    {
      icon: 'fa-cloud',
      title: 'Cloud Security',
      description: 'Cloud-native security posture management to protect your distributed assets.'
    },
    {
      icon: 'fa-file-code',
      title: 'Audit & Compliance',
      description: 'Automated compliance checks against global standards like GDPR, HIPAA, and SOC2.'
    }
  ]

  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-header text-center">
          <h2>Our <span className="text-gradient">Security</span> Services</h2>
          <p>Comprehensive solutions tailored for your business needs.</p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="icon-box">
                <i className={`fa-solid ${service.icon}`}></i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
