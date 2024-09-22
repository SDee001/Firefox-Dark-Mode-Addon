let darkModeEnabled = false;

function applyDarkMode() {
  if (darkModeEnabled) {
    if (!document.getElementById('dark-mode-style')) {
      const link = document.createElement('link');
      link.id = 'dark-mode-style';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = browser.runtime.getURL('darkmode.css');
      (document.head || document.documentElement).appendChild(link);
    }
  } else {
    const link = document.getElementById('dark-mode-style');
    if (link) {
      link.remove();
    }
  }
}

// Apply dark mode immediately if it was previously enabled
browser.storage.local.get('darkModeEnabled', (result) => {
  darkModeEnabled = result.darkModeEnabled;
  applyDarkMode();
});

// Listen for messages from the background script
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "updateState") {
    darkModeEnabled = message.darkModeEnabled;
    applyDarkMode();
  }
});
