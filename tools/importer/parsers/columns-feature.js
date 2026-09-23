/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base: columns.
 * Source: https://www.marutisuzuki.com/more-from-us/maruti-suzuki-rewards
 * Generated: 2026-09-23
 *
 * Structure (from library-description.txt): columns block — first row is the
 * block name, the second row holds one cell per column, sized to the visual
 * grouping. Source is a Bootstrap `.container > .row` with two `.col-md-6`
 * columns:
 *   Left  (.featureLoadedSec): h2 + intro <p> + an owl-carousel of 3 feature
 *          slides (icon img, h3, benefit <ul>, CTA link).
 *   Right (.vendorBenefitSec): a title + an owl-carousel of 3 badge slides
 *          (image, optional CTA link, description <p>).
 * → one content row, two cells (left column, right column).
 *
 * Source note: both carousels are owl-carousel instances. On the live page owl
 * injects `.owl-item.cloned` duplicates plus `.owl-nav` / `.owl-dots` button
 * chrome. Each column is cloned and those clone/nav/dots nodes are stripped so no
 * slide is duplicated and no arrow/dot buttons leak into the content.
 */
export default function parse(element, { document }) {
  let columns = Array.from(element.querySelectorAll(':scope .container .row > .col-md-6'));
  // Fallbacks if the Bootstrap grid classes vary.
  if (columns.length < 2) {
    columns = Array.from(element.querySelectorAll(':scope .container .row > div'));
  }
  if (columns.length < 2) {
    const featured = element.querySelector('.featureLoadedSec');
    const vendor = element.querySelector('.vendorBenefitSec');
    columns = [featured, vendor].filter(Boolean);
  }

  const cells = columns.map((col) => {
    const clone = col.cloneNode(true);
    // Drop owl runtime chrome and cloned slides so nothing duplicates.
    clone.querySelectorAll('.owl-nav, .owl-dots, .owl-item.cloned, style, script').forEach((n) => n.remove());
    return clone;
  }).filter((c) => c && c.textContent.trim());

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single content row, one cell per column.
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells: [cells] });
  element.replaceWith(block);
}
