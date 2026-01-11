// Research Assistant Service - Academic and web research automation
export class ResearchAssistantService {
    constructor() {
        this.sources = {
            scholar: 'https://scholar.google.com/scholar',
            arxiv: 'https://arxiv.org/search/',
            pubmed: 'https://pubmed.ncbi.nlm.nih.gov/',
            books: 'https://www.google.com/search?tbm=bks',
            news: 'https://news.google.com/search'
        };
        this.researchHistory = [];
    }

    async initialize() {
        const data = await chrome.storage.local.get('research_history');
        if (data.research_history) {
            this.researchHistory = data.research_history;
        }
    }

    async searchScholarlyArticles(query, maxResults = 10) {
        const searchUrl = `${this.sources.scholar}?q=${encodeURIComponent(query)}`;

        try {
            const tab = await chrome.tabs.create({ url: searchUrl, active: false });

            const results = await new Promise((resolve) => {
                setTimeout(async () => {
                    try {
                        const data = await chrome.tabs.sendMessage(tab.id, {
                            type: 'SCRAPE_SCHOLAR_RESULTS',
                            maxResults
                        });
                        chrome.tabs.remove(tab.id);
                        resolve(data);
                    } catch (error) {
                        chrome.tabs.remove(tab.id);
                        resolve({ success: false, error: error.message });
                    }
                }, 3000);
            });

            return results;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async searchBooks(query, geminiAI) {
        const prompt = `Search for books related to "${query}". Provide:
1. Top 5 recommended books
2. Author names
3. Brief description of each
4. Why each book is relevant
5. Difficulty level (beginner/intermediate/advanced)

Format as a structured list.`;

        try {
            const recommendations = await geminiAI.generateContent(prompt);

            this.addToHistory({
                type: 'books',
                query,
                timestamp: Date.now(),
                results: recommendations
            });

            return {
                success: true,
                query,
                recommendations
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async searchResearchPapers(topic, geminiAI) {
        const prompt = `Find and summarize recent research papers on "${topic}". Include:
1. Paper titles
2. Authors
3. Key findings
4. Publication year
5. Relevance to current research

Focus on papers from the last 5 years.`;

        try {
            const summary = await geminiAI.generateContent(prompt);

            this.addToHistory({
                type: 'papers',
                query: topic,
                timestamp: Date.now(),
                results: summary
            });

            return {
                success: true,
                topic,
                summary
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async generateLiteratureReview(topic, geminiAI) {
        const prompt = `Create a comprehensive literature review on "${topic}". Include:

1. Introduction and background
2. Current state of research
3. Key findings from major studies
4. Research gaps
5. Future directions
6. References (format: Author, Year, Title)

Make it academic and well-structured.`;

        try {
            const review = await geminiAI.generateContent(prompt, {
                maxOutputTokens: 4096,
                temperature: 0.7
            });

            return {
                success: true,
                topic,
                review
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async summarizeArticle(url, geminiAI) {
        try {
            // Get article content
            const tab = await chrome.tabs.create({ url, active: false });

            const content = await new Promise((resolve) => {
                setTimeout(async () => {
                    const data = await chrome.tabs.sendMessage(tab.id, {
                        type: 'GET_PAGE_CONTENT'
                    });
                    chrome.tabs.remove(tab.id);
                    resolve(data);
                }, 2000);
            });

            if (!content.success) {
                return content;
            }

            // Summarize with AI
            const prompt = `Summarize this article in a structured format:

Title: ${content.content.title}
Content: ${content.content.text.substring(0, 5000)}

Provide:
1. Main topic/thesis
2. Key arguments (3-5 points)
3. Evidence/data presented
4. Conclusions
5. Implications/significance`;

            const summary = await geminiAI.generateContent(prompt);

            return {
                success: true,
                url,
                title: content.content.title,
                summary
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async compareArticles(urls, geminiAI) {
        const summaries = [];

        for (const url of urls) {
            const summary = await this.summarizeArticle(url, geminiAI);
            if (summary.success) {
                summaries.push(summary);
            }
        }

        const prompt = `Compare and contrast these articles:

${summaries.map((s, i) => `
Article ${i + 1}: ${s.title}
Summary: ${s.summary}
`).join('\n')}

Provide:
1. Common themes
2. Differing viewpoints
3. Complementary insights
4. Overall synthesis`;

        try {
            const comparison = await geminiAI.generateContent(prompt);

            return {
                success: true,
                articles: summaries,
                comparison
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async generateCitation(url, style = 'APA') {
        // Extract metadata and generate citation
        try {
            const tab = await chrome.tabs.create({ url, active: false });

            const metadata = await new Promise((resolve) => {
                setTimeout(async () => {
                    const data = await chrome.tabs.sendMessage(tab.id, {
                        type: 'GET_PAGE_CONTENT'
                    });
                    chrome.tabs.remove(tab.id);
                    resolve(data);
                }, 2000);
            });

            if (!metadata.success) {
                return metadata;
            }

            // Generate citation based on style
            const author = metadata.content.metadata.author || 'Unknown Author';
            const title = metadata.content.title;
            const year = new Date().getFullYear();

            let citation = '';

            switch (style) {
                case 'APA':
                    citation = `${author}. (${year}). ${title}. Retrieved from ${url}`;
                    break;
                case 'MLA':
                    citation = `${author}. "${title}." Web. ${new Date().toLocaleDateString()}.`;
                    break;
                case 'Chicago':
                    citation = `${author}. "${title}." Accessed ${new Date().toLocaleDateString()}. ${url}.`;
                    break;
                default:
                    citation = `${author}. ${title}. ${url}`;
            }

            return {
                success: true,
                citation,
                style
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async createResearchNotes(topic, sources, geminiAI) {
        const prompt = `Create structured research notes on "${topic}" based on these sources:

${sources.map((s, i) => `Source ${i + 1}: ${s}`).join('\n')}

Format:
# ${topic}

## Overview
[Brief overview]

## Key Concepts
- [Concept 1]
- [Concept 2]
...

## Important Findings
[Detailed findings]

## Questions for Further Research
[Open questions]

## References
[List sources]`;

        try {
            const notes = await geminiAI.generateContent(prompt);

            return {
                success: true,
                topic,
                notes
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    addToHistory(entry) {
        this.researchHistory.unshift(entry);

        if (this.researchHistory.length > 100) {
            this.researchHistory = this.researchHistory.slice(0, 100);
        }

        this.saveToStorage();
    }

    async saveToStorage() {
        await chrome.storage.local.set({
            research_history: this.researchHistory
        });
    }

    getHistory() {
        return this.researchHistory;
    }
}

export default ResearchAssistantService;
