document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  // Mobile Menu Toggle
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
      const icon = menuToggle.querySelector("i");
      if (nav.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
      } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    });
  }

  // Smooth Scroll for Anchors
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
        // Close mobile menu if open
        if (nav.classList.contains("active")) {
          nav.classList.remove("active");
          menuToggle.querySelector("i").classList.add("fa-bars");
          menuToggle.querySelector("i").classList.remove("fa-xmark");
        }
      }
    });
  });

  // FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all
      faqItems.forEach((faq) => {
        faq.classList.remove("active");
        faq.querySelector("i").classList.remove("fa-minus");
        faq.querySelector("i").classList.add("fa-plus");
      });

      // Open clicked if not previously active
      if (!isActive) {
        item.classList.add("active");
        item.querySelector("i").classList.remove("fa-plus");
        item.querySelector("i").classList.add("fa-minus");
      }
    });
  });

  // Typing Animation
  const textElement = document.getElementById("typing-text");
  if (textElement) {
    const textToType = "Google Profile & We_";
    let index = 0;
    textElement.textContent = "";

    function type() {
      if (index < textToType.length) {
        textElement.textContent += textToType.charAt(index);
        index++;
        setTimeout(type, 100);
      }
    }

    type();
  }

  // Scroll Animations (Fade Up)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 },
  );

  const animatedElements = document.querySelectorAll(
    ".service-card, .feature-content, .hero-content, .section-header",
  );
  animatedElements.forEach((el) => {
    el.classList.add("fade-up");
    observer.observe(el);
  });
});
