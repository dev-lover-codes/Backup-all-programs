# AI Browser Agent - Powered by Gemini API

<div align="center">

![AI Browser Agent](icons/icon128.png)

**An intelligent Chrome extension that uses Google's Gemini AI to automate browsing tasks, scrape data, compare prices, and much more.**



</div>

---

## 🌟 Features

### 🤖 AI-Powered Automation
- **Natural Language Commands**: Simply tell the AI what you want to do
- **Intelligent Command Parsing**: AI understands context and intent
- **Multi-Step Task Execution**: Complex workflows handled automatically

### 📚 Wikipedia Integration
- Search and scrape Wikipedia articles
- Extract structured data (biography, infobox, sections)
- Auto-format and export to Google Docs (coming soon)

### 💰 Price Tracking & Comparison
- Compare prices across Amazon, eBay, Walmart, Best Buy
- Track price history with visual graphs
- Get alerts when prices drop
- AI-powered price trend analysis

### 📰 News Aggregation
- Search latest news on any topic
- AI-generated summaries of articles
- Multi-source aggregation

### 📅 Task Scheduling
- Schedule recurring tasks (daily, hourly, custom intervals)
- Automated price checks
- Scheduled searches and reports

### 🎯 Content Summarization
- Summarize any web page instantly
- Extract key points from long articles
- AI-generated notes for quick reference

### 🌍 Travel Planning
- AI-powered trip planning
- Flight and hotel recommendations
- Local attractions and dining suggestions

### 🔍 Smart Web Scraping
- Extract data from any website
- Customizable selectors
- Structured data output

### 🔐 Security & Privacy
- API keys stored securely in local storage
- No data sent to third-party servers (except Gemini API)
- Full control over your data

---

## 🚀 Installation

### From Source (Developer Mode)

1. **Download** this project.

2. **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key for later use

3. **Load the Extension**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the extension directory

4. **Configure the Extension**:
   - Click the extension icon in your toolbar
   - Enter your Gemini API key when prompted
   - Click "Save API Key"

---

## 📖 Usage Guide

### Basic Commands

The extension understands natural language. Here are some examples:

#### Wikipedia Search
```
Search for Albert Einstein on Wikipedia
Find information about Marie Curie on Wikipedia
```

#### Price Comparison
```
Find the best price for iPhone 15
Compare prices for Sony WH-1000XM5
Check price for MacBook Pro M3
```

#### News Search
```
Get latest news on artificial intelligence
Show me news about climate change
What's happening with SpaceX today
```

#### Content Summarization
```
Summarize this page
Summarize the current article
Give me key points from this content
```

#### Travel Planning
```
Plan a trip to Paris
Help me plan a vacation to Tokyo
```

#### Task Scheduling
```
Check for sales on laptops every morning at 8 AM
Remind me to check news daily at 9:00
Track price for iPhone 15 every 6 hours
```

### Quick Actions

The popup includes quick action buttons for common tasks:
- **📄 Summarize Page**: Instantly summarize the current page
- **💰 Compare Prices**: Quick price comparison
- **📰 Latest News**: Get news on any topic

### Tracked Items

Monitor price changes for products you're interested in:
1. Use command: `Track price for [product name]`
2. View tracked items in the "Tracked Items" tab
3. Get notifications when prices drop
4. View price history graphs

### Scheduled Tasks

Automate recurring tasks:
1. Use command: `Schedule [task] every [interval]`
2. Manage tasks in the "Scheduled Tasks" tab
3. Toggle tasks on/off
4. View execution history

---

## 🏗️ Architecture

```
ai-browser-agent/
├── manifest.json              # Extension configuration
├── config.js                  # Global settings and API config
├── background.js              # Main service worker
├── content.js                 # Content script for page interaction
├── popup.html                 # Extension popup UI
├── popup.css                  # Popup styles
├── popup.js                   # Popup controller
    ├── icon48.png
    └── icon128.png
```

### Key Components

#### Background Service Worker (`background.js`)
- Orchestrates all AI operations
- Handles message passing between components
- Manages scheduled tasks and alarms
- Coordinates web scraping operations

#### Gemini AI Service (`services/gemini-service.js`)
- Wraps Gemini API calls
- Handles rate limiting
- Supports structured output
- Multi-turn conversations

#### Command Parser (`services/command-parser.js`)
- Pattern matching for common commands
- AI-powered intent recognition
- Parameter extraction
- Confidence scoring

#### Price Tracker (`services/price-tracker.js`)
- Multi-site price monitoring
- Price history management
- Alert system
- Trend analysis

#### Task Scheduler (`services/task-scheduler.js`)
- Cron-like scheduling
- Recurring task execution
- Task management (enable/disable/delete)

---

## 🔧 Configuration

### API Settings

Edit `config.js` to customize:

```javascript
export const CONFIG = {
  GEMINI_API_KEY: '', // Set via UI
  GEMINI_MODEL: 'gemini-pro',
  
  // Add or remove e-commerce sites
  ECOMMERCE_SITES: [
    { name: 'Amazon', url: 'amazon.com', selector: '.a-price-whole' },
    // Add more sites...
  ],
  
  // Customize rate limits
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_DAY: 1500
  }
};
```

### Feature Flags

Enable or disable features:

```javascript
FEATURES: {
  WIKIPEDIA_SEARCH: true,
  PRICE_COMPARISON: true,
  SOCIAL_MEDIA_AUTOMATION: false, // Requires OAuth
  VOICE_COMMANDS: false, // Future feature
  // ...
}
```

---

## 🛡️ Privacy & Security

### Data Handling
- **API Keys**: Stored locally using Chrome's storage API (encrypted)
- **User Data**: All data stays on your device
- **External Requests**: Only to Gemini API and websites you explicitly interact with
- **No Tracking**: We don't collect any analytics or usage data

### Permissions Explained
- `activeTab`: Access current tab for scraping
- `storage`: Save settings and tracked items
- `tabs`: Create tabs for automated searches
- `scripting`: Inject content scripts
- `notifications`: Show price alerts
- `alarms`: Schedule recurring tasks
- `contextMenus`: Right-click menu options
- `host_permissions`: Access websites for scraping

---

## 🚧 Limitations & Legal Considerations

### Important Notes

1. **Web Scraping**: 
   - Respect websites' Terms of Service
   - Use rate limiting to avoid overwhelming servers
   - Some sites may block automated access

2. **Content Download**:
   - Only download content you have rights to
   - Respect copyright and licensing
   - YouTube downloads require proper authorization

3. **Social Media Automation**:
   - Requires OAuth integration (not yet implemented)
   - Must comply with platform APIs and terms

4. **API Costs**:
   - Gemini API has usage limits
   - Monitor your API usage in Google Cloud Console
   - Free tier available with limitations

5. **Rate Limiting**:
   - Extension implements rate limiting
   - Avoid excessive API calls
   - Respect Gemini API quotas

---

## 🗺️ Roadmap

### Version 1.1 (Coming Soon)
- [ ] Google Docs integration for Wikipedia exports
- [ ] Price history visualization charts
- [ ] Email report generation
- [ ] Enhanced error handling

### Version 1.2
- [ ] Voice command support
- [ ] Multi-language support
- [ ] Social media OAuth integration
- [ ] Form auto-fill improvements

### Version 2.0
- [ ] Gemini Pro Vision for image analysis
- [ ] Browser automation workflows
- [ ] Custom scraping templates
- [ ] Cloud sync across devices
- [ ] Team collaboration features

---



## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI**: For providing the powerful AI capabilities
- **Chrome Extensions API**: For the robust extension framework
- **Open Source Community**: For inspiration and tools

---

## 📞 Support

- **Email**: support@example.com

---

## ⚠️ Disclaimer

This extension is provided "as is" without warranty of any kind. Use at your own risk. The developers are not responsible for:
- Violations of website Terms of Service
- API costs incurred
- Data loss or corruption
- Any damages resulting from use of this extension

Always ensure you have the right to access and use data from websites you interact with.

---

<div align="center">

**Made with ❤️ and AI**

</div>
