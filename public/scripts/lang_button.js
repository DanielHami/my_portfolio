// ...existing code...
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
  if (!langDropdown || !langTrigger) return;
  langDropdown.classList.remove('hidden');
  langTrigger.setAttribute('aria-expanded', 'true');
}

function hideDropdown() {
  if (!langDropdown || !langTrigger) return;
  langDropdown.classList.add('hidden');
  langTrigger.setAttribute('aria-expanded', 'false');
}

// applyLang updates local state and DOM but does NOT navigate
function applyLang(code) {
  if (!code) return;
  localStorage.setItem('ui:lang', code);
  document.documentElement.lang = code;
  const selectedLang = LANGS.find(lang => lang.code === code);
  if (selectedLang && langLabel) {
    langLabel.textContent = selectedLang.badge;
  }
}

// setLang will apply and then navigate (used by user action)
function setLang(code) {
  applyLang(code);
  // navigate only on explicit user selection
  window.location.href = `/${code}#`;
}

function renderList(selected) {
  if (!langList) return;
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

  // Safe guards: if required DOM elements are missing, do nothing
  if (!langTrigger || !langList || !langSwitcher || !langLabel) {
    // still render list if possible using saved value
    const saved = localStorage.getItem('ui:lang') || 'en';
    if (langList) renderList(saved);
    return;
  }

  // Apply saved language without navigating (prevents refresh loop)
  const savedLang = localStorage.getItem('ui:lang') || 'en';
  applyLang(savedLang);
  renderList(savedLang);

  langTrigger.addEventListener('click', () => {
    const expanded = langTrigger.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      hideDropdown();
    } else {
      renderList(document.documentElement.lang || savedLang);
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
 // ...existing code...