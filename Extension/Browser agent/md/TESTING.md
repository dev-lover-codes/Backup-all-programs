# Testing Guide for AI Browser Agent

## Pre-Installation Testing

### 1. File Verification
Run the setup script to verify all files are present:
```powershell
.\setup.ps1
```

Expected output: All files should show ✓ (green checkmark)

## Installation Testing

### 1. Load Extension in Chrome
1. Open Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the extension directory

**Expected Result**: Extension should load without errors

### 2. Check for Errors
1. Click "Details" on the extension
2. Click "Inspect views: service worker"
3. Check Console tab for errors

**Expected Result**: Should see "🤖 AI Browser Agent initializing..." message

## API Configuration Testing

### 1. Initial State
1. Click extension icon
2. Should see API key setup screen

**Expected Result**: 
- Status shows "Not configured"
- API key input field visible
- Link to get API key present

### 2. API Key Setup
1. Enter a test API key (get from https://makersuite.google.com/app/apikey)
2. Click "Save API Key"

**Expected Result**:
- Success notification appears
- Interface switches to main view
- Status shows "Ready"

### 3. Invalid API Key
1. Enter invalid key (e.g., "test123")
2. Try to execute a command

**Expected Result**: Should show error message about invalid API key

## Command Execution Testing

### Test 1: Wikipedia Search
**Command**: `Search for Albert Einstein on Wikipedia`

**Expected Result**:
- Loading overlay appears
- New tab opens to Wikipedia
- After ~3 seconds, result card appears with:
  - Title: "Albert Einstein"
  - Summary paragraph
  - Quick facts from infobox
  - Copy and Share buttons

### Test 2: Price Comparison
**Command**: `Find the best price for iPhone 15`

**Expected Result**:
- Multiple tabs open (Amazon, eBay, etc.)
- Result card shows prices from different sites
- Each price includes site name and amount

### Test 3: News Search
**Command**: `Get latest news on artificial intelligence`

**Expected Result**:
- Result card with AI-generated news summary
- Summary includes key points
- Sources mentioned (if available)

### Test 4: Page Summarization
1. Navigate to any article (e.g., Wikipedia, news site)
2. Click extension icon
3. Click "📄 Summarize Page" quick action

**Expected Result**:
- Loading overlay appears
- Summary of current page appears in result card
- Key points highlighted

### Test 5: Invalid Command
**Command**: `asdfghjkl random gibberish`

**Expected Result**:
- AI attempts to interpret
- Either executes as general query or shows error
- No crashes

## Price Tracking Testing

### Test 1: Track a Product
**Command**: `Track price for MacBook Pro M3`

**Expected Result**:
- Success notification
- Product appears in "Tracked Items" tab
- Shows current price, site, and date added

### Test 2: View Tracked Items
1. Switch to "Tracked Items" tab

**Expected Result**:
- All tracked products listed
- Each shows name, current price, site
- "History" and "Remove" buttons present

### Test 3: Remove Tracked Item
1. Click "Remove" on a tracked item

**Expected Result**:
- Item removed from list
- If no items left, shows empty state

## Task Scheduling Testing

### Test 1: Schedule a Task
**Command**: `Check for sales on laptops every day at 9 AM`

**Expected Result**:
- Success notification
- Task appears in "Scheduled Tasks" tab
- Shows task name, schedule, and command
- Toggle is ON (active)

### Test 2: Toggle Task
1. Go to "Scheduled Tasks" tab
2. Click toggle switch on a task

**Expected Result**:
- Toggle switches state
- Task enabled/disabled accordingly

### Test 3: View Scheduled Tasks
1. Switch to "Scheduled Tasks" tab

**Expected Result**:
- All scheduled tasks listed
- Each shows name, schedule, command
- Toggle switch shows current state

## History Testing

### Test 1: Command History
1. Execute several commands
2. Switch to "History" tab

**Expected Result**:
- All commands listed in reverse chronological order
- Each shows command text and time ago
- Clicking a history item populates command input

### Test 2: History Persistence
1. Execute commands
2. Close popup
3. Reopen popup
4. Check History tab

**Expected Result**: History persists across sessions

## UI/UX Testing

### Test 1: Tab Switching
1. Click each tab (Results, Tracked Items, Scheduled Tasks, History)

**Expected Result**:
- Smooth transition between tabs
- Active tab highlighted
- Content updates correctly

### Test 2: Quick Actions
1. Click each quick action button

**Expected Result**:
- Command input populated with template
- Cursor focuses on input field

### Test 3: Responsive Design
1. Resize popup (if possible)
2. Check on different screen sizes

**Expected Result**:
- Layout remains usable
- No overflow issues
- Text remains readable

### Test 4: Dark Theme
**Expected Result**:
- All text readable
- Proper contrast
- No white backgrounds bleeding through

## Performance Testing

### Test 1: Multiple Commands
1. Execute 5-10 commands rapidly

**Expected Result**:
- No crashes
- Results appear correctly
- No memory leaks (check in Task Manager)

### Test 2: Large Results
1. Search for topic with lots of data
2. Check result display

**Expected Result**:
- Results display without lag
- Scrolling is smooth
- No UI freezing

### Test 3: Background Processing
1. Execute a command
2. Close popup while processing
3. Reopen popup

**Expected Result**:
- Command continues processing
- Result appears when ready

## Error Handling Testing

### Test 1: Network Error
1. Disconnect internet
2. Try to execute command

**Expected Result**:
- Appropriate error message
- No crashes
- Can retry when connection restored

### Test 2: Invalid Selector
1. Try to scrape a page with invalid selectors

**Expected Result**:
- Graceful error handling
- Error message displayed
- Extension remains functional

### Test 3: Rate Limiting
1. Execute many commands quickly (60+ in a minute)

**Expected Result**:
- Rate limit message appears
- No API calls made beyond limit
- Resets after 1 minute

## Security Testing

### Test 1: API Key Storage
1. Save API key
2. Open Chrome DevTools
3. Check Application > Storage > Local Storage

**Expected Result**:
- API key stored in chrome.storage.local
- Not visible in regular local storage
- Encrypted if possible

### Test 2: Content Script Isolation
1. Open DevTools on a page
2. Check for extension variables in page context

**Expected Result**:
- Extension code isolated from page
- No conflicts with page scripts

## Browser Compatibility Testing

### Test on Different Chrome Versions
- Latest Chrome stable
- Chrome Beta (if available)
- Chromium-based browsers (Edge, Brave)

**Expected Result**: Works consistently across versions

## Cleanup Testing

### Test 1: Uninstall
1. Remove extension
2. Check chrome.storage

**Expected Result**:
- All data cleared
- No remnants left

### Test 2: Data Reset
1. Clear extension data
2. Reload extension

**Expected Result**:
- Returns to initial state
- API key prompt appears

## Known Issues to Test For

1. **Wikipedia Scraping**: Some pages may have different structure
2. **Price Scraping**: Sites may block automated access
3. **Rate Limits**: Gemini API has usage limits
4. **Popup Size**: May vary across systems

## Reporting Issues

When reporting bugs, include:
1. Chrome version
2. Extension version
3. Command executed
4. Expected vs actual result
5. Console errors (if any)
6. Screenshots

## Test Checklist

- [ ] Extension loads without errors
- [ ] API key setup works
- [ ] Wikipedia search works
- [ ] Price comparison works
- [ ] News search works
- [ ] Page summarization works
- [ ] Price tracking works
- [ ] Task scheduling works
- [ ] Command history works
- [ ] All tabs switch correctly
- [ ] Quick actions work
- [ ] UI is responsive
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Error handling is graceful

---

**Testing Complete!** 🎉

If all tests pass, the extension is ready for use!
