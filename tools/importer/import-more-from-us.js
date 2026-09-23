/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import columnsCtaParser from './parsers/columns-cta.js';
import tabsBenefitsParser from './parsers/tabs-benefits.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import cardsVideoParser from './parsers/cards-video.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/marutisuzuki-cleanup.js';
import sectionsTransformer from './transformers/marutisuzuki-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'more-from-us',
  description: '',
  urls: [
    'https://www.marutisuzuki.com/more-from-us/maruti-suzuki-rewards',
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.bannerMainContainer .topBannerMain', '.bannerMainContainer'],
    },
    {
      name: 'columns-cta',
      instances: ['.enrollBtns'],
    },
    {
      name: 'tabs-benefits',
      instances: ['.tabbingSec .whtBg', '#myTab'],
    },
    {
      name: 'columns-feature',
      instances: ['.featureVendorMain'],
    },
    {
      name: 'cards-video',
      instances: ['.recentVideoMain .recentVideoSlider'],
    },
  ],
  sections: [
    {
      id: 'rc3', name: 'hero-banner', selector: ['.bannerMainContainer'], style: null, blocks: ['carousel-hero'], defaultContent: [],
    },
    {
      id: 'rc4', name: 'cta-buttons', selector: ['.enrollBtns'], style: 'dark', blocks: ['columns-cta'], defaultContent: [],
    },
    {
      id: 'rc5', name: 'streamlined-heading', selector: ['.rewardSection', '#tabbingSecInner'], style: 'dark', blocks: [], defaultContent: ['.rewardSection'],
    },
    {
      id: 'rc7_rc8', name: 'benefits-tabs', selector: ['.tabbingSec .whtBg'], style: 'highlight', blocks: ['tabs-benefits'], defaultContent: [],
    },
    {
      id: 'rc9', name: 'app-partner-features', selector: ['.featureVendorMain'], style: 'dark', blocks: ['columns-feature'], defaultContent: [],
    },
    {
      id: 'rc10', name: 'latest-videos-heading', selector: ['.recentVideoMain .title'], style: null, blocks: [], defaultContent: ['.recentVideoMain .title'],
    },
    {
      id: 'rc11', name: 'video-cards', selector: ['.recentVideoMain .recentVideoSlider'], style: null, blocks: ['cards-video'], defaultContent: [],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'columns-cta': columnsCtaParser,
  'tabs-benefits': tabsBenefitsParser,
  'columns-feature': columnsFeatureParser,
  'cards-video': cardsVideoParser,
};

// TRANSFORMER REGISTRY - cleanup runs first, section transformer after
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
