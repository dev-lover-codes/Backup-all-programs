import { useState } from 'react'

const CTA = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Add your form submission logic here
    alert('Thank you for your inquiry! We will get back to you soon.')
    setFormData({ name: '', email: '', company: '', message: '' })
  }

  return (
    <section id="contact" className="cta-section">
      <div className="container cta-container">
        <div className="cta-content">
          <h2>Ready to Secure Your <span className="text-gradient">Digital Assets?</span></h2>
          <p>Get in touch with our team of experts to schedule a personalized demo or vulnerability assessment.</p>
          <a href="#" className="btn btn-primary">Start Your Free Trial</a>
        </div>
        <div className="cta-form-wrapper">
          <h3>Get in touch with our experts</h3>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="text" 
                name="name"
                placeholder="Full Name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="email" 
                name="email"
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="text" 
                name="company"
                placeholder="Company Name" 
                value={formData.company}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <textarea 
                name="message"
                placeholder="How can we help you?" 
                rows="4"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Submit Inquiry</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default CTA
