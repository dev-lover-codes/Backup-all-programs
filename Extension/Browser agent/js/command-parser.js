// Command Parser - Interprets natural language commands using AI
export class CommandParser {
    constructor() {
        this.commandPatterns = {
            WIKIPEDIA_SEARCH: /search (?:for )?(.+?) on wikipedia/i,
            PRICE_COMPARISON: /(?:find|compare|check) (?:the )?(?:best )?price(?:s)? for (.+)/i,
            NEWS_SEARCH: /(?:get|find|show) (?:the )?(?:latest )?news (?:on|about) (.+)/i,
            SOCIAL_POST: /post (?:on|to) (instagram|facebook|twitter|linkedin)(?:: )?(.+)?/i,
            TRAVEL_PLANNING: /plan (?:a )?trip to (.+)/i,
            CONTENT_SUMMARY: /summarize (?:this|the current) (?:page|article|content)/i,
            DOWNLOAD_VIDEO: /download (?:this |the )?(?:youtube )?video/i,
            TRACK_PRICE: /track (?:the )?price (?:of |for )?(.+)/i,
            SCHEDULE_TASK: /(?:schedule|remind me to) (.+?) (?:at|every) (.+)/i,
            TRANSLATE: /translate (?:this |the )?(?:page|text) to (.+)/i
        };
    }

    async parse(command, geminiAI) {
        // First, try pattern matching for quick parsing
        const patternResult = this.tryPatternMatch(command);

        if (patternResult) {
            return patternResult;
        }

        // If no pattern matches, use AI to interpret the command
        return await this.parseWithAI(command, geminiAI);
    }

    tryPatternMatch(command) {
        for (const [action, pattern] of Object.entries(this.commandPatterns)) {
            const match = command.match(pattern);

            if (match) {
                return this.buildCommandObject(action, match);
            }
        }

        return null;
    }

    buildCommandObject(action, match) {
        const params = {};

        switch (action) {
            case 'WIKIPEDIA_SEARCH':
                params.subject = match[1].trim();
                break;

            case 'PRICE_COMPARISON':
                params.product = match[1].trim();
                break;

            case 'NEWS_SEARCH':
                params.topic = match[1].trim();
                break;

            case 'SOCIAL_POST':
                params.platform = match[1].toLowerCase();
                params.content = match[2]?.trim() || '';
                break;

            case 'TRAVEL_PLANNING':
                params.destination = match[1].trim();
                break;

            case 'TRACK_PRICE':
                params.product = match[1].trim();
                break;

            case 'SCHEDULE_TASK':
                params.task = match[1].trim();
                params.schedule = match[2].trim();
                break;

            case 'TRANSLATE':
                params.targetLanguage = match[1].trim();
                break;
        }

        return {
            action,
            parameters: params,
            originalCommand: match[0]
        };
    }

    async parseWithAI(command, geminiAI) {
        const schema = {
            action: "string (one of: WIKIPEDIA_SEARCH, PRICE_COMPARISON, NEWS_SEARCH, SOCIAL_POST, TRAVEL_PLANNING, CONTENT_SUMMARY, DOWNLOAD_VIDEO, TRACK_PRICE, SCHEDULE_TASK, TRANSLATE, GENERAL_QUERY)",
            parameters: "object with relevant parameters",
            confidence: "number between 0 and 1"
        };

        const prompt = `Analyze this user command and extract the intent and parameters: "${command}"
    
Available actions:
- WIKIPEDIA_SEARCH: Search Wikipedia for information about a person, place, or topic
- PRICE_COMPARISON: Compare prices for a product across e-commerce sites
- NEWS_SEARCH: Find latest news about a topic
- SOCIAL_POST: Create a post for social media
- TRAVEL_PLANNING: Plan a trip to a destination
- CONTENT_SUMMARY: Summarize current page or article
- DOWNLOAD_VIDEO: Download a video (YouTube, etc.)
- TRACK_PRICE: Track price changes for a product
- SCHEDULE_TASK: Schedule a recurring task
- TRANSLATE: Translate content to another language
- GENERAL_QUERY: General question or request

Return a JSON object with:
- action: the most appropriate action type
- parameters: object containing extracted parameters (e.g., {subject: "Albert Einstein"} for Wikipedia search)
- confidence: how confident you are in this interpretation (0-1)

Example:
Command: "Find the best price for iPhone 15"
Response: {
  "action": "PRICE_COMPARISON",
  "parameters": {"product": "iPhone 15"},
  "confidence": 0.95
}`;

        try {
            const result = await geminiAI.generateStructuredContent(prompt, schema);
            result.originalCommand = command;
            return result;
        } catch (error) {
            console.error('AI parsing failed:', error);

            // Fallback to general query
            return {
                action: 'GENERAL_QUERY',
                parameters: { query: command },
                confidence: 0.5,
                originalCommand: command
            };
        }
    }

    async suggestCommands(context, geminiAI) {
        // Suggest relevant commands based on current context
        const prompt = `Based on this context, suggest 3-5 useful commands the user might want to execute:
    
Context: ${JSON.stringify(context)}

Return a JSON array of suggested commands with descriptions.`;

        try {
            return await geminiAI.generateStructuredContent(prompt, []);
        } catch (error) {
            console.error('Failed to generate suggestions:', error);
            return [];
        }
    }
}

export default CommandParser;
