/**
 * Utility Helper Functions
 * Common utility functions used throughout the application
 * 
 * @author Kochi Metro Development Team
 * @version 2.0.0
 */

class Helpers {
    constructor() {
        this.debounceTimers = new Map();
        this.throttleTimers = new Map();
    }

    /**
     * Debounce function execution
     * @param {Function} func - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @param {string} key - Unique key for the debounce timer
     * @returns {Function} Debounced function
     */
    debounce(func, delay = CONSTANTS.UI.DEBOUNCE_DELAY, key = 'default') {
        return (...args) => {
            clearTimeout(this.debounceTimers.get(key));
            this.debounceTimers.set(key, setTimeout(() => func.apply(this, args), delay));
        };
    }

    /**
     * Throttle function execution
     * @param {Function} func - Function to throttle
     * @param {number} delay - Delay in milliseconds
     * @param {string} key - Unique key for the throttle timer
     * @returns {Function} Throttled function
     */
    throttle(func, delay = CONSTANTS.UI.DEBOUNCE_DELAY, key = 'default') {
        return (...args) => {
            if (!this.throttleTimers.get(key)) {
                func.apply(this, args);
                this.throttleTimers.set(key, setTimeout(() => {
                    this.throttleTimers.delete(key);
                }, delay));
            }
        };
    }

    /**
     * Format date to readable string
     * @param {Date|string|number} date - Date to format
     * @param {Object} options - Formatting options
     * @returns {string} Formatted date string
     */
    formatDate(date, options = {}) {
        try {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                throw new Error('Invalid date');
            }

            const defaultOptions = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };

            return dateObj.toLocaleDateString('en-IN', { ...defaultOptions, ...options });
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Invalid Date';
        }
    }

    /**
     * Get relative time string (e.g., "2 minutes ago")
     * @param {Date|string|number} date - Date to compare
     * @returns {string} Relative time string
     */
    getRelativeTime(date) {
        try {
            const dateObj = new Date(date);
            const now = new Date();
            const diffMs = now - dateObj;
            const diffSec = Math.floor(diffMs / 1000);
            const diffMin = Math.floor(diffSec / 60);
            const diffHour = Math.floor(diffMin / 60);
            const diffDay = Math.floor(diffHour / 24);

            if (diffSec < 60) return 'Just now';
            if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
            if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
            if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
            
            return this.formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (error) {
            console.error('Relative time calculation error:', error);
            return 'Unknown time';
        }
    }

    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid email
     */
    isValidEmail(email) {
        return typeof email === 'string' && CONSTANTS.VALIDATION.EMAIL_REGEX.test(email.trim());
    }

    /**
     * Validate employee ID
     * @param {string} employeeId - Employee ID to validate
     * @returns {boolean} True if valid employee ID
     */
    isValidEmployeeId(employeeId) {
        return typeof employeeId === 'string' && CONSTANTS.VALIDATION.EMPLOYEE_ID_REGEX.test(employeeId.trim());
    }

    /**
     * Validate train ID
     * @param {string} trainId - Train ID to validate
     * @returns {boolean} True if valid train ID
     */
    isValidTrainId(trainId) {
        return typeof trainId === 'string' && CONSTANTS.VALIDATION.TRAIN_ID_REGEX.test(trainId.trim());
    }

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} Validation result with score and feedback
     */
    validatePassword(password) {
        if (typeof password !== 'string') {
            return { isValid: false, score: 0, feedback: 'Password must be a string' };
        }

        const result = {
            isValid: false,
            score: 0,
            feedback: [],
            strength: 'weak'
        };

        // Length check
        if (password.length < CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH) {
            result.feedback.push(`Password must be at least ${CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH} characters long`);
        } else {
            result.score += 1;
        }

        // Character type checks
        if (/[a-z]/.test(password)) result.score += 1;
        if (/[A-Z]/.test(password)) result.score += 1;
        if (/\d/.test(password)) result.score += 1;
        if (/[^a-zA-Z\d]/.test(password)) result.score += 1;

        // Determine strength
        if (result.score >= 4) {
            result.strength = 'strong';
            result.isValid = true;
        } else if (result.score >= 3) {
            result.strength = 'good';
            result.isValid = true;
        } else if (result.score >= 2) {
            result.strength = 'fair';
        }

        if (!result.isValid) {
            if (!/[a-z]/.test(password)) result.feedback.push('Include lowercase letters');
            if (!/[A-Z]/.test(password)) result.feedback.push('Include uppercase letters');
            if (!/\d/.test(password)) result.feedback.push('Include numbers');
            if (!/[^a-zA-Z\d]/.test(password)) result.feedback.push('Include special characters');
        }

        return result;
    }

    /**
     * Sanitize HTML string
     * @param {string} html - HTML string to sanitize
     * @returns {string} Sanitized HTML string
     */
    sanitizeHtml(html) {
        if (typeof html !== 'string') return '';
        
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    /**
     * Generate unique ID
     * @param {string} prefix - Optional prefix for the ID
     * @returns {string} Unique ID
     */
    generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Deep clone an object
     * @param {*} obj - Object to clone
     * @returns {*} Cloned object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            Object.keys(obj).forEach(key => {
                cloned[key] = this.deepClone(obj[key]);
            });
            return cloned;
        }
        return obj;
    }

    /**
     * Check if object is empty
     * @param {*} obj - Object to check
     * @returns {boolean} True if empty
     */
    isEmpty(obj) {
        if (obj == null) return true;
        if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0;
        if (typeof obj === 'object') return Object.keys(obj).length === 0;
        return false;
    }

    /**
     * Capitalize first letter of string
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    capitalize(str) {
        if (typeof str !== 'string' || str.length === 0) return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    /**
     * Convert string to title case
     * @param {string} str - String to convert
     * @returns {string} Title case string
     */
    toTitleCase(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/\w\S*/g, txt => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }

    /**
     * Format number with commas
     * @param {number} num - Number to format
     * @returns {string} Formatted number string
     */
    formatNumber(num) {
        if (typeof num !== 'number' || isNaN(num)) return '0';
        return num.toLocaleString('en-IN');
    }

    /**
     * Get current viewport size
     * @returns {Object} Viewport dimensions and breakpoint
     */
    getViewportInfo() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        let breakpoint = 'desktop';
        if (width <= CONSTANTS.BREAKPOINTS.MOBILE) {
            breakpoint = 'mobile';
        } else if (width <= CONSTANTS.BREAKPOINTS.TABLET) {
            breakpoint = 'tablet';
        } else if (width >= CONSTANTS.BREAKPOINTS.LARGE_DESKTOP) {
            breakpoint = 'large-desktop';
        }

        return { width, height, breakpoint };
    }

    /**
     * Check if device is mobile
     * @returns {boolean} True if mobile device
     */
    isMobile() {
        return window.innerWidth <= CONSTANTS.BREAKPOINTS.MOBILE;
    }

    /**
     * Check if device is tablet
     * @returns {boolean} True if tablet device
     */
    isTablet() {
        const width = window.innerWidth;
        return width > CONSTANTS.BREAKPOINTS.MOBILE && width <= CONSTANTS.BREAKPOINTS.TABLET;
    }

    /**
     * Smooth scroll to element
     * @param {string|Element} target - Target element or selector
     * @param {Object} options - Scroll options
     */
    scrollToElement(target, options = {}) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;

        const defaultOptions = {
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        };

        element.scrollIntoView({ ...defaultOptions, ...options });
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success status
     */
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const success = document.execCommand('copy');
                textArea.remove();
                return success;
            }
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            return false;
        }
    }

    /**
     * Create delay/sleep function
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Promise that resolves after delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Retry function with exponential backoff
     * @param {Function} fn - Function to retry
     * @param {number} maxAttempts - Maximum retry attempts
     * @param {number} baseDelay - Base delay in milliseconds
     * @returns {Promise} Promise that resolves with function result
     */
    async retry(fn, maxAttempts = CONSTANTS.API.RETRY_ATTEMPTS, baseDelay = CONSTANTS.API.RETRY_DELAY) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                
                if (attempt === maxAttempts) {
                    throw lastError;
                }
                
                // Exponential backoff
                const delay = baseDelay * Math.pow(2, attempt - 1);
                await this.delay(delay);
            }
        }
        
        throw lastError;
    }

    /**
     * Log message with timestamp and context
     * @param {string} level - Log level (info, warn, error)
     * @param {string} message - Log message
     * @param {*} data - Additional data to log
     */
    log(level, message, data = null) {
        if (!CONSTANTS.DEBUG_MODE && level === 'info') return;
        
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        
        switch (level) {
            case 'error':
                console.error(logMessage, data);
                break;
            case 'warn':
                console.warn(logMessage, data);
                break;
            default:
                console.log(logMessage, data);
        }
    }

    /**
     * Cleanup method
     */
    destroy() {
        // Clear all timers
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.throttleTimers.forEach(timer => clearTimeout(timer));
        this.debounceTimers.clear();
        this.throttleTimers.clear();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Helpers;
}