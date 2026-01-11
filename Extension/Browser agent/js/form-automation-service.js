// Form Automation Service - Intelligent form filling
export class FormAutomationService {
    constructor() {
        this.savedProfiles = new Map();
        this.formHistory = [];
    }

    async initialize() {
        const data = await chrome.storage.local.get(['form_profiles', 'form_history']);

        if (data.form_profiles) {
            this.savedProfiles = new Map(Object.entries(data.form_profiles));
        }

        if (data.form_history) {
            this.formHistory = data.form_history;
        }

        console.log('📝 Form Automation initialized');
    }

    async saveProfile(name, profileData) {
        this.savedProfiles.set(name, {
            name,
            data: profileData,
            createdAt: Date.now(),
            lastUsed: Date.now()
        });

        await this.saveToStorage();
        return { success: true, profileName: name };
    }

    async fillForm(tabId, profileName) {
        const profile = this.savedProfiles.get(profileName);

        if (!profile) {
            return { success: false, error: 'Profile not found' };
        }

        try {
            await chrome.tabs.sendMessage(tabId, {
                type: 'FILL_FORM',
                formData: profile.data
            });

            // Update last used
            profile.lastUsed = Date.now();
            await this.saveToStorage();

            // Add to history
            this.formHistory.unshift({
                profileName,
                timestamp: Date.now(),
                tabId
            });

            if (this.formHistory.length > 100) {
                this.formHistory = this.formHistory.slice(0, 100);
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async detectFormFields(tabId) {
        try {
            const response = await chrome.tabs.sendMessage(tabId, {
                type: 'DETECT_FORM_FIELDS'
            });

            return response;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async smartFillForm(tabId, context, geminiAI) {
        // Use AI to intelligently fill form based on context
        const fields = await this.detectFormFields(tabId);

        if (!fields.success) {
            return fields;
        }

        const prompt = `Based on this context, suggest values for these form fields:

Context: ${JSON.stringify(context)}

Form fields: ${JSON.stringify(fields.fields)}

Return a JSON object with field names as keys and suggested values.`;

        try {
            const suggestions = await geminiAI.generateStructuredContent(prompt, {});

            await chrome.tabs.sendMessage(tabId, {
                type: 'FILL_FORM',
                formData: suggestions
            });

            return { success: true, filledFields: suggestions };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async autoCheckout(tabId, paymentProfile) {
        // Automated checkout with user confirmation
        const confirmation = await this.requestUserConfirmation(
            'Proceed with checkout?',
            'This will fill your payment and shipping information and proceed to checkout.'
        );

        if (!confirmation) {
            return { success: false, error: 'User cancelled' };
        }

        try {
            // Fill shipping info
            await chrome.tabs.sendMessage(tabId, {
                type: 'FILL_FORM',
                formData: paymentProfile.shipping
            });

            // Wait for page transition
            await this.sleep(1000);

            // Fill payment info (securely)
            await chrome.tabs.sendMessage(tabId, {
                type: 'FILL_PAYMENT',
                paymentData: paymentProfile.payment
            });

            return { success: true, message: 'Checkout information filled. Please review and confirm.' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async addToCart(tabId, productSelector) {
        try {
            await chrome.tabs.sendMessage(tabId, {
                type: 'CLICK_ELEMENT',
                selector: productSelector || '[data-action="add-to-cart"], .add-to-cart, button[name="add-to-cart"]'
            });

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async requestUserConfirmation(title, message) {
        return new Promise((resolve) => {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icon48.png',
                title: title,
                message: message,
                buttons: [
                    { title: 'Confirm' },
                    { title: 'Cancel' }
                ],
                requireInteraction: true
            }, (notificationId) => {
                chrome.notifications.onButtonClicked.addListener((id, buttonIndex) => {
                    if (id === notificationId) {
                        chrome.notifications.clear(id);
                        resolve(buttonIndex === 0);
                    }
                });
            });
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async saveToStorage() {
        const profilesObj = Object.fromEntries(this.savedProfiles);
        await chrome.storage.local.set({
            form_profiles: profilesObj,
            form_history: this.formHistory
        });
    }

    getProfiles() {
        return Array.from(this.savedProfiles.values());
    }

    async deleteProfile(name) {
        this.savedProfiles.delete(name);
        await this.saveToStorage();
    }
}

export default FormAutomationService;
