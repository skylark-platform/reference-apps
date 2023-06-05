const allResourceTypes = Object.values(chrome.declarativeNetRequest.ResourceType);
console.log({ allResourceTypes})

// {
//   "x-sl-dimension-customer-types": "premium",
//   "x-sl-dimension-device-types": "pc"
// }

const rules: chrome.declarativeNetRequest.Rule[] = [
  {
    id: 1,
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
      requestHeaders: [
        {
          operation: chrome.declarativeNetRequest.HeaderOperation.SET,
          header:"x-sl-dimension-customer-types",
          value: 'standard',
        },
        {
          operation: chrome.declarativeNetRequest.HeaderOperation.SET,
          header:"x-sl-dimension-device-types",
          value: 'pc',
        },
      ]
    },
    condition: {
      urlFilter: "skylarkplatform*/graphql",
      resourceTypes: allResourceTypes,
    }
  },
  {
    id: 2,
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
      responseHeaders: [
        {
          operation: chrome.declarativeNetRequest.HeaderOperation.SET,
          header: 'x-test-response-header',
          value: 'test-value',
        },
      ]
    },
    condition: {
      urlFilter: "skylarkplatform",
      resourceTypes: allResourceTypes,
    }
  },
];

export default rules;
