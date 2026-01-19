const Interconnected = () => {
  const nodes = [
    { icon: 'fa-shield-virus', label: 'Threat Protection', className: 'node-1' },
    { icon: 'fa-lock', label: 'Data Privacy', className: 'node-2' },
    { icon: 'fa-globe', label: '', className: 'node-3 center-node', hasPluse: true },
    { icon: 'fa-server', label: 'Cloud Security', className: 'node-4' },
    { icon: 'fa-user-shield', label: 'Identity', className: 'node-5' }
  ]

  return (
    <section className="interconnected">
      <div className="container">
        <div className="section-header text-center">
          <h2>Cybersecurity in an <span className="text-gradient">Interconnected</span> World</h2>
          <p>Connecting seamless security protocols across your entire digital infrastructure.</p>
        </div>
        <div className="network-viz">
          {nodes.map((node, index) => (
            <div key={index} className={`node ${node.className}`}>
              {node.hasPluse && <div className="pulse"></div>}
              <i className={`fa-solid ${node.icon}`}></i>
              {node.label && <span>{node.label}</span>}
            </div>
          ))}
          <svg className="connections" width="100%" height="100%"></svg>
        </div>
      </div>
    </section>
  )
}

export default Interconnected
