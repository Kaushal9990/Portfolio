document.documentElement.classList.add('js');

const nepalClocks = [...document.querySelectorAll('[data-nepal-clock]')];

if (nepalClocks.length) {
  const clockFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kathmandu',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const updateClock = () => {
    const now = new Date();
    nepalClocks.forEach((clock) => {
      clock.textContent = clockFormatter.format(now);
      clock.dateTime = now.toISOString();
    });
  };

  updateClock();
  setInterval(updateClock, 1000);
}

const avatarStage = document.querySelector('[data-avatar-tilt]');
const avatarImage = avatarStage?.querySelector('.profile-photo');

if (
  avatarStage &&
  avatarImage &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  const resetAvatarTilt = () => {
    avatarImage.style.transform = '';
  };

  avatarStage.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;

    const bounds = avatarStage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const rotateY = (x - 0.5) * 24;
    const rotateX = (0.5 - y) * 20;
    avatarImage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(14px)`;
  });

  avatarStage.addEventListener('pointerleave', resetAvatarTilt);
}

const menuToggle = document.getElementById('menu-toggle');
const navigation = document.getElementById('primary-nav');

if (menuToggle && navigation) {
  const closeMenu = () => {
    navigation.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    navigation.classList.toggle('is-open', !isOpen);
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const sphereCanvas = document.getElementById('contact-sphere');
const sphereContext = sphereCanvas?.getContext('2d');

if (sphereCanvas && sphereContext) {
  const sphereLines = [
    {text: 'HELLO • KAUSHAL ACHARYA', y: -0.92},
    {text: 'SOFTWARE ENGINEER', y: -0.77},
    {text: 'WEB AND MOBILE DEVELOPER', y: -0.62},
    {text: 'MACHINE LEARNING • GIS', y: -0.47},
    {text: 'RAG • REMOTE SENSING', y: -0.32},
    {text: 'KAUSHAL.ACHARYA1999@GMAIL.COM', y: -0.16},
    {text: 'SOFTWARE ENGINEER • WEB DEVELOPER', y: 0},
    {text: '+977-9867866025 • NEPAL', y: 0.16},
    {text: 'LINKEDIN • GITHUB', y: 0.32},
    {text: 'MACHINE LEARNING • GIS', y: 0.47},
    {text: 'KAUSHAL ACHARYA', y: 0.62},
    {text: 'SOFTWARE ENGINEER', y: 0.77},
    {text: 'HELLO', y: 0.92},
  ];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const idleSpinSpeed = 0.0007;
  const hoverSpinSpeed = 0.0032;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let rotation = 0;
  let lastFrameTime = 0;
  let spinSpeed = idleSpinSpeed;

  const drawSphere = () => {
    sphereContext.clearRect(0, 0, canvasWidth, canvasHeight);

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const radius = Math.min(canvasWidth, canvasHeight) * 0.4;
    const tilt = 0.18;
    const cosineX = Math.cos(tilt);
    const sineX = Math.sin(tilt);
    const cosineY = Math.cos(rotation);
    const sineY = Math.sin(rotation);
    sphereContext.textAlign = 'center';
    sphereContext.textBaseline = 'middle';

    const projectPoint = (x, y, z) => {
      const rotatedX = x * cosineY + z * sineY;
      const rotatedZ = -x * sineY + z * cosineY;
      const rotatedY = y * cosineX - rotatedZ * sineX;
      const perspective = 8 / (8 - rotatedZ);

      return {
        x: centerX + rotatedX * radius * perspective,
        y: centerY + rotatedY * radius * perspective,
        z: rotatedZ,
      };
    };

    sphereLines.forEach((line) => {
      const ringRadius = Math.sqrt(1 - line.y * line.y);
      const circumference = 2 * Math.PI * radius * ringRadius;
      const ringText = [...`${line.text} `];
      const baseFontSize = Math.min(16, canvasWidth * 0.03);
      const repeats = Math.max(
        1,
        Math.round(circumference / (baseFontSize * 0.62 * ringText.length)),
      );
      const glyphCount = ringText.length * repeats;
      const fontSize = Math.min(baseFontSize, circumference / (glyphCount * 0.62));
      const longitudeStep = (2 * Math.PI) / glyphCount;
      sphereContext.font = `600 ${fontSize}px ui-monospace, SFMono-Regular, Consolas, monospace`;

      for (let index = 0; index < glyphCount; index += 1) {
        const longitude = -Math.PI / 2 + index * longitudeStep;
        const point = projectPoint(
          ringRadius * Math.sin(longitude),
          line.y,
          ringRadius * Math.cos(longitude),
        );
        const character = ringText[index % ringText.length];
        const depth = (point.z + 1) / 2;

        if (character !== ' ') {
          sphereContext.fillStyle = `rgba(255, 255, 255, ${Math.pow(depth, 5) * 0.95})`;
          sphereContext.fillText(character, point.x, point.y);
        }
      }
    });
  };

  const resizeSphere = () => {
    const bounds = sphereCanvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvasWidth = bounds.width;
    canvasHeight = bounds.height;
    sphereCanvas.width = Math.round(canvasWidth * pixelRatio);
    sphereCanvas.height = Math.round(canvasHeight * pixelRatio);
    sphereContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    drawSphere();
  };

  const animateSphere = (timestamp) => {
    if (lastFrameTime) rotation += Math.min(timestamp - lastFrameTime, 50) * spinSpeed;
    lastFrameTime = timestamp;
    drawSphere();
    window.requestAnimationFrame(animateSphere);
  };

  resizeSphere();
  window.addEventListener('resize', resizeSphere);
  sphereCanvas.addEventListener('pointerenter', () => {
    if (!reducedMotion) spinSpeed = hoverSpinSpeed;
  });
  sphereCanvas.addEventListener('pointerleave', () => {
    if (!reducedMotion) spinSpeed = idleSpinSpeed;
  });
  if (!reducedMotion) {
    window.requestAnimationFrame(animateSphere);
  }
}

const previewButton = document.getElementById('cv-preview-button');
const cvDialog = document.getElementById('cv-dialog');
const cvFrame = document.getElementById('cv-frame');
const closeCvButton = document.getElementById('cv-close-button');

if (previewButton && cvDialog && cvFrame && closeCvButton) {
  const closePreview = () => {
    cvDialog.close();
    cvFrame.removeAttribute('src');
  };

  previewButton.addEventListener('click', () => {
    if (typeof cvDialog.showModal === 'function') {
      cvFrame.src = cvDialog.dataset.pdfUrl;
      cvDialog.showModal();
    } else {
      window.open(cvDialog.dataset.pdfUrl, '_blank', 'noopener,noreferrer');
    }
  });

  closeCvButton.addEventListener('click', closePreview);
  cvDialog.addEventListener('click', (event) => {
    if (event.target === cvDialog) closePreview();
  });
  cvDialog.addEventListener('close', () => cvFrame.removeAttribute('src'));
}

const githubDialog = document.getElementById('github-dialog');
const githubCloseButton = document.getElementById('github-close-button');

if (githubDialog && githubCloseButton) {
  document.querySelectorAll('[data-github-dialog]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      githubDialog.showModal();
    });
  });

  githubCloseButton.addEventListener('click', () => githubDialog.close());
  githubDialog.addEventListener('click', (event) => {
    if (event.target === githubDialog) githubDialog.close();
  });
}

const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotPanel = document.getElementById('chatbot-panel');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotForm = document.getElementById('chatbot-form');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotDataElement = document.getElementById('chatbot-data');

if (
  chatbotToggle &&
  chatbotPanel &&
  chatbotClose &&
  chatbotMessages &&
  chatbotForm &&
  chatbotInput &&
  chatbotDataElement
) {
  const data = JSON.parse(chatbotDataElement.textContent);

  const setChatbotOpen = (isOpen) => {
    chatbotPanel.hidden = !isOpen;
    chatbotToggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) chatbotInput.focus();
  };

  const addMessage = (text, sender) => {
    const message = document.createElement('p');
    message.className = `chat-message chat-message-${sender}`;
    message.textContent = text;
    chatbotMessages.append(message);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  };

  const getResponse = (question) => {
    const query = question.toLowerCase();

    if (/project|built|app|work/.test(query)) {
      return `Projects include ${data.projects.join(', ')}.`;
    }
    if (/skill|tech|stack|language/.test(query)) {
      return `Tools on the site include ${data.skills.join(', ')}.`;
    }
    if (/experience|job|career/.test(query)) {
      return `Experience includes ${data.experience.join('; ')}.`;
    }
    if (/education|degree|study|college/.test(query)) {
      return `Education: ${data.education.join('; ')}.`;
    }
    if (/contact|email|phone|reach|linkedin|github/.test(query)) {
      return `Email: ${data.email}. LinkedIn: ${data.linkedin}. GitHub: ${data.github}.`;
    }

    return 'Ask me about projects, skills, experience, education, or contact details.';
  };

  const askQuestion = (question) => {
    const text = question.trim();
    if (!text) return;
    addMessage(text, 'user');
    addMessage(getResponse(text), 'bot');
  };

  chatbotToggle.addEventListener('click', () => setChatbotOpen(chatbotPanel.hidden));
  chatbotClose.addEventListener('click', () => setChatbotOpen(false));
  chatbotForm.addEventListener('submit', (event) => {
    event.preventDefault();
    askQuestion(chatbotInput.value);
    chatbotInput.value = '';
  });

  document.querySelectorAll('.chatbot-suggestions [data-question]').forEach((button) => {
    button.addEventListener('click', () => askQuestion(button.dataset.question));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !chatbotPanel.hidden) setChatbotOpen(false);
  });
}
