/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-benefits. Base: tabs.
 * Source: https://www.marutisuzuki.com/more-from-us/maruti-suzuki-rewards
 * Generated: 2026-09-23
 *
 * Structure (from library-description.txt): 2-column table. First row = block
 * name. Each subsequent row = one tab: cell 1 = tab label, cell 2 = tab content.
 *
 * Source is a Bootstrap tab set inside a single `.tabbingSecInner`:
 *   ul.nav.nav-tabs#myTab > li.nav-item > a[href="#program"]   (OUTER nav)
 *   .tab-content#myTabContent > .tab-pane[id="program"] ...     (OUTER panes)
 * The panes themselves contain further nested tab sets (Tier / Earn / Redeem),
 * which also carry `id="myTab"` — so `#myTab` is a duplicated id that matches 4
 * navs. Iteration is therefore keyed strictly on the OUTER nav (the first
 * `ul.nav-tabs` under `.tabbingSecInner`) via direct-child `li > a`, never a
 * blanket `.nav-item` query, so the nested tab sets stay inside their pane's
 * content cell rather than becoming separate rows.
 *
 * The mapped instance selectors are `.tabbingSec .whtBg` (an empty marker div,
 * the section entry point the real import uses) and `#myTab`. We normalise to the
 * shared `.tabbingSecInner` from whichever matched, build the block, and consume
 * the source nav + tab-content so nothing leaks as stray default content. An
 * idempotency guard makes repeat invocations (the duplicated `#myTab` matches)
 * safe — only the first builds the block.
 */
export default function parse(element, { document }) {
  const inner = element.matches('.tabbingSecInner')
    ? element
    : (element.closest('.tabbingSecInner')
      || element.querySelector('.tabbingSecInner')
      || element.closest('.tabbingSec')
      || element);

  // Idempotency: the block for this tab container is built once. Later matches
  // (the duplicated `#myTab` navs) just remove themselves so they don't leak.
  if (inner && inner.getAttribute('data-tabs-benefits-done')) {
    if (element !== inner && element.parentElement) element.remove();
    return;
  }

  // OUTER nav + OUTER content region (the first ones under the container).
  const nav = (inner && (inner.querySelector(':scope > ul.nav-tabs') || inner.querySelector('ul.nav-tabs'))) || null;
  const content = (inner && (inner.querySelector(':scope > .tab-content') || inner.querySelector('.tab-content'))) || null;

  const cells = [];
  if (nav && content) {
    // Direct-child nav items only — excludes nested tab sets inside the panes.
    Array.from(nav.querySelectorAll(':scope > li > a')).forEach((link) => {
      const label = link.textContent.trim();
      const targetId = (link.getAttribute('href') || '').replace(/^#/, '');
      let pane = null;
      if (targetId) {
        pane = content.querySelector(`:scope > [id="${targetId}"]`)
          || content.querySelector(`[id="${targetId}"]`);
      }
      if (!label && !pane) return;
      // Clone the pane so consuming the source subtree below cannot empty it.
      cells.push([label || '', pane ? pane.cloneNode(true) : '']);
    });
  }

  // Empty-block guard: nothing resolved.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  if (inner) inner.setAttribute('data-tabs-benefits-done', '1');

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-benefits', cells });
  // Replace the matched element so the created block is added to that element's
  // parent (required for the validator's block-capture and for the import).
  element.replaceWith(block);

  // Consume the original source structure so it does not survive as stray
  // default content next to the block. The block holds cloned copies already.
  if (nav && nav !== element && nav.parentElement) nav.remove();
  if (content && content !== element && content.parentElement) content.remove();
}
