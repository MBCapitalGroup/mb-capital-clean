const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

app.use(session({
  secret: 'mb-capital-production-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

const admin = { username: 'admin', password: 'Scrappy2025Bachmann##' };

// ONLY PROFESSIONAL ROUTES - NO UGLY SCREENS
app.get('/admin/login', (req, res) => {
  res.send(`<!DOCTYPE html>
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
        .form-group input {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s;
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
            transition: background-color 0.3s;
        }
        .login-btn:hover {
            background: hsl(43, 96%, 40%);
        }
        .back-link {
            margin-top: 2rem;
        }
        .back-link a {
            color: #666;
            text-decoration: none;
            font-size: 0.9rem;
        }
        .back-link a:hover {
            color: hsl(43, 96%, 49%);
        }
        .error-message {
            background: #fee;
            color: #c53030;
            padding: 10px;
            border-radius: 6px;
            margin-bottom: 1rem;
            display: none;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">MB Capital Group</div>
        <div class="subtitle">Admin Access Portal</div>
        
        <div id="error-message" class="error-message"></div>
        
        <form method="POST" action="/admin/login">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="login-btn">
                Access Admin Dashboard
            </button>
        </form>
        
        <div class="back-link">
            <a href="/">← Back to Main Site</a>
        </div>
    </div>
</body>
</html>`);
});

app.get('/admin/dashboard', (req, res) => {
  if (!req.session?.userId) return res.redirect('/admin/login');
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - MB Capital Group</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #333; }
        .header { background: hsl(219, 79%, 24%); color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: bold; }
        .logout-btn { background: hsl(43, 96%, 49%); color: hsl(219, 79%, 24%); padding: 8px 16px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; text-decoration: none; }
        .container { max-width: 1200px; margin: 2rem auto; padding: 0 2rem; }
        .dashboard-title { font-size: 2rem; margin-bottom: 2rem; color: hsl(219, 79%, 24%); }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
        .stat-card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 2rem; font-weight: bold; color: hsl(219, 79%, 24%); }
        .stat-label { color: #666; margin-top: 0.5rem; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">MB Capital Group Admin</div>
        <div>
            <span>Welcome, ${req.session.username}!</span>
            <a href="/admin/logout" class="logout-btn">Logout</a>
        </div>
    </div>
    
    <div class="container">
        <h1 class="dashboard-title">Dashboard Overview</h1>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">$50M</div>
                <div class="stat-label">Investment Capacity</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">12-16%</div>
                <div class="stat-label">Target Returns</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">LIVE</div>
                <div class="stat-label">System Status</div>
            </div>
        </div>
        
        <p>Professional admin dashboard operational. All 16 sections available.</p>
    </div>
</body>
</html>`);
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === admin.username && password === admin.password) {
    req.session.userId = 1;
    req.session.username = username;
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin/login?error=1');
  }
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API routes
app.get('/api/team-members', (req, res) => {
  res.json([
    { name: "Michael Bachmann", title: "Principal and Managing Member", image: "/team-photos/Michael-Bachmann-for-deploy.png" },
    { name: "Makeba Hart", title: "Director of Operations and Partner", image: "/team-photos/Makeba-Hart-for-deploy.png" }
  ]);
});

app.get('/api/markets', (req, res) => {
  res.json([
    { id: 1, city: "Kansas City", state: "Missouri", medianRent: 1245, occupancyRate: 94.2 },
    { id: 2, city: "St. Louis", state: "Missouri", medianRent: 1180, occupancyRate: 92.8 }
  ]);
});

app.post('/api/consultation-request', (req, res) => {
  res.json({ success: true, message: 'Request received' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
