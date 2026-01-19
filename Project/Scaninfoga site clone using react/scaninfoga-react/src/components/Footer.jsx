const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-col">
          <a href="#" className="footer-logo">Scaninfoga</a>
          <p>Advanced cybersecurity solutions for the modern web. securing the future, one byte at a time.</p>
          <div className="social-links">
            <a href="#"><i className="fa-brands fa-twitter"></i></a>
            <a href="#"><i className="fa-brands fa-linkedin"></i></a>
            <a href="#"><i className="fa-brands fa-github"></i></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Solutions</h4>
          <ul>
            <li><a href="#">Threat Intel</a></li>
            <li><a href="#">Cloud Security</a></li>
            <li><a href="#">Compliance</a></li>
            <li><a href="#">Identity</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <ul className="contact-info">
            <li><i className="fa-solid fa-envelope"></i> contact@scaninfoga.com</li>
            <li><i className="fa-solid fa-phone"></i> +1 (555) 123-4567</li>
            <li><i className="fa-solid fa-location-dot"></i> San Francisco, CA</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Scaninfoga. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
