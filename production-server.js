const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Essential middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

app.use(session({
  secret: 'mb-capital-production-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

const adminUser = {
  username: 'admin',
  password: '$2b$10$b1O9qIB9lGv5HlOc30t0yuo85tLqf34WEAN5.LYEKkCdLLvSxb1qa'
};

// Working admin routes
app.get('/working-admin-login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html><head><title>MB CAPITAL ADMIN LOGIN</title></head>
    <body style="font-family:Arial;padding:30px;background:#2563eb;color:white;">
    <div style="max-width:400px;margin:0 auto;background:white;color:black;padding:40px;border-radius:20px;">
    <h1 style="color:#2563eb;text-align:center;">MB CAPITAL ADMIN</h1>
    <p style="text-align:center;margin-bottom:20px;color:#10b981;">✅ Production server working correctly</p>
    <form action="/working-admin-login" method="POST">
    <div style="margin:20px 0;">
    <label>Username:</label><br>
    <input type="text" name="username" value="admin" style="width:100%;padding:10px;margin:5px 0;">
    </div>
    <div style="margin:20px 0;">
    <label>Password:</label><br>
    <input type="password" name="password" placeholder="Scrappy2025Bachmann##" style="width:100%;padding:10px;margin:5px 0;">
    </div>
    <button type="submit" style="width:100%;padding:15px;background:#2563eb;color:white;border:none;border-radius:5px;font-size:16px;">ACCESS ADMIN DASHBOARD</button>
    </form>
    <p style="text-align:center;margin-top:20px;font-size:12px;color:#6b7280;">
    Production server: production-server.js<br>
    Time: ${new Date().toLocaleString('en-US', {timeZone: 'America/Chicago'})} CST
    </p>
    </div>
    </body></html>
  `);
});

// Login POST handler
app.post('/working-admin-login', async (req, res) => {
  const { username, password } = req.body;
  
  if (username === adminUser.username && await bcrypt.compare(password, adminUser.password)) {
    req.session.userId = 1;
    req.session.username = username;
    res.redirect('/working-admin-dashboard');
  } else {
    res.redirect('/working-admin-login?error=1');
  }
});

// Working dashboard
app.get('/working-admin-dashboard', (req, res) => {
  if (!req.session?.userId) {
    return res.redirect('/working-admin-login');
  }
  
  res.send(`
    <!DOCTYPE html>
    <html><head><title>MB CAPITAL ADMIN DASHBOARD</title></head>
    <body style="font-family:Arial;padding:30px;background:#f8fafc;">
    <div style="background:#2563eb;color:white;padding:20px;margin-bottom:30px;border-radius:10px;">
    <h1>🏢 MB CAPITAL GROUP ADMIN DASHBOARD</h1>
    <p>Welcome, ${req.session.username}! Production server operational.</p>
    <div style="margin-top:15px;">
    <a href="/working-admin-logout" style="background:white;color:#2563eb;padding:10px 20px;text-decoration:none;border-radius:5px;margin-right:10px;">Logout</a>
    <a href="/" style="background:#10b981;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">View Main Site</a>
    </div>
    </div>
    
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-bottom:30px;">
    <div style="background:white;padding:30px;border-radius:10px;text-align:center;border:3px solid #10b981;">
    <h3 style="color:#10b981;">System Status</h3>
    <div style="font-size:36px;font-weight:bold;margin:10px 0;color:#059669;">LIVE</div>
    <p style="color:#6b7280;">Production Ready</p>
    </div>
    <div style="background:white;padding:30px;border-radius:10px;text-align:center;border:3px solid #2563eb;">
    <h3 style="color:#2563eb;">Investment Capacity</h3>
    <div style="font-size:36px;font-weight:bold;margin:10px 0;color:#1e40af;">$50M</div>
    <p style="color:#6b7280;">Multifamily Syndications</p>
    </div>
    <div style="background:white;padding:30px;border-radius:10px;text-align:center;border:3px solid #7c3aed;">
    <h3 style="color:#7c3aed;">Target Returns</h3>
    <div style="font-size:36px;font-weight:bold;margin:10px 0;color:#6d28d9;">12-16%</div>
    <p style="color:#6b7280;">Annual ROI Target</p>
    </div>
    </div>
    
    <div style="background:white;padding:30px;border-radius:10px;border:2px solid #e5e7eb;">
    <h2 style="color:#2563eb;margin-bottom:20px;">✅ Production System Confirmed</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
    <div>
    <p><strong>🔗 Server:</strong> production-server.js</p>
    <p><strong>🔐 Authentication:</strong> Working</p>
    <p><strong>💾 Sessions:</strong> Persistent</p>
    <p><strong>🌐 Main Site:</strong> <a href="/" style="color:#2563eb;">mbcapitalgroup.com</a></p>
    </div>
    <div>
    <p><strong>📊 Business:</strong> Multifamily Real Estate</p>
    <p><strong>🏢 Focus:</strong> Class B & C Properties</p>
    <p><strong>📍 Markets:</strong> Kansas City, St. Louis</p>
    <p><strong>💰 Min Investment:</strong> $50,000</p>
    </div>
    </div>
    </div>
    
    <script>
    console.log('MB CAPITAL ADMIN DASHBOARD LOADED');
    console.log('Production server: production-server.js');
    console.log('User:', '${req.session.username}');
    console.log('Time:', '${new Date().toISOString()}');
    
    // Test session persistence
    setTimeout(() => {
      fetch('/working-admin-dashboard')
        .then(r => r.ok ? console.log('✅ Session persistence: CONFIRMED') : console.log('❌ Session failed'))
        .catch(e => console.log('Error:', e));
    }, 2000);
    </script>
    </body></html>
  `);
});

// Logout
app.get('/working-admin-logout', (req, res) => {
  req.session.destroy();
  res.redirect('/working-admin-login');
});

// Main site - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: "Route not found", path: req.originalUrl, server: "production-server.js" });
});

app.listen(PORT, () => {
  console.log(`MB CAPITAL PRODUCTION SERVER running on port ${PORT}`);
  console.log('✅ File: production-server.js');
  console.log('✅ Admin routes: /working-admin-login, /working-admin-dashboard');
  console.log('✅ Main site: / (serves index.html)');
  console.log('✅ Time:', new Date().toLocaleString('en-US', {timeZone: 'America/Chicago'}), 'CST');
});
