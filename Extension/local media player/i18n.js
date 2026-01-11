// ========================================
// Internationalization (i18n) Module
// ========================================

const i18n = {
    currentLanguage: 'en',

    // Available languages
    languages: {
        'en': 'English',
        'es': 'Español',
        'hi': 'हिंदी',
        'fr': 'Français',
        'de': 'Deutsch',
        'zh': '中文',
        'ja': '日本語'
    },

    // Initialize i18n system
    init() {
        // Load saved language or use browser default
        const savedLang = localStorage.getItem('selectedLanguage');
        const browserLang = navigator.language.split('-')[0]; // Get 'en' from 'en-US'

        this.currentLanguage = savedLang || (this.languages[browserLang] ? browserLang : 'en');
        this.apply();
    },

    // Get translated message
    getMessage(key) {
        return chrome.i18n.getMessage(key) || key;
    },

    // Apply translations to all elements with data-i18n attribute
    apply() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const message = this.getMessage(key);

            if (element.tagName === 'INPUT' && element.type !== 'button') {
                element.placeholder = message;
            } else {
                element.textContent = message;
            }
        });

        // Apply to title attributes
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.getMessage(key);
        });

        // Save current language
        localStorage.setItem('selectedLanguage', this.currentLanguage);
    },

    // Change language
    setLanguage(langCode) {
        if (!this.languages[langCode]) return;

        this.currentLanguage = langCode;
        this.apply();

        // Trigger event for app to re-render if needed
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: langCode } }));
    },

    // Get current language code
    getCurrentLanguage() {
        return this.currentLanguage;
    },

    // Get all available languages
    getAvailableLanguages() {
        return this.languages;
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}
