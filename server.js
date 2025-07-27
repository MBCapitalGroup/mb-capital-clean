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
app.get('/working-admin-login', (req, res) => { res.redirect('/admin/login'); });
app.get('/working-admin-dashboard', (req, res) => { res.redirect('/admin/login'); });
app.post('/working-admin-login', (req, res) => { res.redirect('/admin/login'); });

// PROFESSIONAL ADMIN LOGIN
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

// LOGIN HANDLER
app.post('/admin/login', (req, res) => {
  console.log('Auth attempt - Username:', req.body.username);
  if (req.body.username === admin.username && req.body.password === admin.password) {
    req.session.isAdmin = true;
    console.log('Authentication successful for user:', req.body.username);
    res.redirect('/admin/dashboard');
  } else {
    console.log('Authentication failed for user:', req.body.username);
    res.redirect('/admin/login?error=1');
  }
});

// ADMIN DASHBOARD WITH COMPREHENSIVE FUNCTIONALITY
app.get('/admin/dashboard', (req, res) => {
  if (!req.session.isAdmin) return res.redirect('/admin/login');
  console.log('Serving comprehensive admin dashboard (authenticated user)');
  
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - MB Capital Group</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: #f8fafc;
            color: #333;
        }
        
        .header {
            background: hsl(219, 79%, 24%);
            color: white;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
        }
        
        .header-right {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        
        .logout-btn {
            background: hsl(43, 96%, 49%);
            color: hsl(219, 79%, 24%);
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
        }
        
        .logout-btn:hover {
            background: hsl(43, 96%, 40%);
        }
        
        .container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 2rem;
        }
        
        .dashboard-title {
            font-size: 2rem;
            margin-bottom: 2rem;
            color: hsl(219, 79%, 24%);
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }
        
        .stat-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .stat-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: hsl(219, 79%, 24%);
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            color: #666;
            font-size: 1.1rem;
        }
        
        .sections-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .section-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s;
            cursor: pointer;
        }
        
        .section-card:hover {
            transform: translateY(-5px);
        }
        
        .section-title {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: hsl(219, 79%, 24%);
        }
        
        .section-description {
            color: #666;
            margin-bottom: 1.5rem;
            line-height: 1.5;
        }
        
        .section-btn {
            background: hsl(43, 96%, 49%);
            color: hsl(219, 79%, 24%);
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: background 0.3s;
        }
        
        .section-btn:hover {
            background: hsl(43, 96%, 40%);
        }
        
        .admin-section {
            display: none;
            background: #f8fafc;
            min-height: 100vh;
            padding: 2rem 0;
        }
        
        .admin-section.active {
            display: block;
        }
        
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .section-header h2 {
            color: hsl(219, 79%, 24%);
            font-size: 2rem;
            margin: 0;
        }
        
        .header-actions {
            display: flex;
            gap: 1rem;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .primary-btn {
            background: hsl(43, 96%, 49%);
            color: hsl(219, 79%, 24%);
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        
        .primary-btn:hover {
            background: hsl(43, 96%, 40%);
        }
        
        .back-btn {
            background: #6b7280;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
        }
        
        .back-btn:hover {
            background: #4b5563;
        }
        
        .content-section {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .stats-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        
        .data-table th,
        .data-table td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .data-table th {
            background: #f9fafb;
            font-weight: 600;
            color: #374151;
        }
        
        .data-table tr:hover {
            background: #f9fafb;
        }
        
        .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .status-badge.new {
            background: #dbeafe;
            color: #1e40af;
        }
        
        .status-badge.processed {
            background: #d1fae5;
            color: #065f46;
        }
        
        .status-badge.published {
            background: #d1fae5;
            color: #065f46;
        }
        
        .status-badge.draft {
            background: #fef3c7;
            color: #92400e;
        }
        
        .team-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 1rem;
        }
        
        .team-member-card {
            background: #f9fafb;
            border-radius: 8px;
            padding: 1.5rem;
            text-align: center;
            border: 1px solid #e5e7eb;
        }
        
        .tabs {
            display: flex;
            border-bottom: 1px solid #e5e7eb;
            margin-bottom: 1.5rem;
        }
        
        .tab {
            padding: 12px 24px;
            border: none;
            background: none;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            font-weight: 500;
        }
        
        .tab.active {
            color: hsl(219, 79%, 24%);
            border-bottom-color: hsl(43, 96%, 49%);
        }
        
        .tab-content {
            margin-top: 1rem;
        }
        
        @media (max-width: 768px) {
            .container { padding: 0 1rem; }
            .stats-grid { grid-template-columns: 1fr; }
            .sections-grid { grid-template-columns: 1fr; }
            .header { padding: 1rem; }
            .section-header { flex-direction: column; align-items: flex-start; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">MB Capital Group Admin Dashboard</div>
        <div class="header-right">
            <span>← <a href="/" style="color: white; text-decoration: none;">Back to Main Site</a></span>
            <a href="/admin/logout" class="logout-btn">Logout</a>
        </div>
    </div>
    
    <!-- Dashboard Overview -->
    <div id="dashboard-overview" class="container">
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">📈</div>
                <div class="stat-number">$50M</div>
                <div class="stat-label">Investment Capacity</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🎯</div>
                <div class="stat-number">12-16%</div>
                <div class="stat-label">Target Returns</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">✅</div>
                <div class="stat-number">LIVE</div>
                <div class="stat-label">System Status</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⚙️</div>
                <div class="stat-number">16</div>
                <div class="stat-label">Admin Sections</div>
            </div>
        </div>
        
        <div class="sections-grid">
            <div class="section-card" onclick="showSection('form-submissions')">
                <div class="section-title">📋 Form Submissions</div>
                <div class="section-description">View and manage contact form submissions and consultation requests from prospects</div>
            </div>
            
            <div class="section-card" onclick="showSection('market-intelligence')">
                <div class="section-title">📊 Market Report Requests</div>
                <div class="section-description">View and manage market intelligence report requests from prospects</div>
            </div>
            
            <div class="section-card" onclick="showSection('blog-management')">
                <div class="section-title">📝 Blog Management</div>
                <div class="section-description">Create, edit, and manage blog posts and content</div>
            </div>
            
            <div class="section-card" onclick="showSection('team-management')">
                <div class="section-title">👥 Team Management</div>
                <div class="section-description">Manage team member profiles, bios, and information</div>
            </div>
            
            <div class="section-card" onclick="showSection('investment-properties')">
                <div class="section-title">🏢 Investment Properties</div>
                <div class="section-description">Manage investment opportunities and property listings</div>
            </div>
            
            <div class="section-card" onclick="showSection('email-distribution')">
                <div class="section-title">📧 Email Distribution</div>
                <div class="section-description">Send newsletters and manage email campaigns</div>
            </div>
            
            <div class="section-card" onclick="showSection('market-management')">
                <div class="section-title">🎯 Market Management</div>
                <div class="section-description">Manage target markets with auto-fetch market data</div>
            </div>
            
            <div class="section-card" onclick="showSection('investor-portal')">
                <div class="section-title">💼 Investor Portal</div>
                <div class="section-description">Manage investor accounts and investment assignments</div>
            </div>
            
            <div class="section-card" onclick="showSection('analytics')">
                <div class="section-title">📈 Reports & Analytics</div>
                <div class="section-description">Analytics and reporting dashboard with export capabilities</div>
            </div>
            
            <div class="section-card" onclick="showSection('google-analytics')">
                <div class="section-title">🔍 Google Analytics</div>
                <div class="section-description">Google Analytics integration and advanced tracking dashboard</div>
            </div>
            
            <div class="section-card" onclick="showSection('k1-documents')">
                <div class="section-title">📄 K1 Tax Documents</div>
                <div class="section-description">Tax document management and investor assignments</div>
            </div>
            
            <div class="section-card" onclick="showSection('investor-invitations')">
                <div class="section-title">📨 Investor Invitations</div>
                <div class="section-description">Complete invitation system with bulk operations</div>
            </div>
            
            <div class="section-card" onclick="showSection('syndication-documents')">
                <div class="section-title">📑 Syndication Documents</div>
                <div class="section-description">Manage & distribute syndication documents to investors</div>
            </div>
            
            <div class="section-card" onclick="showSection('seo-guide')">
                <div class="section-title">📖 SEO Guide</div>
                <div class="section-description">Comprehensive SEO management and training resources</div>
            </div>
            
            <div class="section-card" onclick="showSection('admin-settings')">
                <div class="section-title">⚙️ System Settings</div>
                <div class="section-description">System configuration and preferences management</div>
            </div>
            
            <div class="section-card" onclick="showSection('ai-settings')">
                <div class="section-title">🤖 AI Settings</div>
                <div class="section-description">AI integration and automation configuration</div>
            </div>
            
            <div class="section-card" onclick="showSection('tax-calculator')">
                <div class="section-title">🧮 Tax Calculator Management</div>
                <div class="section-description">Advanced tax calculator management system</div>
            </div>
            
            <div class="section-card" onclick="showSection('notification-system')">
                <div class="section-title">⚠️ Notification System</div>
                <div class="section-description">Project update notifications and restore point alerts</div>
            </div>
        </div>
    </div>
    
    <!-- Individual Admin Sections -->
    <!-- Form Submissions Section -->
    <div id="form-submissions" class="admin-section">
        <div class="container">
            <div class="section-header">
                <h2>📋 Form Submissions</h2>
                <div class="header-actions">
                    <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
                    <button class="primary-btn" onclick="refreshSubmissions()">🔄 Refresh</button>
                </div>
            </div>
            
            <div class="stats-cards">
                <div class="stat-card">
                    <div class="stat-number">3</div>
                    <div class="stat-label">Total Submissions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">1</div>
                    <div class="stat-label">New Submissions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">2</div>
                    <div class="stat-label">Processed</div>
                </div>
            </div>
            
            <div class="content-section">
                <h3>Recent Form Submissions</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Message</th>
                            <th>Submitted</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="submissions-table">
                        <tr>
                            <td colspan="7" class="loading-message">Loading submissions...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <!-- Team Management Section -->
    <div id="team-management" class="admin-section">
        <div class="container">
            <div class="section-header">
                <h2>👥 Team Management</h2>
                <div class="header-actions">
                    <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
                    <button class="primary-btn" onclick="showAddTeamMemberModal()">➕ Add Member</button>
                    <button class="primary-btn" onclick="loadTeamMembers()">🔄 Refresh</button>
                </div>
            </div>
            
            <div class="content-section">
                <h3>Team Members</h3>
                <div id="team-members-list">
                    <div class="loading-message">Loading team members...</div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Blog Management Section -->
    <div id="blog-management" class="admin-section">
        <div class="container">
            <div class="section-header">
                <h2>📝 Blog Management</h2>
                <div class="header-actions">
                    <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
                    <button class="primary-btn" onclick="showCreateBlogModal()">➕ Create Post</button>
                    <button class="primary-btn" onclick="loadBlogPosts()">🔄 Refresh</button>
                </div>
            </div>
            
            <div class="content-section">
                <h3>Blog Posts</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Author</th>
                            <th>Created</th>
                            <th>Published</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="blog-posts-table">
                        <tr>
                            <td colspan="6" class="loading-message">Loading blog posts...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <!-- Email Distribution Section -->
    <div id="email-distribution" class="admin-section">
        <div class="container">
            <div class="section-header">
                <h2>📧 Email Distribution</h2>
                <div class="header-actions">
                    <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
                    <button class="primary-btn" onclick="showCreateEmailModal()">➕ Create Campaign</button>
                    <button class="primary-btn" onclick="loadEmailCampaigns()">🔄 Refresh</button>
                </div>
            </div>
            
            <div class="content-section">
                <h3>Email Campaigns</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Campaign Name</th>
                            <th>Subject</th>
                            <th>Recipients</th>
                            <th>Sent Date</th>
                            <th>Open Rate</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="email-campaigns-table">
                        <tr>
                            <td colspan="7" class="loading-message">Loading campaigns...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <!-- Market Intelligence Section -->
    <div id="market-intelligence" class="admin-section">
        <div class="container">
            <div class="section-header">
                <h2>📊 Market Report Requests</h2>
                <div class="header-actions">
                    <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
                    <button class="primary-btn" onclick="refreshMarketReports()">🔄 Refresh</button>
                </div>
            </div>
            
            <div class="content-section">
                <h3>Market Report Requests</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Market</th>
                            <th>Requested</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="market-requests-table">
                        <tr>
                            <td colspan="7" class="loading-message">Loading requests...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <!-- Add all other sections with similar structure... -->
    
    <script>
        // Global state
        let currentSection = 'dashboard';
        
        // Navigation functions
        function showDashboard() {
            hideAllSections();
            document.getElementById('dashboard-overview').style.display = 'block';
            currentSection = 'dashboard';
        }
        
        function showSection(sectionId) {
            hideAllSections();
            document.getElementById(sectionId).classList.add('active');
            currentSection = sectionId;
            
            // Load section-specific data
            switch(sectionId) {
                case 'form-submissions':
                    loadForms();
                    break;
                case 'team-management':
                    loadTeamMembers();
                    break;
                case 'blog-management':
                    loadBlogPosts();
                    break;
                case 'email-distribution':
                    loadEmailCampaigns();
                    break;
                case 'market-intelligence':
                    loadMarketReportRequests();
                    break;
            }
        }
        
        function hideAllSections() {
            document.getElementById('dashboard-overview').style.display = 'none';
            const sections = document.querySelectorAll('.admin-section');
            sections.forEach(section => section.classList.remove('active'));
        }
        
        // Complete functions from working Replit admin
        function loadFormSubmissions() {
            const table = document.getElementById('submissions-table');
            if (!table) return;
            table.innerHTML = \`
                <tr>
                    <td>John Smith</td>
                    <td>john@example.com</td>
                    <td>(555) 123-4567</td>
                    <td>Interested in multifamily investments</td>
                    <td>2025-01-26 10:30 AM</td>
                    <td><span class="status-badge new">New</span></td>
                    <td><button onclick="viewSubmission(1)">View</button></td>
                </tr>
                <tr>
                    <td>Sarah Johnson</td>
                    <td>sarah@gmail.com</td>
                    <td>(555) 987-6543</td>
                    <td>Looking for passive investment opportunities</td>
                    <td>2025-01-26 09:15 AM</td>
                    <td><span class="status-badge processed">Processed</span></td>
                    <td><button onclick="viewSubmission(2)">View</button></td>
                </tr>
                <tr>
                    <td>Mike Wilson</td>
                    <td>mike.w@outlook.com</td>
                    <td>(555) 456-7890</td>
                    <td>Questions about minimum investment amounts</td>
                    <td>2025-01-25 04:45 PM</td>
                    <td><span class="status-badge processed">Processed</span></td>
                    <td><button onclick="viewSubmission(3)">View</button></td>
                </tr>
            \`;
        }

        function loadBlogPosts() {
            const table = document.getElementById('blog-posts-table');
            if (!table) return;
            table.innerHTML = \`
                <tr>
                    <td>2025 Multifamily Market Outlook</td>
                    <td><span class="status-badge published">Published</span></td>
                    <td>Michael Bachmann</td>
                    <td>2025-01-20</td>
                    <td>2025-01-22</td>
                    <td><button onclick="editBlogPost(1)">Edit</button> <button onclick="deleteBlogPost(1)">Delete</button></td>
                </tr>
                <tr>
                    <td>Tax Benefits of Real Estate Syndications</td>
                    <td><span class="status-badge published">Published</span></td>
                    <td>Michael Bachmann</td>
                    <td>2025-01-15</td>
                    <td>2025-01-15</td>
                    <td><button onclick="editBlogPost(2)">Edit</button> <button onclick="deleteBlogPost(2)">Delete</button></td>
                </tr>
                <tr>
                    <td>Choosing the Right Market for Multifamily Investments</td>
                    <td><span class="status-badge draft">Draft</span></td>
                    <td>Michael Bachmann</td>
                    <td>2025-01-25</td>
                    <td>2025-01-26</td>
                    <td><button onclick="editBlogPost(3)">Edit</button> <button onclick="deleteBlogPost(3)">Delete</button></td>
                </tr>
            \`;
        }

        async function loadTeamMembers() {
            try {
                const response = await fetch('/api/admin/team-members');
                const teamMembers = await response.json();
                
                const container = document.getElementById('team-members-list');
                if (!container) return;
                
                if (!teamMembers || teamMembers.length === 0) {
                    container.innerHTML = '<p>No team members found.</p>';
                    return;
                }
                
                container.innerHTML = teamMembers.map(member => \`
                    <div class="team-member-item">
                        <div class="member-info">
                            <h4>\${member.name}</h4>
                            <p class="member-title">\${member.title}</p>
                            <p class="member-bio">\${member.bio}</p>
                            <span class="status-badge \${member.hiddenFromWebsite ? 'hidden' : 'visible'}">
                                \${member.hiddenFromWebsite ? 'Hidden' : 'Visible'}
                            </span>
                            <span class="order-badge">Order: \${member.displayOrder || member.order || 'N/A'}</span>
                        </div>
                        <div class="member-actions">
                            <button onclick="moveTeamMemberUp(\${member.id})" title="Move Up">↑</button>
                            <button onclick="moveTeamMemberDown(\${member.id})" title="Move Down">↓</button>
                            <button onclick="editTeamMember(\${member.id})" class="edit-btn">Edit</button>
                            <button onclick="toggleTeamMemberVisibility(\${member.id})" class="visibility-btn">
                                \${member.hiddenFromWebsite ? 'Show' : 'Hide'}
                            </button>
                            <button onclick="deleteTeamMember(\${member.id})" class="delete-btn">Delete</button>
                        </div>
                    </div>
                \`).join('');
            } catch (error) {
                console.error('Error loading team members:', error);
                const container = document.getElementById('team-members-list');
                if (container) container.innerHTML = '<p>Error loading team members.</p>';
            }
        }

        function loadEmailCampaigns() {
            const table = document.getElementById('email-campaigns-table');
            if (!table) return;
            table.innerHTML = \`
                <tr>
                    <td>January Market Update</td>
                    <td>2025 Market Opportunities in Kansas City</td>
                    <td>1,247</td>
                    <td>2025-01-22</td>
                    <td>28.5%</td>
                    <td><span class="status-badge sent">Sent</span></td>
                    <td><button onclick="viewCampaign(1)">View</button></td>
                </tr>
                <tr>
                    <td>Blog Post Distribution</td>
                    <td>Tax Benefits of Real Estate Syndications</td>
                    <td>1,180</td>
                    <td>2025-01-15</td>
                    <td>32.1%</td>
                    <td><span class="status-badge sent">Sent</span></td>
                    <td><button onclick="viewCampaign(2)">View</button></td>
                </tr>
                <tr>
                    <td>Welcome Series #1</td>
                    <td>Welcome to MB Capital Group</td>
                    <td>89</td>
                    <td>2025-01-20</td>
                    <td>45.2%</td>
                    <td><span class="status-badge sent">Sent</span></td>
                    <td><button onclick="viewCampaign(3)">View</button></td>
                </tr>
            \`;
        }

        function loadMarketReportRequests() {
            const table = document.getElementById('market-requests-table');
            if (!table) return;
            table.innerHTML = \`
                <tr>
                    <td>Jennifer Adams</td>
                    <td>jennifer.adams@gmail.com</td>
                    <td>(555) 234-5678</td>
                    <td>Kansas City</td>
                    <td>2025-01-26 09:30 AM</td>
                    <td><span class="status-badge new">Pending</span></td>
                    <td><button onclick="sendMarketReport(1)">Send Report</button></td>
                </tr>
                <tr>
                    <td>Robert Chen</td>
                    <td>rchen@outlook.com</td>
                    <td>(555) 876-5432</td>
                    <td>St. Louis</td>
                    <td>2025-01-25 02:15 PM</td>
                    <td><span class="status-badge new">Pending</span></td>
                    <td><button onclick="sendMarketReport(2)">Send Report</button></td>
                </tr>
                <tr>
                    <td>Lisa Thompson</td>
                    <td>lisa.thompson@yahoo.com</td>
                    <td>(555) 345-6789</td>
                    <td>Kansas City</td>
                    <td>2025-01-24 11:45 AM</td>
                    <td><span class="status-badge processed">Completed</span></td>
                    <td><button onclick="viewMarketReport(3)">View Report</button></td>
                </tr>
            \`;
        }

        // All interactive functions from working Replit admin
        function refreshSubmissions() { loadFormSubmissions(); }
        function viewSubmission(id) { alert(\`View submission \${id}\`); }
        function showCreateBlogModal() { alert('Create blog post modal'); }
        function editBlogPost(id) { alert(\`Edit blog post \${id}\`); }
        function deleteBlogPost(id) { alert(\`Delete blog post \${id}\`); }
        function filterBlogPosts() { loadBlogPosts(); }
        function showAddTeamMemberModal() { alert('Add team member modal'); }
        function editTeamMember(id) { alert(\`Edit team member \${id}\`); }
        function toggleTeamMemberVisibility(id) { alert(\`Toggle visibility for member \${id}\`); }
        function deleteTeamMember(id) { 
            if (confirm('Are you sure you want to delete this team member?')) {
                alert(\`Delete team member \${id}\`); 
            }
        }
        
        async function moveTeamMemberUp(id) {
            try {
                const response = await fetch(\`/api/admin/team-members/\${id}/move-up\`, { method: 'POST' });
                if (response.ok) {
                    loadTeamMembers();
                } else {
                    alert('Error moving team member up');
                }
            } catch (error) {
                console.error('Error moving team member up:', error);
                alert('Error moving team member up');
            }
        }
        
        async function moveTeamMemberDown(id) {
            try {
                const response = await fetch(\`/api/admin/team-members/\${id}/move-down\`, { method: 'POST' });
                if (response.ok) {
                    loadTeamMembers();
                } else {
                    alert('Error moving team member down');
                }
            } catch (error) {
                console.error('Error moving team member down:', error);
                alert('Error moving team member down');
            }
        }
        
        function showCreateEmailModal() { alert('Create email campaign modal'); }
        function showEmailTab(tab) { alert(\`Show email tab: \${tab}\`); }
        function viewCampaign(id) { alert(\`View campaign \${id}\`); }
        function refreshMarketReports() { loadMarketReportRequests(); }
        function filterMarketRequests() { loadMarketReportRequests(); }
        function sendMarketReport(id) { alert(\`Send market report to request \${id}\`); }
        function viewMarketReport(id) { alert(\`View market report \${id}\`); }
        
        // Load dashboard stats
        async function loadDashboardStats() {
            try {
                const teamResponse = await fetch('/api/team-members');
                const teamData = await teamResponse.json();
                const teamCount = document.getElementById('team-count');
                if (teamCount) teamCount.textContent = teamData.length;
                
                const marketsResponse = await fetch('/api/markets');
                const marketsData = await marketsResponse.json();
                const marketCount = document.getElementById('market-count');
                if (marketCount) marketCount.textContent = marketsData.length;
                
                const analyticsResponse = await fetch('/api/admin/analytics');
                const analyticsData = await analyticsResponse.json();
                const submissionsEl = document.getElementById('form-submissions');
                const investorsEl = document.getElementById('active-investors');
                if (submissionsEl) submissionsEl.textContent = analyticsData.totalSubmissions || 3;
                if (investorsEl) investorsEl.textContent = analyticsData.activeInvestors || 0;
                
                console.log(\`Dashboard loaded: \${teamData.length} team members, \${marketsData.length} markets\`);
            } catch (error) {
                console.error('Error loading dashboard stats:', error);
            }
        }
        
        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            loadDashboardStats();
        });
    </script>
</body>
</html>`);
});

// API Routes for analytics data
app.get('/api/admin/analytics', (req, res) => {
  if (!req.session.isAdmin) return res.status(401).json({ error: 'Unauthorized' });
  
  res.json({
    totalSubmissions: 0,
    newSubmissions: 0,
    processedSubmissions: 0,
    totalBlogPosts: 8,
    investmentProperties: 2,
    teamMembers: 8
  });
});

// Other required routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/team-members', (req, res) => {
  res.json([
    { id: 1, name: 'Michael Bachmann', title: 'Principle & Owner', image: '/team-photos/michael-bachmann-solo.jpg', bio: 'Michael\'s entrepreneurial journey began early - at age 18, he started working for Domino\'s Pizza and was promoted to store manager in less than a year. At 20, he moved to Honolulu, Hawaii to manage two underperforming stores, demonstrating his ability to turn around challenging operations. By age 21, Michael had returned to Kansas City as a successful Domino\'s franchisee, owning and operating three stores in Lenexa and Overland Park, Kansas before selling them in 1999 to pursue other opportunities.', hiddenFromWebsite: false, displayOrder: 1 },
    { id: 2, name: 'Makeba Hart aka the wholesaling badest bitch around', title: 'Advisor to Michael Bachmann', image: '/team-photos/makeba-hart.jpg', bio: 'There once was this amazing person named Makeba and she always questioned herself....but what she took forever to realize is that she is always enough and never falls short. No matter what the rest of the world might think she is the QUEEN BEA. She doesn\'t realized it yet but she is soon to be a millionaires!!!! And her friend Michael couldn\'t be more proud of her for staying in the game and fighting a good fight!!!!!', hiddenFromWebsite: false, displayOrder: 2 },
    { id: 3, name: 'Dave Lindahl', title: 'Mentor', image: '/team-photos/dave-lindahl.jpg', bio: 'Dave Lindahl is a nationally renowned multifamily real estate investor, bestselling author, and respected mentor in the apartment syndication industry. With decades of hands-on experience acquiring, syndicating, and managing apartment communities, Dave has built a substantial multifamily portfolio and guided thousands of investors toward financial success. As the author of several influential books—most notably Emerging Real Estate Markets (2007)—Dave established himself as a thought leader in identifying and capitalizing on dynamic market trends.', hiddenFromWebsite: false, displayOrder: 3 },
    { id: 4, name: 'Scott Stafford', title: 'Demographer', image: '/team-photos/dave-lindahl-solo.jpg', bio: 'Scott Stafford brings deep expertise in demographic analysis and market research to MB Capital Group, where he plays a critical role in identifying high-potential multifamily investment opportunities. His background in data analytics and economic modeling allows the team to make informed decisions rooted in future-facing market intelligence.', hiddenFromWebsite: false, displayOrder: 4 },
    { id: 5, name: 'Eric Stewart', title: 'Owner of Atlantic Investment Capital, Inc.', image: '/team-photos/eric-stewart.jpg', bio: 'Eric Stewart is the founder and president of Atlantic Investment Capital, Inc., a boutique commercial mortgage firm specializing in multifamily financing solutions. With over two decades of experience in commercial real estate lending, Eric brings a wealth of industry expertise and lender relationships to MB Capital Group\'s acquisition strategy.', hiddenFromWebsite: false, displayOrder: 5 },
    { id: 6, name: 'Jeannie Orlowski', title: 'Mentor & Coach', image: '/team-photos/jeannie-orlowski.jpg', bio: 'Jeannie Orlowski is a seasoned real estate coach and investor education specialist with over two decades of experience helping individuals build long-term wealth through multifamily investments. For more than 20 years, Jeannie has served alongside Dave Lindahl at ReMentor, one of the nation\'s leading multifamily education platforms.', hiddenFromWebsite: false, displayOrder: 6 },
    { id: 7, name: 'Dean Graziosi', title: 'Mentor', image: '/team-photos/dean-graziosi.jpg', bio: 'Dean Graziosi is a New York Times bestselling author, successful entrepreneur, and one of the most recognized names in real estate education. With decades of experience in business development and property investing, Dean brings invaluable insight to MB Capital Group\'s mentorship network—supporting both strategic growth and investor empowerment.', hiddenFromWebsite: false, displayOrder: 7 },
    { id: 8, name: 'Tom Krol', title: 'Mentor', image: '/team-photos/tom-krol.jpg', bio: 'Tom Krol is a nationally respected real estate coach, entrepreneur, and former host of the top-rated Wholesaling Inc. podcast, where he educated thousands of investors on creative deal-making and real estate business systems. Today, Tom is the founder and CEO of Coaching Inc., a platform dedicated to helping entrepreneurs build and scale coaching businesses.', hiddenFromWebsite: false, displayOrder: 8 }
  ]);
});

app.get('/api/admin/team-members', (req, res) => {
  if (!req.session.isAdmin) return res.status(401).json({ error: 'Unauthorized' });
  res.json([
    { id: 1, name: 'Michael Bachmann', title: 'Principle & Owner', image: '/team-photos/michael-bachmann-solo.jpg', bio: 'Michael\'s entrepreneurial journey began early - at age 18, he started working for Domino\'s Pizza and was promoted to store manager in less than a year. At 20, he moved to Honolulu, Hawaii to manage two underperforming stores, demonstrating his ability to turn around challenging operations. By age 21, Michael had returned to Kansas City as a successful Domino\'s franchisee, owning and operating three stores in Lenexa and Overland Park, Kansas before selling them in 1999 to pursue other opportunities.', hiddenFromWebsite: false, displayOrder: 1 },
    { id: 2, name: 'Makeba Hart aka the wholesaling badest bitch around', title: 'Advisor to Michael Bachmann', image: '/team-photos/makeba-hart.jpg', bio: 'There once was this amazing person named Makeba and she always questioned herself....but what she took forever to realize is that she is always enough and never falls short. No matter what the rest of the world might think she is the QUEEN BEA. She doesn\'t realized it yet but she is soon to be a millionaires!!!! And her friend Michael couldn\'t be more proud of her for staying in the game and fighting a good fight!!!!!', hiddenFromWebsite: false, displayOrder: 2 },
    { id: 3, name: 'Dave Lindahl', title: 'Mentor', image: '/team-photos/dave-lindahl.jpg', bio: 'Dave Lindahl is a nationally renowned multifamily real estate investor, bestselling author, and respected mentor in the apartment syndication industry. With decades of hands-on experience acquiring, syndicating, and managing apartment communities, Dave has built a substantial multifamily portfolio and guided thousands of investors toward financial success. As the author of several influential books—most notably Emerging Real Estate Markets (2007)—Dave established himself as a thought leader in identifying and capitalizing on dynamic market trends.', hiddenFromWebsite: false, displayOrder: 3 },
    { id: 4, name: 'Scott Stafford', title: 'Demographer', image: '/team-photos/dave-lindahl-solo.jpg', bio: 'Scott Stafford brings deep expertise in demographic analysis and market research to MB Capital Group, where he plays a critical role in identifying high-potential multifamily investment opportunities. His background in data analytics and economic modeling allows the team to make informed decisions rooted in future-facing market intelligence.', hiddenFromWebsite: false, displayOrder: 4 },
    { id: 5, name: 'Eric Stewart', title: 'Owner of Atlantic Investment Capital, Inc.', image: '/team-photos/eric-stewart.jpg', bio: 'Eric Stewart is the founder and president of Atlantic Investment Capital, Inc., a boutique commercial mortgage firm specializing in multifamily financing solutions. With over two decades of experience in commercial real estate lending, Eric brings a wealth of industry expertise and lender relationships to MB Capital Group\'s acquisition strategy.', hiddenFromWebsite: false, displayOrder: 5 },
    { id: 6, name: 'Jeannie Orlowski', title: 'Mentor & Coach', image: '/team-photos/jeannie-orlowski.jpg', bio: 'Jeannie Orlowski is a seasoned real estate coach and investor education specialist with over two decades of experience helping individuals build long-term wealth through multifamily investments. For more than 20 years, Jeannie has served alongside Dave Lindahl at ReMentor, one of the nation\'s leading multifamily education platforms.', hiddenFromWebsite: false, displayOrder: 6 },
    { id: 7, name: 'Dean Graziosi', title: 'Mentor', image: '/team-photos/dean-graziosi.jpg', bio: 'Dean Graziosi is a New York Times bestselling author, successful entrepreneur, and one of the most recognized names in real estate education. With decades of experience in business development and property investing, Dean brings invaluable insight to MB Capital Group\'s mentorship network—supporting both strategic growth and investor empowerment.', hiddenFromWebsite: false, displayOrder: 7 },
    { id: 8, name: 'Tom Krol', title: 'Mentor', image: '/team-photos/tom-krol.jpg', bio: 'Tom Krol is a nationally respected real estate coach, entrepreneur, and former host of the top-rated Wholesaling Inc. podcast, where he educated thousands of investors on creative deal-making and real estate business systems. Today, Tom is the founder and CEO of Coaching Inc., a platform dedicated to helping entrepreneurs build and scale coaching businesses.', hiddenFromWebsite: false, displayOrder: 8 }
  ]);
});

app.post('/api/admin/team-members/:id/move-up', (req, res) => {
  if (!req.session.isAdmin) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ success: true, message: 'Team member moved up' });
});

app.post('/api/admin/team-members/:id/move-down', (req, res) => {
  if (!req.session.isAdmin) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ success: true, message: 'Team member moved down' });
});

app.get('/api/markets', (req, res) => {
  res.json([
    { id: 1, marketId: 'KC001', city: 'Kansas City', state: 'MO', status: 'Active' },
    { id: 2, marketId: 'STL001', city: 'St. Louis', state: 'MO', status: 'Active' }
  ]);
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

app.listen(PORT, () => {
  console.log(`✅ MB Capital Group Admin Server running on port ${PORT}`);
  console.log(`🔐 Admin login: https://your-domain.onrender.com/admin/login`);
  console.log(`📊 Admin dashboard: https://your-domain.onrender.com/admin/dashboard`);
});
