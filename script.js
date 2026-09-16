const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Keep every portfolio card connected to its current project page.
const projectRoutes = {
  'AWS Bedrock RAG Assistant': 'projects/aws-bedrock-rag-assistant.html',
  'Secure CI/CD Pipeline': 'projects/secure-ci-cd-pipeline/dashboard.html',
  'AWS Security Monitoring Platform': 'projects/aws-security-monitoring-platform/dashboard.html',
  'Terraform AWS Landing Zone': 'projects/terraform-aws-landing-zone/dashboard.html',
  'AI Document Processing Pipeline': 'projects/ai-document-processing-pipeline/dashboard.html',
  'Secure AI API Deployment': 'projects/secure-ai-api-deployment/dashboard.html',
  'Hermes Agent Cloud Deployment': 'projects/hermes-agent-cloud-deployment.html',
  'OpenClaw Private AI Assistant': 'projects/openclaw-private-ai-assistant/dashboard.html',
  'Manufacturing ERP/MRP SQL Reporting': 'projects/manufacturing-erp-mrp-sql-reporting.html',
  'AI Manufacturing Support Agent': 'projects/ai-manufacturing-support-agent/dashboard.html'
};

document.querySelectorAll('.project-card').forEach(card => {
  const title = String(card.querySelector('h3')?.textContent || '').replace('↗', '').trim();
  const route = projectRoutes[title];
  if (route) card.setAttribute('href', route);
});

// Open every non-anchor link in a separate tab/window while keeping
// on-page navigation (Home, About, Skills, Projects, etc.) in the current tab.
document.querySelectorAll('a[href]').forEach(link => {
  const href = String(link.getAttribute('href') || '').trim();
  if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
});

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

const CONTACT_API_URL = String(window.CONTACT_API_URL || '').trim();
const TURNSTILE_SITE_KEY = String(window.TURNSTILE_SITE_KEY || '').trim();
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let turnstileWidgetId = null;

function setFormStatus(message, state = 'info') {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.dataset.state = state;
}

function fieldValue(formData, name) {
  return String(formData.get(name) || '').trim();
}

function resetTurnstile() {
  if (window.turnstile && turnstileWidgetId !== null) {
    try { window.turnstile.reset(turnstileWidgetId); } catch (_) {}
  }
}

function renderTurnstile() {
  if (!contactForm || !TURNSTILE_SITE_KEY || !window.turnstile || turnstileWidgetId !== null) return;

  const submitButton = contactForm.querySelector('button[type="submit"]');
  if (!submitButton) return;

  let container = contactForm.querySelector('#turnstile-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'turnstile-container';
    container.style.margin = '4px 0 14px';
    submitButton.before(container);
  }

  turnstileWidgetId = window.turnstile.render(container, {
    sitekey: TURNSTILE_SITE_KEY,
    theme: 'dark',
    size: 'flexible',
    appearance: 'interaction-only'
  });
}

function loadTurnstile() {
  if (!contactForm || !TURNSTILE_SITE_KEY) return;
  if (window.turnstile) {
    renderTurnstile();
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  script.async = true;
  script.defer = true;
  script.onload = renderTurnstile;
  script.onerror = () => setFormStatus('Security verification could not load. Please refresh and try again.', 'error');
  document.head.appendChild(script);
}

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const defaultButtonHtml = submitButton ? submitButton.innerHTML : 'Send Message';

  loadTurnstile();

  contactForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      setFormStatus('Please complete all required fields.', 'error');
      return;
    }

    const formData = new FormData(contactForm);
    const turnstileToken = fieldValue(formData, 'cf-turnstile-response');
    const payload = {
      name: fieldValue(formData, 'name'),
      email: fieldValue(formData, 'email'),
      company: fieldValue(formData, 'company'),
      subject: fieldValue(formData, 'subject'),
      message: fieldValue(formData, 'message'),
      website: fieldValue(formData, 'website'),
      turnstileToken
    };

    if (!emailPattern.test(payload.email)) {
      setFormStatus('Please enter a valid email address.', 'error');
      contactForm.querySelector('[name="email"]')?.focus();
      return;
    }

    if (!TURNSTILE_SITE_KEY || !turnstileToken) {
      setFormStatus('Please complete the security verification before sending.', 'error');
      return;
    }

    if (!CONTACT_API_URL) {
      setFormStatus('The secure AWS contact endpoint has not been connected yet.', 'error');
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<span>Sending…</span>';
    }
    setFormStatus('Sending your message securely…', 'info');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit'
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Unable to send message.');

      contactForm.reset();
      setFormStatus('Message sent successfully. Thank you — I’ll be in touch.', 'success');
    } catch (error) {
      if (error?.name === 'AbortError') {
        setFormStatus('The contact service timed out. Please try again.', 'error');
      } else {
        setFormStatus(error?.message || 'Unable to send your message right now. Please try again.', 'error');
      }
    } finally {
      clearTimeout(timeout);
      resetTurnstile();
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = defaultButtonHtml;
      }
    }
  });
}
