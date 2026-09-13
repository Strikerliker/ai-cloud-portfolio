const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const CONTACT_API_URL = window.CONTACT_API_URL || '';
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

function setFormStatus(message, state = 'info') {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.dataset.state = state;
}

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      company: String(formData.get('company') || '').trim(),
      subject: String(formData.get('subject') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      website: String(formData.get('website') || '').trim()
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setFormStatus('Please complete all required fields.', 'error');
      return;
    }

    if (!CONTACT_API_URL) {
      setFormStatus('Secure contact delivery is being activated. Please try again shortly.', 'info');
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    setFormStatus('Sending your message securely…', 'info');

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Unable to send message.');

      contactForm.reset();
      setFormStatus('Message sent successfully. Thank you — I’ll be in touch.', 'success');
    } catch (error) {
      setFormStatus(error.message || 'Unable to send your message right now. Please try again later.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }
  });
}
