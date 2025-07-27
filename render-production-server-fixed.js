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
            background: linear-gradient(135deg, #1e3a8a, #f59e0b);
            min-height: 100vh; display: flex; align-items: center; justify-content: center;
        }
        .login-container {
            background: white; padding: 3rem; border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2); width: 100%; max-width: 400px; text-align: center;
        }
        .logo { font-size: 2rem; font-weight: bold; color: #1e3a8a; margin-bottom: 1rem; }
        .subtitle { color: #666; margin-bottom: 2rem; font-size: 1.1rem; }
        .form-group { margin-bottom: 1.5rem; text-align: left; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333; }
        .form-group input { width: 100%; padding: 12px 15px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s; }
        .form-group input:focus { outline: none; border-color: #f59e0b; }
        .login-btn { width: 100%; background: #f59e0b; color: #1e3a8a; padding: 15px; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: background-color 0.3s; }
        .login-btn:hover { background: #d97706; }
        .back-link { margin-top: 2rem; }
        .back-link a { color: #666; text-decoration: none; font-size: 0.9rem; }
        .back-link a:hover { color: #f59e0b; }
        .error-message { background: #fee; color: #c53030; padding: 10px; border-radius: 6px; margin-bottom: 1rem; display: ${req.query.error ? 'block' : 'none'}; }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">MB Capital Group</div>
        <div class="subtitle">Professional Admin Portal</div>
        <div class="error-message">Invalid username or password</div>
        <form method="POST" action="/admin/login">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="login-btn">Access Admin Dashboard</button>
        </form>
        <div class="back-link"><a href="/">← Back to Main Site</a></div>
    </div>
</body>
</html>`);
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === admin.username && password === admin.password) {
    req.session.isAdmin = true;
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin/login?error=1');
  }
});

app.get('/api/team-members', (req, res) => {
  res.json([
    { 
      name: 'Michael Bachmann', 
      title: 'Principle & Owner', 
      image: '/team-photos/michael-bachmann-solo.jpg', 
      bio: 'Michael\'s entrepreneurial journey began early - at age 18, he started working for Domino\'s Pizza and was promoted to store manager in less than a year. At 20, he moved to Honolulu, Hawaii to manage two underperforming stores, demonstrating his ability to turn around challenging operations. By age 21, Michael had returned to Kansas City as a successful Domino\'s franchisee, owning and operating three stores in Lenexa and Overland Park, Kansas before selling them in 1999 to pursue other opportunities.' 
    },
    { 
      name: 'Makeba Hart aka the wholesaling badest bitch around', 
      title: 'Advisor to Michael Bachmann', 
      image: '/team-photos/makeba-hart.jpg', 
      bio: 'There once was this amazing person named Makeba and she always questioned herself....but what she took forever to realize is that she is always enough and never falls short. No matter what the rest of the world might think she is the QUEEN BEA. She doesn\'t realized it yet but she is soon to be a millionaires!!!! And her friend Michael couldn\'t be more proud of her for staying in the game and fighting a good fight!!!!!' 
    },
    { 
      name: 'Dave Lindahl', 
      title: 'Mentor', 
      image: '/team-photos/dave-lindahl.jpg', 
      bio: 'Dave Lindahl is a nationally renowned multifamily real estate investor, bestselling author, and respected mentor in the apartment syndication industry. With decades of hands-on experience acquiring, syndicating, and managing apartment communities, Dave has built a substantial multifamily portfolio and guided thousands of investors toward financial success.' 
    },
    { 
      name: 'Scott Stafford', 
      title: 'Demographer', 
      image: '/team-photos/dave-lindahl-solo.jpg', 
      bio: 'Scott Stafford brings deep expertise in demographic analysis and market research to MB Capital Group, where he plays a critical role in identifying high-potential multifamily investment opportunities. His background in data analytics and economic modeling allows the team to make informed decisions rooted in future-facing market intelligence.' 
    },
    { 
      name: 'Eric Stewart', 
      title: 'Owner of Atlantic Investment Capital, Inc.', 
      image: '/team-photos/eric-stewart.jpg', 
      bio: 'Eric Stewart is the founder and president of Atlantic Investment Capital, Inc., a boutique commercial mortgage firm specializing in multifamily financing solutions. With over two decades of experience in commercial real estate lending, Eric brings a wealth of industry expertise and lender relationships to MB Capital Group\'s acquisition strategy.' 
    },
    { 
      name: 'Jeannie Orlowski', 
      title: 'Mentor & Coach', 
      image: '/team-photos/jeannie-orlowski.jpg', 
      bio: 'Jeannie Orlowski is a seasoned real estate coach and investor education specialist with over two decades of experience helping individuals build long-term wealth through multifamily investments. For more than 20 years, Jeannie has served alongside Dave Lindahl at ReMentor, one of the nation\'s leading multifamily education platforms.' 
    },
    { 
      name: 'Dean Graziosi', 
      title: 'Mentor', 
      image: '/team-photos/dean-graziosi.jpg', 
      bio: 'Dean Graziosi is a New York Times bestselling author, successful entrepreneur, and one of the most recognized names in real estate education. With decades of experience in business development and property investing, Dean brings invaluable insight to MB Capital Group\'s mentorship network—supporting both strategic growth and investor empowerment.' 
    },
    { 
      name: 'Tom Krol', 
      title: 'Mentor', 
      image: '/team-photos/tom-krol.jpg', 
      bio: 'Tom Krol is a nationally respected real estate coach, entrepreneur, and former host of the top-rated Wholesaling Inc. podcast, where he educated thousands of investors on creative deal-making and real estate business systems. Today, Tom is the founder and CEO of Coaching Inc., a platform dedicated to helping entrepreneurs build and scale coaching businesses.' 
    }
  ]);
});

app.get('/admin/dashboard', (req, res) => {
  if (!req.session.isAdmin) return res.redirect('/admin/login');
  res.send(`<!DOCTYPE html>
<html><head><title>Admin Dashboard - MB Capital Group</title>
<style>
body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
.header { background: #1e3a8a; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
.dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
.section-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); cursor: pointer; }
.section-card:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
.section-title { font-size: 1.2rem; font-weight: bold; color: #1e3a8a; margin-bottom: 10px; }
.logout-link { margin-top: 20px; text-align: center; }
.logout-link a { color: #666; text-decoration: none; padding: 10px 20px; border: 1px solid #ddd; border-radius: 5px; }
</style>
</head><body>
<div class="header">
<h1>MB Capital Group Admin Dashboard</h1>
<p>Professional administration portal - All 8 team members with authentic data now live</p>
</div>
<div class="dashboard-grid">
<div class="section-card"><div class="section-title">👥 Team Management</div><p>All 8 team members with authentic bios now active</p></div>
<div class="section-card"><div class="section-title">🏢 Investment Properties</div><p>Property management and listings</p></div>
<div class="section-card"><div class="section-title">📧 Email Distribution</div><p>Newsletter and communication management</p></div>
<div class="section-card"><div class="section-title">📊 Analytics Dashboard</div><p>Website traffic and engagement metrics</p></div>
<div class="section-card"><div class="section-title">💼 Investor Portal</div><p>Investor registration and document access</p></div>
<div class="section-card"><div class="section-title">📋 Consultation Requests</div><p>Lead management and follow-up system</p></div>
<div class="section-card"><div class="section-title">🔧 Market Intelligence</div><p>Real estate market analysis tools</p></div>
<div class="section-card"><div class="section-title">💰 Tax Calculator</div><p>Investment tax benefit calculator</p></div>
</div>
<div class="logout-link"><a href="/admin/logout">Logout</a></div>
</body></html>`);
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

app.listen(PORT, () => {
  console.log('MB Capital Group server running on port ' + PORT);
  console.log('Team API: https://your-domain.onrender.com/api/team-members');
  console.log('Admin login: https://your-domain.onrender.com/admin/login');
});
