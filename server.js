<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - MB Capital Group</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: linear-gradient(135deg, hsl(219, 79%, 24%), hsl(43, 96%, 49%));
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .login-container {
            background: white;
            padding: 3rem;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        
        .logo {
            font-size: 2rem;
            font-weight: bold;
            color: hsl(219, 79%, 24%);
            margin-bottom: 1rem;
        }
        
        .subtitle {
            color: #666;
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
            text-align: left;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #333;
        }
        
        .password-input-container {
            position: relative;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        
        .password-input {
            padding-right: 45px !important;
        }
        
        .password-toggle {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
            font-size: 1.2rem;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: hsl(43, 96%, 49%);
        }
        
        .login-btn {
            width: 100%;
            background: hsl(43, 96%, 49%);
            color: hsl(219, 79%, 24%);
            padding: 15px;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .login-btn:hover {
            background: hsl(43, 96%, 40%);
            transform: translateY(-2px);
        }
        
        .login-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        
        .error-message {
            background: #fee;
            color: #c33;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 1rem;
            display: none;
        }
        
        .back-link {
            margin-top: 2rem;
            text-align: center;
        }
        
        .back-link a {
            color: hsl(219, 79%, 24%);
            text-decoration: none;
            font-weight: 600;
        }
        
        .back-link a:hover {
            color: hsl(43, 96%, 49%);
        }

        .loading {
            display: none;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">MB Capital Group</div>
        <div class="subtitle">Admin Dashboard Access</div>
        
        <div id="error-message" class="error-message"></div>
        
        <form id="loginForm">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <div class="password-input-container">
                    <input type="password" id="password" name="password" class="password-input" required>
                    <button type="button" class="password-toggle" onclick="togglePassword()">👁️</button>
                </div>
            </div>
            
            <button type="submit" class="login-btn" id="loginBtn">
                <span class="normal-text">Access Admin Dashboard</span>
                <span class="loading">Logging in...</span>
            </button>
        </form>
        
        <div class="back-link">
            <a href="/">← Back to Main Site</a>
        </div>
    </div>

    <script>
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const toggleBtn = document.querySelector('.password-toggle');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                toggleBtn.textContent = '👁️';
            }
        }

        function showError(message) {
            const errorDiv = document.getElementById('error-message');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }

        function hideError() {
            const errorDiv = document.getElementById('error-message');
            errorDiv.style.display = 'none';
        }

        function setLoading(loading) {
            const btn = document.getElementById('loginBtn');
            const normalText = btn.querySelector('.normal-text');
            const loadingText = btn.querySelector('.loading');
            
            if (loading) {
                btn.disabled = true;
                normalText.style.display = 'none';
                loadingText.style.display = 'inline';
            } else {
                btn.disabled = false;
                normalText.style.display = 'inline';
                loadingText.style.display = 'none';
            }
        }

        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            hideError();
            setLoading(true);
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    window.location.href = data.redirect || '/admin/dashboard';
                } else {
                    showError(data.error || 'Invalid credentials');
                }
            } catch (error) {
                console.error('Login error:', error);
                showError('Connection error. Please try again.');
            } finally {
                setLoading(false);
            }
        });

        // Focus username field on load
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('username').focus();
        });
    </script>
</body>
</html>
