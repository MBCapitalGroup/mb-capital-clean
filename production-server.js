const express = require('express');
const path = require('path');
const fs = require('fs');
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

// DEFINITIVE AUTHENTICATION - NO BCRYPT, NO COMPLEXITY
const admin = { username: 'admin', password: 'Scrappy2025Bachmann##' };

// DEFINITIVE ADMIN LOGIN - FORCE SERVE ACTUAL HTML FILE
app.get('/admin/login', (req, res) => {
  const loginPath = path.join(__dirname, 'admin-login.html');
  if (fs.existsSync(loginPath)) {
    res.sendFile(loginPath);
  } else {
    res.send(`<!DOCTYPE html><html><head><title>Admin Login - MB Capital Group</title><style>body{font-family:Arial;padding:50px;background:#1e40af;color:white;text-align:center;}form{max-width:400px;margin:0 auto;background:white;color:black;padding:40px;border-radius:15px;}input{width:100%;padding:12px;margin:10px 0;border:1px solid #ccc;border-radius:5px;}button{width:100%;padding:15px;background:#1e40af;color:white;border:none;border-radius:5px;font-size:16px;cursor:pointer;}</style></head><body><h1>MB Capital Group Admin</h1><form method="POST" action="/admin/login"><input type="text" name="username" placeholder="Username" required><input type="password" name="password" placeholder="Password" required><button type="submit">Login</button></form></body></html>`);
  }
});

// DEFINITIVE ADMIN DASHBOARD - FORCE SERVE ACTUAL HTML FILE
app.get('/admin/dashboard', (req, res) => {
  if (!req.session?.userId) return res.redirect('/admin/login');
  
  const dashboardPath = path.join(__dirname, 'admin-dashboard.html');
  if (fs.existsSync(dashboardPath)) {
    res.sendFile(dashboardPath);
  } else {
    res.send(`<!DOCTYPE html><html><head><title>Admin Dashboard</title><style>body{font-family:Arial;padding:30px;background:#f5f5f5;}</style></head><body><h1>MB Capital Group Admin Dashboard</h1><p>Welcome, ${req.session.username}!</p><a href="/admin/logout" style="background:#dc2626;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Logout</a></body></html>`);
  }
});

// DEFINITIVE LOGIN HANDLER
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

// API DATA
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
  console.log(`Admin: /admin/login`);
});
