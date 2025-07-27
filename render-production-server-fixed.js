const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'mb-capital-admin-secret-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

const admin = { username: 'admin', password: 'Scrappy2025Bachmann##' };

function requireAuth(req, res, next) {
  if (!req.session.isAdmin) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// Serve static files - CRITICAL: Team photos middleware
app.use('/team-photos', express.static(path.join(__dirname, 'team-photos')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`<!DOCTYPE html>
<html><head><title>MB Capital Group - Multifamily Real Estate Syndication</title></head>
<body><h1>Welcome to MB Capital Group</h1><p>Professional multifamily real estate syndication services.</p></body></html>`);
  }
});

app.get('/admin/login', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - MB Capital Group</title>
    <style>
        body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #1e3a8a, #3b82f6); margin: 0; padding: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .login-container { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); width: 100%; max-width: 400px; }
        .logo { text-align: center; margin-bottom: 30px; }
        .logo h1 { color: #1e3a8a; font-size: 1.8rem; margin: 0; }
        .logo p { color: #666; margin: 5px 0 0 0; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 5px; color: #333; font-weight: bold; }
        .form-group input { width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box; }
        .form-group input:focus { border-color: #1e3a8a; outline: none; }
        .login-btn { width: 100%; padding: 14px; background: #1e3a8a; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; }
        .login-btn:hover { background: #1d4ed8; }
        .back-link { text-align: center; margin-top: 20px; }
        .back-link a { color: #666; text-decoration: none; }
        .error { color: red; text-align: center; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>MB Capital Group</h1>
            <p>Admin Dashboard Access</p>
        </div>
        ${req.query.error ? '<div class="error">Invalid credentials. Please try again.</div>' : ''}
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
      title: 'Principal & Owner', 
      image: '/team-photos/Michael Bachmann.jpg', 
      bio: 'Michael\'s entrepreneurial journey began early - at age 18, he started working for Domino\'s Pizza and was promoted to store manager in less than a year. At 20, he moved to Honolulu, Hawaii to manage two underperforming stores, demonstrating his ability to turn around challenging operations. By age 21, Michael had returned to Kansas City as a successful Domino\'s franchisee, owning and operating three stores in Lenexa and Overland Park, Kansas before selling them in 1999 to pursue other opportunities.\n\nAfter selling his Domino\'s franchise, Michael transitioned into real estate, where he discovered his passion for multifamily investments. Over the years, he has built and managed a substantial real estate portfolio, gaining invaluable experience in property acquisition, renovation, management, and strategic exits. His hands-on approach and deep understanding of market dynamics have enabled him to identify undervalued properties and transform them into profitable investments.\n\nIn 2024, Michael made the strategic decision to sell his existing portfolio to focus exclusively on multifamily syndication through MB Capital Group. This pivot allows him to leverage his decades of experience while partnering with passive investors to acquire larger, more impactful properties. Michael\'s commitment to transparency, conservative underwriting, and investor education sets MB Capital Group apart in the syndication space.\n\nToday, Michael leads MB Capital Group with a focus on Class B and C multifamily properties in emerging markets, where he sees the greatest potential for value creation and investor returns. His personal investment philosophy centers on sustainable cash flow, strategic value-add improvements, and long-term wealth building for all stakeholders.' 
    },
    { 
      name: 'Makeba Hart aka the wholesaling badest bitch around', 
      title: 'Advisor to Michael Bachmann', 
      image: '/team-photos/makeba_hart.jpg', 
      bio: 'There once was this amazing person named Makeba and she always questioned herself....but what she took forever to realize is that she is always enough and never falls short. No matter what the rest of the world might think she is the QUEEN BEA. She doesn\'t realized it yet but she is soon to be a millionaires!!!! And her friend Michael couldn\'t be more proud of her for staying in the game and fighting a good fight!!!!!\n\nMakeba Hart brings a unique blend of street-smart business acumen and infectious energy to MB Capital Group. Known throughout the real estate community as "the wholesaling badest bitch around," Makeba has earned her reputation through years of hustle, determination, and an unwavering commitment to excellence in real estate deals.\n\nHer journey in real estate began with wholesaling, where she quickly distinguished herself by closing deals that others couldn\'t see or were afraid to pursue. Makeba\'s ability to identify opportunities, negotiate win-win scenarios, and maintain relationships with both sellers and buyers has made her an invaluable asset to the MB Capital Group team.\n\nWhat sets Makeba apart is her authentic approach to business relationships. She doesn\'t just close deals - she builds lasting partnerships based on trust, transparency, and mutual success. Her network spans across multiple markets and includes everyone from distressed property owners to high-net-worth investors looking for their next opportunity.\n\nAs an advisor to Michael Bachmann, Makeba provides crucial market insights, deal sourcing capabilities, and a ground-level perspective on emerging investment opportunities. Her motto "QUEEN BEA" represents her commitment to empowering others while building her own empire. Michael recognizes her potential and is proud to support her journey toward becoming the millionaire she\'s destined to be.\n\nMakeba\'s role at MB Capital Group extends beyond traditional advisory functions - she\'s a culture creator, deal catalyst, and living proof that success comes to those who never give up on their dreams.' 
    },
    { 
      name: 'Dave Lindahl', 
      title: 'Mentor', 
      image: '/team-photos/Dave-Lindahl.jpg', 
      bio: 'Dave Lindahl is a nationally renowned multifamily real estate investor, bestselling author, and respected mentor in the apartment syndication industry. With decades of hands-on experience acquiring, syndicating, and managing apartment communities, Dave has built a substantial multifamily portfolio and guided thousands of investors toward financial success.\n\nAs the author of the influential book "Emerging Real Estate Markets," Dave pioneered the systematic approach to identifying high-growth markets before they become mainstream. His proprietary 4-phase market cycle methodology has become a cornerstone strategy for savvy investors looking to maximize returns through strategic market timing and location selection.\n\nDave\'s investment philosophy centers on thorough market research, conservative underwriting, and value-add strategies that create sustainable cash flow and long-term appreciation. He has successfully navigated multiple market cycles, economic downturns, and industry shifts, proving the durability and effectiveness of his investment approach.\n\nThrough his mentorship platform ReMentor, Dave has educated and coached thousands of real estate investors, from beginners taking their first steps to experienced investors scaling their portfolios. His teaching methodology combines practical, actionable strategies with real-world case studies from his own investment experience.\n\nAt MB Capital Group, Dave serves as a strategic mentor, providing guidance on market selection, deal analysis, and investment strategy. His involvement lends credibility and expertise to the firm\'s investment decisions, ensuring that each opportunity is evaluated through the lens of proven, time-tested criteria.\n\nDave\'s commitment to investor education and transparent communication aligns perfectly with MB Capital Group\'s mission to provide passive investors with exceptional opportunities while maintaining the highest standards of professionalism and integrity in every transaction.' 
    },
    { 
      name: 'Scott Stafford', 
      title: 'Demographer', 
      image: '/team-photos/Scott.jpg', 
      bio: 'Scott Stafford brings deep expertise in demographic analysis and market research to MB Capital Group, where he plays a critical role in identifying high-potential multifamily investment opportunities. His background in data analytics and economic modeling allows the team to make informed decisions rooted in future-facing market intelligence.\n\nWith years of experience analyzing population trends, employment patterns, and economic indicators, Scott has developed a sophisticated understanding of what drives real estate demand in emerging markets. His analytical approach goes beyond surface-level metrics to uncover the underlying demographic shifts that create sustainable investment opportunities.\n\nScott\'s research methodology combines traditional demographic analysis with modern data science techniques, enabling him to identify markets in the early stages of growth cycles. He tracks key indicators such as job creation, population migration patterns, household formation rates, and income growth to build comprehensive market profiles that guide investment decisions.\n\nAt MB Capital Group, Scott\'s demographic insights inform every aspect of the investment process, from initial market screening to property-specific analysis. His reports provide the foundation for understanding not just where markets are today, but where they\'re heading over the next 5-10 years.\n\nScott\'s ability to translate complex demographic data into actionable investment insights makes him an invaluable member of the MB Capital Group team. His research ensures that the firm\'s investments are positioned to benefit from long-term demographic trends rather than short-term market fluctuations.\n\nBy focusing on markets with strong demographic fundamentals - growing populations, diversifying economies, and increasing household incomes - Scott helps MB Capital Group identify opportunities that offer both immediate cash flow potential and long-term appreciation prospects.' 
    },
    { 
      name: 'Eric Stewart', 
      title: 'Owner of Atlantic Investment Capital, Inc.', 
      image: '/team-photos/Eric_stewart.jpg', 
      bio: 'Eric Stewart is the founder and president of Atlantic Investment Capital, Inc., a boutique commercial mortgage firm specializing in multifamily financing solutions. With over two decades of experience in commercial real estate lending, Eric brings a wealth of industry expertise and lender relationships to MB Capital Group\'s acquisition strategy.\n\nEric\'s career in commercial real estate finance began in the early 2000s, where he quickly distinguished himself by developing innovative financing structures for complex multifamily transactions. His deep understanding of both conventional and alternative lending sources has enabled him to secure competitive financing for hundreds of millions of dollars in real estate acquisitions.\n\nAt Atlantic Investment Capital, Eric has built a reputation for crafting creative financing solutions that maximize investor returns while minimizing risk. His firm specializes in bridge loans, construction-to-permanent financing, DSCR loans, and agency lending programs, providing comprehensive financing options for multifamily investors of all sizes.\n\nEric\'s relationship-driven approach to lending has resulted in long-term partnerships with regional banks, credit unions, private lenders, and institutional financing sources. This extensive network allows him to negotiate favorable terms and secure financing even in challenging market conditions.\n\nFor MB Capital Group, Eric\'s involvement ensures that every acquisition is optimally financed with terms that enhance investor returns. His ability to structure debt that aligns with the business plan - whether value-add renovations, cash flow optimization, or strategic hold periods - is crucial to the success of each syndication.\n\nEric\'s commitment to education and transparency means that MB Capital Group investors understand not just what financing was secured, but why those terms were chosen and how they support the overall investment strategy. His expertise in multifamily financing markets provides confidence and credibility to every MB Capital Group offering.' 
    },
    { 
      name: 'Jeannie Orlowski', 
      title: 'Mentor & Coach', 
      image: '/team-photos/Jeannie_orlowski.jpg', 
      bio: 'Jeannie Orlowski is a seasoned real estate coach and investor education specialist with over two decades of experience helping individuals build long-term wealth through multifamily investments. For more than 20 years, Jeannie has served alongside Dave Lindahl at ReMentor, one of the nation\'s leading multifamily education platforms.\n\nJeannie\'s approach to real estate education combines practical investment strategies with personal development principles, recognizing that successful investing requires both technical knowledge and the right mindset. Her coaching methodology has helped thousands of students overcome limiting beliefs and take decisive action toward their financial goals.\n\nWith extensive experience in market analysis, deal evaluation, and investor relations, Jeannie brings a comprehensive understanding of the multifamily investment landscape. Her ability to break down complex concepts into actionable steps has made her one of the most sought-after coaches in the real estate education industry.\n\nAt ReMentor, Jeannie has been instrumental in developing curriculum and coaching programs that have guided investors through every stage of their multifamily journey, from their first duplex to large-scale syndications. Her success stories include students who have built portfolios worth millions of dollars using the strategies and principles she teaches.\n\nFor MB Capital Group, Jeannie provides strategic guidance on investor education and communication. Her insights help ensure that passive investors understand not only the specifics of each investment opportunity but also how it fits into their broader wealth-building strategy.\n\nJeannie\'s commitment to ethical investing and transparent communication aligns perfectly with MB Capital Group\'s values. Her involvement provides an additional layer of credibility and ensures that the firm\'s educational materials and investor communications meet the highest standards of clarity and usefulness.\n\nHer mentorship extends beyond individual coaching to include strategic guidance on market trends, investment criteria, and best practices in multifamily syndication, making her an invaluable advisor to the MB Capital Group team.' 
    },
    { 
      name: 'Dean Graziosi', 
      title: 'Mentor', 
      image: '/team-photos/Dean-Graziosi.jpg', 
      bio: 'Dean Graziosi is a New York Times bestselling author, successful entrepreneur, and one of the most recognized names in real estate education. With decades of experience in business development and property investing, Dean brings invaluable insight to MB Capital Group\'s mentorship network—supporting both strategic growth and investor empowerment.\n\nDean\'s entrepreneurial journey spans multiple industries, but his foundation was built in real estate investing, where he learned the principles of value creation, strategic thinking, and wealth building that have guided his success across all ventures. His hands-on experience in real estate transactions provides him with practical insights that complement his business development expertise.\n\nAs a bestselling author, Dean has shared his knowledge through numerous books that focus on business systems, scaling strategies, and the mindset required for entrepreneurial success. His ability to distill complex business concepts into actionable strategies has made his educational content accessible to entrepreneurs and investors at all levels.\n\nDean\'s approach to business mentorship emphasizes the importance of building scalable systems, developing strong leadership capabilities, and maintaining a growth-oriented mindset. These principles directly apply to real estate syndication, where successful operators must manage complex deals, lead investor groups, and scale their operations effectively.\n\nFor MB Capital Group, Dean\'s mentorship focuses on strategic business development, operational excellence, and investor relations. His experience in building and scaling businesses provides valuable guidance on how to structure and grow a syndication platform that delivers consistent results for passive investors.\n\nDean\'s involvement with MB Capital Group extends beyond traditional mentorship to include strategic advice on market positioning, brand development, and investor education initiatives. His reputation for integrity and results-driven approaches aligns with the firm\'s commitment to transparency and investor success.\n\nHis insights on business systems and scaling strategies help ensure that MB Capital Group maintains operational excellence while growing its portfolio and investor base, positioning the firm for long-term success in the competitive multifamily syndication market.' 
    },
    { 
      name: 'Tom Krol', 
      title: 'Mentor', 
      image: '/team-photos/Tom_krol.jpg', 
      bio: 'Tom Krol is a nationally respected real estate coach, entrepreneur, and former host of the top-rated Wholesaling Inc. podcast, where he educated thousands of investors on creative deal-making and real estate business systems. Today, Tom is the founder and CEO of Coaching Inc., a platform dedicated to helping entrepreneurs build and scale coaching businesses.\n\nTom\'s real estate career began with wholesaling, where he quickly established himself as an expert in finding, analyzing, and closing deals that others overlooked. His systematic approach to deal flow, market analysis, and negotiation tactics became the foundation for the educational content that made his podcast one of the most popular in the real estate space.\n\nThrough Wholesaling Inc., Tom taught thousands of students how to build sustainable real estate businesses using proven systems and processes. His emphasis on treating real estate as a professional business rather than a side hobby helped elevate the standards and practices of countless investors across the country.\n\nTom\'s transition to Coaching Inc. represents his evolution from real estate practitioner to business systems expert. His current focus on helping entrepreneurs build coaching and education businesses provides him with unique insights into business development, client relations, and scaling strategies that directly apply to real estate syndication.\n\nAt MB Capital Group, Tom\'s mentorship brings a unique perspective on deal sourcing, market analysis, and investor communication. His experience in building educational content and managing large audiences of real estate investors provides valuable insights into how to effectively communicate with passive investors.\n\nTom\'s systematic approach to business development aligns with MB Capital Group\'s commitment to operational excellence and consistent results. His guidance helps ensure that the firm\'s processes for deal evaluation, investor relations, and portfolio management meet the highest standards of professionalism.\n\nHis ongoing involvement in the real estate education space keeps him connected to market trends, investor sentiment, and emerging opportunities, making him a valuable strategic advisor for MB Capital Group\'s growth and development initiatives.' 
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
<p>Professional administration portal - All 8 team members with complete biographical content now operational</p>
</div>
<div class="dashboard-grid">
<div class="section-card"><div class="section-title">👥 Team Management</div><p>All 8 team members with complete biographical content and working photos</p></div>
<div class="section-card"><div class="section-title">🏢 Investment Properties</div><p>Property management and listings</p></div>
<div class="section-card"><div class="section-title">📧 Email Distribution</div><p>Newsletter and communication management</p></div>
<div class="section-card"><div class="section-title">📊 Analytics Dashboard</div><p>Website traffic and engagement metrics</p></div>
<div class="section-card"><div class="section-title">💼 Investor Portal</div><p>Investor registration and document access</p></div>
<div class="section-card"><div class="section-title">📝 Blog Management</div><p>Content creation and publication</p></div>
<div class="section-card"><div class="section-title">💰 Financial Reports</div><p>Revenue and performance tracking</p></div>
<div class="section-card"><div class="section-title">⚙️ System Settings</div><p>Configuration and preferences</p></div>
</div>
<div class="logout-link">
<a href="/admin/logout">Logout</a>
</div>
</body></html>`);
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

app.get('/api/blog-posts', (req, res) => {
  const blogPosts = [
    { title: "2025 Multifamily Market Outlook", excerpt: "Our analysis of emerging multifamily investment opportunities for the year ahead.", date: "2025-01-15", author: "Michael Bachmann" },
    { title: "Understanding Syndication Returns", excerpt: "A comprehensive guide to evaluating multifamily syndication opportunities.", date: "2025-01-10", author: "Dave Lindahl" },
    { title: "Market Timing in Real Estate", excerpt: "How to identify the right markets at the right time for maximum returns.", date: "2025-01-05", author: "Scott Stafford" },
    { title: "Value-Add Strategies That Work", excerpt: "Proven approaches to increasing property value and investor returns.", date: "2024-12-28", author: "Michael Bachmann" },
    { title: "Financing Multifamily Acquisitions", excerpt: "Current lending landscape and optimal financing structures.", date: "2024-12-20", author: "Eric Stewart" },
    { title: "Building Passive Income Streams", excerpt: "How multifamily investments create sustainable wealth.", date: "2024-12-15", author: "Jeannie Orlowski" },
    { title: "Demographic Trends Driving Demand", excerpt: "Population shifts creating multifamily investment opportunities.", date: "2024-12-10", author: "Scott Stafford" },
    { title: "Scaling Your Real Estate Business", excerpt: "Systems and strategies for growth-minded investors.", date: "2024-12-05", author: "Tom Krol" },
    { title: "Risk Management in Syndications", excerpt: "Protecting investor capital through proper due diligence.", date: "2024-11-30", author: "Dave Lindahl" },
    { title: "Tax Benefits of Multifamily Investing", excerpt: "Maximizing returns through strategic tax planning.", date: "2024-11-25", author: "Dean Graziosi" }
  ];
  res.json({ success: true, blogPosts });
});

app.get('/api/markets', (req, res) => {
  const markets = [
    { id: 1, marketId: "KC001", city: "Kansas City", state: "Missouri", population: 508394, medianIncome: 54478, jobGrowth: 1.8, avgRent: 1250, occupancyRate: 94.2 },
    { id: 2, marketId: "IND001", city: "Indianapolis", state: "Indiana", population: 887642, medianIncome: 47408, jobGrowth: 2.1, avgRent: 1180, occupancyRate: 95.1 },
    { id: 3, marketId: "CIN001", city: "Cincinnati", state: "Ohio", population: 309317, medianIncome: 41754, jobGrowth: 1.4, avgRent: 1095, occupancyRate: 93.8 }
  ];
  res.json(markets);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`MB Capital Group server running on port ${PORT}`);
});
