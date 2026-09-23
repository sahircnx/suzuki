/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-cta. Base: columns.
 * Source: https://www.marutisuzuki.com/more-from-us/maruti-suzuki-rewards
 * Generated: 2026-09-23
 *
 * Structure (from library-description.txt): columns block — first row is the
 * block name, the second row holds one cell per column. Source is a <ul> of CTA
 * links (each <li> = one action button with an icon + label). Each list item
 * becomes its own column in a single content row.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > ul > li'));
  // Fallback: links directly if the list wrapper is absent.
  const links = items.length
    ? items.map((li) => li.querySelector('a') || li)
    : Array.from(element.querySelectorAll(':scope a'));

  // Empty-block guard.
  if (!links.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Single content row: one cell per CTA column.
  cells.push(links);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}
