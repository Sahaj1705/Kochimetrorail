/**
 * API Client
 * Handles all API communications with proper error handling and retry logic
 * 
 * @author Kochi Metro Development Team
 * @version 2.0.0
 */

class ApiClient {
    constructor() {
        this.baseUrl = CONSTANTS.API.BASE_URL;
        this.timeout = CONSTANTS.API.TIMEOUT;
        this.retryAttempts = CONSTANTS.API.RETRY_ATTEMPTS;
        this.retryDelay = CONSTANTS.API.RETRY_DELAY;
        this.requestInterceptors = [];
        this.responseInterceptors = [];
        this.mockMode = CONSTANTS.MOCK_DATA.ENABLED;
    }

    /**
     * Add request interceptor
     * @param {Function} interceptor - Interceptor function
     */
    addRequestInterceptor(interceptor) {
        this.requestInterceptors.push(interceptor);
    }

    /**
     * Add response interceptor
     * @param {Function} interceptor - Interceptor function
     */
    addResponseInterceptor(interceptor) {
        this.responseInterceptors.push(interceptor);
    }

    /**
     * Apply request interceptors
     * @param {Object} config - Request configuration
     * @returns {Object} Modified configuration
     */
    async applyRequestInterceptors(config) {
        let modifiedConfig = { ...config };
        
        for (const interceptor of this.requestInterceptors) {
            try {
                modifiedConfig = await interceptor(modifiedConfig);
            } catch (error) {
                console.error('Request interceptor error:', error);
            }
        }
        
        return modifiedConfig;
    }

    /**
     * Apply response interceptors
     * @param {Response} response - Fetch response
     * @returns {Response} Modified response
     */
    async applyResponseInterceptors(response) {
        let modifiedResponse = response;
        
        for (const interceptor of this.responseInterceptors) {
            try {
                modifiedResponse = await interceptor(modifiedResponse);
            } catch (error) {
                console.error('Response interceptor error:', error);
            }
        }
        
        return modifiedResponse;
    }

    /**
     * Create request configuration
     * @param {string} method - HTTP method
     * @param {string} url - Request URL
     * @param {Object} options - Request options
     * @returns {Object} Request configuration
     */
    createRequestConfig(method, url, options = {}) {
        const config = {
            method: method.toUpperCase(),
            url: url.startsWith('http') ? url : `${this.baseUrl}${url}`,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add authentication token if available
        const token = window.storage?.get(CONSTANTS.AUTH.TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }

    /**
     * Make HTTP request with retry logic
     * @param {Object} config - Request configuration
     * @returns {Promise} Response promise
     */
    async makeRequest(config) {
        const modifiedConfig = await this.applyRequestInterceptors(config);
        
        // Mock mode handling
        if (this.mockMode) {
            return this.handleMockRequest(modifiedConfig);
        }

        let lastError;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);

                const fetchConfig = {
                    method: modifiedConfig.method,
                    headers: modifiedConfig.headers,
                    signal: controller.signal,
                    ...modifiedConfig
                };

                if (modifiedConfig.body) {
                    fetchConfig.body = typeof modifiedConfig.body === 'string' 
                        ? modifiedConfig.body 
                        : JSON.stringify(modifiedConfig.body);
                }

                const response = await fetch(modifiedConfig.url, fetchConfig);
                clearTimeout(timeoutId);

                const modifiedResponse = await this.applyResponseInterceptors(response);
                
                if (!modifiedResponse.ok) {
                    throw new Error(`HTTP ${modifiedResponse.status}: ${modifiedResponse.statusText}`);
                }

                return modifiedResponse;
            } catch (error) {
                lastError = error;
                
                if (attempt === this.retryAttempts || error.name === 'AbortError') {
                    break;
                }
                
                // Exponential backoff
                const delay = this.retryDelay * Math.pow(2, attempt - 1);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        throw this.createApiError(lastError);
    }

    /**
     * Handle mock requests for development
     * @param {Object} config - Request configuration
     * @returns {Promise} Mock response promise
     */
    async handleMockRequest(config) {
        // Simulate network delay
        const delay = Math.random() * (CONSTANTS.MOCK_DATA.DELAY_MAX - CONSTANTS.MOCK_DATA.DELAY_MIN) + CONSTANTS.MOCK_DATA.DELAY_MIN;
        await new Promise(resolve => setTimeout(resolve, delay));

        // Simulate random errors
        if (Math.random() < CONSTANTS.MOCK_DATA.ERROR_RATE) {
            throw new Error('Mock API error for testing');
        }

        // Generate mock response based on endpoint
        const mockData = this.generateMockData(config);
        
        return {
            ok: true,
            status: 200,
            statusText: 'OK',
            json: async () => mockData,
            text: async () => JSON.stringify(mockData)
        };
    }

    /**
     * Generate mock data based on request
     * @param {Object} config - Request configuration
     * @returns {Object} Mock data
     */
    generateMockData(config) {
        const url = config.url.toLowerCase();
        
        if (url.includes('/auth/login')) {
            return {
                success: true,
                token: 'mock-jwt-token',
                user: {
                    id: 1,
                    name: 'John Doe',
                    email: 'john.doe@kochimetro.com',
                    role: 'Administrator'
                }
            };
        }
        
        if (url.includes('/trains')) {
            return {
                success: true,
                data: this.generateMockTrains()
            };
        }
        
        if (url.includes('/stations')) {
            return {
                success: true,
                data: CONSTANTS.METRO.STATIONS
            };
        }
        
        if (url.includes('/notifications')) {
            return {
                success: true,
                data: this.generateMockNotifications()
            };
        }
        
        return {
            success: true,
            message: 'Mock response',
            data: null
        };
    }

    /**
     * Generate mock train data
     * @returns {Array} Mock train data
     */
    generateMockTrains() {
        const trains = [];
        const statuses = Object.values(CONSTANTS.METRO.TRAIN_STATUSES);
        
        for (let i = 1; i <= 8; i++) {
            trains.push({
                id: `KM-${i.toString().padStart(3, '0')}`,
                driver: `Driver ${i}`,
                route: i % 2 === 0 ? 'Aluva - Pettah' : 'Pettah - Aluva',
                status: statuses[Math.floor(Math.random() * statuses.length)],
                currentStation: CONSTANTS.METRO.STATIONS[Math.floor(Math.random() * CONSTANTS.METRO.STATIONS.length)].name,
                passengers: Math.floor(Math.random() * 200) + 50,
                lastUpdate: new Date(Date.now() - Math.random() * 300000).toISOString()
            });
        }
        
        return trains;
    }

    /**
     * Generate mock notification data
     * @returns {Array} Mock notification data
     */
    generateMockNotifications() {
        return [
            {
                id: 1,
                type: 'warning',
                title: 'Train KM-003 Delayed',
                message: 'Train KM-003 is running 5 minutes behind schedule due to technical issues.',
                timestamp: new Date(Date.now() - 120000).toISOString(),
                read: false
            },
            {
                id: 2,
                type: 'info',
                title: 'Maintenance Scheduled',
                message: 'Routine maintenance scheduled for Edapally station tonight from 11 PM to 2 AM.',
                timestamp: new Date(Date.now() - 300000).toISOString(),
                read: false
            },
            {
                id: 3,
                type: 'success',
                title: 'System Update Complete',
                message: 'All systems have been successfully updated to version 2.1.0.',
                timestamp: new Date(Date.now() - 600000).toISOString(),
                read: true
            }
        ];
    }

    /**
     * Create standardized API error
     * @param {Error} originalError - Original error
     * @returns {Error} Standardized API error
     */
    createApiError(originalError) {
        let message = CONSTANTS.ERRORS.UNKNOWN_ERROR;
        let code = 'UNKNOWN_ERROR';
        
        if (originalError.name === 'AbortError') {
            message = 'Request timeout';
            code = 'TIMEOUT';
        } else if (originalError.message.includes('Failed to fetch')) {
            message = CONSTANTS.ERRORS.NETWORK_ERROR;
            code = 'NETWORK_ERROR';
        } else if (originalError.message.includes('401')) {
            message = CONSTANTS.ERRORS.UNAUTHORIZED;
            code = 'UNAUTHORIZED';
        } else if (originalError.message.includes('403')) {
            message = CONSTANTS.ERRORS.AUTHENTICATION_FAILED;
            code = 'FORBIDDEN';
        } else if (originalError.message.includes('500')) {
            message = CONSTANTS.ERRORS.SERVER_ERROR;
            code = 'SERVER_ERROR';
        }
        
        const apiError = new Error(message);
        apiError.code = code;
        apiError.originalError = originalError;
        
        return apiError;
    }

    /**
     * HTTP method shortcuts
     */

    /**
     * GET request
     * @param {string} url - Request URL
     * @param {Object} options - Request options
     * @returns {Promise} Response promise
     */
    async get(url, options = {}) {
        const config = this.createRequestConfig('GET', url, options);
        const response = await this.makeRequest(config);
        return response.json();
    }

    /**
     * POST request
     * @param {string} url - Request URL
     * @param {Object} data - Request data
     * @param {Object} options - Request options
     * @returns {Promise} Response promise
     */
    async post(url, data = null, options = {}) {
        const config = this.createRequestConfig('POST', url, {
            ...options,
            body: data
        });
        const response = await this.makeRequest(config);
        return response.json();
    }

    /**
     * PUT request
     * @param {string} url - Request URL
     * @param {Object} data - Request data
     * @param {Object} options - Request options
     * @returns {Promise} Response promise
     */
    async put(url, data = null, options = {}) {
        const config = this.createRequestConfig('PUT', url, {
            ...options,
            body: data
        });
        const response = await this.makeRequest(config);
        return response.json();
    }

    /**
     * DELETE request
     * @param {string} url - Request URL
     * @param {Object} options - Request options
     * @returns {Promise} Response promise
     */
    async delete(url, options = {}) {
        const config = this.createRequestConfig('DELETE', url, options);
        const response = await this.makeRequest(config);
        return response.json();
    }

    /**
     * PATCH request
     * @param {string} url - Request URL
     * @param {Object} data - Request data
     * @param {Object} options - Request options
     * @returns {Promise} Response promise
     */
    async patch(url, data = null, options = {}) {
        const config = this.createRequestConfig('PATCH', url, {
            ...options,
            body: data
        });
        const response = await this.makeRequest(config);
        return response.json();
    }

    /**
     * Upload file
     * @param {string} url - Upload URL
     * @param {FormData} formData - Form data with file
     * @param {Object} options - Request options
     * @returns {Promise} Response promise
     */
    async upload(url, formData, options = {}) {
        const config = this.createRequestConfig('POST', url, {
            ...options,
            body: formData,
            headers: {
                // Don't set Content-Type for FormData, let browser set it
                ...options.headers
            }
        });
        
        // Remove Content-Type header for file uploads
        delete config.headers['Content-Type'];
        
        const response = await this.makeRequest(config);
        return response.json();
    }

    /**
     * Download file
     * @param {string} url - Download URL
     * @param {Object} options - Request options
     * @returns {Promise} Blob promise
     */
    async download(url, options = {}) {
        const config = this.createRequestConfig('GET', url, options);
        const response = await this.makeRequest(config);
        return response.blob();
    }

    /**
     * Health check
     * @returns {Promise} Health status
     */
    async healthCheck() {
        try {
            const response = await this.get('/health');
            return { status: 'healthy', ...response };
        } catch (error) {
            return { status: 'unhealthy', error: error.message };
        }
    }

    /**
     * Cleanup method
     */
    destroy() {
        this.requestInterceptors.length = 0;
        this.responseInterceptors.length = 0;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiClient;
}