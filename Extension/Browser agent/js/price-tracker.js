// Price Tracker Service - Monitor product prices across e-commerce sites
export class PriceTracker {
    constructor() {
        this.trackedProducts = new Map();
        this.priceHistory = new Map();
    }

    async initialize() {
        // Load tracked products from storage
        const data = await chrome.storage.local.get(['tracked_products', 'price_history']);

        if (data.tracked_products) {
            this.trackedProducts = new Map(Object.entries(data.tracked_products));
        }

        if (data.price_history) {
            this.priceHistory = new Map(Object.entries(data.price_history));
        }

        // Set up periodic price checks (every 6 hours)
        chrome.alarms.create('price_check_all', {
            periodInMinutes: 360
        });

        console.log('📊 Price Tracker initialized with', this.trackedProducts.size, 'products');
    }

    async trackProduct(productData, sendResponse) {
        const productId = this.generateProductId(productData.name, productData.url);

        const product = {
            id: productId,
            name: productData.name,
            url: productData.url,
            targetPrice: productData.targetPrice || null,
            currentPrice: productData.currentPrice,
            site: productData.site,
            addedAt: Date.now(),
            lastChecked: Date.now(),
            notifications: productData.notifications !== false
        };

        this.trackedProducts.set(productId, product);

        // Initialize price history
        if (!this.priceHistory.has(productId)) {
            this.priceHistory.set(productId, []);
        }

        this.addPricePoint(productId, productData.currentPrice);

        await this.saveToStorage();

        if (sendResponse) {
            sendResponse({
                success: true,
                productId,
                message: `Now tracking ${product.name}`
            });
        }

        return productId;
    }

    async untrackProduct(productId) {
        this.trackedProducts.delete(productId);
        await this.saveToStorage();
    }

    async checkPrices() {
        console.log('🔍 Checking prices for', this.trackedProducts.size, 'products');

        for (const [productId, product] of this.trackedProducts) {
            try {
                const newPrice = await this.fetchCurrentPrice(product.url);

                if (newPrice && newPrice !== product.currentPrice) {
                    const priceChange = newPrice - product.currentPrice;
                    const percentChange = ((priceChange / product.currentPrice) * 100).toFixed(2);

                    // Update product
                    product.currentPrice = newPrice;
                    product.lastChecked = Date.now();

                    // Add to history
                    this.addPricePoint(productId, newPrice);

                    // Check if we should notify
                    if (product.notifications) {
                        if (product.targetPrice && newPrice <= product.targetPrice) {
                            this.sendPriceAlert(product, 'TARGET_REACHED', {
                                newPrice,
                                targetPrice: product.targetPrice
                            });
                        } else if (priceChange < 0) {
                            this.sendPriceAlert(product, 'PRICE_DROP', {
                                newPrice,
                                oldPrice: product.currentPrice,
                                percentChange
                            });
                        }
                    }
                }
            } catch (error) {
                console.error(`Error checking price for ${product.name}:`, error);
            }
        }

        await this.saveToStorage();
    }

    async fetchCurrentPrice(url) {
        // This would need to be implemented with actual scraping logic
        // For now, return a simulated price
        return null;
    }

    addPricePoint(productId, price) {
        const history = this.priceHistory.get(productId) || [];

        history.push({
            price,
            timestamp: Date.now()
        });

        // Keep only last 100 data points
        if (history.length > 100) {
            history.shift();
        }

        this.priceHistory.set(productId, history);
    }

    async getPriceHistory(productId, sendResponse) {
        const history = this.priceHistory.get(productId) || [];
        const product = this.trackedProducts.get(productId);

        if (!product) {
            sendResponse({ error: 'Product not found' });
            return;
        }

        // Calculate statistics
        const prices = history.map(h => h.price);
        const stats = {
            current: product.currentPrice,
            lowest: Math.min(...prices),
            highest: Math.max(...prices),
            average: prices.reduce((a, b) => a + b, 0) / prices.length,
            history: history
        };

        sendResponse({
            success: true,
            product,
            stats
        });
    }

    sendPriceAlert(product, alertType, data) {
        let message = '';

        switch (alertType) {
            case 'TARGET_REACHED':
                message = `${product.name} reached your target price of $${data.targetPrice}! Current price: $${data.newPrice}`;
                break;

            case 'PRICE_DROP':
                message = `${product.name} price dropped by ${Math.abs(data.percentChange)}%! Now $${data.newPrice}`;
                break;
        }

        chrome.notifications.create({
            type: 'basic',
            iconUrl: '../icons/icon48.png',
            title: '💰 Price Alert',
            message: message,
            buttons: [
                { title: 'View Product' },
                { title: 'Dismiss' }
            ]
        });
    }

    generateProductId(name, url) {
        return `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    }

    async saveToStorage() {
        const trackedProductsObj = Object.fromEntries(this.trackedProducts);
        const priceHistoryObj = Object.fromEntries(this.priceHistory);

        await chrome.storage.local.set({
            tracked_products: trackedProductsObj,
            price_history: priceHistoryObj
        });
    }

    getTrackedProducts() {
        return Array.from(this.trackedProducts.values());
    }

    async analyzePriceTrends(productId, geminiAI) {
        const history = this.priceHistory.get(productId);
        const product = this.trackedProducts.get(productId);

        if (!history || !product) {
            return null;
        }

        const prompt = `Analyze this price history for ${product.name} and provide insights:
    
Price History: ${JSON.stringify(history)}

Provide:
1. Overall trend (increasing, decreasing, stable)
2. Best time to buy based on patterns
3. Price prediction for next week
4. Any seasonal patterns detected`;

        return await geminiAI.generateContent(prompt);
    }
}

export default PriceTracker;
