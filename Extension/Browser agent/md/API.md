# API Reference - AI Browser Agent

## Table of Contents
1. [Background Service Worker](#background-service-worker)
2. [Gemini AI Service](#gemini-ai-service)
3. [Command Parser](#command-parser)
4. [Price Tracker](#price-tracker)
5. [Task Scheduler](#task-scheduler)
6. [Content Script](#content-script)
7. [Message Protocol](#message-protocol)

---

## Background Service Worker

### Main Class: `AIBrowserAgent`

#### Methods

##### `initialize()`
Initializes the AI agent, loads API key, and sets up listeners.

```javascript
await agent.initialize();
```

##### `executeCommand(command, sendResponse)`
Executes a natural language command.

**Parameters:**
- `command` (string): Natural language command
- `sendResponse` (function): Callback for response

**Example:**
```javascript
chrome.runtime.sendMessage({
  type: 'EXECUTE_COMMAND',
  command: 'Search for Einstein on Wikipedia'
}, (response) => {
  console.log(response.result);
});
```

---

## Gemini AI Service

### Class: `GeminiAI`

#### Constructor
```javascript
const gemini = new GeminiAI(apiKey);
```

#### Methods

##### `generateContent(prompt, options)`
Generates AI content from a prompt.

**Parameters:**
- `prompt` (string): The prompt text
- `options` (object): Optional configuration
  - `temperature` (number): 0-1, creativity level (default: 0.7)
  - `maxOutputTokens` (number): Max response length (default: 2048)

**Returns:** Promise<string>

**Example:**
```javascript
const response = await gemini.generateContent(
  'Explain quantum computing',
  { temperature: 0.5 }
);
```

##### `generateStructuredContent(prompt, schema)`
Generates structured JSON output.

**Parameters:**
- `prompt` (string): The prompt text
- `schema` (object): Expected JSON structure

**Returns:** Promise<object>

**Example:**
```javascript
const data = await gemini.generateStructuredContent(
  'Extract person info from: John Doe, 30 years old',
  { name: 'string', age: 'number' }
);
// Returns: { name: 'John Doe', age: 30 }
```

##### `chat(messages, options)`
Multi-turn conversation.

**Parameters:**
- `messages` (array): Array of message objects
  - `role` (string): 'user' or 'assistant'
  - `content` (string): Message text

**Example:**
```javascript
const response = await gemini.chat([
  { role: 'user', content: 'What is AI?' },
  { role: 'assistant', content: 'AI is...' },
  { role: 'user', content: 'Tell me more' }
]);
```

---

## Command Parser

### Class: `CommandParser`

#### Methods

##### `parse(command, geminiAI)`
Parses natural language command into structured action.

**Parameters:**
- `command` (string): Natural language command
- `geminiAI` (GeminiAI): AI instance for fallback parsing

**Returns:** Promise<object>
```javascript
{
  action: 'WIKIPEDIA_SEARCH',
  parameters: { subject: 'Albert Einstein' },
  confidence: 0.95,
  originalCommand: 'Search for Albert Einstein on Wikipedia'
}
```

**Supported Actions:**
- `WIKIPEDIA_SEARCH`
- `PRICE_COMPARISON`
- `NEWS_SEARCH`
- `SOCIAL_POST`
- `TRAVEL_PLANNING`
- `CONTENT_SUMMARY`
- `DOWNLOAD_VIDEO`
- `TRACK_PRICE`
- `SCHEDULE_TASK`
- `TRANSLATE`
- `GENERAL_QUERY`

**Example:**
```javascript
const parser = new CommandParser();
const result = await parser.parse(
  'Find best price for iPhone 15',
  geminiAI
);
// Returns: { action: 'PRICE_COMPARISON', parameters: { product: 'iPhone 15' }, ... }
```

---

## Price Tracker

### Class: `PriceTracker`

#### Methods

##### `trackProduct(productData, sendResponse)`
Start tracking a product's price.

**Parameters:**
- `productData` (object):
  - `name` (string): Product name
  - `url` (string): Product URL
  - `currentPrice` (number): Current price
  - `targetPrice` (number): Optional target price for alerts
  - `site` (string): E-commerce site name
  - `notifications` (boolean): Enable/disable alerts

**Example:**
```javascript
await priceTracker.trackProduct({
  name: 'iPhone 15 Pro',
  url: 'https://amazon.com/...',
  currentPrice: 999,
  targetPrice: 899,
  site: 'Amazon',
  notifications: true
});
```

##### `getPriceHistory(productId, sendResponse)`
Get price history for a tracked product.

**Returns:**
```javascript
{
  product: { name, url, ... },
  stats: {
    current: 999,
    lowest: 899,
    highest: 1099,
    average: 975,
    history: [
      { price: 999, timestamp: 1234567890 },
      ...
    ]
  }
}
```

##### `checkPrices()`
Check all tracked products for price changes.

```javascript
await priceTracker.checkPrices();
```

##### `untrackProduct(productId)`
Stop tracking a product.

```javascript
await priceTracker.untrackProduct('product-id-123');
```

---

## Task Scheduler

### Class: `TaskScheduler`

#### Methods

##### `scheduleTask(task, sendResponse)`
Schedule a recurring task.

**Parameters:**
- `task` (object):
  - `name` (string): Task name
  - `command` (string): Command to execute
  - `schedule` (string): Schedule pattern

**Schedule Patterns:**
- `"every X minutes"` - Every X minutes
- `"daily at HH:MM"` - Daily at specific time
- `"every Monday at HH:MM"` - Weekly (coming soon)

**Example:**
```javascript
await taskScheduler.scheduleTask({
  name: 'Daily News Check',
  command: 'Get latest news on technology',
  schedule: 'daily at 09:00'
});
```

##### `deleteTask(taskId)`
Delete a scheduled task.

```javascript
await taskScheduler.deleteTask('task-id-123');
```

##### `toggleTask(taskId, enabled)`
Enable or disable a task.

```javascript
await taskScheduler.toggleTask('task-id-123', false);
```

---

## Content Script

### Available Message Types

#### `SCRAPE_WIKIPEDIA`
Scrape Wikipedia article data.

```javascript
chrome.tabs.sendMessage(tabId, {
  type: 'SCRAPE_WIKIPEDIA',
  subject: 'Albert Einstein'
}, (response) => {
  console.log(response.data);
  // { title, summary, infobox, sections }
});
```

#### `SCRAPE_PRICES`
Scrape product prices from e-commerce site.

```javascript
chrome.tabs.sendMessage(tabId, {
  type: 'SCRAPE_PRICES',
  selector: '.a-price-whole'
}, (response) => {
  console.log(response.prices);
  // [{ price, priceText, name, url }, ...]
});
```

#### `GET_PAGE_CONTENT`
Get current page content.

```javascript
chrome.tabs.sendMessage(tabId, {
  type: 'GET_PAGE_CONTENT'
}, (response) => {
  console.log(response.content);
  // { url, title, text, html, metadata }
});
```

#### `FILL_FORM`
Auto-fill form fields.

```javascript
chrome.tabs.sendMessage(tabId, {
  type: 'FILL_FORM',
  formData: {
    email: 'user@example.com',
    name: 'John Doe'
  }
});
```

---

## Message Protocol

### Background ← → Popup

#### Execute Command
```javascript
// Popup → Background
chrome.runtime.sendMessage({
  type: 'EXECUTE_COMMAND',
  command: 'Search for Einstein on Wikipedia'
}, (response) => {
  if (response.success) {
    console.log(response.result);
  } else {
    console.error(response.error);
  }
});
```

#### Set API Key
```javascript
// Popup → Background
chrome.runtime.sendMessage({
  type: 'SET_API_KEY',
  apiKey: 'your-api-key-here'
}, (response) => {
  console.log(response.message);
});
```

#### Track Product
```javascript
// Popup → Background
chrome.runtime.sendMessage({
  type: 'TRACK_PRODUCT',
  productData: {
    name: 'Product Name',
    url: 'https://...',
    currentPrice: 99.99,
    site: 'Amazon'
  }
});
```

#### Schedule Task
```javascript
// Popup → Background
chrome.runtime.sendMessage({
  type: 'SCHEDULE_TASK',
  task: {
    name: 'Task Name',
    command: 'Command to execute',
    schedule: 'daily at 09:00'
  }
});
```

#### Get Status
```javascript
// Popup → Background
chrome.runtime.sendMessage({
  type: 'GET_STATUS'
}, (response) => {
  console.log(response.initialized); // boolean
  console.log(response.hasApiKey);   // boolean
});
```

---

## Storage Schema

### chrome.storage.local

#### `gemini_api_key`
```javascript
{
  gemini_api_key: 'your-api-key-here'
}
```

#### `tracked_products`
```javascript
{
  tracked_products: {
    'product-id-1': {
      id: 'product-id-1',
      name: 'iPhone 15',
      url: 'https://...',
      currentPrice: 999,
      targetPrice: 899,
      site: 'Amazon',
      addedAt: 1234567890,
      lastChecked: 1234567890,
      notifications: true
    },
    // ...
  }
}
```

#### `price_history`
```javascript
{
  price_history: {
    'product-id-1': [
      { price: 999, timestamp: 1234567890 },
      { price: 979, timestamp: 1234567900 },
      // ...
    ]
  }
}
```

#### `scheduled_tasks`
```javascript
{
  scheduled_tasks: {
    'task-id-1': {
      id: 'task-id-1',
      name: 'Daily News',
      command: 'Get latest news',
      schedule: 'daily at 09:00',
      enabled: true,
      createdAt: 1234567890,
      lastRun: 1234567890,
      nextRun: 1234567890
    }
  }
}
```

#### `command_history`
```javascript
{
  command_history: [
    {
      command: 'Search for Einstein',
      timestamp: 1234567890
    },
    // ... (max 50 items)
  ]
}
```

---

## Error Handling

### Error Response Format
```javascript
{
  error: 'Error message',
  code: 'ERROR_CODE', // optional
  details: { ... }    // optional
}
```

### Common Error Codes
- `API_KEY_MISSING`: Gemini API key not configured
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INVALID_COMMAND`: Command could not be parsed
- `SCRAPING_FAILED`: Web scraping error
- `NETWORK_ERROR`: Network request failed

---

## Rate Limiting

### Gemini API Limits
- **Requests per minute**: 60
- **Requests per day**: 1500

### Checking Rate Limit
```javascript
const canMakeRequest = gemini.checkRateLimit();
if (!canMakeRequest) {
  console.log('Rate limit exceeded');
}
```

---

## Best Practices

1. **Always check for errors** in responses
2. **Use structured output** when you need specific data format
3. **Implement retries** for network failures
4. **Respect rate limits** to avoid API blocks
5. **Validate user input** before sending to AI
6. **Cache results** when appropriate
7. **Handle timeouts** for long-running operations

---

## Examples

### Complete Wikipedia Search Flow
```javascript
// 1. Parse command
const parsed = await commandParser.parse(
  'Search for Marie Curie on Wikipedia',
  geminiAI
);

// 2. Execute search
const tab = await chrome.tabs.create({
  url: 'https://en.wikipedia.org/wiki/Marie_Curie'
});

// 3. Wait and scrape
setTimeout(async () => {
  const result = await chrome.tabs.sendMessage(tab.id, {
    type: 'SCRAPE_WIKIPEDIA',
    subject: 'Marie Curie'
  });
  
  console.log(result.data);
}, 3000);
```

### Complete Price Tracking Flow
```javascript
// 1. Track product
const productId = await priceTracker.trackProduct({
  name: 'MacBook Pro M3',
  url: 'https://amazon.com/...',
  currentPrice: 1999,
  targetPrice: 1799,
  site: 'Amazon'
});

// 2. Get history
const history = await priceTracker.getPriceHistory(productId);

// 3. Analyze trends
const analysis = await priceTracker.analyzePriceTrends(
  productId,
  geminiAI
);
```

---

For more examples, see the `examples/` directory (coming soon).
