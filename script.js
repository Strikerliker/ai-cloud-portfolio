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

function refreshPortfolioHero() {
  const brandName = document.querySelector('.brand-name');
  if (brandName) brandName.textContent = 'AI & CLOUD SOLUTIONS';

  const heroPanel = document.querySelector('.hero-panel');
  if (heroPanel) {
    heroPanel.className = 'hero-cloud-visual';
    heroPanel.setAttribute('aria-label', 'AWS and Azure cloud platforms');
    heroPanel.innerHTML = `
      <div class="cloud-outline">
        <div class="cloud-platforms">
          <div class="platform aws-platform"><span class="aws-word">aws</span><span class="aws-smile">⌣</span></div>
          <div class="platform-divider"></div>
          <div class="platform azure-platform"><span class="azure-mark">▲</span><span class="azure-word">Azure</span></div>
        </div>
      </div>
      <div class="hero-side-words"><span>PEOPLE</span><span>SOLUTIONS</span><span>SECURITY</span><span>INNOVATION</span><i></i><strong>A BRIGHTER<br>TOMORROW</strong></div>`;
  }

  const badges = document.querySelector('.hero-badges');
  if (badges) {
    badges.innerHTML = `
      <span class="capability-badge cloud">☁ <strong>AWS Architecture</strong></span>
      <span class="capability-badge security">🛡 <strong>Cloud Security</strong></span>
      <span class="capability-badge ai">✦ <strong>Generative AI</strong></span>`;
  }

  const architecture = document.querySelector('#architecture');
  if (architecture) {
    architecture.innerHTML = `
      <div class="container architecture-section">
        <div class="section-heading reveal visible">
          <div class="eyebrow">Solution Focus</div>
          <h2>AWS Generative AI Architecture</h2>
          <p>A secure, scalable, production-ready reference architecture for enterprise AI, RAG, agents, and intelligent automation.</p>
        </div>
        <div class="ai-architecture reveal visible" aria-label="AWS generative AI reference architecture">
          <div class="ai-arch-grid">
            <div class="ai-layer users-layer">
              <h3>Users</h3>
              <div class="svc"><b>WEB</b><span>Web / Mobile</span></div>
              <div class="svc"><b>CC</b><span>Contact Center</span></div>
              <div class="svc"><b>INT</b><span>Internal Users</span></div>
            </div>
            <div class="ai-layer access-layer">
              <h3>Frontend & Access</h3>
              <div class="svc aws-purple"><b>CF</b><span>Amazon CloudFront</span></div>
              <div class="svc aws-purple"><b>R53</b><span>Amazon Route 53</span></div>
              <div class="svc aws-purple"><b>COG</b><span>Amazon Cognito</span></div>
            </div>
            <div class="ai-layer app-layer">
              <h3>Application Layer</h3>
              <div class="svc aws-orange"><b>API</b><span>Amazon API Gateway</span></div>
              <div class="svc aws-orange"><b>λ</b><span>AWS Lambda</span></div>
              <div class="svc aws-orange"><b>SF</b><span>AWS Step Functions</span></div>
            </div>
            <div class="ai-layer ml-layer">
              <h3>AI / ML Layer</h3>
              <div class="svc aws-green"><b>BR</b><span>Amazon Bedrock</span></div>
              <div class="svc aws-green"><b>KB</b><span>Bedrock Knowledge Bases</span></div>
              <div class="svc aws-green"><b>SM</b><span>Amazon SageMaker</span></div>
            </div>
            <div class="ai-layer data-layer">
              <h3>Data Layer</h3>
              <div class="svc aws-blue"><b>S3</b><span>Amazon S3</span></div>
              <div class="svc aws-blue"><b>OS</b><span>Amazon OpenSearch</span></div>
              <div class="svc aws-blue"><b>DDB</b><span>Amazon DynamoDB</span></div>
            </div>
            <div class="ai-layer sec-layer">
              <h3>Security & Operations</h3>
              <div class="svc aws-red"><b>IAM</b><span>AWS IAM</span></div>
              <div class="svc aws-red"><b>KMS</b><span>AWS KMS</span></div>
              <div class="svc aws-red"><b>WAF</b><span>AWS WAF</span></div>
              <div class="svc aws-red"><b>CW</b><span>Amazon CloudWatch</span></div>
              <div class="svc aws-red"><b>CT</b><span>AWS CloudTrail</span></div>
            </div>
          </div>
          <div class="governance-strip">
            <strong>MLOps & Governance</strong>
            <span>CodePipeline · EventBridge · CloudFormation · GuardDuty · AWS Config</span>
          </div>
        </div>
      </div>`;
  }

  const style = document.createElement('style');
  style.textContent = `
    .hero-grid{grid-template-columns:1.22fr .78fr;align-items:center}
    .hero-copy{align-self:center}
    .hero h1{margin-bottom:16px}
    .gradient-text{font-size:clamp(3.2rem,5.4vw,5.4rem);background:none;color:#fff;-webkit-text-fill-color:#fff}
    .brand-name{font-size:1.3rem;letter-spacing:.025em}
    .hero-cloud-visual{position:relative;min-height:430px;display:flex;align-items:center;justify-content:center}
    .cloud-outline{position:relative;width:min(480px,92%);height:280px;border:3px solid rgba(73,190,255,.75);border-radius:44% 44% 36% 36% / 52% 52% 42% 42%;background:radial-gradient(circle at 50% 48%,rgba(28,104,181,.28),rgba(1,18,35,.08) 70%);box-shadow:0 0 35px rgba(34,164,255,.28),inset 0 0 35px rgba(34,164,255,.12)}
    .cloud-outline:before,.cloud-outline:after{content:'';position:absolute;border:3px solid rgba(73,190,255,.75);background:rgba(4,31,59,.75);border-bottom:0}
    .cloud-outline:before{width:155px;height:105px;border-radius:90px 90px 0 0;left:52px;top:-55px}
    .cloud-outline:after{width:190px;height:135px;border-radius:110px 110px 0 0;right:55px;top:-90px}
    .cloud-platforms{position:absolute;inset:0;z-index:3;display:flex;align-items:center;justify-content:center;gap:28px}
    .platform{display:flex;align-items:center;gap:10px;font-weight:700}
    .aws-platform{flex-direction:column;gap:0;color:white}.aws-word{font-size:3.4rem;line-height:.9}.aws-smile{font-size:3.3rem;color:#ff9900;line-height:.45;transform:rotate(-8deg)}
    .platform-divider{width:1px;height:70px;background:rgba(170,220,255,.55)}
    .azure-mark{font-size:4rem;color:#1689f4;transform:rotate(3deg)}.azure-word{font-size:2.15rem;color:white}
    .hero-side-words{position:absolute;right:-10px;top:72px;display:flex;flex-direction:column;gap:12px;color:#1ba8ff;letter-spacing:.16em;font-size:.84rem}
    .hero-side-words i{width:36px;height:1px;background:#41bfff;margin:4px 0 3px}.hero-side-words strong{color:#79c8ff;font-weight:500;line-height:1.8}
    .ai-architecture{background:#f6fbff;color:#0a2547;border-radius:26px;padding:28px;box-shadow:0 24px 70px rgba(0,0,0,.22)}
    .ai-arch-grid{display:grid;grid-template-columns:.78fr 1fr 1fr 1.35fr 1fr 1.25fr;gap:12px;align-items:stretch}
    .ai-layer{border:1px solid #ccdaea;border-radius:14px;background:#fff;overflow:hidden;padding-bottom:12px}
    .ai-layer h3{margin:0 0 12px;padding:10px 8px;text-align:center;color:white;font-size:.82rem;letter-spacing:.02em}
    .users-layer h3{background:#355b86}.access-layer h3{background:#7255b8}.app-layer h3{background:#ef7f26}.ml-layer h3{background:#399467}.data-layer h3{background:#3185d8}.sec-layer h3{background:#b5253d}
    .svc{display:flex;align-items:center;gap:8px;padding:8px 10px;font-size:.72rem;line-height:1.2}
    .svc b{display:grid;place-items:center;flex:0 0 34px;height:34px;border-radius:8px;background:#e8eff7;color:#15334f;font-size:.68rem}
    .svc span{font-weight:700;color:#17304f}.aws-purple b{background:#6e42ce;color:white}.aws-orange b{background:#ef791f;color:white}.aws-green b{background:#14936d;color:white}.aws-blue b{background:#287fd6;color:white}.aws-red b{background:#ce284c;color:white}
    .governance-strip{margin-top:14px;padding:11px 16px;border-radius:12px;background:#7658b8;color:white;display:flex;justify-content:center;gap:22px;flex-wrap:wrap;font-size:.78rem}
    @media(max-width:1100px){.hero-side-words{display:none}.ai-arch-grid{grid-template-columns:repeat(3,1fr)}}
    @media(max-width:900px){.hero-cloud-visual{min-height:330px}.cloud-outline{transform:scale(.84)}.ai-arch-grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:640px){.hero-cloud-visual{min-height:270px}.cloud-outline{transform:scale(.62)}.brand-name{font-size:1rem}.ai-architecture{padding:18px}.ai-arch-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
}

refreshPortfolioHero();

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
