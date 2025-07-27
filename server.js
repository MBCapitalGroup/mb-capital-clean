const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Simple fix - minimal interference approach
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'simple-render-fix-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

const adminUser = {
  username: 'admin',
  password: '$2b$10$b1O9qIB9lGv5HlOc30t0yuo85tLqf34WEAN5.LYEKkCdLLvSxb1qa'
};

// Root - simple redirect
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html><head><title>RENDER FIX WORKING</title></head>
    <body style="font-family:Arial;padding:50px;text-align:center;background:#dc2626;color:white;">
    <h1>RENDER FIX ACTIVE</h1>
    <p>Server updated at: ${new Date().toISOString()}</p>
    <a href="/render-login" style="background:white;color:#dc2626;padding:20px;text-decoration:none;border-radius:10px;font-weight:bold;">LOGIN HERE</a>
    </body></html>
  `);
});

// Login page
app.get('/render-login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html><head><title>RENDER LOGIN WORKING</title></head>
    <body style="font-family:Arial;padding:30px;background:#dc2626;color:white;">
    <div style="max-width:400px;margin:0 auto;background:white;color:black;padding:40px;border-radius:20px;">
    <h1 style="color:#dc2626;text-align:center;">RENDER LOGIN</h1>
    <form action="/render-login" method="POST">
    <div style="margin:20px 0;">
    <label>Username:</label><br>
    <input type="text" name="username" value="admin" style="width:100%;padding:10px;margin:5px 0;">
    </div>
    <div style="margin:20px 0;">
    <label>Password:</label><br>
    <input type="password" name="password" style="width:100%;padding:10px;margin:5px 0;">
    </div>
    <button type="submit" style="width:100%;padding:15px;background:#dc2626;color:white;border:none;border-radius:5px;font-size:16px;">LOGIN</button>
    </form>
    </div>
    </body></html>
  `);
});

// Login POST
app.post('/render-login', async (req, res) => {
  const { username, password } = req.body;
  
  if (username === adminUser.username && await bcrypt.compare(password, adminUser.password)) {
    req.session.userId = 1;
    req.session.username = username;
    res.redirect('/render-dashboard');
  } else {
    res.redirect('/render-login');
  }
});

// Dashboard
app.get('/render-dashboard', (req, res) => {
  if (!req.session?.userId) {
    return res.redirect('/render-login');
  }
  
  res.send(`
    <!DOCTYPE html>
    <html><head><title>RENDER DASHBOARD WORKING</title></head>
    <body style="font-family:Arial;padding:30px;background:#f5f5f5;">
    <div style="background:#dc2626;color:white;padding:20px;margin-bottom:30px;border-radius:10px;">
    <h1>RENDER DASHBOARD SUCCESS</h1>
    <p>Welcome, ${req.session.username}!</p>
    <a href="/render-logout" style="background:white;color:#dc2626;padding:10px 20px;text-decoration:none;border-radius:5px;">Logout</a>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;">
    <div style="background:white;padding:30px;border-radius:10px;text-align:center;border:3px solid #dc2626;">
    <h3 style="color:#dc2626;">Investment Capacity</h3>
    <div style="font-size:36px;font-weight:bold;margin:10px 0;">$50M</div>
    </div>
    <div style="background:white;padding:30px;border-radius:10px;text-align:center;border:3px solid #dc2626;">
    <h3 style="color:#dc2626;">Target Returns</h3>
    <div style="font-size:36px;font-weight:bold;margin:10px 0;">12-16%</div>
    </div>
    <div style="background:white;padding:30px;border-radius:10px;text-align:center;border:3px solid #dc2626;">
    <h3 style="color:#dc2626;">Active Markets</h3>
    <div style="font-size:36px;font-weight:bold;margin:10px 0;">2</div>
    </div>
    </div>
    <script>
    console.log('RENDER DASHBOARD LOADED - Session working!');
    setTimeout(() => {
      fetch('/render-dashboard')
        .then(r => r.ok ? console.log('Session persistence: WORKING') : console.log('Session test failed'))
        .catch(e => console.log('Error:', e));
    }, 2000);
    </script>
    </body></html>
  `);
});

// Logout
app.get('/render-logout', (req, res) => {
  req.session.destroy();
  res.redirect('/render-login');
});

app.listen(PORT, () => {
  console.log(`SIMPLE RENDER FIX SERVER running on port ${PORT}`);
  console.log('Routes: /render-login, /render-dashboard');
  console.log('Time:', new Date().toISOString());
});
