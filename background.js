let darkModeEnabled = false;

browser.storage.local.get('darkModeEnabled', (result) => {
  darkModeEnabled = result.darkModeEnabled !== undefined ? result.darkModeEnabled : true;
  browser.storage.local.set({ darkModeEnabled });
});

browser.browserAction.onClicked.addListener((tab) => {
  darkModeEnabled = !darkModeEnabled;
  browser.storage.local.set({ darkModeEnabled });
  updateAllTabs();
});

function updateAllTabs() {
  browser.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      browser.tabs.sendMessage(tab.id, { 
        action: "updateState", 
        darkModeEnabled: darkModeEnabled
      });
    });
  });
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    browser.tabs.sendMessage(tabId, { 
      action: "updateState", 
      darkModeEnabled: darkModeEnabled
    });
  }
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getState") {
    sendResponse({ darkModeEnabled: darkModeEnabled });
  }
});
