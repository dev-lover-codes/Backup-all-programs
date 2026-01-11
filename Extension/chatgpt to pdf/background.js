// Background Service Worker for ChatGPT Export Pro
// Handles context menus, keyboard shortcuts, and message coordination

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('ChatGPT Export Pro installed');
  
  // Create context menu items
  chrome.contextMenus.create({
    id: 'export-pdf',
    title: 'Export to PDF',
    contexts: ['page'],
    documentUrlPatterns: [
      'https://chat.openai.com/*',
      'https://chatgpt.com/*'
    ]
  });
  
  chrome.contextMenus.create({
    id: 'export-markdown',
    title: 'Export to Markdown',
    contexts: ['page'],
    documentUrlPatterns: [
      'https://chat.openai.com/*',
      'https://chatgpt.com/*'
    ]
  });
  
  chrome.contextMenus.create({
    id: 'export-word',
    title: 'Export to Word',
    contexts: ['page'],
    documentUrlPatterns: [
      'https://chat.openai.com/*',
      'https://chatgpt.com/*'
    ]
  });
  
  chrome.contextMenus.create({
    id: 'export-submenu',
    title: 'Export As...',
    contexts: ['page'],
    documentUrlPatterns: [
      'https://chat.openai.com/*',
      'https://chatgpt.com/*'
    ]
  });
  
  chrome.contextMenus.create({
    id: 'export-txt',
    parentId: 'export-submenu',
    title: 'Plain Text',
    contexts: ['page']
  });
  
  chrome.contextMenus.create({
    id: 'export-html',
    parentId: 'export-submenu',
    title: 'HTML',
    contexts: ['page']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const exportFormat = info.menuItemId.replace('export-', '');
  
  // Send message to content script to trigger export
  chrome.tabs.sendMessage(tab.id, {
    action: 'exportConversation',
    format: exportFormat
  });
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && (tabs[0].url.includes('chat.openai.com') || tabs[0].url.includes('chatgpt.com'))) {
      let format = 'pdf';
      if (command === 'export-markdown') {
        format = 'markdown';
      }
      
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'exportConversation',
        format: format
      });
    }
  });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveConversation') {
    // Save conversation to storage
    chrome.storage.local.get(['conversations'], (result) => {
      const conversations = result.conversations || [];
      const newConversation = {
        id: Date.now().toString(),
        title: request.title,
        messages: request.messages,
        timestamp: Date.now(),
        tags: request.tags || [],
        url: sender.tab ? sender.tab.url : ''
      };
      
      conversations.push(newConversation);
      
      chrome.storage.local.set({ conversations }, () => {
        sendResponse({ success: true, id: newConversation.id });
      });
    });
    return true; // Keep channel open for async response
  }
  
  if (request.action === 'getSavedConversations') {
    chrome.storage.local.get(['conversations'], (result) => {
      sendResponse({ conversations: result.conversations || [] });
    });
    return true;
  }
  
  if (request.action === 'deleteConversation') {
    chrome.storage.local.get(['conversations'], (result) => {
      const conversations = result.conversations || [];
      const filtered = conversations.filter(c => c.id !== request.id);
      
      chrome.storage.local.set({ conversations: filtered }, () => {
        sendResponse({ success: true });
      });
    });
    return true;
  }
  
  if (request.action === 'updateConversation') {
    chrome.storage.local.get(['conversations'], (result) => {
      const conversations = result.conversations || [];
      const index = conversations.findIndex(c => c.id === request.id);
      
      if (index !== -1) {
        conversations[index] = { ...conversations[index], ...request.updates };
        
        chrome.storage.local.set({ conversations }, () => {
          sendResponse({ success: true });
        });
      } else {
        sendResponse({ success: false, error: 'Conversation not found' });
      }
    });
    return true;
  }
  
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(['settings'], (result) => {
      sendResponse({ settings: result.settings || getDefaultSettings() });
    });
    return true;
  }
  
  if (request.action === 'saveSettings') {
    chrome.storage.sync.set({ settings: request.settings }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Default settings
function getDefaultSettings() {
  return {
    defaultFormat: 'pdf',
    theme: 'light',
    fontSize: 12,
    fontFamily: 'Inter',
    includeTimestamps: true,
    includeLabels: true,
    includeSystemMessages: false,
    coverPage: true,
    autoSave: false
  };
}

// Handle extension icon click badge
chrome.action.setBadgeBackgroundColor({ color: '#10B981' });
