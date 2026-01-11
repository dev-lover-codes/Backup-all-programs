// Configuration file for AI Browser Agent
export const CONFIG = {
  // Gemini API Configuration
  GEMINI_API_KEY: '', // User will set this in settings
  GEMINI_API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  GEMINI_MODEL: 'gemini-pro',
  
  // Feature Flags
  FEATURES: {
    WIKIPEDIA_SEARCH: true,
    GOOGLE_DOCS_INTEGRATION: true,
    PRICE_COMPARISON: true,
    SOCIAL_MEDIA_AUTOMATION: true,
    NEWS_AGGREGATION: true,
    TASK_SCHEDULING: true,
    EMAIL_REPORTS: true,
    TRAVEL_PLANNING: true,
    CONTENT_DISCOVERY: true,
    VOICE_COMMANDS: false, // Future feature
    AUTO_TRANSLATION: true,
    FORM_FILLING: true
  },
  
  // Supported E-commerce Sites for Price Comparison
  ECOMMERCE_SITES: [
    { name: 'Amazon', url: 'amazon.com', selector: '.a-price-whole' },
    { name: 'eBay', url: 'ebay.com', selector: '.x-price-primary' },
    { name: 'Walmart', url: 'walmart.com', selector: '.price-characteristic' },
    { name: 'Best Buy', url: 'bestbuy.com', selector: '.priceView-customer-price' }
  ],
  
  // News Sources
  NEWS_SOURCES: [
    'https://news.google.com',
    'https://www.bbc.com/news',
    'https://www.reuters.com',
    'https://www.theguardian.com'
  ],
  
  // Social Media Platforms
  SOCIAL_PLATFORMS: {
    INSTAGRAM: 'instagram.com',
    FACEBOOK: 'facebook.com',
    TWITTER: 'twitter.com',
    LINKEDIN: 'linkedin.com'
  },
  
  // Task Scheduling
  SCHEDULING: {
    DEFAULT_CHECK_INTERVAL: 60, // minutes
    MAX_SCHEDULED_TASKS: 50
  },
  
  // Storage Keys
  STORAGE_KEYS: {
    API_KEY: 'gemini_api_key',
    USER_PREFERENCES: 'user_preferences',
    TRACKED_PRODUCTS: 'tracked_products',
    SCHEDULED_TASKS: 'scheduled_tasks',
    PRICE_HISTORY: 'price_history',
    COMMAND_HISTORY: 'command_history'
  },
  
  // Security
  ENCRYPTION_ENABLED: true,
  
  // Rate Limiting
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_DAY: 1500
  }
};

export default CONFIG;
