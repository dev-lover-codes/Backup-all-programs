// Injected Script - Runs in page context for deeper access
(function () {
    'use strict';

    console.log('🔧 AI Browser Agent injected script loaded');

    // This script runs in the page context, not the extension context
    // It can access page variables and functions that content scripts cannot

    // Helper to safely access page data
    window.__AI_AGENT__ = {
        version: '1.0.0',

        // Extract React/Vue component data
        getComponentData: function () {
            // Try to find React root
            const reactRoot = document.querySelector('[data-reactroot]');
            if (reactRoot && reactRoot._reactRootContainer) {
                return 'React app detected';
            }

            // Try to find Vue instance
            if (window.__VUE__) {
                return 'Vue app detected';
            }

            return null;
        },

        // Get all global variables
        getGlobalVars: function () {
            const globals = {};
            for (let key in window) {
                if (window.hasOwnProperty(key) && typeof window[key] !== 'function') {
                    try {
                        globals[key] = typeof window[key];
                    } catch (e) {
                        // Skip inaccessible properties
                    }
                }
            }
            return globals;
        },

        // Monitor network requests
        interceptFetch: function () {
            const originalFetch = window.fetch;
            window.fetch = function (...args) {
                console.log('Fetch request:', args[0]);
                return originalFetch.apply(this, args);
            };
        },

        // Get page performance data
        getPerformance: function () {
            if (window.performance && window.performance.timing) {
                const timing = window.performance.timing;
                return {
                    loadTime: timing.loadEventEnd - timing.navigationStart,
                    domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                    responseTime: timing.responseEnd - timing.requestStart
                };
            }
            return null;
        }
    };

    // Notify content script that injected script is ready
    window.postMessage({ type: 'AI_AGENT_INJECTED_READY' }, '*');

})();
