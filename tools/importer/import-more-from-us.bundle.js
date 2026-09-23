/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-more-from-us.js
  var import_more_from_us_exports = {};
  __export(import_more_from_us_exports, {
    default: () => import_more_from_us_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document: document2 }) {
    let slides = Array.from(element.querySelectorAll(":scope .owl-item:not(.cloned)"));
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll(":scope .slideImg"));
    }
    const cells = [];
    const seenSrc = /* @__PURE__ */ new Set();
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (!img) return;
      const src = img.getAttribute("src") || "";
      if (src && seenSrc.has(src)) return;
      if (src) seenSrc.add(src);
      const textCell = [];
      const heading = slide.querySelector('h1, h2, h3, [class*="title"]');
      if (heading) textCell.push(heading);
      slide.querySelectorAll("p").forEach((p) => {
        if (p.textContent.trim()) textCell.push(p);
      });
      slide.querySelectorAll("a").forEach((a) => textCell.push(a));
      cells.push([img, textCell.length ? textCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse2(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(":scope > ul > li"));
    const links = items.length ? items.map((li) => li.querySelector("a") || li) : Array.from(element.querySelectorAll(":scope a"));
    if (!links.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push(links);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-benefits.js
  function parse3(element, { document: document2 }) {
    const inner = element.matches(".tabbingSecInner") ? element : element.closest(".tabbingSecInner") || element.querySelector(".tabbingSecInner") || element.closest(".tabbingSec") || element;
    if (inner && inner.getAttribute("data-tabs-benefits-done")) {
      if (element !== inner && element.parentElement) element.remove();
      return;
    }
    const nav = inner && (inner.querySelector(":scope > ul.nav-tabs") || inner.querySelector("ul.nav-tabs")) || null;
    const content = inner && (inner.querySelector(":scope > .tab-content") || inner.querySelector(".tab-content")) || null;
    const cells = [];
    if (nav && content) {
      Array.from(nav.querySelectorAll(":scope > li > a")).forEach((link) => {
        const label = link.textContent.trim();
        const targetId = (link.getAttribute("href") || "").replace(/^#/, "");
        let pane = null;
        if (targetId) {
          pane = content.querySelector(`:scope > [id="${targetId}"]`) || content.querySelector(`[id="${targetId}"]`);
        }
        if (!label && !pane) return;
        cells.push([label || "", pane ? pane.cloneNode(true) : ""]);
      });
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    if (inner) inner.setAttribute("data-tabs-benefits-done", "1");
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-benefits", cells });
    element.replaceWith(block);
    if (nav && nav !== element && nav.parentElement) nav.remove();
    if (content && content !== element && content.parentElement) content.remove();
  }

  // tools/importer/parsers/columns-feature.js
  function parse4(element, { document: document2 }) {
    let columns = Array.from(element.querySelectorAll(":scope .container .row > .col-md-6"));
    if (columns.length < 2) {
      columns = Array.from(element.querySelectorAll(":scope .container .row > div"));
    }
    if (columns.length < 2) {
      const featured = element.querySelector(".featureLoadedSec");
      const vendor = element.querySelector(".vendorBenefitSec");
      columns = [featured, vendor].filter(Boolean);
    }
    const cells = columns.map((col) => {
      const clone = col.cloneNode(true);
      clone.querySelectorAll(".owl-nav, .owl-dots, .owl-item.cloned, style, script").forEach((n) => n.remove());
      return clone;
    }).filter((c) => c && c.textContent.trim());
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-feature", cells: [cells] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-video.js
  function parse5(element, { document: document2 }) {
    let items = Array.from(element.querySelectorAll(":scope .owl-item:not(.cloned) .item"));
    if (!items.length) {
      items = Array.from(element.querySelectorAll(":scope .item"));
    }
    const cells = [];
    const seen = /* @__PURE__ */ new Set();
    items.forEach((item) => {
      const videoLink = item.querySelector('a.various, a[href*="youtube"], a[href*="youtu.be"], a[class*="fancybox"]');
      const href = videoLink ? videoLink.getAttribute("href") || "" : "";
      const img = item.querySelector(".image img, img");
      if (!img && !videoLink) return;
      const key = href || img && img.getAttribute("src") || "";
      if (key && seen.has(key)) return;
      if (key) seen.add(key);
      let imageCell;
      if (videoLink && href && href !== "#" && img) {
        const a = document2.createElement("a");
        a.setAttribute("href", href);
        a.append(img);
        imageCell = a;
      } else {
        imageCell = img || "";
      }
      const textCell = [];
      const heading = item.querySelector('.text h1, .text h2, .text h3, .text h4, h4, [class*="title"]');
      if (heading) textCell.push(heading);
      item.querySelectorAll(".text p, p").forEach((p) => {
        if (p.textContent.trim()) textCell.push(p);
      });
      if (href && href !== "#") {
        const cta = document2.createElement("a");
        cta.setAttribute("href", href);
        cta.textContent = "Watch video";
        textCell.push(cta);
      }
      cells.push([imageCell, textCell.length ? textCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/marutisuzuki-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "section.floating-component",
        // line 769: floating assistance + request-a-quote / price-list popups
        ".popupBg",
        // line 1148: modal backdrop
        "#captchaModal",
        // line 1152: captcha verification modal
        ".captcha-modal",
        // line 1178: captcha modal (second step)
        ".disclaimermodal",
        // line 744: disclaimer modal
        ".footerdisclaimermodal",
        // line 2426: footer disclaimer modal
        "#defaultModal",
        // line 2519: image-preview modal
        ".booktestpopup",
        // line 802: book-test-drive / enquiry form popup
        ".overlayContent"
        // lines 634 & 977: login box / price-list overlays
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        // line 15: global site header (contains nav.primaryNav)
        "footer",
        // line 2349: global site footer
        ".footer-component",
        // line 2348: footer wrapper
        ".mobile-header",
        // line 593: mobile header
        ".utilityWrapper",
        // line 611: utility navigation wrapper
        ".switch",
        // line 758: language (HIN/ENG) toggle
        "#Arena_Common_Loader",
        // line 12: page loader
        ".backToTop",
        // lines 6 & 2514: back-to-top control
        ".androidAppleSec",
        // line 1204: global app-download promo (precedes page content)
        ".midSizeCircle",
        // line 1223: decorative empty element
        "#_AntiForgeToken",
        // line 3: anti-forgery hidden input
        "link",
        // lines 2550-2555: stylesheet links
        "iframe",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("onload");
        el.removeAttribute("data-track");
      });
      element.querySelectorAll('img[src*="doubleclick"], img[src*="treasuredata"]').forEach((img) => img.remove());
    }
  }

  // tools/importer/transformers/marutisuzuki-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-more-from-us.js
  var PAGE_TEMPLATE = {
    name: "more-from-us",
    description: "",
    urls: [
      "https://www.marutisuzuki.com/more-from-us/maruti-suzuki-rewards"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".bannerMainContainer .topBannerMain", ".bannerMainContainer"]
      },
      {
        name: "columns-cta",
        instances: [".enrollBtns"]
      },
      {
        name: "tabs-benefits",
        instances: [".tabbingSec .whtBg", "#myTab"]
      },
      {
        name: "columns-feature",
        instances: [".featureVendorMain"]
      },
      {
        name: "cards-video",
        instances: [".recentVideoMain .recentVideoSlider"]
      }
    ],
    sections: [
      {
        id: "rc3",
        name: "hero-banner",
        selector: [".bannerMainContainer"],
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "rc4",
        name: "cta-buttons",
        selector: [".enrollBtns"],
        style: "dark",
        blocks: ["columns-cta"],
        defaultContent: []
      },
      {
        id: "rc5",
        name: "streamlined-heading",
        selector: [".rewardSection", "#tabbingSecInner"],
        style: "dark",
        blocks: [],
        defaultContent: [".rewardSection"]
      },
      {
        id: "rc7_rc8",
        name: "benefits-tabs",
        selector: [".tabbingSec .whtBg"],
        style: "highlight",
        blocks: ["tabs-benefits"],
        defaultContent: []
      },
      {
        id: "rc9",
        name: "app-partner-features",
        selector: [".featureVendorMain"],
        style: "dark",
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "rc10",
        name: "latest-videos-heading",
        selector: [".recentVideoMain .title"],
        style: null,
        blocks: [],
        defaultContent: [".recentVideoMain .title"]
      },
      {
        id: "rc11",
        name: "video-cards",
        selector: [".recentVideoMain .recentVideoSlider"],
        style: null,
        blocks: ["cards-video"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    "carousel-hero": parse,
    "columns-cta": parse2,
    "tabs-benefits": parse3,
    "columns-feature": parse4,
    "cards-video": parse5
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_more_from_us_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_more_from_us_exports);
})();
