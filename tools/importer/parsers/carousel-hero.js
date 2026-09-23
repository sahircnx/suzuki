/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://www.marutisuzuki.com/more-from-us/maruti-suzuki-rewards
 * Generated: 2026-09-23
 *
 * Structure (from library-description.txt): 2-column table. First row = block name.
 * Each subsequent row is one slide: cell 1 = image (mandatory), cell 2 = optional
 * text/CTA. Source slides here are image-only, so cell 2 is empty.
 *
 * Source note: owl-carousel duplicates slides as `.owl-item.cloned` on the live
 * page. Iterate `.owl-item:not(.cloned)` and dedupe by image src so no slide is
 * emitted twice and no clone leaks in.
 */
export default function parse(element, { document }) {
  // Real slides only — skip owl's runtime clones.
  let slides = Array.from(element.querySelectorAll(':scope .owl-item:not(.cloned)'));
  // Fallback: if there are no owl-item wrappers, use the slide image containers.
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll(':scope .slideImg'));
  }

  const cells = [];
  const seenSrc = new Set();

  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    if (!img) return;
    const src = img.getAttribute('src') || '';
    if (src && seenSrc.has(src)) return; // dedupe clones / repeats
    if (src) seenSrc.add(src);

    // Optional text content for this slide (title / description / CTA).
    const textCell = [];
    const heading = slide.querySelector('h1, h2, h3, [class*="title"]');
    if (heading) textCell.push(heading);
    slide.querySelectorAll('p').forEach((p) => {
      if (p.textContent.trim()) textCell.push(p);
    });
    slide.querySelectorAll('a').forEach((a) => textCell.push(a));

    cells.push([img, textCell.length ? textCell : '']);
  });

  // Empty-block guard: no usable slides.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
