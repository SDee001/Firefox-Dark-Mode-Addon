document.addEventListener('DOMContentLoaded', () => {
  const toggleGlobalButton = document.getElementById('toggleGlobalButton');
  const toggleSiteButton = document.getElementById('toggleSiteButton');

  browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const currentUrl = new URL(tabs[0].url);
    const currentDomain = currentUrl.hostname;

    browser.storage.local.get(['globalDarkMode', 'siteDarkModeSettings'], (result) => {
      const globalDarkMode = result.globalDarkMode || false;
      const siteDarkModeSettings = result.siteDarkModeSettings || {};
      const siteDarkMode = siteDarkModeSettings[currentDomain] || false;

      toggleGlobalButton.textContent = `Global Dark Mode: ${globalDarkMode ? 'ON' : 'OFF'}`;
      toggleSiteButton.textContent = `Site Dark Mode: ${siteDarkMode ? 'ON' : 'OFF'}`;
    });
  });

  toggleGlobalButton.addEventListener('click', () => {
    browser.storage.local.get('globalDarkMode', (result) => {
      const newState = !result.globalDarkMode;
      browser.storage.local.set({globalDarkMode: newState});
      toggleGlobalButton.textContent = `Global Dark Mode: ${newState ? 'ON' : 'OFF'}`;
      
      browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {action: 'updateDarkMode', enabled: newState});
      });
    });
  });

  toggleSiteButton.addEventListener('click', () => {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const currentUrl = new URL(tabs[0].url);
      const currentDomain = currentUrl.hostname;

      browser.storage.local.get('siteDarkModeSettings', (result) => {
        const siteDarkModeSettings = result.siteDarkModeSettings || {};
        const newState = !siteDarkModeSettings[currentDomain];
        siteDarkModeSettings[currentDomain] = newState;
        browser.storage.local.set({siteDarkModeSettings: siteDarkModeSettings});
        toggleSiteButton.textContent = `Site Dark Mode: ${newState ? 'ON' : 'OFF'}`;
        
        browser.tabs.sendMessage(tabs[0].id, {action: 'updateDarkMode', enabled: newState});
      });
    });
  });
});
