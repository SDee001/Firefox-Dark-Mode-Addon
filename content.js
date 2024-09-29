(function() {
  let darkModeEnabled = false;
  let currentDomain = window.location.hostname;

  function applyDarkMode() {
    document.documentElement.classList.add('sophisticated-dark-mode');
    document.body.style.setProperty('background-color', '#121212', 'important');
    document.body.style.setProperty('color', '#e0e0e0', 'important');
  }

  function removeDarkMode() {
    document.documentElement.classList.remove('sophisticated-dark-mode');
    document.body.style.removeProperty('background-color');
    document.body.style.removeProperty('color');
  }

  function updateDarkMode(enabled) {
    darkModeEnabled = enabled;
    if (darkModeEnabled) {
      applyDarkMode();
    } else {
      removeDarkMode();
    }
  }

  // Apply dark mode immediately if it was previously enabled for this site
  browser.storage.local.get(['globalDarkMode', 'siteDarkModeSettings'], (result) => {
    const siteDarkModeSettings = result.siteDarkModeSettings || {};
    if (currentDomain in siteDarkModeSettings) {
      updateDarkMode(siteDarkModeSettings[currentDomain]);
    } else if (result.globalDarkMode) {
      updateDarkMode(true);
    }
  });

  // Listen for messages from the popup or background script
  browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'updateDarkMode') {
      updateDarkMode(message.enabled);
    }
  });

  // Reapply dark mode on dynamic content changes
  const observer = new MutationObserver(() => {
    if (darkModeEnabled) {
      applyDarkMode();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
