browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({globalDarkMode: false, siteDarkModeSettings: {}});
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const currentUrl = new URL(tab.url);
    const currentDomain = currentUrl.hostname;

    browser.storage.local.get(['globalDarkMode', 'siteDarkModeSettings'], (result) => {
      const siteDarkModeSettings = result.siteDarkModeSettings || {};
      let darkModeEnabled;

      if (currentDomain in siteDarkModeSettings) {
        darkModeEnabled = siteDarkModeSettings[currentDomain];
      } else {
        darkModeEnabled = result.globalDarkMode;
      }

      browser.tabs.sendMessage(tabId, {action: 'updateDarkMode', enabled: darkModeEnabled});
    });
  }
});
