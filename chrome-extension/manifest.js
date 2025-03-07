import fs from 'node:fs';
import deepmerge from 'deepmerge';

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

const isFirefox = process.env.__FIREFOX__ === 'true';

/**
 * If you want to disable the sidePanel, you can delete withSidePanel function and remove the sidePanel HoC on the manifest declaration.
 *
 * ```js
 * const manifest = { // remove `withSidePanel()`
 * ```
 */
function withSidePanel(manifest) {
  // Firefox does not support sidePanel
  if (isFirefox) {
    return manifest;
  }
  return deepmerge(manifest, {
    side_panel: {
      default_path: 'side-panel/index.html',
    },
    permissions: ['sidePanel'],
  });
}

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = withSidePanel({
  manifest_version: 3,
  default_locale: 'en',
  /**
   * if you want to support multiple languages, you can use the following reference
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
   */
  name: '__MSG_extensionName__',
  version: packageJson.version,
  description: '__MSG_extensionDescription__',
  host_permissions: ['<all_urls>'],
  permissions: ['storage', 'scripting', 'tabs', 'notifications'],
  options_page: 'options/index.html',
  background: {
    service_worker: 'background.iife.js',
    type: 'module',
  },
  action: {
    default_popup: 'popup/index.html',
    default_icon: 'logo_32_lc.png',
  },
  
  icons: {
    128: 'logo_32_lc.png',
  },
  content_scripts: [
    {
      matches: ['http://*.leetcode.com/*', 'https://*.leetcode.com/*', 'https://*.geeksforgeeks.org/*', 'http://*.geeksforgeeks.org/*', 'https://*.codechef.com/*', 'http://*.codechef.com/*', 'https://*.codeforces.com/*', 'http://*.codeforces.com/*'],
      js: ['content/index.iife.js'],
    },
    {
      matches: ['http://*.leetcode.com/*', 'https://*.leetcode.com/*', 'https://*.geeksforgeeks.org/*', 'http://*.geeksforgeeks.org/*', 'https://*.codechef.com/*', 'http://*.codechef.com/*', 'https://*.codeforces.com/*', 'http://*.codeforces.com/*'],
      js: ['content-ui/index.iife.js'],
    },
    {
      matches: ['http://*.leetcode.com/*', 'https://*.leetcode.com/*', 'https://*.geeksforgeeks.org/*', 'http://*.geeksforgeeks.org/*', 'https://*.codechef.com/*', 'http://*.codechef.com/*', 'https://*.codeforces.com/*', 'http://*.codeforces.com/*'],
      css: ['content.css'], // public folder
    },
  ],
  devtools_page: 'devtools/index.html',
  web_accessible_resources: [
    {
      resources: ['*.js', '*.css', '*.svg', 'icon-128.png', 'icon-34.png'],
      matches: ['*://*/*'],
    },
  ],
});

export default manifest;
