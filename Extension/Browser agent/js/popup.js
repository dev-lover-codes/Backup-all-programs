// Popup UI Controller
class PopupController {
    constructor() {
        this.currentTab = 'results';
        this.commandHistory = [];
        this.isInitialized = false;
    }

    async initialize() {
        console.log('🎨 Initializing popup UI');

        // Check if extension is initialized
        const response = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });

        if (response.initialized && response.hasApiKey) {
            this.showMainInterface();
            this.isInitialized = true;
        } else {
            this.showApiSetup();
        }

        this.setupEventListeners();
        await this.loadData();
    }

    setupEventListeners() {
        // API Key Setup
        const saveApiKeyBtn = document.getElementById('saveApiKey');
        const apiKeyInput = document.getElementById('apiKeyInput');

        if (saveApiKeyBtn) {
            saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
            apiKeyInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.saveApiKey();
            });
        }

        // Command Execution
        const executeBtn = document.getElementById('executeCommand');
        const commandInput = document.getElementById('commandInput');

        if (executeBtn) {
            executeBtn.addEventListener('click', () => this.executeCommand());
            commandInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.executeCommand();
            });
        }

        // Quick Actions
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const command = e.target.dataset.command;
                commandInput.value = command;
                commandInput.focus();
            });
        });

        // Tab Switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    async saveApiKey() {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const apiKey = apiKeyInput.value.trim();

        if (!apiKey) {
            this.showNotification('Please enter a valid API key', 'error');
            return;
        }

        this.showLoading(true);

        try {
            const response = await chrome.runtime.sendMessage({
                type: 'SET_API_KEY',
                apiKey: apiKey
            });

            if (response.success) {
                this.showNotification('API key saved successfully!', 'success');
                setTimeout(() => {
                    this.showMainInterface();
                    this.isInitialized = true;
                }, 1000);
            } else {
                this.showNotification('Failed to save API key', 'error');
            }
        } catch (error) {
            this.showNotification('Error: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async executeCommand() {
        const commandInput = document.getElementById('commandInput');
        const command = commandInput.value.trim();

        if (!command) {
            return;
        }

        // Add to history
        this.commandHistory.unshift({
            command,
            timestamp: Date.now()
        });

        // Save history
        await chrome.storage.local.set({
            command_history: this.commandHistory.slice(0, 50)
        });

        this.showLoading(true);

        try {
            const response = await chrome.runtime.sendMessage({
                type: 'EXECUTE_COMMAND',
                command: command
            });

            if (response.error) {
                this.showNotification('Error: ' + response.error, 'error');
            } else {
                this.displayResult(response.result, command);
                commandInput.value = '';
            }
        } catch (error) {
            this.showNotification('Error: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    displayResult(result, command) {
        const resultsContainer = document.getElementById('resultsContainer');
        const emptyState = document.getElementById('emptyState');

        emptyState.style.display = 'none';
        resultsContainer.style.display = 'block';

        const resultCard = document.createElement('div');
        resultCard.className = 'result-card';

        let content = '';
        let actionType = 'Result';

        // Format based on result type
        if (result.data) {
            // Wikipedia result
            actionType = 'Wikipedia';
            content = `
        <h3>${result.data.title}</h3>
        <p>${result.data.summary}</p>
        ${Object.keys(result.data.infobox).length > 0 ? `
          <div style="margin-top: 12px;">
            <strong>Quick Facts:</strong>
            <ul style="margin-top: 8px; padding-left: 20px;">
              ${Object.entries(result.data.infobox).slice(0, 5).map(([key, value]) =>
                `<li><strong>${key}:</strong> ${value}</li>`
            ).join('')}
            </ul>
          </div>
        ` : ''}
      `;
        } else if (result.comparisons) {
            // Price comparison result
            actionType = 'Price Comparison';
            content = `
        <h3>${result.product}</h3>
        <div style="margin-top: 12px;">
          ${result.comparisons.map(comp => `
            <div style="margin-bottom: 8px; padding: 8px; background: var(--bg-tertiary); border-radius: 6px;">
              <strong>${comp.site}</strong>: $${comp.prices?.[0]?.price || 'N/A'}
            </div>
          `).join('')}
        </div>
      `;
        } else if (result.summary) {
            // Summary result
            actionType = 'Summary';
            content = `<p>${result.summary}</p>`;
        } else if (result.plan) {
            // Travel plan
            actionType = 'Travel Plan';
            content = `
        <h3>${result.destination}</h3>
        <div style="white-space: pre-wrap; margin-top: 12px;">${result.plan}</div>
      `;
        } else {
            // Generic result
            content = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
        }

        resultCard.innerHTML = `
      <div class="result-header">
        <div class="result-title">${command}</div>
        <div class="result-badge">${actionType}</div>
      </div>
      <div class="result-content">
        ${content}
      </div>
      <div class="result-actions">
        <button class="result-btn copy-btn">📋 Copy</button>
        <button class="result-btn share-btn">🔗 Share</button>
      </div>
    `;

        // Add event listeners
        const copyBtn = resultCard.querySelector('.copy-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(content);
            this.showNotification('Copied to clipboard!', 'success');
        });

        resultsContainer.insertBefore(resultCard, resultsContainer.firstChild);

        // Switch to results tab
        this.switchTab('results');
    }

    async loadData() {
        // Load tracked products
        await this.loadTrackedProducts();

        // Load scheduled tasks
        await this.loadScheduledTasks();

        // Load command history
        await this.loadCommandHistory();
    }

    async loadTrackedProducts() {
        const data = await chrome.storage.local.get('tracked_products');
        const trackedList = document.getElementById('trackedList');

        if (!data.tracked_products || Object.keys(data.tracked_products).length === 0) {
            trackedList.innerHTML = '<div class="empty-state"><p>No items being tracked</p></div>';
            return;
        }

        trackedList.innerHTML = '';

        for (const [id, product] of Object.entries(data.tracked_products)) {
            const item = document.createElement('div');
            item.className = 'tracked-item';

            item.innerHTML = `
        <div class="tracked-item-header">
          <div class="tracked-item-name">${product.name}</div>
          <div class="tracked-item-price">
            $${product.currentPrice}
            ${product.targetPrice ? `<span class="price-change">Target: $${product.targetPrice}</span>` : ''}
          </div>
        </div>
        <div class="tracked-item-meta">
          <span>📍 ${product.site}</span>
          <span>📅 ${new Date(product.addedAt).toLocaleDateString()}</span>
        </div>
        <div class="tracked-item-actions">
          <button class="result-btn view-history-btn" data-id="${id}">📊 History</button>
          <button class="result-btn untrack-btn" data-id="${id}">🗑️ Remove</button>
        </div>
      `;

            trackedList.appendChild(item);
        }

        // Add event listeners
        document.querySelectorAll('.untrack-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                this.untrackProduct(productId);
            });
        });
    }

    async loadScheduledTasks() {
        const data = await chrome.storage.local.get('scheduled_tasks');
        const scheduledList = document.getElementById('scheduledList');

        if (!data.scheduled_tasks || Object.keys(data.scheduled_tasks).length === 0) {
            scheduledList.innerHTML = '<div class="empty-state"><p>No scheduled tasks</p></div>';
            return;
        }

        scheduledList.innerHTML = '';

        for (const [id, task] of Object.entries(data.scheduled_tasks)) {
            const item = document.createElement('div');
            item.className = 'scheduled-task';

            item.innerHTML = `
        <div class="task-header">
          <div class="task-name">${task.name}</div>
          <div class="task-toggle ${task.enabled ? 'active' : ''}" data-id="${id}"></div>
        </div>
        <div class="task-schedule">⏰ ${task.schedule}</div>
        <div class="task-command">${task.command}</div>
      `;

            scheduledList.appendChild(item);
        }

        // Add toggle listeners
        document.querySelectorAll('.task-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const taskId = e.target.dataset.id;
                const enabled = !e.target.classList.contains('active');
                this.toggleTask(taskId, enabled);
                e.target.classList.toggle('active');
            });
        });
    }

    async loadCommandHistory() {
        const data = await chrome.storage.local.get('command_history');
        const historyList = document.getElementById('historyList');

        if (!data.command_history || data.command_history.length === 0) {
            historyList.innerHTML = '<div class="empty-state"><p>No command history</p></div>';
            return;
        }

        historyList.innerHTML = '';

        data.command_history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';

            const timeAgo = this.getTimeAgo(item.timestamp);

            historyItem.innerHTML = `
        <div class="history-command">${item.command}</div>
        <div class="history-time">${timeAgo}</div>
      `;

            historyItem.addEventListener('click', () => {
                document.getElementById('commandInput').value = item.command;
                this.switchTab('results');
            });

            historyList.appendChild(historyItem);
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            }
        });

        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        document.getElementById(`${tabName}Panel`).classList.add('active');
        this.currentTab = tabName;
    }

    showApiSetup() {
        document.getElementById('apiSetup').style.display = 'block';
        document.getElementById('mainInterface').style.display = 'none';

        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');

        statusDot.classList.add('inactive');
        statusText.textContent = 'Not configured';
    }

    showMainInterface() {
        document.getElementById('apiSetup').style.display = 'none';
        document.getElementById('mainInterface').style.display = 'flex';

        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');

        statusDot.classList.remove('inactive');
        statusText.textContent = 'Ready';
    }

    showLoading(show) {
        document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
    }

    showNotification(message, type = 'info') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'AI Browser Agent',
            message: message
        });
    }

    async untrackProduct(productId) {
        // This would call the background script to untrack
        await this.loadTrackedProducts();
    }

    async toggleTask(taskId, enabled) {
        // This would call the background script to toggle task
        console.log('Toggle task:', taskId, enabled);
    }

    getTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    }
}

// Initialize popup
const popup = new PopupController();
popup.initialize();
