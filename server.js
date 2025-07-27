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

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === admin.username && password === admin.password) {
    req.session.isAdmin = true;
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin/login?error=1');
  }
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
