// ChatGPT Injector - Content Script
// Extracts conversations from ChatGPT and injects export UI

(function () {
    'use strict';

    console.log('✅ ChatGPT Export Pro: Content script loaded!');

    // State variables
    let exportButton = null;
    let isExtracting = false;
    let retryCount = 0;
    const MAX_RETRIES = 5;

    // Initialize the extension  
    function initialize() {
        console.log('🚀 ChatGPT Export Pro: Initializing...');

        //Wait for body to be ready
        if (!document.body) {
            console.log('⏳ Waiting for document.body...');
            setTimeout(initialize, 100);
            return;
        }

        injectExportButton();
        observeConversationChanges();
    }

    // Inject floating export button
    function injectExportButton() {
        // Check if already exists
        const existing = document.getElementById('chatgpt-export-button');
        if (existing) {
            console.log('✓ Button already exists');
            return;
        }

        console.log('📌 Injecting export button...');

        try {
            // Create button container
            exportButton = document.createElement('div');
            exportButton.id = 'chatgpt-export-button';
            exportButton.className = 'chatgpt-export-pro-btn';

            // Inline critical styles for immediate visibility
            exportButton.style.cssText = `
        position: fixed !important;
        bottom: 30px !important;
        right: 30px !important;
        z-index: 999999 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      `;

            exportButton.innerHTML = `
        <div class="export-btn-main" style="
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          padding: 12px 20px !important;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
          border-radius: 50px !important;
          cursor: pointer !important;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4) !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          user-select: none !important;
          transition: all 0.3s ease !important;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Export</span>
        </div>
        <div class="export-menu" id="export-menu" style="display: none; position: absolute; bottom: 70px; right: 0; background: white; border-radius: 16px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2); padding: 8px; min-width: 180px;">
          <div class="export-menu-item" data-format="pdf" style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px; cursor: pointer; color: #1f2937; font-size: 14px; font-weight: 500; transition: background 0.2s;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span>PDF</span>
          </div>
          <div class="export-menu-item" data-format="markdown" style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px; cursor: pointer; color: #1f2937; font-size: 14px; font-weight: 500; transition: background 0.2s;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 7v10h4l3-3h7v-7h-14z"></path>
              <path d="M10 7v7"></path>
            </svg>
            <span>Markdown</span>
          </div>
          <div class="export-menu-item" data-format="txt" style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px; cursor: pointer; color: #1f2937; font-size: 14px; font-weight: 500; transition: background 0.2s;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span>Text</span>
          </div>
          <div class="export-menu-item" data-format="html" style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px; cursor: pointer; color: #1f2937; font-size: 14px; font-weight: 500; transition: background 0.2s;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span>HTML</span>
          </div>
        </div>
      `;

            // Append to body
            document.body.appendChild(exportButton);

            // Verify it was added
            const check = document.getElementById('chatgpt-export-button');
            if (!check) {
                throw new Error('Button not found after injection');
            }

            console.log('✅ Button injected successfully!');

            // Setup event listeners
            setupEventListeners();

            // Show success notification
            setTimeout(() => {
                showNotification('ChatGPT Export Pro is ready! Click the button to export.', 'success');
            }, 500);

        } catch (error) {
            console.error('❌ Error injecting button:', error);
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                console.log(`🔄 Retrying... (${retryCount}/${MAX_RETRIES})`);
                setTimeout(injectExportButton, 1000);
            }
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        const mainBtn = exportButton.querySelector('.export-btn-main');
        const menu = exportButton.querySelector('.export-menu');
        const menuItems = exportButton.querySelectorAll('.export-menu-item');

        if (!mainBtn || !menu) {
            console.error('❌ Button elements not found');
            return;
        }

        // Main button click
        mainBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('🖱️ Export button clicked');
            const isVisible = menu.style.display !== 'none';
            menu.style.display = isVisible ? 'none' : 'block';
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!exportButton.contains(e.target)) {
                menu.style.display = 'none';
            }
        });

        // Menu item hover effects
        menuItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.background = 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.background = 'transparent';
            });

            // Export on click
            item.addEventListener('click', async (e) => {
                e.stopPropagation();
                const format = item.dataset.format;
                console.log('📤 Exporting as:', format);
                menu.style.display = 'none';
                await handleExport(format);
            });
        });

        console.log('✅ Event listeners attached');
    }

    // Extract conversation from ChatGPT DOM
    function extractConversation() {
        console.log('🔍 Extracting conversation...');

        const conversation = {
            title: getConversationTitle(),
            messages: [],
            timestamp: Date.now(),
            url: window.location.href
        };

        // Multiple selectors to find messages
        const messageSelectors = [
            '[data-message-author-role]',
            '[data-testid^="conversation-turn"]',
            'div[class*="group"]',
            '.text-base'
        ];

        let messages = null;
        for (const selector of messageSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                messages = Array.from(elements);
                console.log(`✓ Found ${messages.length} messages using selector: ${selector}`);
                break;
            }
        }

        if (!messages || messages.length === 0) {
            console.warn('⚠️ No messages found');
            return conversation;
        }

        messages.forEach((msgElement, index) => {
            const message = extractMessage(msgElement, index);
            if (message && message.content.trim()) {
                conversation.messages.push(message);
            }
        });

        console.log(`✅ Extracted ${conversation.messages.length} messages`);
        return conversation;
    }

    // Extract single message
    function extractMessage(element, index) {
        // Determine role from data attribute or position
        let role = 'unknown';
        const roleAttr = element.getAttribute('data-message-author-role');

        if (roleAttr) {
            role = roleAttr;
        } else {
            // Alternate between user and assistant if no role found
            role = index % 2 === 0 ? 'user' : 'assistant';
        }

        // Extract content - try different approaches
        let content = '';
        let html = '';

        // Try to find the prose content
        const proseEl = element.querySelector('[class*="prose"], [class*="markdown"], .whitespace-pre-wrap');
        if (proseEl) {
            html = proseEl.innerHTML;
            content = extractMathContent(proseEl);
        } else {
            html = element.innerHTML;
            content = extractMathContent(element);
        }

        // Clean content
        content = content.trim();
        html = cleanHTML(html);

        return {
            role: role,
            content: content,
            html: html,
            timestamp: Date.now()
        };
    }

    // Extract content with proper math handling
    function extractMathContent(element) {
        const cloned = element.cloneNode(true);

        // Process LaTeX/MathJax elements
        const mathElements = cloned.querySelectorAll('.katex, .math, mjx-container, [class*="math"]');
        mathElements.forEach(mathEl => {
            // Try to get LaTeX annotation or original
            const annotation = mathEl.querySelector('annotation[encoding="application/x-tex"]');
            if (annotation) {
                // Replace with formatted LaTeX
                const latex = annotation.textContent;
                const formatted = formatLatex(latex);
                mathEl.textContent = formatted;
            }
        });

        // Process code blocks - preserve formatting
        const codeBlocks = cloned.querySelectorAll('pre code, pre');
        codeBlocks.forEach(block => {
            const code = block.textContent;
            block.textContent = '\n```\n' + code + '\n```\n';
        });

        return cloned.textContent || cloned.innerText || '';
    }

    // Format LaTeX for better readability in plain text
    function formatLatex(latex) {
        if (!latex) return '';

        // For matrices, create a more readable format
        if (latex.includes('\\begin{matrix}') || latex.includes('\\begin{bmatrix}') ||
            latex.includes('\\begin{pmatrix}')) {

            // Simple formatting for matrices
            let formatted = latex
                .replace(/\\begin\{[bp]?matrix\}/g, '\n')
                .replace(/\\end\{[bp]?matrix\}/g, '\n')
                .replace(/\\\\/g, '\n')
                .replace(/&/g, '  ');

            return `\n[Matrix]${formatted}\n`;
        }

        // For inline math, add markers
        if (latex.includes('\\frac')) {
            // Format fractions
            latex = latex.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/$2)');
        }

        // Clean common LaTeX commands
        latex = latex
            .replace(/\\left/g, '')
            .replace(/\\right/g, '')
            .replace(/\\,/g, ' ')
            .replace(/\\ /g, ' ')
            .replace(/\\text\{([^}]+)\}/g, '$1')
            .replace(/\\mathrm\{([^}]+)\}/g, '$1')
            .replace(/\\mathbf\{([^}]+)\}/g, '$1');

        return ` ${latex} `;
    }

    // Clean HTML content
    function cleanHTML(html) {
        if (!html) return '';

        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Remove unwanted elements
        temp.querySelectorAll('button, script, style, [class*="copy"], [class*="clipboard"]').forEach(el => el.remove());

        return temp.innerHTML;
    }

    // Get conversation title
    function getConversationTitle() {
        // Try to find title in various places
        const titleSelectors = [
            'nav h1',
            'h1',
            '[class*="title"]',
            'title'
        ];

        for (const selector of titleSelectors) {
            const el = document.querySelector(selector);
            if (el && el.textContent.trim() && !el.textContent.includes('ChatGPT')) {
                return el.textContent.trim();
            }
        }

        return 'ChatGPT Conversation - ' + new Date().toLocaleDateString();
    }

    // Handle export
    async function handleExport(format) {
        if (isExtracting) {
            showNotification('Export already in progress...', 'warning');
            return;
        }

        isExtracting = true;
        showNotification(`Extracting conversation...`, 'info');

        try {
            const conversation = extractConversation();

            if (!conversation.messages || conversation.messages.length === 0) {
                showNotification('No messages found in this conversation', 'error');
                isExtracting = false;
                return;
            }

            showNotification(`Exporting ${conversation.messages.length} messages as ${format.toUpperCase()}...`, 'info');

            // Handle export inline to avoid extension context issues
            switch (format.toLowerCase()) {
                case 'markdown':
                case 'md':
                    exportMarkdown(conversation);
                    showNotification(`Successfully exported to Markdown!`, 'success');
                    break;
                case 'txt':
                case 'text':
                    exportText(conversation);
                    showNotification(`Successfully exported to Text!`, 'success');
                    break;
                case 'html':
                    exportHTML(conversation);
                    showNotification(`Successfully exported to HTML!`, 'success');
                    break;
                case 'pdf':
                    showNotification('📄 For PDF: Click the extension icon in your toolbar, then click the PDF button', 'warning');
                    isExtracting = false;
                    return; // Exit early for PDF
                default:
                    throw new Error(`Unsupported format: ${format}`);
            }

        } catch (error) {
            console.error('❌ Export error:', error);

            if (error.message && (error.message.includes('Extension context') || error.message.includes('invalidated'))) {
                showNotification('⚠️ Extension was reloaded. Please refresh this page (Ctrl+Shift+R)', 'error');
            } else {
                showNotification('Export failed: ' + error.message, 'error');
            }
        } finally {
            isExtracting = false;
        }
    }

    // Export to Markdown
    function exportMarkdown(conversation) {
        let md = `# ${conversation.title || 'ChatGPT Conversation'}\n\n`;
        md += `**Messages:** ${conversation.messages.length}  \n`;
        md += `**Exported:** ${new Date().toLocaleDateString()}  \n\n`;
        md += '---\n\n';

        conversation.messages.forEach((msg) => {
            const role = msg.role === 'user' ? '👤 **You**' : '🤖 **ChatGPT**';
            md += `${role}\n\n${msg.content}\n\n---\n\n`;
        });

        download(md, `${conversation.title || 'ChatGPT-Export'}.md`, 'text/markdown');
    }

    // Export to Text
    function exportText(conversation) {
        let txt = `${conversation.title || 'ChatGPT Conversation'}\n`;
        txt += '='.repeat((conversation.title || 'ChatGPT Conversation').length) + '\n\n';
        txt += `Messages: ${conversation.messages.length}\n`;
        txt += `Exported: ${new Date().toLocaleDateString()}\n\n`;
        txt += '-'.repeat(50) + '\n\n';

        conversation.messages.forEach((msg) => {
            const role = msg.role === 'user' ? 'YOU' : 'ChatGPT';
            txt += `${role}\n\n${msg.content}\n\n`;
            txt += '-'.repeat(50) + '\n\n';
        });

        download(txt, `${conversation.title || 'ChatGPT-Export'}.txt`, 'text/plain');
    }

    // Export to HTML
    function exportHTML(conversation) {
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${conversation.title || 'ChatGPT Conversation'}</title>
  <style>
    body {font-family: -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6;}
    h1 {background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;}
    .message {margin: 20px 0; padding: 20px; border-radius: 12px; background: #f9fafb; border-left: 4px solid #667eea;}
    .message.assistant {border-left-color: #10b981;}
    .role {font-weight: 700; margin-bottom: 10px; color: #667eea;}
    .message.assistant .role {color: #10b981;}
    .content {white-space: pre-wrap;}
  </style>
</head>
<body>
  <h1>${conversation.title || 'ChatGPT Conversation'}</h1>
  <p><strong>Messages:</strong> ${conversation.messages.length} | <strong>Exported:</strong> ${new Date().toLocaleDateString()}</p>
  ${conversation.messages.map(msg => `
    <div class="message ${msg.role}">
      <div class="role">${msg.role === 'user' ? 'You' : 'ChatGPT'}</div>
      <div class="content">${msg.content}</div>
    </div>
  `).join('')}
</body>
</html>`;

        download(html, `${conversation.title || 'ChatGPT-Export'}.html`, 'text/html');
    }

    // Download helper function
    function download(content, filename, mimeType) {
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

    // Show notification
    function showNotification(message, type = 'info') {
        console.log(`📢 ${type.toUpperCase()}: ${message}`);

        const notification = document.createElement('div');
        notification.className = `chatgpt-export-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      padding: 16px 24px !important;
      border-radius: 12px !important;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
      z-index: 1000000 !important;
      font-family: -apple-system, sans-serif !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      color: white !important;
      max-width: 400px !important;
      opacity: 0 !important;
      transform: translateX(100px) !important;
      transition: all 0.3s ease !important;
    `;

        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        } else if (type === 'warning') {
            notification.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Observe conversation changes
    function observeConversationChanges() {
        const observer = new MutationObserver(() => {
            // Re-inject if button disappears
            if (!document.getElementById('chatgpt-export-button')) {
                console.log('🔄 Button removed, re-injecting...');
                injectExportButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: false
        });

        console.log('👀 Observing DOM changes');
    }

    // Listen for messages from background/popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('📨 Message received:', request.action);

        if (request.action === 'exportConversation') {
            handleExport(request.format);
            sendResponse({ success: true });
        }

        if (request.action === 'getConversation') {
            const conversation = extractConversation();
            sendResponse({ conversation });
        }

        return true;
    });

    // Initialize with multiple triggers for reliability
    console.log('📋 Document ready state:', document.readyState);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Backup initialization
    setTimeout(() => {
        if (!document.getElementById('chatgpt-export-button')) {
            console.log('📌 Backup initialization triggered');
            initialize();
        }
    }, 2000);

    console.log('✅ ChatGPT Export Pro content script initialized');

})();
