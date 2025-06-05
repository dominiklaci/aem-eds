export default function decorate(block) {
  // Detect locale from URL
  const path = window.location.pathname;
  let locale = '';
  if (path.startsWith('/en/')) locale = '/en';
  else if (path.startsWith('/de/')) locale = '/de';

  // Create back button
  const back = document.createElement('a');
  back.className = 'back-button';
  back.href = locale || '/'; // fallback to root if no locale
  back.textContent = 'Back';

  // Insert at the top of the block
  block.innerHTML = '';
  block.append(back);
}
