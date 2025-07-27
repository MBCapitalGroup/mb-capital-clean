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

// BLOCK ALL UGLY ROUTES COMPLETELY
app.get('/working-admin-login', (req, res) => {
  res.redirect('/admin/login');
});

app.get('/working-admin-dashboard', (req, res) => {
  res.redirect('/admin/login');
});

app.post('/working-admin-login', (req, res) => {
  res.redirect('/admin/login');
});

// PROFESSIONAL ADMIN LOGIN - EMBEDDED HTML
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
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-container {
            background: white;
            padding: 3rem;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        .logo {
            font-size: 2rem;
            font-weight: bold;
            color: #1e3a8a;
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
            border-color: #f59e0b;
        }
        .login-btn {
            width: 100%;
            background: #f59e0b;
            color: #1e3a8a;
            padding: 15px;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .login-btn:hover {
            background: #d97706;
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
            color: #f59e0b;
        }
        .error-message {
            background: #fee;
            color: #c53030;
            padding: 10px;
            border-radius: 6px;
            margin-bottom: 1rem;
            display: ${req.query.error ? 'block' : 'none'};
        }
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
        .header { background: #1e3a8a; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: bold; }
        .logout-btn { background: #f59e0b; color: #1e3a8a; padding: 8px 16px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; text-decoration: none; }
        .container { max-width: 1200px; margin: 2rem auto; padding: 0 2rem; }
        .dashboard-title { font-size: 2rem; margin-bottom: 2rem; color: #1e3a8a; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
        .stat-card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 2rem; font-weight: bold; color: #1e3a8a; }
        .stat-label { color: #666; margin-top: 0.5rem; }
        .nav-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 2rem; }
        .nav-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; cursor: pointer; transition: transform 0.2s; }
        .nav-card:hover { transform: translateY(-2px); }
        .section { display: none; background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 2rem; }
        .section.active { display: block; }
        .section h2 { color: #1e3a8a; margin-bottom: 1.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #f59e0b; }
        .back-btn { background: #6b7280; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 1rem; }
        .back-btn:hover { background: #4b5563; }
        .nav-title { font-weight: bold; color: #1e3a8a; margin-bottom: 0.5rem; }
        .nav-desc { color: #666; font-size: 0.9rem; }
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
        <div id="dashboard-overview">
            <h1 class="dashboard-title">Admin Dashboard</h1>
        
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
            <div class="stat-card">
                <div class="stat-number">16</div>
                <div class="stat-label">Admin Sections</div>
            </div>
        </div>
        
        <div class="nav-grid">
            <div class="nav-card" onclick="showSection('team-management')">
                <div class="nav-title">👥 Team Management</div>
                <div class="nav-desc">Manage team member profiles, bios, photos, and organizational structure</div>
            </div>
            <div class="nav-card" onclick="showSection('property-management')">
                <div class="nav-title">🏢 Property Management</div>
                <div class="nav-desc">Investment property tracking, acquisition pipeline, and portfolio oversight</div>
            </div>
            <div class="nav-card" onclick="showSection('market-intelligence')">
                <div class="nav-title">📊 Market Intelligence</div>
                <div class="nav-desc">Real estate market data, analytics, and investment opportunity analysis</div>
            </div>
            <div class="nav-card" onclick="showSection('investor-portal')">
                <div class="nav-title">💼 Investor Portal Management</div>
                <div class="nav-desc">Investor account management, distribution tracking, and communication</div>
            </div>
            <div class="nav-card" onclick="showSection('consultation-requests')">
                <div class="nav-title">📋 Consultation Requests</div>
                <div class="nav-desc">Lead management, consultation scheduling, and prospect tracking</div>
            </div>
            <div class="nav-card" onclick="showSection('email-distribution')">
                <div class="nav-title">📧 Email Distribution</div>
                <div class="nav-desc">Newsletter management, investor communications, and email campaigns</div>
            </div>
            <div class="nav-card" onclick="showSection('blog-management')">
                <div class="nav-title">📝 Blog Management</div>
                <div class="nav-desc">Content creation, SEO optimization, and blog post distribution</div>
            </div>
            <div class="nav-card" onclick="showSection('analytics')">
                <div class="nav-title">📈 Reports & Analytics</div>
                <div class="nav-desc">Performance metrics, website analytics, and business intelligence</div>
            </div>
            <div class="nav-card" onclick="showSection('google-analytics')">
                <div class="nav-title">🔍 Google Analytics</div>
                <div class="nav-desc">Website traffic analysis, user behavior, and conversion tracking</div>
            </div>
            <div class="nav-card" onclick="showSection('k1-documents')">
                <div class="nav-title">📄 K1 Tax Documents</div>
                <div class="nav-desc">Tax document generation, distribution, and investor tax reporting</div>
            </div>
            <div class="nav-card" onclick="showSection('investor-invitations')">
                <div class="nav-title">📨 Investor Invitations</div>
                <div class="nav-desc">Secure invitation system for new investor onboarding</div>
            </div>
            <div class="nav-card" onclick="showSection('tax-calculator')">
                <div class="nav-title">🧮 Tax Calculator Management</div>
                <div class="nav-desc">Tax bracket management, calculator settings, and IRS code updates</div>
            </div>
            <div class="nav-card" onclick="showSection('ai-settings')">
                <div class="nav-title">🤖 AI Settings & Automation</div>
                <div class="nav-desc">AI configuration, market priorities, and automated recommendations</div>
            </div>
            <div class="nav-card" onclick="showSection('syndication-documents')">
                <div class="nav-title">📑 Syndication Documents</div>
                <div class="nav-desc">Document management, distribution, and investor communications</div>
            </div>
            <div class="nav-card" onclick="showSection('api-monitoring')">
                <div class="nav-title">🔑 API Key Management</div>
                <div class="nav-desc">API key monitoring, rotation, and system health tracking</div>
            </div>
            <div class="nav-card" onclick="showSection('admin-settings')">
                <div class="nav-title">⚙️ System Settings</div>
                <div class="nav-desc">Admin configuration, system settings, and platform management</div>
            </div>
        </div>
        
        <p style="margin-top: 2rem; color: #666;">Professional admin dashboard with 16 comprehensive sections for complete business management.</p>
    </div>
    
    <!-- All 16 Admin Sections -->
    <div id="team-management" class="section">
        <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
        <h2>👥 Team Management</h2>
        <p>Manage team member profiles, photos, and organizational structure. Add new team members, update existing profiles, and maintain the public-facing team page.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
            <strong>Current Team Members:</strong> 8 members<br>
            <strong>Photo Management:</strong> Professional headshots maintained<br>
            <strong>Last Updated:</strong> January 2025
        </div>
    </div>
    
    <div id="property-management" class="section">
        <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
        <h2>🏢 Property Management</h2>
        <p>Track investment properties, acquisition pipeline, and portfolio performance across all markets.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
            <strong>Active Properties:</strong> Under management<br>
            <strong>Pipeline:</strong> Acquisition opportunities tracked<br>
            <strong>Portfolio Value:</strong> $50M+ capacity
        </div>
    </div>
    
    <div id="market-intelligence" class="section">
        <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
        <h2>📊 Market Intelligence</h2>
        <p>Real estate market data, analytics, and investment opportunity analysis for target markets.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
            <strong>Target Markets:</strong> Kansas City, St. Louis<br>
            <strong>Market Analysis:</strong> Live data integration<br>
            <strong>Cap Rates:</strong> 7.8% - 8.2% average
        </div>
    </div>
    
    <div id="investor-portal" class="section">
        <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
        <h2>💼 Investor Portal Management</h2>
        <p>Manage investor accounts, track distributions, and handle investor communications.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
            <strong>Investor Accounts:</strong> Active management system<br>
            <strong>Distribution Tracking:</strong> Automated processing<br>
            <strong>Communications:</strong> Integrated messaging
        </div>
    </div>
    
    <div id="consultation-requests" class="section">
        <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
        <h2>📋 Consultation Requests</h2>
        <p>Lead management system for consultation requests and prospect tracking.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
            <strong>Lead Pipeline:</strong> Active prospect management<br>
            <strong>Consultation Scheduling:</strong> Automated system<br>
            <strong>Follow-up Tracking:</strong> CRM integration
        </div>
    </div>
    
    <div id="email-distribution" class="section">
        <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
        <h2>📧 Email Distribution</h2>
        <p>Newsletter management, investor communications, and automated email campaigns.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
            <strong>SendGrid Integration:</strong> Professional email delivery<br>
            <strong>Newsletter System:</strong> Automated distribution<br>
            <strong>Campaign Management:</strong> Investor communications
        </div>
    </div>
    
    <div id="blog-management" class="section">
        <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
        <h2>📝 Blog Management</h2>
        <p>Content creation, SEO optimization, and blog post distribution management.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
            <strong>Content Management:</strong> SEO-optimized posts<br>
            <strong>Distribution:</strong> Automated social sharing<br>
            <strong>Analytics:</strong> Performance tracking
        </div>
    </div>
    
    <div id="analytics" class="section">
        <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
        <h2>📈 Reports & Analytics</h2>
        <p>Performance metrics, business intelligence, and comprehensive reporting dashboard.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
            <strong>Business Intelligence:</strong> Comprehensive analytics<br>
            <strong>Performance Metrics:</strong> Real-time tracking<br>
            <strong>Reporting:</strong> Automated dashboard updates
        </div>
    </div>
    
    <div id="google-analytics" class="section">
        <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
        <h2>🔍 Google Analytics</h2>
        <p>Website traffic analysis, user behavior tracking, and conversion optimization.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
            <strong>Property ID:</strong> 11477941008<br>
            <strong>Measurement ID:</strong> G-ZC83SHQLM3<br>
            <strong>Live Data:</strong> Real-time visitor tracking
        </div>
    </div>
    
    <div id="k1-documents" class="section">
        <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
        <h2>📄 K1 Tax Documents</h2>
        <p>Tax document generation, distribution management, and investor tax reporting.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
            <strong>Document Generation:</strong> Automated tax forms<br>
            <strong>Distribution:</strong> Secure delivery system<br>
            <strong>Compliance:</strong> IRS reporting standards
        </div>
    </div>
    
    <div id="investor-invitations" class="section">
        <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
        <h2>📨 Investor Invitations</h2>
        <p>Secure invitation system for new investor onboarding and account creation.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
            <strong>Secure Tokens:</strong> Encrypted invitation system<br>
            <strong>Registration Flow:</strong> Automated onboarding<br>
            <strong>Account Creation:</strong> Investor portal integration
        </div>
    </div>
    
    <div id="tax-calculator" class="section">
        <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
        <h2>🧮 Tax Calculator Management</h2>
        <p>Tax bracket management, calculator settings, and IRS tax code updates.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
            <strong>Year Management:</strong> 2025-2030 tax years<br>
            <strong>IRS Integration:</strong> Updated tax brackets<br>
            <strong>Calculator Engine:</strong> Cost segregation analysis
        </div>
    </div>
    
    <div id="ai-settings" class="section">
        <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
        <h2>🤖 AI Settings & Automation</h2>
        <p>AI configuration, market priorities, and automated investment recommendations.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
            <strong>OpenAI Integration:</strong> GPT-4 powered analysis<br>
            <strong>Market Priorities:</strong> Automated ranking system<br>
            <strong>Recommendations:</strong> AI-driven investment insights
        </div>
    </div>
    
    <div id="syndication-documents" class="section">
        <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
        <h2>📑 Syndication Documents</h2>
        <p>Document management, distribution tracking, and investor communication materials.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
            <strong>Document Library:</strong> PPM, Operating Agreements<br>
            <strong>Distribution:</strong> Secure investor delivery<br>
            <strong>Version Control:</strong> Document management system
        </div>
    </div>
    
    <div id="api-monitoring" class="section">
        <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
        <h2>🔑 API Key Management</h2>
        <p>API key monitoring, rotation management, and system health tracking.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
            <strong>SendGrid API:</strong> Email delivery monitoring<br>
            <strong>Health Checks:</strong> Automated system validation<br>
            <strong>Key Rotation:</strong> Security management
        </div>
    </div>
    
    <div id="admin-settings" class="section">
        <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
        <h2>⚙️ System Settings</h2>
        <p>Admin configuration, system settings, and platform management tools.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
            <strong>Configuration:</strong> System-wide settings<br>
            <strong>User Management:</strong> Admin account control<br>
            <strong>Platform Tools:</strong> Management utilities
        </div>
    </div>

    <script>
        function showSection(sectionId) {
            // Hide dashboard overview
            document.getElementById('dashboard-overview').style.display = 'none';
            
            // Hide all sections
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Show selected section
            document.getElementById(sectionId).classList.add('active');
        }
        
        function showDashboard() {
            // Hide all sections
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Show dashboard overview
            document.getElementById('dashboard-overview').style.display = 'block';
        }
    </script>
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
    { name: "Michael Bachmann", title: "Principal and Managing Member", bio: "Michael has over 15 years of experience in real estate investment and multifamily syndications.", image: "/team-photos/Michael-Bachmann-for-deploy.png" },
    { name: "Makeba Hart", title: "Director of Operations and Partner", bio: "Makeba brings 12 years of operational excellence to our team.", image: "/team-photos/Makeba-Hart-for-deploy.png" }
  ]);
});

app.get('/api/markets', (req, res) => {
  res.json([
    { id: 1, marketId: "KC001", city: "Kansas City", state: "Missouri", population: 508394, medianRent: 1245, occupancyRate: 94.2, averageCapRate: 7.8, pricePerUnit: 125000, jobGrowth: 2.4, description: "Strong emerging market with diverse economy and growing tech sector" },
    { id: 2, marketId: "STL001", city: "St. Louis", state: "Missouri", population: 302838, medianRent: 1180, occupancyRate: 92.8, averageCapRate: 8.2, pricePerUnit: 115000, jobGrowth: 1.8, description: "Stable market with strong fundamentals and affordable housing stock" }
  ]);
});

app.post('/api/consultation-request', (req, res) => {
  console.log('Consultation request received:', req.body);
  res.json({ success: true, message: 'Consultation request submitted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin login: /admin/login`);
  console.log(`Main site: /`);
});
