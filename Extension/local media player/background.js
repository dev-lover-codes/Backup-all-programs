// ========================================
// Background Service Worker
// ========================================

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Local Media Player Pro installed successfully!');

        // Set default settings
        chrome.storage.local.set({
            theme: 'dark',
            firstRun: true
        });
    } else if (details.reason === 'update') {
        console.log('Local Media Player Pro updated!');
    }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveData') {
        // Save data to chrome.storage
        chrome.storage.local.set({ [request.key]: request.value }, () => {
            sendResponse({ success: true });
        });
        return true; // Keep channel open for async response
    }

    if (request.action === 'getData') {
        // Retrieve data from chrome.storage
        chrome.storage.local.get([request.key], (result) => {
            sendResponse({ data: result[request.key] });
        });
        return true;
    }
});

// Keep service worker alive
chrome.runtime.onStartup.addListener(() => {
    console.log('Local Media Player Pro started');
});

// Monitor extension lifecycle
self.addEventListener('activate', (event) => {
    console.log('Service worker activated');
});
