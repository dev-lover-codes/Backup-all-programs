// Content Script - Injected into web pages for scraping and interaction
console.log('🌐 AI Browser Agent content script loaded');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message, sendResponse);
    return true; // Keep channel open for async response
});

async function handleMessage(message, sendResponse) {
    try {
        switch (message.type) {
            case 'SCRAPE_WIKIPEDIA':
                await scrapeWikipedia(message.subject, sendResponse);
                break;

            case 'SCRAPE_PRICES':
                await scrapePrices(message.selector, sendResponse);
                break;

            case 'GET_PAGE_CONTENT':
                getPageContent(sendResponse);
                break;

            case 'SCRAPE_DATA':
                await scrapeData(message.selectors, sendResponse);
                break;

            case 'FILL_FORM':
                await fillForm(message.formData, sendResponse);
                break;

            case 'TRANSLATE_PAGE':
                await translatePage(message.targetLanguage, sendResponse);
                break;

            default:
                sendResponse({ error: 'Unknown message type' });
        }
    } catch (error) {
        console.error('Content script error:', error);
        sendResponse({ error: error.message });
    }
}

async function scrapeWikipedia(subject, sendResponse) {
    try {
        // Wait for page to load
        await waitForElement('.mw-parser-output');

        const data = {
            title: document.querySelector('#firstHeading')?.textContent || '',
            summary: '',
            infobox: {},
            sections: []
        };

        // Get summary (first paragraph)
        const firstParagraph = document.querySelector('.mw-parser-output > p:not(.mw-empty-elt)');
        if (firstParagraph) {
            data.summary = firstParagraph.textContent.trim();
        }

        // Get infobox data
        const infobox = document.querySelector('.infobox');
        if (infobox) {
            const rows = infobox.querySelectorAll('tr');
            rows.forEach(row => {
                const header = row.querySelector('th');
                const value = row.querySelector('td');
                if (header && value) {
                    data.infobox[header.textContent.trim()] = value.textContent.trim();
                }
            });
        }

        // Get main sections
        const headings = document.querySelectorAll('h2 .mw-headline');
        headings.forEach(heading => {
            const sectionTitle = heading.textContent;
            let content = '';

            let element = heading.closest('h2').nextElementSibling;
            while (element && element.tagName !== 'H2') {
                if (element.tagName === 'P') {
                    content += element.textContent + '\n\n';
                }
                element = element.nextElementSibling;
            }

            if (content) {
                data.sections.push({
                    title: sectionTitle,
                    content: content.trim()
                });
            }
        });

        sendResponse({ success: true, data });
    } catch (error) {
        sendResponse({ error: error.message });
    }
}

async function scrapePrices(selector, sendResponse) {
    try {
        await waitForElement(selector, 5000);

        const priceElements = document.querySelectorAll(selector);
        const prices = [];

        priceElements.forEach((el, index) => {
            if (index < 10) { // Limit to first 10 results
                const priceText = el.textContent.trim();
                const price = parsePrice(priceText);

                if (price) {
                    // Try to get product name
                    const productElement = el.closest('[data-component-type="s-search-result"]') ||
                        el.closest('.s-result-item') ||
                        el.closest('li');

                    const nameElement = productElement?.querySelector('h2, .product-title, [data-cy="listing-title"]');
                    const linkElement = productElement?.querySelector('a[href]');

                    prices.push({
                        price,
                        priceText,
                        name: nameElement?.textContent.trim() || 'Unknown Product',
                        url: linkElement?.href || window.location.href
                    });
                }
            }
        });

        sendResponse({
            success: true,
            prices,
            url: window.location.href
        });
    } catch (error) {
        sendResponse({ error: error.message });
    }
}

function getPageContent(sendResponse) {
    const content = {
        url: window.location.href,
        title: document.title,
        text: document.body.innerText.substring(0, 10000), // Limit to 10k chars
        html: document.documentElement.outerHTML.substring(0, 50000),
        metadata: {
            description: document.querySelector('meta[name="description"]')?.content || '',
            keywords: document.querySelector('meta[name="keywords"]')?.content || '',
            author: document.querySelector('meta[name="author"]')?.content || ''
        }
    };

    sendResponse({ success: true, content });
}

async function scrapeData(selectors, sendResponse) {
    const data = {};

    for (const [key, selector] of Object.entries(selectors)) {
        try {
            const elements = document.querySelectorAll(selector);

            if (elements.length === 1) {
                data[key] = elements[0].textContent.trim();
            } else if (elements.length > 1) {
                data[key] = Array.from(elements).map(el => el.textContent.trim());
            } else {
                data[key] = null;
            }
        } catch (error) {
            data[key] = null;
        }
    }

    sendResponse({ success: true, data });
}

async function fillForm(formData, sendResponse) {
    try {
        for (const [fieldName, value] of Object.entries(formData)) {
            // Try different selectors
            const field = document.querySelector(`[name="${fieldName}"]`) ||
                document.querySelector(`#${fieldName}`) ||
                document.querySelector(`[placeholder*="${fieldName}" i]`);

            if (field) {
                if (field.tagName === 'SELECT') {
                    field.value = value;
                } else if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = value;
                } else {
                    field.value = value;

                    // Trigger input event for React/Vue forms
                    field.dispatchEvent(new Event('input', { bubbles: true }));
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }

        sendResponse({ success: true, message: 'Form filled successfully' });
    } catch (error) {
        sendResponse({ error: error.message });
    }
}

async function translatePage(targetLanguage, sendResponse) {
    // This would integrate with Google Translate or similar service
    // For now, just return a placeholder
    sendResponse({
        success: false,
        message: 'Translation feature coming soon'
    });
}

// Helper functions
function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);

        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}

function parsePrice(priceText) {
    // Remove currency symbols and extract number
    const match = priceText.match(/[\d,]+\.?\d*/);
    if (match) {
        return parseFloat(match[0].replace(/,/g, ''));
    }
    return null;
}

// Highlight feature - visual feedback when AI is working
function showAIWorking() {
    const overlay = document.createElement('div');
    overlay.id = 'ai-agent-overlay';
    overlay.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    animation: slideIn 0.3s ease-out;
  `;
    overlay.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 20px; height: 20px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <span>AI Agent Working...</span>
    </div>
  `;

    const style = document.createElement('style');
    style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    return overlay;
}

function hideAIWorking(overlay) {
    if (overlay) {
        overlay.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => overlay.remove(), 300);
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { scrapeWikipedia, scrapePrices, getPageContent };
}
