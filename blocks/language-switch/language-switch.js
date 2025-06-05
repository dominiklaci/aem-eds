export default function decorate(block) {
  // Define supported languages as an array of objects
  const LANGUAGES = [
    { code: 'en', label: 'en' },
    { code: 'de', label: 'de' },
    // Add more languages here as needed
  ];

  // Detect current language from the path
  const path = window.location.pathname;
  let selectedIdx = LANGUAGES.findIndex((lang) => path.match(new RegExp(`^/${lang.code}(/|$)`)));
  if (selectedIdx === -1) selectedIdx = 0; // Default to first language

  // Create the toggle container
  const toggle = document.createElement('div');
  toggle.className = 'language-toggle';

  // Create language buttons and separators using for...of
  let idx = 0;
  for (const lang of LANGUAGES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = lang.label;
    btn.className = `lang-btn lang-${lang.code}`;
    if (idx === selectedIdx) btn.classList.add('selected');
    btn.addEventListener('click', () => {
      // If already on the selected locale, do nothing
      if (idx === selectedIdx) return;

      let newPath = path;
      // Remove any existing locale prefix
      for (const l of LANGUAGES) {
        newPath = newPath.replace(new RegExp(`^/${l.code}(/|$)`), '/');
      }

      // If English is selected and no locale is present in the path, do nothing
      if (idx === 0 && selectedIdx === 0 && !path.match(/^\/[a-z]{2}(\/|$)/)) return;

      // If English is selected, just go to the path without locale
      if (idx === 0) {
        window.location.pathname = newPath.replace(/\/{2,}/g, '/');
        return;
      }
      // For other languages, add the locale prefix
      newPath = `/${lang.code}${newPath}`;
      // Remove double slashes
      newPath = newPath.replace(/\/{2,}/g, '/');
      window.location.pathname = newPath;
    });
    toggle.append(btn);

    // Add separator except after last button
    if (idx < LANGUAGES.length - 1) {
      const sep = document.createElement('span');
      sep.textContent = ' | ';
      sep.className = 'lang-separator';
      toggle.append(sep);
    }
    idx++;
  }

  // Clear block and add toggle
  block.innerHTML = '';
  block.append(toggle);
}
