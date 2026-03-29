/* ==================== UTILITY FUNCTIONS ==================== */

/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = event.target.closest('.toggle-password');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

/**
 * Show error message
 */
function showError(fieldId, message) {
    const errorEl = document.getElementById(fieldId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }
}

/**
 * Clear error message
 */
function clearError(fieldId) {
    const errorEl = document.getElementById(fieldId);
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('show');
    }
}

/**
 * Clear all errors
 */
function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
}

/**
 * Show success message
 */
function showSuccessMessage(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.classList.add('show');
    }
}

/**
 * Navigate to page
 */
function navigateTo(page) {
    window.location.href = page;
}

/**
 * Get current user from localStorage
 */
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('currentUser');
    showSuccessMessage('Logged out successfully!');
    setTimeout(() => {
        navigateTo('index.html');
    }, 1500);
}

/* ==================== SIGN UP HANDLER ==================== */
function handleSignUp(event) {
    event.preventDefault();
    clearAllErrors();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate full name
    if (!fullName || fullName.length < 2) {
        showError('nameError', 'Full name must be at least 2 characters');
        return;
    }

    // Validate email
    if (!email) {
        showError('emailError', 'Email is required');
        return;
    }

    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        return;
    }

    // Check if email already exists
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    if (allUsers.some(u => u.email === email)) {
        showError('emailError', 'This email is already registered');
        return;
    }

    // Validate password
    if (!password || password.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters');
        return;
    }

    // Confirm password match
    if (password !== confirmPassword) {
        showError('confirmError', 'Passwords do not match');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        fullName: fullName,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };

    // Store user
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));

    // Sign them in automatically
    const userData = {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));

    showSuccessMessage('Account created successfully!');
    setTimeout(() => {
        navigateTo('index.html');
    }, 1500);
}

/* ==================== SIGN IN HANDLER ==================== */
function handleSignIn(event) {
    event.preventDefault();
    clearAllErrors();

    const email = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value;

    // Validate email
    if (!email) {
        showError('emailError', 'Email is required');
        return;
    }

    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        return;
    }

    // Validate password
    if (!password) {
        showError('passwordError', 'Password is required');
        return;
    }

    // Find user
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const user = allUsers.find(u => u.email === email && u.password === password);

    if (!user) {
        showError('emailError', 'Invalid email or password');
        return;
    }

    // Sign in successful
    const userData = {
        id: user.id,
        fullName: user.fullName,
        email: user.email
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));

    showSuccessMessage('Signed in successfully!');
    setTimeout(() => {
        navigateTo('index.html');
    }, 1500);
}

/* ==================== PAGE INITIALIZATION ==================== */
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    
    // Update home page if user is logged in
    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting && currentUser) {
        userGreeting.textContent = `Welcome back, ${currentUser.fullName}!`;
    }
});
