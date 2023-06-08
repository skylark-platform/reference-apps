// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   console.log(`Change URL: ${tab.url}`);
// });

const convertHeadersToRules = (
  headers: Record<string, string>
): chrome.declarativeNetRequest.Rule[] | undefined => {
  const allResourceTypes = Object.values(
    chrome.declarativeNetRequest.ResourceType
  );

  const headerEntries = Object.entries(headers);

  if (headerEntries.length === 0) {
    return undefined;
  }

  const requestHeaders: chrome.declarativeNetRequest.ModifyHeaderInfo[] =
    Object.entries(headers).map(([header, value]) => ({
      operation: chrome.declarativeNetRequest.HeaderOperation.SET,
      header,
      value,
    }));

  const rules: chrome.declarativeNetRequest.Rule[] = [
    {
      id: 1,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
        requestHeaders,
      },
      condition: {
        urlFilter: "skylarkplatform*/graphql",
        resourceTypes: allResourceTypes,
      },
    },
  ];

  return rules;
};

chrome.bookmarks.getRecent(10, (results) => {
  console.log(`bookmarks:`, results);
});

console.log(`this is background service worker`);

// chrome.tabs.onCreated.addListener((tab) => {
//   // wait for contenscript to load
//   chrome.runtime.onMessage.addListener((isLoaded, sender, sendResponse) => {
//     console.log({ isLoaded, sender });
//     if (isLoaded) {
//       (async () => {
//         const response = await chrome.tabs.sendMessage(tab.id, "test");
//         console.log(response);
//       })();
//     }
//   });
// });

// chrome.declarativeNetRequest.updateDynamicRules({
//   removeRuleIds: rules.map((rule) => rule.id), // remove existing rules
//   addRules: rules,
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("message received", message);

  if (message.type === "headers") {
    const rules = convertHeadersToRules(
      message.value as Record<string, string>
    );

    chrome.declarativeNetRequest
      .getDynamicRules()
      .then((oldRules) => {
        console.log("rules", { rules, oldRules });

        void chrome.declarativeNetRequest
          .updateDynamicRules({
            removeRuleIds: oldRules.map((rule) => rule.id), // remove existing rules
            addRules: rules,
          })
          .then(sendResponse);
      })
      .catch((err) => console.log("active rules err", err));
    return true;
  }
});

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((e) => {
  const msg = `Cookies removed in request to ${e.request.url} on tab ${e.request.tabId}.`;
  console.log(msg);
});

console.log("Service worker started.");

export {};
