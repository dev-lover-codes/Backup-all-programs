const Testimonials = () => {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header text-center">
          <h2>What Our <span className="text-gradient">Clients</span> Say</h2>
        </div>
        <div className="testimonial-slider">
          <div className="testimonial-card">
            <div className="quote-icon">
              <i className="fa-solid fa-quote-left"></i>
            </div>
            <p>"Scaninfoga has completely transformed our security posture. Their AI-driven approach is lightyears ahead of the competition. We feel safer than ever."</p>
            <div className="author">
              <div className="author-info">
                <h4>Sarah Jenkins</h4>
                <span>CTO, TechFlow Inc.</span>
              </div>
            </div>
          </div>
        </div>
        <div className="slider-controls">
          <button className="prev">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button className="next">
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
