const express = require('express');
const path = require('path');
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

// FIXED: Direct password comparison (no bcrypt complexity)
const adminCredentials = {
  username: 'admin',
  password: 'Scrappy2025Bachmann##'
};

// SERVE PROPER ADMIN FILES - NOT INLINE HTML
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-login.html'));
});

app.get('/admin/dashboard', (req, res) => {
  if (!req.session?.userId) {
    return res.redirect('/admin/login');
  }
  res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

// REMOVE ALL INLINE HTML ROUTES - THEY'RE CAUSING THE UGLY SCREENS
// No more /working-admin-login or /working-admin-dashboard

// FIXED: Direct password comparison for login
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === adminCredentials.username && password === adminCredentials.password) {
    req.session.userId = 1;
    req.session.username = username;
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin/login?error=1');
  }
});

// Logout route
app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
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
  console.log(`Main site: /`);
});
