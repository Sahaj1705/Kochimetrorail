/**
 * Storage Manager
 * Handles local storage, session storage, and data persistence
 * 
 * @author Kochi Metro Development Team
 * @version 2.0.0
 */

class StorageManager {
    constructor() {
        this.isLocalStorageAvailable = this.checkStorageAvailability('localStorage');
        this.isSessionStorageAvailable = this.checkStorageAvailability('sessionStorage');
        this.memoryStorage = new Map(); // Fallback storage
    }

    /**
     * Check if storage type is available
     * @param {string} type - Storage type ('localStorage' or 'sessionStorage')
     * @returns {boolean} True if storage is available
     */
    checkStorageAvailability(type) {
        try {
            const storage = window[type];
            const testKey = '__storage_test__';
            storage.setItem(testKey, 'test');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            console.warn(`${type} is not available:`, error);
            return false;
        }
    }

    /**
     * Set item in storage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @param {Object} options - Storage options
     * @returns {boolean} Success status
     */
    set(key, value, options = {}) {
        try {
            const {
                type = 'local', // 'local', 'session', or 'memory'
                encrypt = false,
                expiry = null
            } = options;

            // Prepare data for storage
            const data = {
                value: value,
                timestamp: Date.now(),
                expiry: expiry ? Date.now() + expiry : null
            };

            const serializedData = JSON.stringify(data);
            const finalData = encrypt ? this.encrypt(serializedData) : serializedData;

            // Store based on type
            switch (type) {
                case 'session':
                    if (this.isSessionStorageAvailable) {
                        sessionStorage.setItem(key, finalData);
                    } else {
                        this.memoryStorage.set(key, data);
                    }
                    break;
                case 'memory':
                    this.memoryStorage.set(key, data);
                    break;
                default: // 'local'
                    if (this.isLocalStorageAvailable) {
                        localStorage.setItem(key, finalData);
                    } else {
                        this.memoryStorage.set(key, data);
                    }
            }

            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    }

    /**
     * Get item from storage
     * @param {string} key - Storage key
     * @param {Object} options - Storage options
     * @returns {*} Retrieved value or null
     */
    get(key, options = {}) {
        try {
            const {
                type = 'local',
                decrypt = false,
                defaultValue = null
            } = options;

            let rawData = null;

            // Retrieve based on type
            switch (type) {
                case 'session':
                    if (this.isSessionStorageAvailable) {
                        rawData = sessionStorage.getItem(key);
                    } else {
                        const memoryData = this.memoryStorage.get(key);
                        rawData = memoryData ? JSON.stringify(memoryData) : null;
                    }
                    break;
                case 'memory':
                    const memoryData = this.memoryStorage.get(key);
                    return memoryData ? memoryData.value : defaultValue;
                default: // 'local'
                    if (this.isLocalStorageAvailable) {
                        rawData = localStorage.getItem(key);
                    } else {
                        const memoryData = this.memoryStorage.get(key);
                        rawData = memoryData ? JSON.stringify(memoryData) : null;
                    }
            }

            if (!rawData) return defaultValue;

            // Decrypt if needed
            const dataString = decrypt ? this.decrypt(rawData) : rawData;
            const data = JSON.parse(dataString);

            // Check expiry
            if (data.expiry && Date.now() > data.expiry) {
                this.remove(key, { type });
                return defaultValue;
            }

            return data.value;
        } catch (error) {
            console.error('Storage get error:', error);
            return options.defaultValue || null;
        }
    }

    /**
     * Remove item from storage
     * @param {string} key - Storage key
     * @param {Object} options - Storage options
     * @returns {boolean} Success status
     */
    remove(key, options = {}) {
        try {
            const { type = 'local' } = options;

            switch (type) {
                case 'session':
                    if (this.isSessionStorageAvailable) {
                        sessionStorage.removeItem(key);
                    } else {
                        this.memoryStorage.delete(key);
                    }
                    break;
                case 'memory':
                    this.memoryStorage.delete(key);
                    break;
                default: // 'local'
                    if (this.isLocalStorageAvailable) {
                        localStorage.removeItem(key);
                    } else {
                        this.memoryStorage.delete(key);
                    }
            }

            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    }

    /**
     * Clear all items from storage
     * @param {Object} options - Storage options
     * @returns {boolean} Success status
     */
    clear(options = {}) {
        try {
            const { type = 'local' } = options;

            switch (type) {
                case 'session':
                    if (this.isSessionStorageAvailable) {
                        sessionStorage.clear();
                    } else {
                        this.memoryStorage.clear();
                    }
                    break;
                case 'memory':
                    this.memoryStorage.clear();
                    break;
                default: // 'local'
                    if (this.isLocalStorageAvailable) {
                        localStorage.clear();
                    } else {
                        this.memoryStorage.clear();
                    }
            }

            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }

    /**
     * Get all keys from storage
     * @param {Object} options - Storage options
     * @returns {Array} Array of keys
     */
    keys(options = {}) {
        try {
            const { type = 'local' } = options;

            switch (type) {
                case 'session':
                    if (this.isSessionStorageAvailable) {
                        return Object.keys(sessionStorage);
                    } else {
                        return Array.from(this.memoryStorage.keys());
                    }
                case 'memory':
                    return Array.from(this.memoryStorage.keys());
                default: // 'local'
                    if (this.isLocalStorageAvailable) {
                        return Object.keys(localStorage);
                    } else {
                        return Array.from(this.memoryStorage.keys());
                    }
            }
        } catch (error) {
            console.error('Storage keys error:', error);
            return [];
        }
    }

    /**
     * Check if key exists in storage
     * @param {string} key - Storage key
     * @param {Object} options - Storage options
     * @returns {boolean} True if key exists
     */
    has(key, options = {}) {
        return this.get(key, options) !== null;
    }

    /**
     * Get storage size in bytes (approximate)
     * @param {Object} options - Storage options
     * @returns {number} Storage size in bytes
     */
    getSize(options = {}) {
        try {
            const { type = 'local' } = options;
            let size = 0;

            switch (type) {
                case 'session':
                    if (this.isSessionStorageAvailable) {
                        for (let key in sessionStorage) {
                            if (sessionStorage.hasOwnProperty(key)) {
                                size += sessionStorage[key].length + key.length;
                            }
                        }
                    } else {
                        this.memoryStorage.forEach((value, key) => {
                            size += JSON.stringify(value).length + key.length;
                        });
                    }
                    break;
                case 'memory':
                    this.memoryStorage.forEach((value, key) => {
                        size += JSON.stringify(value).length + key.length;
                    });
                    break;
                default: // 'local'
                    if (this.isLocalStorageAvailable) {
                        for (let key in localStorage) {
                            if (localStorage.hasOwnProperty(key)) {
                                size += localStorage[key].length + key.length;
                            }
                        }
                    } else {
                        this.memoryStorage.forEach((value, key) => {
                            size += JSON.stringify(value).length + key.length;
                        });
                    }
            }

            return size;
        } catch (error) {
            console.error('Storage size calculation error:', error);
            return 0;
        }
    }

    /**
     * Clean expired items from storage
     * @param {Object} options - Storage options
     * @returns {number} Number of items cleaned
     */
    cleanExpired(options = {}) {
        try {
            const { type = 'local' } = options;
            const keys = this.keys({ type });
            let cleanedCount = 0;

            keys.forEach(key => {
                const value = this.get(key, { type });
                if (value === null) {
                    cleanedCount++;
                }
            });

            return cleanedCount;
        } catch (error) {
            console.error('Storage cleanup error:', error);
            return 0;
        }
    }

    /**
     * Simple encryption (for demo purposes - use proper encryption in production)
     * @param {string} data - Data to encrypt
     * @returns {string} Encrypted data
     */
    encrypt(data) {
        // Simple base64 encoding (NOT secure - for demo only)
        return btoa(data);
    }

    /**
     * Simple decryption (for demo purposes - use proper decryption in production)
     * @param {string} encryptedData - Data to decrypt
     * @returns {string} Decrypted data
     */
    decrypt(encryptedData) {
        // Simple base64 decoding (NOT secure - for demo only)
        return atob(encryptedData);
    }

    /**
     * User-specific storage methods
     */

    /**
     * Set user preference
     * @param {string} key - Preference key
     * @param {*} value - Preference value
     * @returns {boolean} Success status
     */
    setUserPreference(key, value) {
        const preferences = this.get(CONSTANTS.STORAGE_KEYS.USER_PREFERENCES) || {};
        preferences[key] = value;
        return this.set(CONSTANTS.STORAGE_KEYS.USER_PREFERENCES, preferences);
    }

    /**
     * Get user preference
     * @param {string} key - Preference key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Preference value
     */
    getUserPreference(key, defaultValue = null) {
        const preferences = this.get(CONSTANTS.STORAGE_KEYS.USER_PREFERENCES) || {};
        return preferences[key] !== undefined ? preferences[key] : defaultValue;
    }

    /**
     * Set dashboard setting
     * @param {string} key - Setting key
     * @param {*} value - Setting value
     * @returns {boolean} Success status
     */
    setDashboardSetting(key, value) {
        const settings = this.get(CONSTANTS.STORAGE_KEYS.DASHBOARD_SETTINGS) || {};
        settings[key] = value;
        return this.set(CONSTANTS.STORAGE_KEYS.DASHBOARD_SETTINGS, settings);
    }

    /**
     * Get dashboard setting
     * @param {string} key - Setting key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Setting value
     */
    getDashboardSetting(key, defaultValue = null) {
        const settings = this.get(CONSTANTS.STORAGE_KEYS.DASHBOARD_SETTINGS) || {};
        return settings[key] !== undefined ? settings[key] : defaultValue;
    }

    /**
     * Export storage data
     * @param {Object} options - Export options
     * @returns {Object} Exported data
     */
    export(options = {}) {
        const { type = 'local', includeExpired = false } = options;
        const keys = this.keys({ type });
        const exportData = {};

        keys.forEach(key => {
            const value = this.get(key, { type });
            if (value !== null || includeExpired) {
                exportData[key] = value;
            }
        });

        return {
            type,
            timestamp: Date.now(),
            data: exportData
        };
    }

    /**
     * Import storage data
     * @param {Object} importData - Data to import
     * @param {Object} options - Import options
     * @returns {boolean} Success status
     */
    import(importData, options = {}) {
        try {
            const { type = 'local', overwrite = false } = options;

            if (!importData || !importData.data) {
                throw new Error('Invalid import data');
            }

            Object.entries(importData.data).forEach(([key, value]) => {
                if (overwrite || !this.has(key, { type })) {
                    this.set(key, value, { type });
                }
            });

            return true;
        } catch (error) {
            console.error('Storage import error:', error);
            return false;
        }
    }

    /**
     * Get storage statistics
     * @returns {Object} Storage statistics
     */
    getStats() {
        return {
            localStorage: {
                available: this.isLocalStorageAvailable,
                size: this.getSize({ type: 'local' }),
                keys: this.keys({ type: 'local' }).length
            },
            sessionStorage: {
                available: this.isSessionStorageAvailable,
                size: this.getSize({ type: 'session' }),
                keys: this.keys({ type: 'session' }).length
            },
            memoryStorage: {
                size: this.getSize({ type: 'memory' }),
                keys: this.keys({ type: 'memory' }).length
            }
        };
    }

    /**
     * Cleanup method
     */
    destroy() {
        this.memoryStorage.clear();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}