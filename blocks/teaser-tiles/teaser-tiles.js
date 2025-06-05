import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    let tileHref = null;

    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div, i) => {
      if (i === 0 && div.querySelector('picture')) div.className = 'teaser-tile-image';
      if (i === 1) div.className = 'teaser-tile-pretitle';
      if (i === 2) div.className = 'teaser-tile-title';
      if (i === 3) {
        const anchor = div.querySelector('a[href]');
        if (anchor) {
          tileHref = anchor.getAttribute('href');
          div.remove(); // Remove the link container
        }
      }
    });

    // If a link was found, wrap the li's content with an anchor
    if (tileHref) {
      const a = document.createElement('a');
      a.href = tileHref;
      // Move all children of li into the anchor
      while (li.firstChild) {
        a.appendChild(li.firstChild);
      }
      li.appendChild(a);
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img
    .closest('picture')
    .replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    ));
  block.textContent = '';
  block.append(ul);
}
