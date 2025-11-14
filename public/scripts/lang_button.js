// DOM references
const langSwitcher = document.getElementById('lang-switcher');
const langTrigger = document.getElementById('lang-trigger');
const langLabel = document.getElementById('lang-label');
const langDropdown = document.getElementById('lang-dropdown');
const langList = document.getElementById('lang-list');

const LANGS = [
  { code: 'en', label: 'English', badge: 'EN' },
  { code: 'hu', label: 'Magyar', badge: 'HU' },
];

// Util functions
function showDropdown() {
  langDropdown.classList.remove('hidden');
  langTrigger.setAttribute('aria-expanded', 'true');
}

function hideDropdown() {
  langDropdown.classList.add('hidden');
  langTrigger.setAttribute('aria-expanded', 'false');
}

function setLang(code) {
  // Update the language in localStorage first
  localStorage.setItem('ui:lang', code);
  
  // Update the language label
  const selectedLang = LANGS.find(lang => lang.code === code);
  if (selectedLang && langLabel) {
    langLabel.textContent = selectedLang.badge;
  }
  
  // Navigate to the new URL with hash
  window.location.href = `/${code}#`;
}

function renderList(selected) {
  langList.innerHTML = '';
  LANGS.forEach(lang => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'flex w-full items-center gap-2 px-3 py-2 rounded text-sm hover:bg-neutral-800 text-neutral-200';
    btn.textContent = `${lang.label} (${lang.badge})`;
    if (lang.code === selected) btn.classList.add('bg-neutral-800');
    btn.addEventListener('click', () => {
      setLang(lang.code);
      hideDropdown();
    });
    langList.appendChild(btn);
  });
}

// Initial setup on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  const savedLang = localStorage.getItem('ui:lang') || 'en';
  setLang(savedLang);
  renderList(savedLang);

  langTrigger.addEventListener('click', () => {
    const expanded = langTrigger.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      hideDropdown();
    } else {
      renderList(document.documentElement.lang);
      showDropdown();
    }
    if (window.lucide) window.lucide.createIcons();
  });

  document.addEventListener('mousedown', e => {
    if (!langSwitcher.contains(e.target)) {
      hideDropdown();
    }
  });
});
