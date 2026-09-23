/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-video. Base: cards.
 * Source: https://www.marutisuzuki.com/more-from-us/maruti-suzuki-rewards
 * Generated: 2026-09-23
 *
 * Structure (from library-description.txt): Cards block — 2 columns, first row =
 * block name, each subsequent row = one card: cell 1 = image (mandatory), cell 2
 * = text (title + description + optional CTA).
 *
 * Source is an owl-carousel of video cards. Each card:
 *   .item > .slide
 *     .image > a.various.fancybox.iframe[href=<youtube embed url>] > img  (thumb + video link)
 *     .text  > h4 (title) + p (description)
 * The `.item` also contains empty `<a href="#">` placeholders (owl/fancybox
 * hooks) — these are siblings, not nesting, but carry no content and are skipped.
 *
 * Iteration is keyed on the `.item` block-level wrapper (iterationSafe per
 * structure.json), NOT on the anchors. On the live page owl injects
 * `.owl-item.cloned` duplicates, so cards are de-duplicated by their video href.
 * The card image is emitted inside its video anchor so the YouTube link is
 * preserved, and the same link is repeated as a "Watch video" CTA in the text
 * cell.
 */
export default function parse(element, { document }) {
  // Real cards only — exclude owl's cloned slides; key on the inner block wrapper.
  let items = Array.from(element.querySelectorAll(':scope .owl-item:not(.cloned) .item'));
  if (!items.length) {
    items = Array.from(element.querySelectorAll(':scope .item'));
  }

  const cells = [];
  const seen = new Set();

  items.forEach((item) => {
    // The video link carrying the real (youtube) href — not the empty '#' hooks.
    const videoLink = item.querySelector('a.various, a[href*="youtube"], a[href*="youtu.be"], a[class*="fancybox"]');
    const href = videoLink ? (videoLink.getAttribute('href') || '') : '';
    const img = item.querySelector('.image img, img');
    if (!img && !videoLink) return;

    // Dedupe clones by video href (fall back to image src when no href).
    const key = href || (img && img.getAttribute('src')) || '';
    if (key && seen.has(key)) return;
    if (key) seen.add(key);

    // Cell 1 (image): keep the image inside its video anchor so the link survives.
    let imageCell;
    if (videoLink && href && href !== '#' && img) {
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.append(img);
      imageCell = a;
    } else {
      imageCell = img || '';
    }

    // Cell 2 (text): title + description + optional video CTA.
    const textCell = [];
    const heading = item.querySelector('.text h1, .text h2, .text h3, .text h4, h4, [class*="title"]');
    if (heading) textCell.push(heading);
    item.querySelectorAll('.text p, p').forEach((p) => {
      if (p.textContent.trim()) textCell.push(p);
    });
    if (href && href !== '#') {
      const cta = document.createElement('a');
      cta.setAttribute('href', href);
      cta.textContent = 'Watch video';
      textCell.push(cta);
    }

    cells.push([imageCell, textCell.length ? textCell : '']);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-video', cells });
  element.replaceWith(block);
}
