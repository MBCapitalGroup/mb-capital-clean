const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

const app = express();
const PORT = process.env.PORT || 3000;

// Critical Render.com settings
app.set('trust proxy', 1);

// Enhanced middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// COMPLETELY DIFFERENT SESSION APPROACH - Use MemoryStore with detailed logging
const sessionConfig = {
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: 'mb-capital-session-secret-2025-debug',
  resave: false,
  saveUninitialized: false,
  name: 'mb-session',
  rolling: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
};

app.use(session(sessionConfig));

// Detailed session logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  console.log(`Session ID: ${req.sessionID}`);
  console.log(`Session Data:`, req.session);
  console.log(`Cookies:`, req.headers.cookie);
  console.log('---');
  next();
});

// Admin users
const adminUsers = [
  {
    id: 10,
    username: 'admin',
    password: '$2b$10$b1O9qIB9lGv5HlOc30t0yuo85tLqf34WEAN5.LYEKkCdLLvSxb1qa',
    email: 'admin@mbcapitalgroup.com'
  }
];

// Simplified auth middleware with extensive logging
function requireAuth(req, res, next) {
  console.log('AUTH CHECK START');
  console.log('Session ID:', req.sessionID);
  console.log('User ID in session:', req.session?.userId);
  console.log('Session object:', JSON.stringify(req.session, null, 2));
  
  if (!req.session || !req.session.userId) {
    console.log('AUTH FAILED - Redirecting to login');
    return res.status(401).json({ error: 'Authentication required', sessionData: req.session });
  }
  
  console.log('AUTH SUCCESS for user:', req.session.username);
  next();
}

// Root route
app.get('/', (req, res) => {
  res.send('<h1>MB Capital Group</h1><p><a href="/admin/login">Admin Login</a></p>');
});

// Login page with enhanced debugging
app.get('/admin/login', (req, res) => {
  console.log('SERVING LOGIN PAGE');
  res.send(`<!DOCTYPE html>
<html>
<head>
    <title>DEBUG Login - MB Capital</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        button { width: 100%; padding: 12px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #005a87; }
        .debug { background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 4px; font-size: 12px; }
        .status { position: fixed; top: 10px; right: 10px; background: #28a745; color: white; padding: 5px 10px; border-radius: 15px; }
    </style>
</head>
<body>
    <div class="status">DEBUG MODE</div>
    <h2>MB Capital Group - Admin Login</h2>
    
    <div class="debug">
        <strong>Session Debug Info:</strong><br>
        Session ID: ${req.sessionID}<br>
        Current User: ${req.session?.userId || 'None'}<br>
        Timestamp: ${new Date().toISOString()}
    </div>
    
    <form id="loginForm">
        <div class="form-group">
            <label>Username:</label>
            <input type="text" name="username" value="admin" required>
        </div>
        <div class="form-group">
            <label>Password:</label>
            <input type="password" name="password" required>
        </div>
        <button type="submit">Login</button>
    </form>
    
    <div id="result" class="debug" style="display:none;"></div>
    
    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const resultDiv = document.getElementById('result');
            const formData = new FormData(e.target);
            
            console.log('STARTING LOGIN ATTEMPT');
            
            try {
                const response = await fetch('/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: formData.get('username'),
                        password: formData.get('password')
                    }),
                    credentials: 'same-origin'
                });
                
                const result = await response.json();
                console.log('LOGIN RESPONSE:', result);
                
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = '<strong>Response:</strong><br>' + JSON.stringify(result, null, 2);
                
                if (result.success) {
                    console.log('LOGIN SUCCESS - Redirecting in 2 seconds');
                    setTimeout(() => {
                        window.location.href = '/admin/dashboard';
                    }, 2000);
                }
                
            } catch (error) {
                console.error('LOGIN ERROR:', error);
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = '<strong>Error:</strong> ' + error.message;
            }
        });
    </script>
</body>
</html>`);
});

// Login POST with step-by-step logging
app.post('/admin/login', async (req, res) => {
  console.log('=== LOGIN POST START ===');
  console.log('Body:', req.body);
  console.log('Session before login:', req.session);
  
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      console.log('MISSING CREDENTIALS');
      return res.json({ success: false, error: 'Missing credentials' });
    }
    
    const user = adminUsers.find(u => u.username === username);
    if (!user) {
      console.log('USER NOT FOUND');
      return res.json({ success: false, error: 'User not found' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('INVALID PASSWORD');
      return res.json({ success: false, error: 'Invalid password' });
    }
    
    console.log('PASSWORD VALID - Setting session');
    
    // Direct session assignment - no regeneration
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.isAdmin = true;
    req.session.loginTime = new Date().toISOString();
    
    console.log('Session after assignment:', req.session);
    
    // Force save with callback
    req.session.save((saveErr) => {
      if (saveErr) {
        console.error('SESSION SAVE ERROR:', saveErr);
        return res.json({ success: false, error: 'Session save failed' });
      }
      
      console.log('SESSION SAVED SUCCESSFULLY');
      console.log('Final session:', req.session);
      
      res.json({ 
        success: true, 
        redirect: '/admin/dashboard',
        sessionId: req.sessionID,
        userId: req.session.userId
      });
    });
    
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.json({ success: false, error: 'Server error' });
  }
});

// Dashboard with session verification
app.get('/admin/dashboard', requireAuth, (req, res) => {
  console.log('=== DASHBOARD ACCESS ===');
  console.log('Session:', req.session);
  
  res.send(`<!DOCTYPE html>
<html>
<head>
    <title>Dashboard - MB Capital</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1000px; margin: 20px auto; padding: 20px; }
        .header { background: #007cba; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #007cba; }
        .debug { background: #e9ecef; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .status { position: fixed; top: 10px; right: 10px; background: #28a745; color: white; padding: 5px 10px; border-radius: 15px; }
    </style>
</head>
<body>
    <div class="status">SESSION ACTIVE</div>
    
    <div class="header">
        <h1>MB Capital Group - Admin Dashboard</h1>
        <p>Welcome, ${req.session.username}! Session working correctly.</p>
        <a href="/admin/logout" style="color: yellow;">Logout</a>
    </div>
    
    <div class="stats">
        <div class="stat-card">
            <h3>Investment Capacity</h3>
            <h2>$50M</h2>
        </div>
        <div class="stat-card">
            <h3>Target Returns</h3>
            <h2>12-16%</h2>
        </div>
        <div class="stat-card">
            <h3>Active Markets</h3>
            <h2>2</h2>
        </div>
        <div class="stat-card">
            <h3>Team Members</h3>
            <h2>4</h2>
        </div>
    </div>
    
    <div class="debug">
        <strong>Session Debug Info:</strong><br>
        User ID: ${req.session.userId}<br>
        Username: ${req.session.username}<br>
        Login Time: ${req.session.loginTime}<br>
        Session ID: ${req.sessionID}<br>
        Is Admin: ${req.session.isAdmin}<br>
        Timestamp: ${new Date().toISOString()}
    </div>
    
    <script>
        console.log('Dashboard loaded successfully');
        console.log('Session info available on page');
        
        // Test session persistence
        setTimeout(() => {
            fetch('/admin/dashboard', { credentials: 'same-origin' })
                .then(response => {
                    console.log('Session test response:', response.status);
                    if (response.status === 401) {
                        console.log('SESSION LOST - This is the problem!');
                    } else {
                        console.log('SESSION PERSISTENT - Working correctly');
                    }
                })
                .catch(err => console.log('Session test error:', err));
        }, 3000);
    </script>
</body>
</html>`);
});

// Logout
app.get('/admin/logout', (req, res) => {
  console.log('LOGOUT REQUEST');
  req.session.destroy((err) => {
    if (err) console.error('Logout error:', err);
    res.clearCookie('mb-session');
    res.redirect('/admin/login');
  });
});

// API routes for testing
app.get('/api/session-status', (req, res) => {
  res.json({
    sessionId: req.sessionID,
    sessionData: req.session,
    isAuthenticated: !!req.session?.userId,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔍 DEBUG SERVER running on port ${PORT}`);
  console.log('📊 This server has extensive logging to debug session issues');
  console.log('🔑 Login: admin / Scrappy2025Bachmann##');
  console.log('🎯 Focus: Identify why sessions aren\'t persisting');
});
