// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   console.log(`Change URL: ${tab.url}`);
// });

chrome.bookmarks.getRecent(10, (results) => {
  console.log(`bookmarks:`, results);
});

console.log(`this is background service worker`);


import rules from './rules';

chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: rules.map((rule) => rule.id), // remove existing rules
  addRules: rules
});

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((e) => {
  const msg = `Cookies removed in request to ${e.request.url} on tab ${e.request.tabId}.`;
  console.log(msg);
});

console.log('Service worker started.');


export {};
