// Common utility functions
const Utils = {
    // Show a message on the page
    showMessage: function(message, type = 'info') {
        // Remove any existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        
        // Insert after the form header or at the top of the container
        const formHeader = document.querySelector('.form-header');
        const container = document.querySelector('.form-container') || document.querySelector('.dashboard-container');
        
        if (formHeader) {
            formHeader.parentNode.insertBefore(messageEl, formHeader.nextSibling);
        } else if (container) {
            container.insertBefore(messageEl, container.firstChild);
        }
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 5000);
    },
    
    // Validate email format
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Validate password strength
    isValidPassword: function(password) {
        return password.length >= 8;
    },
    
    // Check if passwords match
    doPasswordsMatch: function(password, confirmPassword) {
        return password === confirmPassword;
    }
};

// Login page functionality
if (window.location.pathname.includes('login.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('loginForm');
        const createAccountBtn = document.getElementById('createAccount');
        const resetPasswordBtn = document.getElementById('resetPassword');
        
        // Form submission handling
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                // Basic validation
                if (!email || !password) {
                    Utils.showMessage('Please fill in all fields', 'info');
                    return;
                }
                
                // Email format validation
                if (!Utils.isValidEmail(email)) {
                    Utils.showMessage('Please enter a valid email address', 'info');
                    return;
                }
                
                // Simulate login process
                simulateLogin(email, password);
            });
        }
        
        // Create account button - redirect to create account page
        if (createAccountBtn) {
            createAccountBtn.addEventListener('click', function() {
                window.location.href = 'CreateAccount.html';
            });
        }
        
        // Reset password button - redirect to reset password page
        if (resetPasswordBtn) {
            resetPasswordBtn.addEventListener('click', function() {
                window.location.href = 'resetpassword.html';
            });
        }
        
       // Simulate login process
       function simulateLogin(email, password) {
        // Show loading state
        const loginBtn = document.querySelector('.btn-login');
        const originalText = loginBtn.textContent;
        loginBtn.textContent = 'Logging in...';
        loginBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(function() {
            // For demo purposes, always show success
            Utils.showMessage('Login successful! Redirecting to dashboard...', 'success');
            
            // Reset button state
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }, 1500);
    }
});
}

// Create account page functionality
if (window.location.pathname.includes('CreateAccount.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const createAccountForm = document.getElementById('createAccountForm');
        const backToLoginBtn = document.getElementById('backToLogin');
        
        // Form submission handling
        if (createAccountForm) {
            createAccountForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                // Basic validation
                if (!email || !password || !confirmPassword) {
                    Utils.showMessage('Please fill in all fields', 'info');
                    return;
                }
                
                // Email format validation
                if (!Utils.isValidEmail(email)) {
                    Utils.showMessage('Please enter a valid email address', 'info');
                    return;
                }
                
                // Password strength validation
                if (!Utils.isValidPassword(password)) {
                    Utils.showMessage('Password must be at least 6 characters long', 'info');
                    return;
                }
                
                // Password match validation
                if (!Utils.doPasswordsMatch(password, confirmPassword)) {
                    Utils.showMessage('Passwords do not match', 'info');
                    return;
                }
                
                // Simulate account creation process
                simulateAccountCreation(email, password);
            });
        }
        
        // Back to login button
        if (backToLoginBtn) {
            backToLoginBtn.addEventListener('click', function() {
                window.location.href = 'index.html';
            });
        }
        
        // Simulate account creation process
        function simulateAccountCreation(email, password) {
            // Show loading state
            const createAccountBtn = document.querySelector('.btn-create-account');
            const originalText = createAccountBtn.textContent;
            createAccountBtn.textContent = 'Creating Account...';
            createAccountBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(function() {
                // For demo purposes, always show success
                Utils.showMessage('Account created successfully! Redirecting to dashboard...', 'success');
                
                // Reset button state
                createAccountBtn.textContent = originalText;
                createAccountBtn.disabled = false;
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }, 1500);
        }
    });
}

// Reset password page functionality
if (window.location.pathname.includes('resetpassword.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const resetPasswordForm = document.getElementById('resetPasswordForm');
        const backToLoginBtn = document.getElementById('backToLogin');
        
        // Form submission handling
        if (resetPasswordForm) {
            resetPasswordForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const email = document.getElementById('email').value;
                
                // Basic validation
                if (!email) {
                    Utils.showMessage('Please enter your email address', 'info');
                    return;
                }
                
                // Email format validation
                if (!Utils.isValidEmail(email)) {
                    Utils.showMessage('Please enter a valid email address', 'info');
                    return;
                }
                
                // Simulate password reset process
                simulatePasswordReset(email);
            });
        }
        
        // Back to login button
        if (backToLoginBtn) {
            backToLoginBtn.addEventListener('click', function() {
                window.location.href = 'index.html';
            });
        }
        
        // Simulate password reset process
        function simulatePasswordReset(email) {
            // Show loading state
            const resetBtn = document.querySelector('.btn-reset-password');
            const originalText = resetBtn.textContent;
            resetBtn.textContent = 'Sending...';
            resetBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(function() {
                // Show success message
                Utils.showMessage(`Password reset instructions sent to: ${email}`, 'success');
                
                // Reset button state
                resetBtn.textContent = originalText;
                resetBtn.disabled = false;
                
                // Redirect to login page after a short delay
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
            }, 1500);
        }
    });
}



// Splash screen functionality
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', function() {
        // Hide splash screen after loading animation
        setTimeout(function() {
            const splashScreen = document.getElementById('splashScreen');
            if (splashScreen) {
                splashScreen.style.opacity = '0';
                setTimeout(function() {
                    splashScreen.style.display = 'none';
                }, 500);
            }
        }, 2000);
    });
}