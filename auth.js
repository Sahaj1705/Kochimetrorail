// Authentication JavaScript

// Global variables
let currentUser = null;

// Initialize authentication system
function initializeAuth() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

// Initialize login page
function initializeLogin() {
    const loginForm = document.getElementById('login-form');
    const togglePassword = document.getElementById('toggle-password');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // Real-time validation
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail(this.value, 'email-error');
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            validatePassword(this.value, 'password-error');
        });
    }

    // Social login buttons
    initializeSocialLogin();
}

// Initialize signup page
function initializeSignup() {
    const signupForm = document.getElementById('signup-form');
    const toggleSignupPassword = document.getElementById('toggle-signup-password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const signupPasswordInput = document.getElementById('signup-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Toggle password visibility
    if (toggleSignupPassword) {
        toggleSignupPassword.addEventListener('click', function() {
            const type = signupPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            signupPasswordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function() {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Handle signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }

    // Password strength indicator
    if (signupPasswordInput) {
        signupPasswordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });

        signupPasswordInput.addEventListener('blur', function() {
            validatePassword(this.value, 'signup-password-error');
        });
    }

    // Confirm password validation
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', function() {
            validateConfirmPassword(signupPasswordInput.value, this.value, 'confirm-password-error');
        });
    }

    // Real-time validation for other fields
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const signupEmailInput = document.getElementById('signup-email');
    const employeeIdInput = document.getElementById('employee-id');
    const departmentSelect = document.getElementById('department');

    if (firstNameInput) {
        firstNameInput.addEventListener('blur', function() {
            validateRequired(this.value, 'first-name-error', 'First name is required');
        });
    }

    if (lastNameInput) {
        lastNameInput.addEventListener('blur', function() {
            validateRequired(this.value, 'last-name-error', 'Last name is required');
        });
    }

    if (signupEmailInput) {
        signupEmailInput.addEventListener('blur', function() {
            validateEmail(this.value, 'signup-email-error');
        });
    }

    if (employeeIdInput) {
        employeeIdInput.addEventListener('blur', function() {
            validateEmployeeId(this.value, 'employee-id-error');
        });
    }

    if (departmentSelect) {
        departmentSelect.addEventListener('change', function() {
            validateRequired(this.value, 'department-error', 'Please select a department');
        });
    }

    // Social login buttons
    initializeSocialLogin();
}

// Handle login
function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    const loginBtn = document.getElementById('login-btn');

    // Clear previous errors
    clearErrors();

    // Validate inputs
    let isValid = true;
    
    if (!validateEmail(email, 'email-error')) {
        isValid = false;
    }
    
    if (!validatePassword(password, 'password-error')) {
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Show loading state
    setButtonLoading(loginBtn, true);

    // Simulate API call
    setTimeout(() => {
        // Mock authentication - in real app, this would be an API call
        const mockUsers = [
            { email: 'admin@kochimetro.com', password: 'admin123', name: 'Admin User', role: 'Administrator' },
            { email: 'operator@kochimetro.com', password: 'operator123', name: 'Train Operator', role: 'Operator' },
            { email: 'manager@kochimetro.com', password: 'manager123', name: 'Station Manager', role: 'Manager' }
        ];

        const user = mockUsers.find(u => u.email === email && u.password === password);

        if (user) {
            // Successful login
            currentUser = {
                email: user.email,
                name: user.name,
                role: user.role,
                loginTime: new Date().toISOString()
            };

            // Save to localStorage if remember me is checked
            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            }

            showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to main dashboard
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            // Failed login
            showMessage('Invalid email or password. Please try again.', 'error');
            setButtonLoading(loginBtn, false);
        }
    }, 1500);
}

// Handle signup
function handleSignup() {
    const formData = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        email: document.getElementById('signup-email').value,
        employeeId: document.getElementById('employee-id').value,
        department: document.getElementById('department').value,
        password: document.getElementById('signup-password').value,
        confirmPassword: document.getElementById('confirm-password').value,
        termsAgreed: document.getElementById('terms-agreement').checked
    };

    const signupBtn = document.getElementById('signup-btn');

    // Clear previous errors
    clearErrors();

    // Validate all inputs
    let isValid = true;

    if (!validateRequired(formData.firstName, 'first-name-error', 'First name is required')) {
        isValid = false;
    }

    if (!validateRequired(formData.lastName, 'last-name-error', 'Last name is required')) {
        isValid = false;
    }

    if (!validateEmail(formData.email, 'signup-email-error')) {
        isValid = false;
    }

    if (!validateEmployeeId(formData.employeeId, 'employee-id-error')) {
        isValid = false;
    }

    if (!validateRequired(formData.department, 'department-error', 'Please select a department')) {
        isValid = false;
    }

    if (!validatePassword(formData.password, 'signup-password-error')) {
        isValid = false;
    }

    if (!validateConfirmPassword(formData.password, formData.confirmPassword, 'confirm-password-error')) {
        isValid = false;
    }

    if (!formData.termsAgreed) {
        showMessage('Please agree to the Terms of Service and Privacy Policy', 'error');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Show loading state
    setButtonLoading(signupBtn, true);

    // Simulate API call
    setTimeout(() => {
        // Mock registration - in real app, this would be an API call
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        // Check if user already exists
        if (existingUsers.find(u => u.email === formData.email || u.employeeId === formData.employeeId)) {
            showMessage('User with this email or employee ID already exists', 'error');
            setButtonLoading(signupBtn, false);
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            employeeId: formData.employeeId,
            department: formData.department,
            password: formData.password, // In real app, this would be hashed
            registrationDate: new Date().toISOString(),
            role: 'Employee'
        };

        // Save to localStorage (in real app, this would be sent to server)
        existingUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

        showMessage('Account created successfully! Redirecting to login...', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }, 2000);
}

// Validation functions
function validateEmail(email, errorElementId) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorElement = document.getElementById(errorElementId);
    
    if (!email) {
        showError(errorElement, 'Email is required');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showError(errorElement, 'Please enter a valid email address');
        return false;
    }
    
    clearError(errorElement);
    return true;
}

function validatePassword(password, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    
    if (!password) {
        showError(errorElement, 'Password is required');
        return false;
    }
    
    if (password.length < 8) {
        showError(errorElement, 'Password must be at least 8 characters long');
        return false;
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        showError(errorElement, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
        return false;
    }
    
    clearError(errorElement);
    return true;
}

function validateConfirmPassword(password, confirmPassword, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    
    if (!confirmPassword) {
        showError(errorElement, 'Please confirm your password');
        return false;
    }
    
    if (password !== confirmPassword) {
        showError(errorElement, 'Passwords do not match');
        return false;
    }
    
    clearError(errorElement);
    return true;
}

function validateRequired(value, errorElementId, message) {
    const errorElement = document.getElementById(errorElementId);
    
    if (!value || value.trim() === '') {
        showError(errorElement, message);
        return false;
    }
    
    clearError(errorElement);
    return true;
}

function validateEmployeeId(employeeId, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    
    if (!employeeId) {
        showError(errorElement, 'Employee ID is required');
        return false;
    }
    
    if (!/^[A-Z]{2}\d{4}$/.test(employeeId)) {
        showError(errorElement, 'Employee ID must be in format: XX0000 (e.g., KM1234)');
        return false;
    }
    
    clearError(errorElement);
    return true;
}

// Password strength indicator
function updatePasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    let strength = 0;
    let strengthLabel = '';
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    // Remove all strength classes
    strengthBar.classList.remove('weak', 'fair', 'good', 'strong');
    
    switch (strength) {
        case 0:
        case 1:
            strengthBar.classList.add('weak');
            strengthLabel = 'Weak password';
            break;
        case 2:
            strengthBar.classList.add('fair');
            strengthLabel = 'Fair password';
            break;
        case 3:
        case 4:
            strengthBar.classList.add('good');
            strengthLabel = 'Good password';
            break;
        case 5:
            strengthBar.classList.add('strong');
            strengthLabel = 'Strong password';
            break;
    }
    
    strengthText.textContent = strengthLabel;
}

// Social login initialization
function initializeSocialLogin() {
    const googleBtns = document.querySelectorAll('.social-btn.google');
    const microsoftBtns = document.querySelectorAll('.social-btn.microsoft');
    
    googleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showMessage('Google authentication is not available in demo mode', 'info');
        });
    });
    
    microsoftBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showMessage('Microsoft authentication is not available in demo mode', 'info');
        });
    });
}

// Utility functions
function showError(errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(errorElement) {
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

function setButtonLoading(button, loading) {
    if (!button) return;
    
    const btnText = button.querySelector('.btn-text');
    const btnSpinner = button.querySelector('.btn-spinner');
    
    if (loading) {
        button.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnSpinner) btnSpinner.style.display = 'inline-block';
    } else {
        button.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnSpinner) btnSpinner.style.display = 'none';
    }
}

function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('message-container');
    if (!messageContainer) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    messageContainer.appendChild(messageElement);
    
    // Animate in
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageElement.classList.remove('show');
        setTimeout(() => {
            if (messageContainer.contains(messageElement)) {
                messageContainer.removeChild(messageElement);
            }
        }, 300);
    }, 5000);
}

// Check authentication status
function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        return true;
    }
    return false;
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Initialize authentication system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});