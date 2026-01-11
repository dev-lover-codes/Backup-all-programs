// Recommendation Engine - AI-powered personalized recommendations
export class RecommendationEngine {
    constructor() {
        this.userProfile = {
            interests: [],
            browsingHistory: [],
            searchHistory: [],
            purchaseHistory: [],
            preferences: {}
        };
        this.recommendations = [];
    }

    async initialize() {
        const data = await chrome.storage.local.get(['user_profile', 'recommendations']);

        if (data.user_profile) {
            this.userProfile = data.user_profile;
        }

        if (data.recommendations) {
            this.recommendations = data.recommendations;
        }

        // Start tracking user behavior
        this.startBehaviorTracking();
    }

    startBehaviorTracking() {
        // Track page visits
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url) {
                this.recordPageVisit(tab.url, tab.title);
            }
        });

        // Track searches
        chrome.webNavigation.onCompleted.addListener((details) => {
            if (details.url.includes('google.com/search') ||
                details.url.includes('bing.com/search')) {
                this.recordSearch(details.url);
            }
        });
    }

    async recordPageVisit(url, title) {
        this.userProfile.browsingHistory.unshift({
            url,
            title,
            timestamp: Date.now()
        });

        // Keep only last 1000 visits
        if (this.userProfile.browsingHistory.length > 1000) {
            this.userProfile.browsingHistory = this.userProfile.browsingHistory.slice(0, 1000);
        }

        // Extract interests from URL and title
        await this.extractInterests(url, title);

        await this.saveProfile();
    }

    async recordSearch(searchUrl) {
        const query = new URL(searchUrl).searchParams.get('q');

        if (query) {
            this.userProfile.searchHistory.unshift({
                query,
                timestamp: Date.now()
            });

            if (this.userProfile.searchHistory.length > 500) {
                this.userProfile.searchHistory = this.userProfile.searchHistory.slice(0, 500);
            }

            await this.saveProfile();
        }
    }

    async extractInterests(url, title) {
        // Simple interest extraction based on domain and keywords
        const domain = new URL(url).hostname;
        const keywords = title.toLowerCase().split(/\s+/);

        // Category mapping
        const categories = {
            'technology': ['tech', 'software', 'hardware', 'ai', 'programming'],
            'shopping': ['shop', 'buy', 'store', 'amazon', 'ebay'],
            'news': ['news', 'article', 'report', 'breaking'],
            'entertainment': ['movie', 'music', 'game', 'video', 'youtube'],
            'education': ['learn', 'course', 'tutorial', 'education'],
            'health': ['health', 'fitness', 'medical', 'wellness'],
            'finance': ['finance', 'money', 'invest', 'stock', 'crypto']
        };

        for (const [category, terms] of Object.entries(categories)) {
            const matches = terms.some(term =>
                keywords.includes(term) || domain.includes(term)
            );

            if (matches) {
                const existing = this.userProfile.interests.find(i => i.category === category);
                if (existing) {
                    existing.count++;
                    existing.lastSeen = Date.now();
                } else {
                    this.userProfile.interests.push({
                        category,
                        count: 1,
                        lastSeen: Date.now()
                    });
                }
            }
        }

        // Sort by count
        this.userProfile.interests.sort((a, b) => b.count - a.count);
    }

    async generateRecommendations(geminiAI) {
        const topInterests = this.userProfile.interests.slice(0, 5);
        const recentSearches = this.userProfile.searchHistory.slice(0, 10);

        const prompt = `Based on this user profile, generate personalized recommendations:

Top Interests: ${topInterests.map(i => i.category).join(', ')}
Recent Searches: ${recentSearches.map(s => s.query).join(', ')}

Provide recommendations for:
1. **Articles/Content** (5 suggestions)
   - Title and brief description
   - Why it's relevant

2. **Products** (5 suggestions)
   - Product name
   - Why they might like it
   - Estimated price range

3. **Videos/Channels** (5 suggestions)
   - Title/Channel name
   - Content type
   - Why it matches their interests

4. **Learning Resources** (3 suggestions)
   - Course/tutorial name
   - Skill level
   - Platform

Format as structured JSON.`;

        try {
            const recommendations = await geminiAI.generateStructuredContent(prompt, {
                articles: [],
                products: [],
                videos: [],
                learning: []
            });

            this.recommendations = {
                ...recommendations,
                generatedAt: Date.now(),
                basedOn: {
                    interests: topInterests,
                    searches: recentSearches.length
                }
            };

            await this.saveProfile();

            return {
                success: true,
                recommendations: this.recommendations
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async recommendProducts(category, priceRange, geminiAI) {
        const prompt = `Recommend products in the ${category} category within ${priceRange} price range.

Consider:
- User interests: ${this.userProfile.interests.slice(0, 3).map(i => i.category).join(', ')}
- Quality and value
- Current trends
- User reviews

Provide 5 specific product recommendations with:
- Product name
- Brief description
- Estimated price
- Why it's a good match
- Where to buy`;

        try {
            const recommendations = await geminiAI.generateContent(prompt);

            return {
                success: true,
                category,
                priceRange,
                recommendations
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async recommendContent(contentType, geminiAI) {
        const interests = this.userProfile.interests.slice(0, 5).map(i => i.category);

        const prompt = `Recommend ${contentType} based on these interests: ${interests.join(', ')}

Provide 10 specific recommendations with:
- Title
- Creator/Author
- Brief description
- Why it matches user interests
- Where to find it

Make recommendations diverse and high-quality.`;

        try {
            const recommendations = await geminiAI.generateContent(prompt);

            return {
                success: true,
                contentType,
                recommendations
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async findSimilarContent(url, geminiAI) {
        // Get current page content
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0];

        const content = await chrome.tabs.sendMessage(tab.id, {
            type: 'GET_PAGE_CONTENT'
        });

        const prompt = `Based on this content, recommend similar articles/pages:

Title: ${content.content.title}
Description: ${content.content.metadata.description}
Content snippet: ${content.content.text.substring(0, 500)}

Provide 5 recommendations for similar content with:
- Title
- URL (if known) or where to search
- Why it's similar
- What additional value it provides`;

        try {
            const recommendations = await geminiAI.generateContent(prompt);

            return {
                success: true,
                originalUrl: url,
                recommendations
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async discoverNewInterests(geminiAI) {
        const currentInterests = this.userProfile.interests.slice(0, 5).map(i => i.category);

        const prompt = `Based on current interests (${currentInterests.join(', ')}), suggest new related topics to explore:

Provide 5 new interest areas with:
- Topic name
- Why it's related to current interests
- What makes it interesting
- Where to start exploring
- Difficulty level`;

        try {
            const suggestions = await geminiAI.generateContent(prompt);

            return {
                success: true,
                currentInterests,
                suggestions
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    getUserProfile() {
        return {
            interests: this.userProfile.interests,
            totalVisits: this.userProfile.browsingHistory.length,
            totalSearches: this.userProfile.searchHistory.length,
            topCategories: this.userProfile.interests.slice(0, 5)
        };
    }

    async clearProfile() {
        this.userProfile = {
            interests: [],
            browsingHistory: [],
            searchHistory: [],
            purchaseHistory: [],
            preferences: {}
        };

        await this.saveProfile();
    }

    async saveProfile() {
        await chrome.storage.local.set({
            user_profile: this.userProfile,
            recommendations: this.recommendations
        });
    }
}

export default RecommendationEngine;
