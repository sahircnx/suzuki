/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: marutisuzuki site-wide cleanup.
 * Removes non-authorable site chrome (header, nav, footer, global promos,
 * modals/overlays, loaders, tracking) so the import contains only
 * page-level authorable content.
 *
 * All selectors verified by reading migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Modals / overlays / popups (forms, captcha, disclaimers) — verified in cleaned.html.
    // Removed early so their form fields never interfere with block parsing.
    WebImporter.DOMUtils.remove(element, [
      'section.floating-component',   // line 769: floating assistance + request-a-quote / price-list popups
      '.popupBg',                     // line 1148: modal backdrop
      '#captchaModal',                // line 1152: captcha verification modal
      '.captcha-modal',               // line 1178: captcha modal (second step)
      '.disclaimermodal',             // line 744: disclaimer modal
      '.footerdisclaimermodal',       // line 2426: footer disclaimer modal
      '#defaultModal',                // line 2519: image-preview modal
      '.booktestpopup',               // line 802: book-test-drive / enquiry form popup
      '.overlayContent',              // lines 634 & 977: login box / price-list overlays
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Site chrome and global (non-page) sections — verified in cleaned.html.
    WebImporter.DOMUtils.remove(element, [
      'header',                       // line 15: global site header (contains nav.primaryNav)
      'footer',                       // line 2349: global site footer
      '.footer-component',            // line 2348: footer wrapper
      '.mobile-header',               // line 593: mobile header
      '.utilityWrapper',              // line 611: utility navigation wrapper
      '.switch',                      // line 758: language (HIN/ENG) toggle
      '#Arena_Common_Loader',         // line 12: page loader
      '.backToTop',                   // lines 6 & 2514: back-to-top control
      '.androidAppleSec',             // line 1204: global app-download promo (precedes page content)
      '.midSizeCircle',               // line 1223: decorative empty element
      '#_AntiForgeToken',             // line 3: anti-forgery hidden input
      'link',                         // lines 2550-2555: stylesheet links
      'iframe',
      'noscript',
    ]);

    // Strip inline event/tracking attributes wherever present.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('onload');
      el.removeAttribute('data-track');
    });

    // Remove tracking pixels (doubleclick / treasuredata) — verified line 2556.
    element.querySelectorAll('img[src*="doubleclick"], img[src*="treasuredata"]').forEach((img) => img.remove());
  }
}
