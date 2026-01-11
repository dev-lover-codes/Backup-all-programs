// Background Service Worker - Main AI Processing Engine
import CONFIG from './config.js';
import { GeminiAI } from './gemini-service.js';
import { TaskScheduler } from './task-scheduler.js';
import { PriceTracker } from './price-tracker.js';
import { CommandParser } from './command-parser.js';

class AIBrowserAgent {
    constructor() {
        this.geminiAI = null;
        this.taskScheduler = new TaskScheduler();
        this.priceTracker = new PriceTracker();
        this.commandParser = new CommandParser();
        this.isInitialized = false;
    }

    async initialize() {
        console.log('🤖 AI Browser Agent initializing...');

        // Load API key from storage
        const { gemini_api_key } = await chrome.storage.local.get('gemini_api_key');

        if (gemini_api_key) {
            this.geminiAI = new GeminiAI(gemini_api_key);
            this.isInitialized = true;
            console.log('✅ AI Browser Agent initialized successfully');
        } else {
            console.warn('⚠️ Gemini API key not set. Please configure in settings.');
        }

        // Set up listeners
        this.setupListeners();

        // Initialize scheduled tasks
        await this.taskScheduler.initialize();

        // Initialize price tracking
        await this.priceTracker.initialize();
    }

    setupListeners() {
        // Listen for messages from popup and content scripts
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Keep channel open for async response
        });

        // Context menu for quick actions
        chrome.runtime.onInstalled.addListener(() => {
            chrome.contextMenus.create({
                id: 'ai-agent-analyze',
                title: 'Analyze with AI',
                contexts: ['selection', 'page', 'link']
            });

            chrome.contextMenus.create({
                id: 'ai-agent-track-price',
                title: 'Track Price',
                contexts: ['link']
            });
        });

        chrome.contextMenus.onClicked.addListener((info, tab) => {
            this.handleContextMenu(info, tab);
        });

        // Alarm for scheduled tasks
        chrome.alarms.onAlarm.addListener((alarm) => {
            this.handleAlarm(alarm);
        });
    }

    async handleMessage(message, sender, sendResponse) {
        try {
            console.log('📨 Received message:', message.type);

            switch (message.type) {
                case 'EXECUTE_COMMAND':
                    await this.executeCommand(message.command, sendResponse);
                    break;

                case 'SET_API_KEY':
                    await this.setApiKey(message.apiKey, sendResponse);
                    break;

                case 'TRACK_PRODUCT':
                    await this.priceTracker.trackProduct(message.productData, sendResponse);
                    break;

                case 'SCHEDULE_TASK':
                    await this.taskScheduler.scheduleTask(message.task, sendResponse);
                    break;

                case 'GET_PRICE_HISTORY':
                    await this.priceTracker.getPriceHistory(message.productId, sendResponse);
                    break;

                case 'SCRAPE_PAGE':
                    await this.scrapePage(message.url, message.selectors, sendResponse);
                    break;

                case 'GET_STATUS':
                    sendResponse({
                        initialized: this.isInitialized,
                        hasApiKey: !!this.geminiAI
                    });
                    break;

                default:
                    sendResponse({ error: 'Unknown message type' });
            }
        } catch (error) {
            console.error('❌ Error handling message:', error);
            sendResponse({ error: error.message });
        }
    }

    async executeCommand(command, sendResponse) {
        if (!this.isInitialized) {
            sendResponse({
                error: 'AI not initialized. Please set your Gemini API key in settings.'
            });
            return;
        }

        try {
            // Parse command using AI
            const parsedCommand = await this.commandParser.parse(command, this.geminiAI);
            console.log('🧠 Parsed command:', parsedCommand);

            // Execute based on command type
            let result;
            switch (parsedCommand.action) {
                case 'WIKIPEDIA_SEARCH':
                    result = await this.executeWikipediaSearch(parsedCommand);
                    break;

                case 'PRICE_COMPARISON':
                    result = await this.executePriceComparison(parsedCommand);
                    break;

                case 'NEWS_SEARCH':
                    result = await this.executeNewsSearch(parsedCommand);
                    break;

                case 'SOCIAL_POST':
                    result = await this.executeSocialPost(parsedCommand);
                    break;

                case 'TRAVEL_PLANNING':
                    result = await this.executeTravelPlanning(parsedCommand);
                    break;

                case 'CONTENT_SUMMARY':
                    result = await this.executeContentSummary(parsedCommand);
                    break;

                default:
                    result = { error: 'Unknown action type' };
            }

            sendResponse({ success: true, result });
        } catch (error) {
            console.error('❌ Error executing command:', error);
            sendResponse({ error: error.message });
        }
    }

    async executeWikipediaSearch(parsedCommand) {
        const { subject } = parsedCommand.parameters;

        // Open Wikipedia and search
        const searchUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(subject.replace(/ /g, '_'))}`;

        const tab = await chrome.tabs.create({ url: searchUrl, active: false });

        // Wait for page to load and scrape content
        return new Promise((resolve) => {
            setTimeout(async () => {
                const result = await chrome.tabs.sendMessage(tab.id, {
                    type: 'SCRAPE_WIKIPEDIA',
                    subject: subject
                });

                // Optionally close the tab
                // chrome.tabs.remove(tab.id);

                resolve(result);
            }, 3000);
        });
    }

    async executePriceComparison(parsedCommand) {
        const { product } = parsedCommand.parameters;
        const results = [];

        // Search across multiple e-commerce sites
        for (const site of CONFIG.ECOMMERCE_SITES) {
            const searchUrl = `https://www.${site.url}/s?k=${encodeURIComponent(product)}`;

            try {
                const tab = await chrome.tabs.create({ url: searchUrl, active: false });

                const priceData = await new Promise((resolve) => {
                    setTimeout(async () => {
                        try {
                            const data = await chrome.tabs.sendMessage(tab.id, {
                                type: 'SCRAPE_PRICES',
                                selector: site.selector
                            });
                            chrome.tabs.remove(tab.id);
                            resolve(data);
                        } catch (error) {
                            chrome.tabs.remove(tab.id);
                            resolve(null);
                        }
                    }, 2000);
                });

                if (priceData) {
                    results.push({
                        site: site.name,
                        ...priceData
                    });
                }
            } catch (error) {
                console.error(`Error searching ${site.name}:`, error);
            }
        }

        return { product, comparisons: results };
    }

    async executeNewsSearch(parsedCommand) {
        const { topic } = parsedCommand.parameters;

        // Use Gemini AI to search and summarize news
        const prompt = `Search for the latest news about "${topic}" and provide a comprehensive summary with key points. Include sources if possible.`;

        const summary = await this.geminiAI.generateContent(prompt);

        return { topic, summary };
    }

    async executeSocialPost(parsedCommand) {
        // This would require OAuth integration with social platforms
        // For now, return a placeholder
        return {
            message: 'Social media posting requires additional authentication setup',
            platform: parsedCommand.parameters.platform,
            content: parsedCommand.parameters.content
        };
    }

    async executeTravelPlanning(parsedCommand) {
        const { destination } = parsedCommand.parameters;

        const prompt = `Create a comprehensive travel plan for ${destination}. Include:
    1. Best time to visit
    2. Top attractions
    3. Recommended hotels (budget, mid-range, luxury)
    4. Local cuisine recommendations
    5. Transportation tips
    6. Estimated budget
    7. Safety tips`;

        const travelPlan = await this.geminiAI.generateContent(prompt);

        return { destination, plan: travelPlan };
    }

    async executeContentSummary(parsedCommand) {
        const { url } = parsedCommand.parameters;

        // Get current tab content
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        const content = await chrome.tabs.sendMessage(tab.id, {
            type: 'GET_PAGE_CONTENT'
        });

        const prompt = `Summarize the following content in a concise manner, highlighting key points:\n\n${content.text}`;

        const summary = await this.geminiAI.generateContent(prompt);

        return { url: content.url, summary };
    }

    async setApiKey(apiKey, sendResponse) {
        await chrome.storage.local.set({ gemini_api_key: apiKey });
        this.geminiAI = new GeminiAI(apiKey);
        this.isInitialized = true;
        sendResponse({ success: true, message: 'API key saved successfully' });
    }

    async handleContextMenu(info, tab) {
        if (info.menuItemId === 'ai-agent-analyze') {
            const text = info.selectionText || 'this page';

            const prompt = `Analyze the following and provide insights: ${text}`;
            const analysis = await this.geminiAI.generateContent(prompt);

            // Show notification with result
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icon48.png',
                title: 'AI Analysis',
                message: analysis.substring(0, 200) + '...'
            });
        }
    }

    async handleAlarm(alarm) {
        console.log('⏰ Alarm triggered:', alarm.name);

        if (alarm.name.startsWith('task_')) {
            await this.taskScheduler.executeScheduledTask(alarm.name);
        } else if (alarm.name.startsWith('price_check_')) {
            await this.priceTracker.checkPrices();
        }
    }

    async scrapePage(url, selectors, sendResponse) {
        const tab = await chrome.tabs.create({ url, active: false });

        setTimeout(async () => {
            const data = await chrome.tabs.sendMessage(tab.id, {
                type: 'SCRAPE_DATA',
                selectors
            });

            chrome.tabs.remove(tab.id);
            sendResponse({ success: true, data });
        }, 2000);
    }
}

// Initialize the agent
const agent = new AIBrowserAgent();
agent.initialize();

// Export for testing
export default agent;
