// ChatGPT Export Pro - Popup Script with Inline Export Functions
// Handles UI interactions and exports

let currentConversation = null;
let savedConversations = [];
let settings = {};

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Popup initialized');

    await loadSettings();
    await loadSavedConversations();
    loadCurrentConversation();
    setupEventListeners();
    applySettings();
});

// Load settings
async function loadSettings() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
            if (response && response.settings) {
                settings = response.settings;
            } else {
                settings = getDefaultSettings();
            }
            resolve();
        });
    });
}

// Get default settings
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

// Apply settings to UI
function applySettings() {
    const themeButtons = document.querySelectorAll('.theme-option');
    themeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === settings.theme);
    });

    document.getElementById('includeTimestamps').checked = settings.includeTimestamps;
    document.getElementById('includeCoverPage').checked = settings.coverPage;
    document.getElementById('saveOnExport').checked = settings.autoSave;
}

// Load current conversation from active tab
function loadCurrentConversation() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        if (!activeTab || (!activeTab.url.includes('chat.openai.com') && !activeTab.url.includes('chatgpt.com'))) {
            showNotOnChatGPT();
            return;
        }

        chrome.tabs.sendMessage(activeTab.id, { action: 'getConversation' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Error getting conversation:', chrome.runtime.lastError);
                showError('Could not load conversation. Try refreshing the page.');
                return;
            }

            if (response && response.conversation) {
                currentConversation = response.conversation;
                updateConversationInfo(currentConversation);
            }
        });
    });
}

// Update conversation info display
function updateConversationInfo(conversation) {
    const titleEl = document.getElementById('conversationTitle');
    const countEl = document.getElementById('messageCount');

    if (conversation && conversation.messages.length > 0) {
        titleEl.textContent = conversation.title || 'Untitled Conversation';
        countEl.textContent = `${conversation.messages.length} messages`;
    } else {
        titleEl.textContent = 'No conversation detected';
        countEl.textContent = '0 messages';
    }
}

// Show not on ChatGPT message
function showNotOnChatGPT() {
    const titleEl = document.getElementById('conversationTitle');
    const countEl = document.getElementById('messageCount');

    titleEl.textContent = 'Not on ChatGPT';
    countEl.textContent = 'Open a ChatGPT conversation to export';
}

// Load saved conversations
async function loadSavedConversations() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'getSavedConversations' }, (response) => {
            if (response && response.conversations) {
                savedConversations = response.conversations;
                updateSavedCount();
                renderSavedConversations();
            }
            resolve();
        });
    });
}

// Update saved conversations count badge
function updateSavedCount() {
    const badge = document.getElementById('savedCount');
    badge.textContent = savedConversations.length;
}

// Render saved conversations
function renderSavedConversations() {
    const container = document.getElementById('savedConversations');

    if (savedConversations.length === 0) {
        container.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
        <p>No saved conversations yet</p>
        <span>Export conversations with "Save locally" enabled</span>
      </div>
    `;
        return;
    }

    container.innerHTML = savedConversations.map(conv => `
    <div class="conversation-item" data-id="${conv.id}">
      <div class="conversation-header">
        <div>
          <div class="conversation-title">${conv.title || 'Untitled'}</div>
          <div class="conversation-meta">${conv.messages.length} messages • ${formatDate(conv.timestamp)}</div>
        </div>
        <div class="conversation-actions">
          <button class="icon-btn export-conv" data-id="${conv.id}" title="Export">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          <button class="icon-btn delete-conv" data-id="${conv.id}" title="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');

    container.querySelectorAll('.export-conv').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            exportSavedConversation(btn.dataset.id);
        });
    });

    container.querySelectorAll('.delete-conv').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteSavedConversation(btn.dataset.id);
        });
    });
}

// Format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;

    return date.toLocaleDateString();
}

// Export saved conversation
function exportSavedConversation(id) {
    const conversation = savedConversations.find(c => c.id === id);
    if (!conversation) return;

    currentConversation = conversation;
    handleExport(settings.defaultFormat || 'pdf');
}

// Delete saved conversation
function deleteSavedConversation(id) {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    chrome.runtime.sendMessage({
        action: 'deleteConversation',
        id: id
    }, async () => {
        showToast('Conversation deleted', 'success');
        await loadSavedConversations();
    });
}

// Setup event listeners
function setupEventListeners() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });

    const exportButtons = document.querySelectorAll('.export-btn');
    exportButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            handleExport(btn.dataset.format);
        });
    });

    const themeButtons = document.querySelectorAll('.theme-option');
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            themeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            settings.theme = btn.dataset.theme;
            saveSettings();
        });
    });

    document.getElementById('includeTimestamps').addEventListener('change', (e) => {
        settings.includeTimestamps = e.target.checked;
        saveSettings();
    });

    document.getElementById('includeCoverPage').addEventListener('change', (e) => {
        settings.coverPage = e.target.checked;
        saveSettings();
    });

    document.getElementById('saveOnExport').addEventListener('change', (e) => {
        settings.autoSave = e.target.checked;
        saveSettings();
    });

    document.getElementById('searchInput').addEventListener('input', (e) => {
        filterConversations(e.target.value);
    });
}

// Switch tab
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}Tab`);
    });
}

// Handle export - MAIN EXPORT FUNCTION
async function handleExport(format) {
    if (!currentConversation || !currentConversation.messages || currentConversation.messages.length === 0) {
        showToast('No conversation to export', 'error');
        return;
    }

    const exportOptions = {
        format: format,
        theme: settings.theme,
        includeTimestamps: document.getElementById('includeTimestamps').checked,
        includeCoverPage: document.getElementById('includeCoverPage').checked,
        saveLocally: document.getElementById('saveOnExport').checked
    };

    showLoading(`Exporting to ${format.toUpperCase()}...`);

    try {
        // Export based on format
        switch (format.toLowerCase()) {
            case 'pdf':
                await exportToPDF(currentConversation, exportOptions);
                break;
            case 'markdown':
            case 'md':
                exportToMarkdown(currentConversation, exportOptions);
                break;
            case 'txt':
            case 'text':
                exportToText(currentConversation, exportOptions);
                break;
            case 'html':
                exportToHTML(currentConversation, exportOptions);
                break;
            case 'word':
            case 'docx':
                showToast('Word export not yet implemented. Use PDF or HTML instead.', 'warning');
                hideLoading();
                return;
            default:
                throw new Error(`Unsupported format: ${format}`);
        }

        if (exportOptions.saveLocally) {
            await saveConversation(currentConversation);
        }

        hideLoading();
        showToast(`Successfully exported to ${format.toUpperCase()}!`, 'success');
    } catch (error) {
        console.error('Export error:', error);
        hideLoading();
        showToast('Export failed: ' + error.message, 'error');
    }
}

// Export to PDF using jsPDF
async function exportToPDF(conversation, options) {
    // Check if jsPDF is available
    console.log('Checking for jsPDF...', { jspdf: typeof window.jspdf, jsPDF: typeof window.jsPDF });

    // The UMD build exposes jsPDF at window.jspdf.jsPDF
    let jsPDF;
    if (window.jspdf && window.jspdf.jsPDF) {
        jsPDF = window.jspdf.jsPDF;
    } else if (window.jsPDF) {
        jsPDF = window.jsPDF;
    } else {
        throw new Error('PDF library not loaded. Please ensure jsPDF is included.');
    }

    console.log('jsPDF found:', typeof jsPDF);

    const doc = new jsPDF();

    let y = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    function checkPageBreak(needed = 20) {
        if (y + needed > pageHeight - margin) {
            doc.addPage();
            y = margin;
            return true;
        }
        return false;
    }

    // Cover page
    if (options.includeCoverPage) {
        doc.setFillColor(102, 126, 234);
        doc.rect(0, 0, pageWidth, 80, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text(conversation.title || 'ChatGPT Conversation', margin, 40);

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`${conversation.messages.length} messages`, margin, 55);
        doc.text(new Date().toLocaleDateString(), margin, 65);

        doc.addPage();
        y = margin;
    }

    // Messages
    doc.setTextColor(0, 0, 0);

    conversation.messages.forEach((message) => {
        checkPageBreak(30);

        // Role
        const roleLabel = message.role === 'user' ? 'You' : 'ChatGPT';
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');

        if (message.role === 'user') {
            doc.setTextColor(102, 126, 234);
        } else {
            doc.setTextColor(16, 185, 129);
        }

        doc.text(roleLabel, margin, y);
        y += 7;
        doc.setTextColor(0, 0, 0);

        // Timestamp
        if (options.includeTimestamps && message.timestamp) {
            doc.setFontSize(9);
            doc.setTextColor(156, 163, 175);
            doc.text(new Date(message.timestamp).toLocaleString(), margin, y);
            y += 5;
            doc.setTextColor(0, 0, 0);
        }

        // Content
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');

        const content = message.content || '';

        // Process content to identify special sections
        const sections = parseContentSections(content);

        sections.forEach(section => {
            if (section.type === 'code' || section.type === 'matrix') {
                // Use monospace for code/matrix blocks
                doc.setFont('courier', 'normal');
                doc.setFontSize(10);
                doc.setTextColor(75, 85, 99); // Gray for code

                const lines = doc.splitTextToSize(section.content, contentWidth);
                lines.forEach(line => {
                    checkPageBreak();
                    doc.text(line, margin, y);
                    y += 5.5;
                });

                // Reset font
                doc.setFont(undefined, 'normal');
                doc.setFontSize(11);
                doc.setTextColor(0, 0, 0);
                y += 5;
            } else {
                // Normal text
                const lines = doc.splitTextToSize(section.content, contentWidth);
                lines.forEach(line => {
                    checkPageBreak();
                    doc.text(line, margin, y);
                    y += 6;
                });
            }
        });

        y += 10;
    });

    const filename = `${conversation.title || 'ChatGPT-Export'}.pdf`;
    doc.save(filename);
}

// Parse content into sections (normal, code, math)
function parseContentSections(content) {
    const sections = [];
    const codeBlockRegex = /```[\s\S]*?```/g;
    const matrixRegex = /\[Matrix\][\s\S]*?\n\n/g;

    let lastIndex = 0;
    const matches = [];

    // Find code blocks
    let match;
    while ((match = codeBlockRegex.exec(content)) !== null) {
        matches.push({ start: match.index, end: match.index + match[0].length, content: match[0], type: 'code' });
    }

    // Find matrix blocks
    while ((match = matrixRegex.exec(content)) !== null) {
        matches.push({ start: match.index, end: match.index + match[0].length, content: match[0], type: 'matrix' });
    }

    // Sort by position
    matches.sort((a, b) => a.start - b.start);

    // Build sections
    matches.forEach(m => {
        if (m.start > lastIndex) {
            sections.push({ type: 'text', content: content.substring(lastIndex, m.start) });
        }
        sections.push({ type: m.type, content: m.content.replace(/```/g, '') });
        lastIndex = m.end;
    });

    // Add remaining text
    if (lastIndex < content.length) {
        sections.push({ type: 'text', content: content.substring(lastIndex) });
    }

    return sections.length > 0 ? sections : [{ type: 'text', content }];
}

// Export to Markdown
function exportToMarkdown(conversation, options) {
    let md = `# ${conversation.title || 'ChatGPT Conversation'}\n\n`;
    md += `**Messages:** ${conversation.messages.length}  \n`;
    md += `**Exported:** ${new Date().toLocaleDateString()}  \n\n`;
    md += '---\n\n';

    conversation.messages.forEach((msg) => {
        const role = msg.role === 'user' ? '👤 **You**' : '🤖 **ChatGPT**';
        md += `${role}\n\n`;

        if (options.includeTimestamps && msg.timestamp) {
            md += `*${new Date(msg.timestamp).toLocaleString()}*\n\n`;
        }

        md += `${msg.content}\n\n---\n\n`;
    });

    downloadFile(md, `${conversation.title || 'ChatGPT-Export'}.md`, 'text/markdown');
}

// Export to Text
function exportToText(conversation, options) {
    let txt = `${conversation.title || 'ChatGPT Conversation'}\n`;
    txt += '='.repeat((conversation.title || 'ChatGPT Conversation').length) + '\n\n';
    txt += `Messages: ${conversation.messages.length}\n`;
    txt += `Exported: ${new Date().toLocaleDateString()}\n\n`;
    txt += '-'.repeat(50) + '\n\n';

    conversation.messages.forEach((msg) => {
        const role = msg.role === 'user' ? 'YOU' : 'ChatGPT';
        txt += `${role}\n`;

        if (options.includeTimestamps && msg.timestamp) {
            txt += `${new Date(msg.timestamp).toLocaleString()}\n`;
        }

        txt += `\n${msg.content}\n\n`;
        txt += '-'.repeat(50) + '\n\n';
    });

    downloadFile(txt, `${conversation.title || 'ChatGPT-Export'}.txt`, 'text/plain');
}

// Export to HTML
function exportToHTML(conversation, options) {
    const isDark = options.theme === 'dark';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${conversation.title || 'ChatGPT Conversation'}</title>
  <style>
    body {font-family: -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; background: ${isDark ? '#1f2937' : '#f9fafb'}; color: ${isDark ? '#e5e7eb' : '#111827'}; line-height: 1.6;}
    h1 {background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;}
    .message {margin: 20px 0; padding: 20px; border-radius: 12px; background: ${isDark ? '#374151' : '#ffffff'}; border-left: 4px solid #667eea;}
    .message.assistant {border-left-color: #10b981;}
    .role {font-weight: 700; margin-bottom: 10px; color: #667eea;}
    .message.assistant .role {color: #10b981;}
    .timestamp {font-size: 12px; color: #9ca3af; margin-bottom: 8px;}
    .content {white-space: pre-wrap;}
  </style>
</head>
<body>
  <h1>${conversation.title || 'ChatGPT Conversation'}</h1>
  <p><strong>Messages:</strong> ${conversation.messages.length} | <strong>Exported:</strong> ${new Date().toLocaleDateString()}</p>
  ${conversation.messages.map(msg => `
    <div class="message ${msg.role}">
      <div class="role">${msg.role === 'user' ? 'You' : 'ChatGPT'}</div>
      ${options.includeTimestamps && msg.timestamp ? `<div class="timestamp">${new Date(msg.timestamp).toLocaleString()}</div>` : ''}
      <div class="content">${msg.content}</div>
    </div>
  `).join('')}
</body>
</html>`;

    downloadFile(html, `${conversation.title || 'ChatGPT-Export'}.html`, 'text/html');
}

// Download file helper
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// Save conversation
async function saveConversation(conversation) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({
            action: 'saveConversation',
            title: conversation.title,
            messages: conversation.messages,
            tags: []
        }, async (response) => {
            if (response && response.success) {
                await loadSavedConversations();
            }
            resolve();
        });
    });
}

// Filter conversations
function filterConversations(query) {
    const filtered = savedConversations.filter(conv => {
        const title = (conv.title || '').toLowerCase();
        const q = query.toLowerCase();
        return title.includes(q);
    });

    const container = document.getElementById('savedConversations');

    if (filtered.length === 0) {
        container.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <p>No results found</p>
        <span>Try a different search term</span>
      </div>
    `;
    }
}

// Save settings
function saveSettings() {
    chrome.runtime.sendMessage({
        action: 'saveSettings',
        settings: settings
    });
}

// Show loading
function showLoading(message) {
    const overlay = document.getElementById('loadingOverlay');
    const text = document.getElementById('loadingText');
    text.textContent = message;
    overlay.classList.add('active');
}

// Hide loading
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('active');
}

// Show toast
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<div class="toast-message">${message}</div>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Error message helper
function showError(message) {
    showToast(message, 'error');
}
