import { useState } from 'react'

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null)

  const faqs = [
    {
      question: 'How does the AI threat detection work?',
      answer: 'Our AI analyzes traffic patterns in real-time, identifying anomalies that deviate from established baselines to block threats instantly.'
    },
    {
      question: 'Is Scaninfoga suitable for small businesses?',
      answer: 'Absolutely. We offer scalable tiers that bring enterprise-grade security to businesses of all sizes.'
    },
    {
      question: 'What compliance standards do you support?',
      answer: 'We support all major standards including GDPR, HIPAA, SOC2, PCI-DSS, and ISO 27001.'
    },
    {
      question: 'Can I integrate this with my existing stack?',
      answer: 'Yes, we have native integrations for AWS, Azure, Google Cloud, and most major CI/CD pipelines.'
    }
  ]

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section className="faq">
      <div className="container">
        <div className="section-header text-center">
          <h2>Frequently Asked <span className="text-gradient">Questions</span></h2>
        </div>
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <h3>{faq.question}</h3>
                <i className={`fa-solid ${activeIndex === index ? 'fa-minus' : 'fa-plus'}`}></i>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
