/**
 * Application Constants
 * Central location for all application constants and configuration
 * 
 * @author Kochi Metro Development Team
 * @version 2.0.0
 */

const CONSTANTS = {
    // Application Configuration
    APP_NAME: 'Kochi Metro Operations Dashboard',
    APP_VERSION: '2.0.0',
    DEBUG_MODE: true,
    
    // API Configuration
    API: {
        BASE_URL: '/api/v1',
        TIMEOUT: 30000,
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000
    },
    
    // Authentication
    AUTH: {
        TOKEN_KEY: 'metro_auth_token',
        USER_KEY: 'currentUser',
        SESSION_TIMEOUT: 8 * 60 * 60 * 1000, // 8 hours
        REFRESH_THRESHOLD: 5 * 60 * 1000 // 5 minutes
    },
    
    // UI Configuration
    UI: {
        ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 250,
        TOAST_DURATION: 5000,
        SLIDESHOW_INTERVAL: 6000,
        NOTIFICATION_POLL_INTERVAL: 30000
    },
    
    // Metro System Configuration
    METRO: {
        STATIONS: [
            { id: 'aluva', name: 'Aluva', position: { x: 50, y: 100 } },
            { id: 'pulinchodu', name: 'Pulinchodu', position: { x: 80, y: 120 } },
            { id: 'companypady', name: 'Companypady', position: { x: 110, y: 140 } },
            { id: 'ambattukavu', name: 'Ambattukavu', position: { x: 140, y: 160 } },
            { id: 'muttom', name: 'Muttom', position: { x: 170, y: 180 } },
            { id: 'kalamassery', name: 'Kalamassery', position: { x: 200, y: 200 } },
            { id: 'cusat', name: 'CUSAT', position: { x: 230, y: 220 } },
            { id: 'pathadipalam', name: 'Pathadipalam', position: { x: 260, y: 240 } },
            { id: 'edapally', name: 'Edapally', position: { x: 290, y: 260 } },
            { id: 'changampuzha-park', name: 'Changampuzha Park', position: { x: 320, y: 280 } },
            { id: 'palarivattom', name: 'Palarivattom', position: { x: 350, y: 300 } },
            { id: 'jln-stadium', name: 'JLN Stadium', position: { x: 380, y: 320 } },
            { id: 'kaloor', name: 'Kaloor', position: { x: 410, y: 340 } },
            { id: 'lissie', name: 'Lissie', position: { x: 440, y: 360 } },
            { id: 'mg-road', name: 'MG Road', position: { x: 470, y: 380 } },
            { id: 'maharajas', name: 'Maharajas', position: { x: 500, y: 400 } },
            { id: 'ernakulam-south', name: 'Ernakulam South', position: { x: 530, y: 420 } },
            { id: 'kadavanthra', name: 'Kadavanthra', position: { x: 560, y: 440 } },
            { id: 'elamkulam', name: 'Elamkulam', position: { x: 590, y: 460 } },
            { id: 'vyttila', name: 'Vyttila', position: { x: 620, y: 480 } },
            { id: 'thaikoodam', name: 'Thaikoodam', position: { x: 650, y: 500 } },
            { id: 'pettah', name: 'Pettah', position: { x: 680, y: 520 } }
        ],
        
        TRAIN_STATUSES: {
            RUNNING: 'running',
            DELAYED: 'delayed',
            STOPPED: 'stopped',
            MAINTENANCE: 'maintenance'
        },
        
        PRIORITY_LEVELS: {
            HIGH: 'high',
            MEDIUM: 'medium',
            LOW: 'low'
        }
    },
    
    // Validation Rules
    VALIDATION: {
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        EMPLOYEE_ID_REGEX: /^[A-Z]{2}\d{4}$/,
        TRAIN_ID_REGEX: /^KM-\d{3}$/,
        PASSWORD_MIN_LENGTH: 8,
        NAME_MIN_LENGTH: 2,
        NAME_MAX_LENGTH: 50
    },
    
    // Error Messages
    ERRORS: {
        NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
        AUTHENTICATION_FAILED: 'Authentication failed. Please check your credentials.',
        UNAUTHORIZED: 'You are not authorized to perform this action.',
        VALIDATION_FAILED: 'Please check your input and try again.',
        SERVER_ERROR: 'Server error occurred. Please try again later.',
        UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
    },
    
    // Success Messages
    SUCCESS: {
        LOGIN: 'Login successful! Welcome back.',
        LOGOUT: 'Logged out successfully.',
        SAVE: 'Changes saved successfully.',
        DELETE: 'Item deleted successfully.',
        UPDATE: 'Updated successfully.',
        VERIFICATION: 'Operation verified successfully.'
    },
    
    // Local Storage Keys
    STORAGE_KEYS: {
        USER_PREFERENCES: 'metro_user_preferences',
        DASHBOARD_SETTINGS: 'metro_dashboard_settings',
        NOTIFICATION_SETTINGS: 'metro_notification_settings',
        THEME_PREFERENCE: 'metro_theme_preference'
    },
    
    // Event Names
    EVENTS: {
        USER_LOGIN: 'user:login',
        USER_LOGOUT: 'user:logout',
        TAB_CHANGE: 'tab:change',
        NOTIFICATION_RECEIVED: 'notification:received',
        TRAIN_STATUS_CHANGE: 'train:status:change',
        STATION_UPDATE: 'station:update'
    },
    
    // CSS Classes
    CSS_CLASSES: {
        ACTIVE: 'active',
        HIDDEN: 'hidden',
        LOADING: 'loading',
        ERROR: 'error',
        SUCCESS: 'success',
        WARNING: 'warning',
        INFO: 'info'
    },
    
    // Breakpoints for responsive design
    BREAKPOINTS: {
        MOBILE: 480,
        TABLET: 768,
        DESKTOP: 1024,
        LARGE_DESKTOP: 1440
    },
    
    // Mock Data Configuration
    MOCK_DATA: {
        ENABLED: true,
        DELAY_MIN: 500,
        DELAY_MAX: 2000,
        ERROR_RATE: 0.1 // 10% chance of simulated errors
    }
};

// Freeze the constants object to prevent modifications
Object.freeze(CONSTANTS);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONSTANTS;
}