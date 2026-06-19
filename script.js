const LANGUAGE_SETTINGS = {
  ru: { label: 'RU', locale: 'ru-RU', direction: 'ltr' },
  en: { label: 'EN', locale: 'en-US', direction: 'ltr' },
  he: { label: 'HE', locale: 'he-IL', direction: 'rtl' }
};

// Add "he" here after locales/he.json is translated and published.
const ACTIVE_LANGUAGES = ['ru', 'en'];
const translationCache = new Map();
let currentTranslations = {};

const toggleFade = (elements, callback) => {
  elements.forEach(element => element.classList.add('fade'));
  setTimeout(() => {
    callback();
    elements.forEach(element => element.classList.remove('fade'));
  }, 300);
};

const getLanguageFromUrl = () => {
  const segments = window.location.pathname.toLowerCase().split('/').filter(Boolean);
  return ACTIVE_LANGUAGES.find(language => segments.includes(language)) || null;
};

const loadTranslations = async language => {
  if (translationCache.has(language)) {
    return translationCache.get(language);
  }

  const response = await fetch(new URL(`locales/${language}.json`, document.baseURI));
  if (!response.ok) {
    throw new Error(`Unable to load locale: ${language}`);
  }

  const translations = await response.json();
  translationCache.set(language, translations);
  return translations;
};

const updateLanguageButton = language => {
  const currentIndex = ACTIVE_LANGUAGES.indexOf(language);
  const nextLanguage = ACTIVE_LANGUAGES[(currentIndex + 1) % ACTIVE_LANGUAGES.length];
  const button = document.getElementById('lang-toggle');
  button.textContent = LANGUAGE_SETTINGS[nextLanguage].label;
  button.dataset.nextLanguage = nextLanguage;
};

const updateThemeButtonTitle = () => {
  const currentTheme = document.body.getAttribute('data-theme') || 'light';
  const key = currentTheme === 'light' ? 'ui.themeToDark' : 'ui.themeToLight';
  document.getElementById('theme-toggle').title = currentTranslations[key] || '';
};

const updateResumeStatus = language => {
  const status = document.getElementById('resume-status');
  const template = currentTranslations['status.template'];
  if (!status || !template) return;

  const date = new Date().toLocaleDateString(
    LANGUAGE_SETTINGS[language].locale,
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  status.textContent = template.replace('{date}', date);
};

const applyTranslations = (language, translations) => {
  const elements = [...document.querySelectorAll('[data-i18n]')];
  const isInitialLoad = document.documentElement.classList.contains('i18n-loading');

  const render = () => {
    elements.forEach(element => {
      const key = element.dataset.i18n;
      if (Object.prototype.hasOwnProperty.call(translations, key)) {
        element.textContent = translations[key];
      }
    });
  };

  if (isInitialLoad) {
    render();
  } else {
    toggleFade(elements, render);
  }

  const settings = LANGUAGE_SETTINGS[language];
  document.documentElement.lang = language;
  document.documentElement.dir = settings.direction;
  currentTranslations = translations;
  localStorage.setItem('lang', language);
  updateLanguageButton(language);
  updateThemeButtonTitle();
  updateResumeStatus(language);
  document.documentElement.classList.remove('i18n-loading');
};

const setLanguage = async (language, updateUrl = true) => {
  const targetLanguage = ACTIVE_LANGUAGES.includes(language) ? language : 'ru';

  try {
    const translations = await loadTranslations(targetLanguage);
    applyTranslations(targetLanguage, translations);

    if (updateUrl && window.location.protocol !== 'file:') {
      const newUrl = `${window.location.origin}/${targetLanguage}/`;
      if (window.location.href !== newUrl) {
        window.history.replaceState({}, '', newUrl);
      }
    }
  } catch (error) {
    console.error(error);
    document.documentElement.classList.remove('i18n-loading');
  }
};

const setTheme = theme => {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeButtonTitle();
};

document.getElementById('theme-toggle').addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme');
  setTheme(currentTheme === 'light' ? 'dark' : 'light');
});

document.getElementById('lang-toggle').addEventListener('click', event => {
  setLanguage(event.currentTarget.dataset.nextLanguage);
});

document.getElementById('download-pdf').addEventListener('click', () => {
  const element = document.querySelector('main');
  const options = {
    margin: 0.5,
    filename: currentTranslations['pdf.filename'] || 'Resume_Pavel_Traktin.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(options).from(element).save();
});

window.addEventListener('DOMContentLoaded', async () => {
  const savedLanguage = localStorage.getItem('lang');
  const initialLanguage = getLanguageFromUrl()
    || (ACTIVE_LANGUAGES.includes(savedLanguage) ? savedLanguage : 'ru');
  const savedTheme = localStorage.getItem('theme') || 'light';

  setTheme(savedTheme);
  await setLanguage(initialLanguage, false);

  const avatar = document.getElementById('avatar');
  if (avatar) {
    avatar.addEventListener('load', () => avatar.classList.remove('hidden'));
    if (avatar.complete) avatar.classList.remove('hidden');
  }
});
