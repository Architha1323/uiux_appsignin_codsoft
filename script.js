// ============================================
// AUTHENTICATION SYSTEM WITH VALIDATION
// ============================================

// Storage keys
const STORAGE_KEYS = {
    USERS: 'glassauth_users',
    CURRENT_USER: 'glassauth_current_user',
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize users storage if empty
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    }

    // Handle Sign Up Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignUp);
        // Add real-time validation
        document.getElementById('fullName').addEventListener('blur', validateFullName);
        document.getElementById('email').addEventListener('blur', validateEmail);
        document.getElementById('password').addEventListener('input', validatePassword);
        document.getElementById('password').addEventListener('blur', validatePassword);
        document.getElementById('confirmPassword').addEventListener('blur', validateConfirmPassword);
        document.getElementById('terms').addEventListener('change', validateTerms);
    }

    // Handle Sign In Form
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', handleSignIn);
        document.getElementById('signinEmail').addEventListener('blur', validateSignInEmail);
        document.getElementById('signinPassword').addEventListener('blur', validateSignInPassword);
        checkExistingUser();
    }

    // Handle Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Handle Social Media Buttons
    setupSocialButtons();
});

// ============================================
// SOCIAL LOGIN FUNCTIONALITY
// ============================================

function setupSocialButtons() {
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            let platform = '';
            
            if (btn.classList.contains('google-btn')) {
                platform = 'Google';
            } else if (btn.classList.contains('facebook-btn')) {
                platform = 'Facebook';
            } else if (btn.classList.contains('twitter-btn')) {
                platform = 'Twitter';
            }
            
            // Show alert with platform name
            alert(`${platform} login integration would be implemented here with OAuth`);
            // In a real application, you would integrate actual OAuth here
        });
    });
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

function clearError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function setError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function validateFullName() {
    const fullName = document.getElementById('fullName');
    const value = fullName.value.trim();

    if (!value) {
        setError('fullNameError', 'Full name is required');
        fullName.classList.remove('valid');
        fullName.classList.add('error');
        return false;
    }

    if (value.length < 3) {
        setError('fullNameError', 'Full name must be at least 3 characters');
        fullName.classList.remove('valid');
        fullName.classList.add('error');
        return false;
    }

    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
        setError('fullNameError', 'Full name can only contain letters, spaces, hyphens, and apostrophes');
        fullName.classList.remove('valid');
        fullName.classList.add('error');
        return false;
    }

    clearError('fullNameError');
    fullName.classList.remove('error');
    fullName.classList.add('valid');
    return true;
}

function validateEmail() {
    const email = document.getElementById('email');
    const value = email.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
        setError('emailError', 'Email is required');
        email.classList.remove('valid');
        email.classList.add('error');
        return false;
    }

    if (!emailRegex.test(value)) {
        setError('emailError', 'Please enter a valid email address');
        email.classList.remove('valid');
        email.classList.add('error');
        return false;
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    if (users.some(user => user.email === value)) {
        setError('emailError', 'This email is already registered');
        email.classList.remove('valid');
        email.classList.add('error');
        return false;
    }

    clearError('emailError');
    email.classList.remove('error');
    email.classList.add('valid');
    return true;
}

function validatePassword() {
    const password = document.getElementById('password');
    const value = password.value;

    if (!value) {
        setError('passwordError', 'Password is required');
        password.classList.remove('valid');
        password.classList.add('error');
        return false;
    }

    if (value.length < 8) {
        setError('passwordError', 'Password must be at least 8 characters');
        password.classList.remove('valid');
        password.classList.add('error');
        return false;
    }

    // Calculate password strength
    const strength = calculatePasswordStrength(value);

    if (strength === 'weak') {
        setError('passwordError', 'Password is too weak. Add uppercase, numbers, and special characters');
        password.classList.remove('valid');
        password.classList.add('error');
        return false;
    }

    clearError('passwordError');
    password.classList.remove('error');
    password.classList.add('valid');
    return true;
}

function calculatePasswordStrength(password) {
    let strength = 0;

    // Check length
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Check for lowercase
    if (/[a-z]/.test(password)) strength++;

    // Check for uppercase
    if (/[A-Z]/.test(password)) strength++;

    // Check for numbers
    if (/\d/.test(password)) strength++;

    // Check for special characters
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
}

function validateConfirmPassword() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const value = confirmPassword.value;

    if (!value) {
        setError('confirmPasswordError', 'Please confirm your password');
        confirmPassword.classList.remove('valid');
        confirmPassword.classList.add('error');
        return false;
    }

    if (value !== password.value) {
        setError('confirmPasswordError', 'Passwords do not match');
        confirmPassword.classList.remove('valid');
        confirmPassword.classList.add('error');
        return false;
    }

    clearError('confirmPasswordError');
    confirmPassword.classList.remove('error');
    confirmPassword.classList.add('valid');
    return true;
}

function validateTerms() {
    const terms = document.getElementById('terms');

    if (!terms.checked) {
        setError('termsError', 'You must agree to the privacy policy');
        return false;
    }

    clearError('termsError');
    return true;
}

function validateSignInEmail() {
    const email = document.getElementById('signinEmail');
    const value = email.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
        setError('signinEmailError', 'Email is required');
        email.classList.remove('valid');
        email.classList.add('error');
        return false;
    }

    if (!emailRegex.test(value)) {
        setError('signinEmailError', 'Please enter a valid email address');
        email.classList.remove('valid');
        email.classList.add('error');
        return false;
    }

    clearError('signinEmailError');
    email.classList.remove('error');
    email.classList.add('valid');
    return true;
}

function validateSignInPassword() {
    const password = document.getElementById('signinPassword');
    const value = password.value;

    if (!value) {
        setError('signinPasswordError', 'Password is required');
        password.classList.remove('valid');
        password.classList.add('error');
        return false;
    }

    clearError('signinPasswordError');
    password.classList.remove('error');
    password.classList.add('valid');
    return true;
}

// ============================================
// SIGN UP HANDLER
// ============================================

function handleSignUp(e) {
    e.preventDefault();

    // Validate all fields
    const isFullNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const isTermsValid = validateTerms();

    if (!isFullNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isTermsValid) {
        return;
    }

    // Get form data
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Create user object
    const newUser = {
        id: generateId(),
        fullName,
        email,
        password: hashPassword(password), // Simple hash (not for production)
        createdAt: new Date().toISOString(),
    };

    // Get existing users
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];

    // Add new user
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Store current user
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
    }));

    // Show success message
    const form = document.getElementById('signupForm');
    const successMessage = document.getElementById('successMessage');
    form.style.display = 'none';
    successMessage.style.display = 'flex';

    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = 'signin.html';
    }, 2000);
}

// ============================================
// SIGN IN HANDLER
// ============================================

function handleSignIn(e) {
    e.preventDefault();

    // Validate fields
    const isEmailValid = validateSignInEmail();
    const isPasswordValid = validateSignInPassword();

    if (!isEmailValid || !isPasswordValid) {
        return;
    }

    const email = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Get users
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];

    // Find user
    const user = users.find(u => u.email === email && u.password === hashPassword(password));

    if (!user) {
        setError('signinEmailError', 'Invalid email or password');
        setError('signinPasswordError', 'Invalid email or password');
        return;
    }

    // Store current user
    const currentUser = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
    };

    if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
    } else {
        localStorage.removeItem('rememberedEmail');
    }

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));

    // Show success message
    const form = document.getElementById('signinForm');
    const successMessage = document.getElementById('signinSuccessMessage');
    form.style.display = 'none';
    successMessage.style.display = 'flex';

    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = 'signin.html';
        location.reload();
    }, 2000);
}

// ============================================
// CHECK EXISTING USER
// ============================================

function checkExistingUser() {
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));

    if (currentUser) {
        const form = document.getElementById('signinForm');
        const userInfo = document.getElementById('userInfo');

        form.style.display = 'none';
        userInfo.style.display = 'block';

        // Display user information
        document.getElementById('displayName').textContent = currentUser.fullName;
        document.getElementById('displayEmail').textContent = currentUser.email;

        // Format date
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
        const user = users.find(u => u.id === currentUser.id);
        if (user) {
            const date = new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            document.getElementById('displayDate').textContent = date;
        }
    } else {
        // Check if email was remembered
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            document.getElementById('signinEmail').value = rememberedEmail;
            document.getElementById('rememberMe').checked = true;
        }
    }
}

// ============================================
// LOGOUT HANDLER
// ============================================

function handleLogout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    window.location.href = 'signin.html';
    location.reload();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function hashPassword(password) {
    // Simple hash function - NOT for production use!
    // In production, use bcrypt or similar on the server
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return 'hash_' + Math.abs(hash).toString(16);
}

// ============================================
// FORM INTERACTION ENHANCEMENTS
// ============================================

// Remove error styling on input
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('form-error')) {
        e.target.classList.remove('error');
    }
});

// Prevent form submission on Enter in non-submit fields
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && e.target.type !== 'submit') {
        const form = e.target.closest('form');
        if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                e.preventDefault();
                submitBtn.focus();
            }
        }
    }
});

