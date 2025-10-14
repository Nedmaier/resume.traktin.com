// === fade анимация ===
const toggleFade = (elements, callback) => {
  elements.forEach(el => el.classList.add('fade'));
  setTimeout(() => {
    callback();
    elements.forEach(el => el.classList.remove('fade'));
  }, 500);
};

// === переключение языка ====
const setLanguage = (lang) => {
  const all = document.querySelectorAll('[data-ru]');
  toggleFade(all, () => {
    document.documentElement.lang = lang;
    all.forEach(el => {
      el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-ru');
    });
    document.getElementById('lang-toggle').textContent = lang === 'en' ? 'RU' : 'EN';
    localStorage.setItem('lang', lang);
    updateThemeButtonTitle();
    updateResumeStatus();
  });
};

// === переключение темы ===
const setTheme = (theme) => {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeButtonTitle();
};

// === заголовок у переключателя темы ===
const updateThemeButtonTitle = () => {
  const lang = document.documentElement.lang || 'ru';
  const currentTheme = document.body.getAttribute('data-theme') || 'light';
  const button = document.getElementById('theme-toggle');

  if (currentTheme === 'light') {
    button.title = lang === 'en' ? 'Switch to dark theme' : 'Переключить на тёмную тему';
  } else {
    button.title = lang === 'en' ? 'Switch to light theme' : 'Переключить на светлую тему';
  }
};

// === резюме статус ===
function updateResumeStatus() {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  const ruText = `Резюме актуально на ${now.toLocaleDateString("ru-RU", options)}. Заинтересован в полной или частичной занятости. Формат работы: удаленно.`;
  const enText = `Resume is up-to-date as of ${now.toLocaleDateString("en-US", options)}. Open to full-time opportunities. Remote work preferred.`;

  const statusEl = document.getElementById('resume-status');
  if (!statusEl) return;
  const lang = document.documentElement.lang;
  statusEl.textContent = lang === 'en' ? enText : ruText;
}

// === обработчики ===
document.getElementById('theme-toggle').addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
});

document.getElementById('lang-toggle').addEventListener('click', () => {
  const isRU = document.documentElement.lang === 'ru';
  setLanguage(isRU ? 'en' : 'ru');
});

document.getElementById('download-pdf').addEventListener('click', () => {
  const element = document.querySelector('main');
  const opt = {
    margin: 0.5,
    filename: 'Resume_Pavel_Traktin.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
});

// === при загрузке страницы ===
window.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang');
  const savedTheme = localStorage.getItem('theme') || 'light';

  const path = window.location.pathname.toLowerCase();
  if (path.includes('/en')) {
    setLanguage('en');
  } else if (path.includes('/ru')) {
    setLanguage('ru');
  } else if (savedLang) {
    setLanguage(savedLang);
  } else {
    setLanguage('ru'); // дефолт
  }

  setTheme(savedTheme);

  // статус инициализация
  updateResumeStatus();

  // аватар плавное появление
  const avatar = document.getElementById('avatar');
  if (avatar) {
    avatar.addEventListener('load', () => avatar.classList.remove('hidden'));
    if (avatar.complete) avatar.classList.remove('hidden');
  }
});
