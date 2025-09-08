/**
 * Main Application Controller
 * Handles application initialization, routing, and global state management
 * 
 * @author Kochi Metro Development Team
 * @version 2.0.0
 */

class MetroApp {
    constructor() {
        this.currentUser = null;
        this.currentTab = 'dashboard';
        this.isInitialized = false;
        this.modules = new Map();
        this.eventListeners = new Map();
        
        // Bind methods to maintain context
        this.init = this.init.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            this.showLoadingScreen();
            
            // Initialize core utilities
            await this.initializeUtilities();
            
            // Initialize components
            await this.initializeComponents();
            
            // Initialize modules
            await this.initializeModules();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize authentication
            await this.initializeAuth();
            
            // Initialize routing
            this.initializeRouting();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            this.isInitialized = true;
            this.logInfo('Application initialized successfully');
            
        } catch (error) {
            this.logError('Failed to initialize application:', error);
            this.showErrorMessage('Failed to initialize application. Please refresh the page.');
        }
    }

    /**
     * Initialize core utilities
     */
    async initializeUtilities() {
        // Initialize storage
        if (typeof StorageManager !== 'undefined') {
            window.storage = new StorageManager();
        }
        
        // Initialize API client
        if (typeof ApiClient !== 'undefined') {
            window.api = new ApiClient();
        }
        
        // Initialize helpers
        if (typeof Helpers !== 'undefined') {
            window.helpers = new Helpers();
        }
    }

    /**
     * Initialize UI components
     */
    async initializeComponents() {
        const components = [
            { name: 'toast', class: ToastManager },
            { name: 'modal', class: ModalManager },
            { name: 'slideshow', class: SlideshowManager },
            { name: 'navigation', class: NavigationManager },
            { name: 'search', class: SearchManager },
            { name: 'notifications', class: NotificationManager }
        ];

        for (const component of components) {
            try {
                if (typeof component.class !== 'undefined') {
                    window[component.name] = new component.class();
                    if (window[component.name].init) {
                        await window[component.name].init();
                    }
                    this.logInfo(`${component.name} component initialized`);
                }
            } catch (error) {
                this.logError(`Failed to initialize ${component.name} component:`, error);
            }
        }
    }

    /**
     * Initialize application modules
     */
    async initializeModules() {
        const modules = [
            { name: 'dashboard', class: DashboardModule },
            { name: 'liveMap', class: LiveMapModule },
            { name: 'trainOperations', class: TrainOperationsModule },
            { name: 'verifyOperations', class: VerifyOperationsModule }
        ];

        for (const module of modules) {
            try {
                if (typeof module.class !== 'undefined') {
                    const instance = new module.class();
                    this.modules.set(module.name, instance);
                    
                    if (instance.init) {
                        await instance.init();
                    }
                    this.logInfo(`${module.name} module initialized`);
                }
            } catch (error) {
                this.logError(`Failed to initialize ${module.name} module:`, error);
            }
        }
    }

    /**
     * Set up global event listeners
     */
    setupEventListeners() {
        // Tab navigation
        const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
        navItems.forEach(item => {
            if (item.dataset.tab) {
                const handler = () => this.handleTabChange(item.dataset.tab);
                item.addEventListener('click', handler);
                this.eventListeners.set(item, { event: 'click', handler });
            }
        });

        // Window events
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        document.addEventListener('visibilitychange', this.handleVisibilityChange);

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));

        // Error handling
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }

    /**
     * Initialize authentication
     */
    async initializeAuth() {
        try {
            // Check for existing session
            const savedUser = window.storage?.get('currentUser') || 
                             sessionStorage.getItem('currentUser');
            
            if (savedUser) {
                this.currentUser = typeof savedUser === 'string' ? 
                                 JSON.parse(savedUser) : savedUser;
                this.updateAuthUI(true);
            } else {
                this.updateAuthUI(false);
            }
        } catch (error) {
            this.logError('Failed to initialize authentication:', error);
        }
    }

    /**
     * Initialize routing
     */
    initializeRouting() {
        // Handle initial route
        const hash = window.location.hash.slice(1);
        if (hash && this.isValidTab(hash)) {
            this.handleTabChange(hash);
        }

        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const newHash = window.location.hash.slice(1);
            if (newHash && this.isValidTab(newHash)) {
                this.handleTabChange(newHash);
            }
        });
    }

    /**
     * Handle tab changes
     */
    handleTabChange(tabName) {
        if (!this.isValidTab(tabName) || tabName === this.currentTab) {
            return;
        }

        try {
            // Hide current tab
            const currentTabElement = document.getElementById(`${this.currentTab}-tab`);
            if (currentTabElement) {
                currentTabElement.classList.remove('active');
            }

            // Update navigation
            this.updateNavigation(this.currentTab, false);
            this.updateNavigation(tabName, true);

            // Show new tab
            const newTabElement = document.getElementById(`${tabName}-tab`);
            if (newTabElement) {
                newTabElement.classList.add('active');
            }

            // Update URL
            window.history.replaceState(null, null, `#${tabName}`);

            // Notify module of activation
            const module = this.modules.get(tabName);
            if (module && module.onActivate) {
                module.onActivate();
            }

            // Notify previous module of deactivation
            const previousModule = this.modules.get(this.currentTab);
            if (previousModule && previousModule.onDeactivate) {
                previousModule.onDeactivate();
            }

            this.currentTab = tabName;
            this.logInfo(`Switched to tab: ${tabName}`);

        } catch (error) {
            this.logError('Failed to change tab:', error);
            this.showErrorMessage('Failed to switch tabs. Please try again.');
        }
    }

    /**
     * Update navigation UI
     */
    updateNavigation(tabName, isActive) {
        const selectors = [
            `.nav-item[data-tab="${tabName}"]`,
            `.mobile-nav-item[data-tab="${tabName}"]`
        ];

        selectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.toggle('active', isActive);
                element.setAttribute('aria-pressed', isActive.toString());
            }
        });
    }

    /**
     * Update authentication UI
     */
    updateAuthUI(isAuthenticated) {
        const authButtons = document.getElementById('auth-buttons');
        const userSection = document.getElementById('user-section');
        const mobileAuth = document.getElementById('mobile-auth');
        const authPortal = document.getElementById('auth-portal');

        if (isAuthenticated && this.currentUser) {
            // Show user info, hide auth buttons
            if (authButtons) authButtons.style.display = 'none';
            if (mobileAuth) mobileAuth.style.display = 'none';
            if (authPortal) authPortal.style.display = 'none';
            if (userSection) userSection.style.display = 'flex';

            // Update user info
            const userName = document.getElementById('user-name');
            const userRole = document.getElementById('user-role');
            if (userName) userName.textContent = this.currentUser.name || 'User';
            if (userRole) userRole.textContent = this.currentUser.role || 'Employee';

            // Set up logout handler
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', this.handleLogout.bind(this));
            }
        } else {
            // Show auth buttons, hide user info
            if (authButtons) authButtons.style.display = 'flex';
            if (mobileAuth) mobileAuth.style.display = 'block';
            if (authPortal) authPortal.style.display = 'grid';
            if (userSection) userSection.style.display = 'none';
        }
    }

    /**
     * Handle user logout
     */
    handleLogout() {
        try {
            // Clear user data
            this.currentUser = null;
            window.storage?.remove('currentUser');
            sessionStorage.removeItem('currentUser');

            // Update UI
            this.updateAuthUI(false);

            // Show success message
            if (window.toast) {
                window.toast.show('Logged out successfully', 'success');
            }

            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);

        } catch (error) {
            this.logError('Failed to logout:', error);
            this.showErrorMessage('Failed to logout. Please try again.');
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            // Notify modules of resize
            this.modules.forEach(module => {
                if (module.onResize) {
                    module.onResize();
                }
            });
        }, 250);
    }

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause updates
            this.modules.forEach(module => {
                if (module.onPause) {
                    module.onPause();
                }
            });
        } else {
            // Page is visible - resume updates
            this.modules.forEach(module => {
                if (module.onResume) {
                    module.onResume();
                }
            });
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        // Only handle shortcuts when not in input fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        const shortcuts = {
            '1': 'dashboard',
            '2': 'live-map',
            '3': 'train-operations',
            '4': 'verify-operations'
        };

        if (event.altKey && shortcuts[event.key]) {
            event.preventDefault();
            this.handleTabChange(shortcuts[event.key]);
        }

        // ESC key to close modals
        if (event.key === 'Escape' && window.modal) {
            window.modal.closeAll();
        }
    }

    /**
     * Handle global errors
     */
    handleGlobalError(event) {
        this.logError('Global error:', event.error);
        this.showErrorMessage('An unexpected error occurred. Please refresh the page.');
    }

    /**
     * Handle unhandled promise rejections
     */
    handleUnhandledRejection(event) {
        this.logError('Unhandled promise rejection:', event.reason);
        this.showErrorMessage('An unexpected error occurred. Please try again.');
    }

    /**
     * Handle before unload
     */
    handleBeforeUnload(event) {
        // Save any pending data
        this.modules.forEach(module => {
            if (module.onBeforeUnload) {
                module.onBeforeUnload();
            }
        });
    }

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            loadingScreen.setAttribute('aria-hidden', 'false');
        }
    }

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                loadingScreen.setAttribute('aria-hidden', 'true');
            }, 300);
        }
    }

    /**
     * Check if tab name is valid
     */
    isValidTab(tabName) {
        const validTabs = ['dashboard', 'live-map', 'train-operations', 'verify-operations'];
        return validTabs.includes(tabName);
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        if (window.toast) {
            window.toast.show(message, 'error');
        } else {
            alert(message);
        }
    }

    /**
     * Logging methods
     */
    logInfo(message, ...args) {
        if (CONSTANTS.DEBUG_MODE) {
            console.log(`[MetroApp] ${message}`, ...args);
        }
    }

    logError(message, ...args) {
        console.error(`[MetroApp] ${message}`, ...args);
    }

    /**
     * Cleanup method
     */
    destroy() {
        // Remove event listeners
        this.eventListeners.forEach((listener, element) => {
            element.removeEventListener(listener.event, listener.handler);
        });
        this.eventListeners.clear();

        // Cleanup modules
        this.modules.forEach(module => {
            if (module.destroy) {
                module.destroy();
            }
        });
        this.modules.clear();

        // Clear timeouts
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        this.isInitialized = false;
        this.logInfo('Application destroyed');
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.metroApp = new MetroApp();
    window.metroApp.init();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.metroApp) {
        window.metroApp.destroy();
    }
});