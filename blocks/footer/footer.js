import { decorateIcons } from '../../scripts/aem.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer fragment — metadata-independent dual-fetch:
  // /content first (localhost / aem up), then root (DA/EDS production)
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return;
  const html = await resp.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;
  decorateIcons(fragment);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-content';
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // label the top-level sections for styling
  const sections = [...footer.children];
  const names = ['footer-reach', 'footer-columns', 'footer-contact', 'footer-disclaimer', 'footer-legal'];
  sections.forEach((section, i) => {
    if (names[i]) section.classList.add(names[i]);
  });

  block.append(footer);
}
