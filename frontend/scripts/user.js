import { API_URL, authHeaders } from './config.js'

export async function getUsersByGroupIds(groupIds) {
    if (!groupIds || groupIds.length === 0) return {};
  
    const res = await fetch(`${API_URL}/groups/members.php?ids=${groupIds.join(',')}`, {
      headers: authHeaders()
    });
  
    if (!res.ok) return {};
  
    const data = await res.json();
    return data.groups || {};
  }
  
export async function getUsersByIds(ids) {
    if (!ids || ids.length === 0) return {};
  
    const res = await fetch(`${API_URL}/users/read.php?ids=${ids.join(',')}`, {
      headers: authHeaders()
    });
  
    if (!res.ok) {
      console.warn('Failed to fetch users');
      return {};
    }
  
    const data = await res.json();
    const userMap = {};
    if (data.success && Array.isArray(data.users)) {
      data.users.forEach(user => {
        userMap[user.id] = user.username;
      });
    }
    return userMap;
  }

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-button');
    const registerBtn = document.getElementById('register-button');
    const toggleToRegister = document.getElementById('toggle-to-register');
    const toggleToLogin = document.getElementById('toggle-to-login');

    if (loginBtn) loginBtn.addEventListener('click', login);
    if (registerBtn) registerBtn.addEventListener('click', register);
    if (toggleToRegister) toggleToRegister.addEventListener('click', showRegister);
    if (toggleToLogin) toggleToLogin.addEventListener('click', showLogin);
});


function showNotification(message, type = 'error', duration = 3000) {
    let notification = document.getElementById('notification');

    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.className = `notification show ${type}`;

    setTimeout(() => {
        notification.className = 'notification hidden';
    }, duration);
}

function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

async function login() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        showNotification('Please enter email and password');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/login.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            showNotification(errorData.error || 'Server error', 'error');
            return;
        }
    
        const result = await response.json();
    
        if (result.token) {
            localStorage.setItem('token', result.token);
            showNotification('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showNotification(result.message || 'Login error', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification(error.message || 'Login error', 'error');
    }
    
}

async function register() {
    const username = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();

    if (!username || !email || !password) {
        showNotification('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/register.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            showNotification(errorData.error || 'Registration error', 'error');
            return;
        }
    
        const result = await response.json();
    
        if (result.token) {
            localStorage.setItem('token', result.token);
            showNotification('Registration successful!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showNotification(result.message || 'Registration error', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification(error.message || 'Registration error', 'error');
    }
    
}

export async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
        logout();
        return null;
    }

    const response = await fetch(`${API_URL}/auth/profile.php`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const text = await response.text();

    if (!response.ok) {
        logout();
        return null;
    }

    try {
        const user = JSON.parse(text);
        return {
            token,
            ...user
        };
    } catch (e) {
        console.error('JSON.parse error in checkAuth:', e);
        logout();
        return null;
    }
}

function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp < now;
    } catch (e) {
        console.error('Token parse error:', e);
        return true; 
    }
}


export function logout() {
    localStorage.removeItem('token');
    window.location.href = 'start.html';
}