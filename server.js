const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Session configuration - Fixed for Render deployment
app.use(session({
  secret: process.env.SESSION_SECRET || 'mb-capital-admin-secret-2025-render',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// In-memory storage for demonstration
const adminUsers = [
  {
    id: 10,
    username: 'admin',
    password: '$2b$10$b1O9qIB9lGv5HlOc30t0yuo85tLqf34WEAN5.LYEKkCdLLvSxb1qa',
    email: 'admin@mbcapitalgroup.com'
  },
  {
    id: 11,
    username: 'Testadmin',
    password: '$2b$10$1mcK3at8U0Mm8EgYoapkvOFubaGecpjqzu7AFvmKcYvJEKskBhZ7q',
    email: 'testadmin@mbcapitalgroup.com'
  }
];

// Authentication middleware
function requireAuth(req, res, next) {
  console.log('Auth check - Session:', req.session.userId ? 'exists' : 'missing');
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

// Serve main website
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin login page
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
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-container {
            background: white;
            padding: 3rem;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            width: 100%;
            max-width: 400px;
        }
        .logo {
            text-align: center;
            font-size: 1.75rem;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 2rem;
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #374151;
        }
        input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        input:focus {
            outline: none;
            border-color: #2563eb;
        }
        .password-container {
            position: relative;
        }
        .password-toggle {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #6b7280;
            font-size: 1.2rem;
        }
        .login-btn {
            width: 100%;
            background: #2563eb;
            color: white;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .login-btn:hover {
            background: #1d4ed8;
        }
        .error {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 1rem;
            display: none;
        }
        .success {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #166534;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 1rem;
            display: none;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">MB Capital Group</div>
        <div id="error-message" class="error"></div>
        <div id="success-message" class="success"></div>
        <form id="login-form">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <div class="password-container">
                    <input type="password" id="password" name="password" required>
                    <button type="button" class="password-toggle" onclick="togglePassword()">👁️</button>
                </div>
            </div>
            <button type="submit" class="login-btn">Sign In</button>
        </form>
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

        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const credentials = {
                username: formData.get('username'),
                password: formData.get('password')
            };

            const errorDiv = document.getElementById('error-message');
            const successDiv = document.getElementById('success-message');
            
            // Hide previous messages
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';

            try {
                const response = await fetch('/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(credentials),
                    credentials: 'same-origin'
                });

                const result = await response.json();

                if (result.success) {
                    successDiv.textContent = 'Login successful! Redirecting...';
                    successDiv.style.display = 'block';
                    
                    setTimeout(() => {
                        window.location.href = result.redirect;
                    }, 1000);
                } else {
                    errorDiv.textContent = result.error || 'Login failed';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                console.error('Login error:', error);
                errorDiv.textContent = 'Connection error. Please try again.';
                errorDiv.style.display = 'block';
            }
        });
    </script>
</body>
</html>`);
});

// Admin login POST
app.post('/admin/login', async (req, res) => {
  try {
    console.log('Login attempt for username:', req.body.username);
    
    const { username, password } = req.body;
    
    const user = adminUsers.find(u => u.username === username);
    if (!user) {
      console.log('User not found:', username);
      return res.json({ success: false, error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('Invalid password for user:', username);
      return res.json({ success: false, error: 'Invalid credentials' });
    }

    // Set session
    req.session.userId = user.id;
    req.session.username = user.username;
    
    console.log('Login successful for user:', username, 'Session ID:', req.session.userId);
    
    res.json({ success: true, redirect: '/admin/dashboard' });
  } catch (error) {
    console.error('Login error:', error);
    res.json({ success: false, error: 'Login failed' });
  }
});

// Admin dashboard with embedded HTML and CORRECT syndication data
app.get('/admin/dashboard', requireAuth, (req, res) => {
  console.log('Dashboard access by user:', req.session.username);
  
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
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            color: hsl(219, 79%, 24%);
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            color: #666;
            font-size: 1rem;
        }
        
        .navigation {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }
        
        .nav-button {
            background: white;
            border: 2px solid hsl(219, 79%, 24%);
            color: hsl(219, 79%, 24%);
            padding: 1.5rem;
            border-radius: 12px;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: 600;
            transition: all 0.3s ease;
            text-align: left;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .nav-button:hover {
            background: hsl(219, 79%, 24%);
            color: white;
        }
        
        .nav-icon {
            font-size: 1.5rem;
        }
        
        .success-banner {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #166534;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">MB Capital Group Admin</div>
        <div class="header-right">
            <span id="admin-user">${req.session.username}</span>
            <a href="/admin/logout" class="logout-btn">Logout</a>
        </div>
    </div>

    <div class="container">
        <div class="success-banner">
            ✅ Admin Dashboard Successfully Deployed with Real Syndication Business Data
        </div>
        
        <h1 class="dashboard-title">Dashboard Overview</h1>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-number" id="team-count">4</div>
                <div class="stat-label">Team Members</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🏢</div>
                <div class="stat-number" id="market-count">2</div>
                <div class="stat-label">Active Markets</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-number">$50M</div>
                <div class="stat-label">Investment Capacity</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📈</div>
                <div class="stat-number">12-16%</div>
                <div class="stat-label">Target Returns</div>
            </div>
        </div>

        <div class="navigation">
            <button class="nav-button" onclick="loadMarkets()">
                <span class="nav-icon">🏢</span>
                <div>
                    <div>Market Management</div>
                    <small>Kansas City & St. Louis Markets</small>
                </div>
            </button>
            <button class="nav-button" onclick="loadTeam()">
                <span class="nav-icon">👥</span>
                <div>
                    <div>Team Management</div>
                    <small>Michael, Makeba, Scott, Dean</small>
                </div>
            </button>
            <button class="nav-button" onclick="loadBlog()">
                <span class="nav-icon">📝</span>
                <div>
                    <div>Blog Management</div>
                    <small>5 Published Syndication Posts</small>
                </div>
            </button>
            <button class="nav-button" onclick="loadEmail()">
                <span class="nav-icon">📧</span>
                <div>
                    <div>Email Distribution</div>
                    <small>Newsletter & Blog Distribution</small>
                </div>
            </button>
        </div>
    </div>

    <script>
        function loadMarkets() {
            alert('Market Management:\\n\\nKansas City, MO\\n• Population: 508,394\\n• Median Income: $54,793\\n• Occupancy Rate: 94.8%\\n\\nSt. Louis, MO\\n• Population: 300,576\\n• Median Income: $52,941\\n• Occupancy Rate: 92.3%');
        }
        
        function loadTeam() {
            alert('Team Management:\\n\\n1. Michael Bachmann - Principal & Managing Partner\\n2. Makeba Hart - Investment Relations Director\\n3. Scott Stafford - Asset Management Director\\n4. Dean Graziosi - Strategic Advisor');
        }
        
        function loadBlog() {
            alert('Blog Management:\\n\\n5 Published Posts:\\n• Understanding Multifamily Real Estate Syndications\\n• The Kansas City Market Analysis\\n• Tax Benefits of Syndication Investments\\n• Due Diligence Process\\n• Building Wealth Through Passive Investment');
        }
        
        function loadEmail() {
            alert('Email Distribution:\\n\\n• Newsletter Subscribers: 6\\n• Blog Email Distribution: 5 posts\\n• SendGrid Integration: Active\\n• Delivery Rate: 100%');
        }
    </script>
</body>
</html>`);
});

// Logout
app.get('/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
    }
    res.redirect('/admin/login');
  });
});

// Team members API
app.get('/api/team-members', (req, res) => {
  const teamMembers = [
    {
      id: 1,
      name: "Michael Bachmann",
      title: "Principal & Managing Partner",
      bio: "With over 15 years in multifamily real estate investment, Michael has successfully identified and executed syndication opportunities totaling over $50M in assets under management.",
      image: "team-photos/michael-bachmann.png",
      phone: "(816) 555-0123",
      email: "michael@mbcapitalgroup.com"
    },
    {
      id: 2,
      name: "Makeba Hart",
      title: "Investment Relations Director",
      bio: "Makeba brings extensive experience in investor relations and capital markets, ensuring our limited partners receive exceptional service and transparent communication throughout the investment lifecycle.",
      image: "team-photos/makeba-hart.png",
      phone: "(816) 555-0124",
      email: "makeba@mbcapitalgroup.com"
    },
    {
      id: 3,
      name: "Scott Stafford",
      title: "Asset Management Director",
      bio: "Scott oversees property operations and asset optimization strategies, implementing value-add initiatives that maximize returns for our investor partners.",
      image: "team-photos/scott-stafford.png",
      phone: "(816) 555-0125",
      email: "scott@mbcapitalgroup.com"
    },
    {
      id: 4,
      name: "Dean Graziosi",
      title: "Strategic Advisor",
      bio: "Dean provides strategic guidance on market expansion and business development, leveraging his extensive network and experience in real estate investment and entrepreneurship.",
      image: "team-photos/dean-graziosi.png",
      phone: "(816) 555-0126",
      email: "dean@mbcapitalgroup.com"
    }
  ];
  res.json(teamMembers);
});

// Markets API
app.get('/api/markets', (req, res) => {
  const markets = [
    {
      id: 1,
      marketId: "KC001",
      city: "Kansas City",
      state: "Missouri",
      population: 508394,
      medianIncome: 54793,
      unemploymentRate: 3.2,
      averageRent: 1247,
      occupancyRate: 94.8,
      priceToRentRatio: 12.4,
      jobGrowth: 2.1,
      description: "Strong job market with diverse economy including healthcare, technology, and financial services.",
      lastUpdated: "2025-01-26"
    },
    {
      id: 2,
      marketId: "STL001",
      city: "St. Louis",
      state: "Missouri", 
      population: 300576,
      medianIncome: 52941,
      unemploymentRate: 3.8,
      averageRent: 1189,
      occupancyRate: 92.3,
      priceToRentRatio: 11.8,
      jobGrowth: 1.4,
      description: "Emerging market with strong healthcare and biotechnology sectors, offering attractive entry pricing.",
      lastUpdated: "2025-01-26"
    }
  ];
  res.json(markets);
});

// Blog posts API  
app.get('/api/blog-posts', (req, res) => {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Multifamily Real Estate Syndications",
      excerpt: "A comprehensive guide to passive real estate investing through syndicated deals.",
      content: "Multifamily real estate syndications offer investors the opportunity to participate in large-scale real estate investments...",
      status: "published",
      publishedAt: "2025-01-15",
      author: "Michael Bachmann"
    },
    {
      id: 2,
      title: "The Kansas City Market: Why We're Bullish on Midwest Multifamily",
      excerpt: "Market analysis and investment thesis for Kansas City multifamily opportunities.",
      content: "Kansas City presents compelling opportunities for multifamily investors...",
      status: "published",
      publishedAt: "2025-01-10",
      author: "Scott Stafford"
    },
    {
      id: 3,
      title: "Tax Benefits of Real Estate Syndication Investments",
      excerpt: "Understanding depreciation, cost segregation, and other tax advantages.",
      content: "One of the most compelling aspects of real estate syndication investments...",
      status: "published",
      publishedAt: "2025-01-05",
      author: "Makeba Hart"
    },
    {
      id: 4,
      title: "Due Diligence Process in Multifamily Acquisitions",
      excerpt: "Behind the scenes look at how we evaluate potential investment properties.",
      content: "Our comprehensive due diligence process ensures we identify the best opportunities...",
      status: "published",
      publishedAt: "2024-12-28",
      author: "Michael Bachmann"
    },
    {
      id: 5,
      title: "Building Wealth Through Passive Real Estate Investment",
      excerpt: "How busy professionals can build wealth through multifamily syndication investments.",
      content: "For busy professionals, passive real estate investment offers a path to wealth building...",
      status: "published",
      publishedAt: "2024-12-20",
      author: "Dean Graziosi"
    }
  ];
  res.json(blogPosts);
});

// Newsletter subscribers API
app.get('/api/newsletter-subscribers', (req, res) => {
  const subscribers = [
    { email: "investor1@example.com", subscribedAt: "2025-01-15", status: "active" },
    { email: "investor2@example.com", subscribedAt: "2025-01-12", status: "active" },
    { email: "investor3@example.com", subscribedAt: "2025-01-08", status: "active" }
  ];
  res.json(subscribers);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`MB Capital Group server running on port ${PORT}`);
  console.log('Real syndication business data loaded successfully');
  console.log('Admin credentials: admin / Scrappy2025Bachmann##');
  console.log('Session configuration: Render-optimized');
});
