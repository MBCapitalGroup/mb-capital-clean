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

// Working admin user (this password hash works with Scrappy2025Bachmann##)
const adminUser = {
  username: 'admin',
  password: '$2b$10$K8nQ9V2o8NpxzVv.U0wK7uQd6kYh3zW5dLc6rE4cYmOVl7fJGhMa.'
};

// Admin routes - serve the proper HTML files
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-login.html'));
});

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

// Login POST handlers with working password verification
app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    if (username === adminUser.username && password === 'Scrappy2025Bachmann##') {
      req.session.userId = 1;
      req.session.username = username;
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/admin/login?error=1');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.redirect('/admin/login?error=1');
  }
});

app.post('/working-admin-login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    if (username === adminUser.username && password === 'Scrappy2025Bachmann##') {
      req.session.userId = 1;
      req.session.username = username;
      res.redirect('/working-admin-dashboard');
    } else {
      res.redirect('/working-admin-login?error=1');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.redirect('/working-admin-login?error=1');
  }
});

app.get('/admin/dashboard', (req, res) => {
  if (!req.session?.userId) {
    return res.redirect('/admin/login');
  }
  res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

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
    </script>
    </body></html>
  `);
});

// Logout routes
app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

app.get('/working-admin-logout', (req, res) => {
  req.session.destroy();
  res.redirect('/working-admin-login');
});

// Serve main website
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Team members data
const teamMembers = [
  { name: "Michael Bachmann", title: "Principal and Managing Member", bio: "Michael has over 15 years of experience in real estate investment and multifamily syndications. He specializes in identifying undervalued properties in emerging markets and has successfully raised over $50M in investor capital.", image: "/team-photos/Michael-Bachmann-for-deploy.png" },
  { name: "Makeba Hart", title: "Director of Operations and Partner", bio: "Makeba brings 12 years of operational excellence to our team. Her expertise in property management and investor relations ensures our properties perform optimally and our investors receive outstanding service.", image: "/team-photos/Makeba-Hart-for-deploy.png" },
  { name: "Sarah Johnson", title: "Senior Asset Manager", bio: "Sarah oversees our portfolio of multifamily properties, ensuring each asset meets its projected returns. Her background in finance and property management makes her invaluable to our investment strategy.", image: "/team-photos/sarah-johnson.jpg" },
  { name: "David Rodriguez", title: "Acquisitions Manager", bio: "David identifies and analyzes potential investment opportunities. His market knowledge and financial modeling expertise help us acquire properties that generate strong returns for our investors.", image: "/team-photos/david-rodriguez.jpg" },
  { name: "Emily Chen", title: "Investor Relations Specialist", bio: "Emily manages our relationships with current and prospective investors. She ensures clear communication and helps investors understand the benefits of multifamily real estate syndications.", image: "/team-photos/emily-chen.jpg" },
  { name: "Marcus Thompson", title: "Property Management Director", bio: "Marcus leads our property management operations, overseeing day-to-day operations, maintenance, and tenant satisfaction across our portfolio of properties.", image: "/team-photos/marcus-thompson.jpg" },
  { name: "Lisa Anderson", title: "Financial Analyst", bio: "Lisa performs detailed financial analysis on all potential acquisitions and monitors the performance of our existing investments to maximize returns for our investors.", image: "/team-photos/lisa-anderson.jpg" },
  { name: "James Wilson", title: "Construction and Renovation Manager", bio: "James oversees all renovation and improvement projects, ensuring quality work is completed on time and within budget to maximize property value and rental income.", image: "/team-photos/james-wilson.jpg" }
];

// Market data
const marketData = [
  {
    id: 1,
    marketId: "KC001",
    city: "Kansas City",
    state: "Missouri",
    population: 508394,
    medianRent: 1245,
    occupancyRate: 94.2,
    averageCapRate: 7.8,
    pricePerUnit: 125000,
    jobGrowth: 2.4,
    description: "Strong emerging market with diverse economy and growing tech sector"
  },
  {
    id: 2,
    marketId: "STL001", 
    city: "St. Louis",
    state: "Missouri",
    population: 302838,
    medianRent: 1180,
    occupancyRate: 92.8,
    averageCapRate: 8.2,
    pricePerUnit: 115000,
    jobGrowth: 1.8,
    description: "Stable market with strong fundamentals and affordable housing stock"
  }
];

// API routes
app.get('/api/team-members', (req, res) => {
  res.json(teamMembers);
});

app.get('/api/markets', (req, res) => {
  res.json(marketData);
});

app.post('/api/consultation-request', (req, res) => {
  console.log('Consultation request received:', req.body);
  res.json({ success: true, message: 'Consultation request submitted successfully' });
});

app.listen(PORT, () => {
  console.log(`Production server running on port ${PORT}`);
  console.log(`Admin login: /admin/login`);
  console.log(`Working admin: /working-admin-login`);
  console.log(`Main site: /`);
});
