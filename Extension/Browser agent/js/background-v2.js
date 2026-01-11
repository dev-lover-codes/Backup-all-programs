// Enhanced Background Service Worker - V2.0 with all advanced features
import CONFIG from './config.js';
import { GeminiAI } from './gemini-service.js';
import { TaskScheduler } from './task-scheduler.js';
import { PriceTracker } from './price-tracker.js';
import { CommandParser } from './command-parser.js';
import { GoogleDocsService } from './google-docs-service.js';
import { GmailService } from './gmail-service.js';
import { YouTubeService } from './youtube-service.js';
import { FormAutomationService } from './form-automation-service.js';
import { ResearchAssistantService } from './research-assistant-service.js';
import { NewsDigestService } from './news-digest-service.js';
import { RecommendationEngine } from './recommendation-engine.js';

class AIBrowserAgentV2 {
    constructor() {
        this.geminiAI = null;
        this.taskScheduler = new TaskScheduler();
        this.priceTracker = new PriceTracker();
        this.commandParser = new CommandParser();
        this.googleDocs = new GoogleDocsService();
        this.gmail = new GmailService();
        this.youtube = new YouTubeService();
        this.formAutomation = new FormAutomationService();
        this.researchAssistant = new ResearchAssistantService();
        this.newsDigest = new NewsDigestService();
        this.recommendationEngine = new RecommendationEngine();
        this.isInitialized = false;
    }

    async initialize() {
        console.log('🤖 AI Browser Agent V2.0 initializing...');

        // Load API key from storage
        const { gemini_api_key, youtube_api_key } = await chrome.storage.local.get(['gemini_api_key', 'youtube_api_key']);

        if (gemini_api_key) {
            this.geminiAI = new GeminiAI(gemini_api_key);
            this.isInitialized = true;
            console.log('✅ AI Browser Agent initialized successfully');
        } else {
            console.warn('⚠️ Gemini API key not set. Please configure in settings.');
        }

        if (youtube_api_key) {
            this.youtube.apiKey = youtube_api_key;
        }

        // Set up listeners
        this.setupListeners();

        // Initialize all services
        await this.taskScheduler.initialize();
        await this.priceTracker.initialize();
        await this.formAutomation.initialize();
        await this.researchAssistant.initialize();
        await this.newsDigest.initialize();
        await this.recommendationEngine.initialize();

        console.log('✅ All services initialized');
    }

    setupListeners() {
        // Listen for messages from popup and content scripts
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Keep channel open for async response
        });

        // Enhanced context menu
        chrome.runtime.onInstalled.addListener(() => {
            const menuItems = [
                { id: 'ai-agent-analyze', title: 'Analyze with AI', contexts: ['selection', 'page'] },
                { id: 'ai-agent-summarize', title: 'Summarize Page', contexts: ['page'] },
                { id: 'ai-agent-track-price', title: 'Track Price', contexts: ['link'] },
                { id: 'ai-agent-save-to-docs', title: 'Save to Google Docs', contexts: ['selection', 'page'] },
                { id: 'ai-agent-research', title: 'Research This Topic', contexts: ['selection'] },
                { id: 'ai-agent-translate', title: 'Translate Page', contexts: ['page'] }
            ];

            menuItems.forEach(item => {
                chrome.contextMenus.create(item);
            });
        });

        chrome.contextMenus.onClicked.addListener((info, tab) => {
            this.handleContextMenu(info, tab);
        });

        // Alarm for scheduled tasks and digests
        chrome.alarms.onAlarm.addListener((alarm) => {
            this.handleAlarm(alarm);
        });
    }

    async handleMessage(message, sender, sendResponse) {
        try {
            console.log('📨 Received message:', message.type);

            switch (message.type) {
                // Core commands
                case 'EXECUTE_COMMAND':
                    await this.executeCommand(message.command, sendResponse);
                    break;

                case 'SET_API_KEY':
                    await this.setApiKey(message.apiKey, sendResponse);
                    break;

                // Price tracking
                case 'TRACK_PRODUCT':
                    await this.priceTracker.trackProduct(message.productData, sendResponse);
                    break;

                case 'GET_PRICE_HISTORY':
                    await this.priceTracker.getPriceHistory(message.productId, sendResponse);
                    break;

                // Task scheduling
                case 'SCHEDULE_TASK':
                    await this.taskScheduler.scheduleTask(message.task, sendResponse);
                    break;

                // Google Docs
                case 'CREATE_GOOGLE_DOC':
                    const docResult = await this.googleDocs.createDocument(message.title, message.content);
                    sendResponse(docResult);
                    break;

                case 'SAVE_TO_DOCS':
                    await this.saveToGoogleDocs(message.data, sendResponse);
                    break;

                // Gmail
                case 'SUMMARIZE_EMAIL':
                    const emailSummary = await this.gmail.summarizeEmail(message.emailId, this.geminiAI);
                    sendResponse(emailSummary);
                    break;

                case 'GENERATE_EMAIL_REPLY':
                    const reply = await this.gmail.generateReply(message.emailId, message.tone, this.geminiAI);
                    sendResponse(reply);
                    break;

                // YouTube
                case 'SUMMARIZE_VIDEO':
                    const videoSummary = await this.youtube.summarizeVideo(message.videoId, this.geminiAI);
                    sendResponse(videoSummary);
                    break;

                // Form automation
                case 'FILL_FORM':
                    await this.formAutomation.fillForm(message.tabId, message.profileName);
                    sendResponse({ success: true });
                    break;

                case 'AUTO_CHECKOUT':
                    const checkoutResult = await this.formAutomation.autoCheckout(message.tabId, message.paymentProfile);
                    sendResponse(checkoutResult);
                    break;

                // Research
                case 'SEARCH_SCHOLARLY':
                    const scholarResults = await this.researchAssistant.searchScholarlyArticles(message.query);
                    sendResponse(scholarResults);
                    break;

                case 'GENERATE_LITERATURE_REVIEW':
                    const review = await this.researchAssistant.generateLiteratureReview(message.topic, this.geminiAI);
                    sendResponse(review);
                    break;

                // News digest
                case 'SUBSCRIBE_NEWS':
                    const subscription = await this.newsDigest.subscribe(message.topic, message.frequency);
                    sendResponse(subscription);
                    break;

                case 'GENERATE_NEWS_DIGEST':
                    const digest = await this.newsDigest.generateDigest(message.topic, this.geminiAI);
                    sendResponse(digest);
                    break;

                // Recommendations
                case 'GET_RECOMMENDATIONS':
                    const recommendations = await this.recommendationEngine.generateRecommendations(this.geminiAI);
                    sendResponse(recommendations);
                    break;

                case 'RECOMMEND_PRODUCTS':
                    const productRecs = await this.recommendationEngine.recommendProducts(
                        message.category,
                        message.priceRange,
                        this.geminiAI
                    );
                    sendResponse(productRecs);
                    break;

                // General
                case 'SCRAPE_PAGE':
                    await this.scrapePage(message.url, message.selectors, sendResponse);
                    break;

                case 'GET_STATUS':
                    sendResponse({
                        initialized: this.isInitialized,
                        hasApiKey: !!this.geminiAI,
                        version: '2.0.0',
                        services: {
                            googleDocs: !!this.googleDocs.accessToken,
                            gmail: !!this.gmail.accessToken,
                            youtube: !!this.youtube.apiKey
                        }
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

                case 'TRAVEL_PLANNING':
                    result = await this.executeTravelPlanning(parsedCommand);
                    break;

                case 'CONTENT_SUMMARY':
                    result = await this.executeContentSummary(parsedCommand);
                    break;

                case 'YOUTUBE_SUMMARY':
                    result = await this.executeYouTubeSummary(parsedCommand);
                    break;

                case 'RESEARCH_TOPIC':
                    result = await this.executeResearch(parsedCommand);
                    break;

                case 'GENERATE_EMAIL':
                    result = await this.executeEmailGeneration(parsedCommand);
                    break;

                default:
                    // Use AI for general queries
                    result = await this.executeGeneralQuery(parsedCommand);
            }

            sendResponse({ success: true, result });
        } catch (error) {
            console.error('❌ Error executing command:', error);
            sendResponse({ error: error.message });
        }
    }

    async executeWikipediaSearch(parsedCommand) {
        const { subject } = parsedCommand.parameters;
        const searchUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(subject.replace(/ /g, '_'))}`;

        const tab = await chrome.tabs.create({ url: searchUrl, active: false });

        return new Promise((resolve) => {
            setTimeout(async () => {
                const result = await chrome.tabs.sendMessage(tab.id, {
                    type: 'SCRAPE_WIKIPEDIA',
                    subject: subject
                });

                resolve(result);
            }, 3000);
        });
    }

    async executePriceComparison(parsedCommand) {
        const { product } = parsedCommand.parameters;
        const results = [];

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
        return await this.newsDigest.searchNews(topic, this.geminiAI);
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
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        const content = await chrome.tabs.sendMessage(tab.id, {
            type: 'GET_PAGE_CONTENT'
        });

        const prompt = `Summarize the following content in a concise manner, highlighting key points:\n\n${content.content.text.substring(0, 5000)}`;

        const summary = await this.geminiAI.generateContent(prompt);

        return { url: content.content.url, summary };
    }

    async executeYouTubeSummary(parsedCommand) {
        const { url } = parsedCommand.parameters;
        const videoId = this.youtube.extractVideoId(url);

        if (!videoId) {
            return { error: 'Invalid YouTube URL' };
        }

        return await this.youtube.summarizeVideo(videoId, this.geminiAI);
    }

    async executeResearch(parsedCommand) {
        const { topic } = parsedCommand.parameters;
        return await this.researchAssistant.searchResearchPapers(topic, this.geminiAI);
    }

    async executeEmailGeneration(parsedCommand) {
        const { context, tone } = parsedCommand.parameters;

        const prompt = `Generate a ${tone} email based on this context: ${context}`;
        const emailContent = await this.geminiAI.generateContent(prompt);

        return { emailContent };
    }

    async executeGeneralQuery(parsedCommand) {
        const response = await this.geminiAI.generateContent(parsedCommand.originalCommand);
        return { answer: response };
    }

    async saveToGoogleDocs(data, sendResponse) {
        if (!this.googleDocs.accessToken) {
            await this.googleDocs.authenticate();
        }

        let content;
        if (data.wikiData) {
            content = await this.googleDocs.formatWikipediaData(data.wikiData);
        } else {
            content = data.content;
        }

        const result = await this.googleDocs.createDocument(data.title, content);
        sendResponse(result);
    }

    async setApiKey(apiKey, sendResponse) {
        await chrome.storage.local.set({ gemini_api_key: apiKey });
        this.geminiAI = new GeminiAI(apiKey);
        this.isInitialized = true;
        sendResponse({ success: true, message: 'API key saved successfully' });
    }

    async handleContextMenu(info, tab) {
        if (!this.isInitialized) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icon48.png',
                title: 'AI Agent',
                message: 'Please configure your API key first'
            });
            return;
        }

        switch (info.menuItemId) {
            case 'ai-agent-analyze':
                const text = info.selectionText || 'this page';
                const analysis = await this.geminiAI.generateContent(`Analyze: ${text}`);
                this.showNotification('AI Analysis', analysis);
                break;

            case 'ai-agent-summarize':
                const summary = await this.executeContentSummary({ parameters: {} });
                this.showNotification('Page Summary', summary.summary);
                break;

            case 'ai-agent-save-to-docs':
                const content = await chrome.tabs.sendMessage(tab.id, {
                    type: 'GET_PAGE_CONTENT'
                });
                await this.saveToGoogleDocs({
                    title: content.content.title,
                    content: content.content.text
                }, () => { });
                this.showNotification('Saved', 'Content saved to Google Docs');
                break;

            case 'ai-agent-research':
                const research = await this.researchAssistant.searchResearchPapers(
                    info.selectionText,
                    this.geminiAI
                );
                this.showNotification('Research Results', research.summary);
                break;
        }
    }

    async handleAlarm(alarm) {
        console.log('⏰ Alarm triggered:', alarm.name);

        if (alarm.name.startsWith('task_')) {
            await this.taskScheduler.executeScheduledTask(alarm.name);
        } else if (alarm.name.startsWith('price_check_')) {
            await this.priceTracker.checkPrices();
        } else if (alarm.name.startsWith('news_digest_')) {
            const subscriptionId = alarm.name.replace('news_digest_', '');
            await this.newsDigest.deliverScheduledDigest(subscriptionId, this.geminiAI, this.gmail);
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

    showNotification(title, message) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: title,
            message: message.substring(0, 200) + (message.length > 200 ? '...' : '')
        });
    }
}

// Initialize the agent
const agent = new AIBrowserAgentV2();
agent.initialize();

// Export for testing
export default agent;
