const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static directories
app.use('/team-photos', express.static('team-photos'));
app.use('/assets', express.static('assets'));
app.use('/uploads', express.static('uploads'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'mb-capital-session-secret-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Simple user storage (matching your working system)
const users = new Map();
// Hash for password: Scrappy2025Bachmann##
users.set('admin', {
  id: 10,
  username: 'admin',
  password: '$2b$10$gZmXzKWRe45FGpax61sNWeiiyMnNOB35UKHUAp3ZnDjP87VybF48K'
});

passport.use(new LocalStrategy(
  async (username, password, done) => {
    const user = users.get(username);
    if (!user) return done(null, false);
    
    try {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) return done(null, user);
      return done(null, false);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = Array.from(users.values()).find(u => u.id === id);
  done(null, user);
});

// Helper function to serve HTML files
async function serveHtml(res, filename) {
  try {
    const template = await fs.readFile(path.resolve(process.cwd(), filename), 'utf-8');
    res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
  } catch (error) {
    console.error(`Error serving ${filename}:`, error);
    res.status(500).send('Internal Server Error');
  }
}

// Routes
app.get('/', (req, res) => serveHtml(res, 'index.html'));
app.get('/investor-portal/register', (req, res) => serveHtml(res, 'investor-registration.html'));
app.get('/investor-portal', (req, res) => serveHtml(res, 'investor-portal.html'));
app.get('/investor-portal/login', (req, res) => serveHtml(res, 'investor-portal-login.html'));
app.get('/tax-calculator', (req, res) => serveHtml(res, 'tax-calculator.html'));
app.get('/tax-calculator.html', (req, res) => serveHtml(res, 'tax-calculator.html'));

// Admin routes - CORRECTED PATHS
app.get('/admin/login', (req, res) => serveHtml(res, 'admin-login.html'));
app.get('/admin/dashboard', (req, res) => serveHtml(res, 'admin-dashboard.html'));

// API Routes - CORRECTED TEAM DATA WITH PROPER IMAGE PATHS
app.get('/api/team-members', (req, res) => {
  res.json([
    {
      id: 1,
      name: "Michael Bachmann",
      title: "Principle & Owner", 
      bio: "Michael's entrepreneurial journey began early - at age 18, he started working for Domino's Pizza and was promoted to store manager in less than a year. At 20, he moved to Honolulu, Hawaii to manage two underperforming stores, demonstrating his ability to turn around challenging operations. By age 21, Michael had returned to Kansas City as a successful Domino's franchisee, owning and operating three stores in Lenexa and Overland Park, Kansas before selling them in 1999 to pursue other opportunities.<br><br>Michael is an experienced real estate investor from Kansas City, Missouri with over 15 years in real estate investing. His background includes successful ventures in fix-and-flip properties, rental property management, and real estate development projects throughout the Kansas City metropolitan area.<br><br>In 2024, Michael made a strategic decision to sell his entire rental property portfolio to focus exclusively on multifamily syndications. This pivot represents his commitment to scaling real estate investments through syndicated deals that can provide superior returns and diversification for investors.<br><br>Michael's combination of hands-on real estate experience, business management background from his franchise operations, and comprehensive multifamily education through industry mentors positions him to lead MB Capital Group's mission of creating wealth through strategic multifamily investments. His entrepreneurial foundation and proven track record in both business operations and real estate provide the leadership experience necessary for successful syndication management.",
      image: "/team-photos/Michael%20Bachmann.jpg",
      displayOrder: 1,
      hiddenFromWebsite: false
    },
    {
      id: 2,
      name: "Makeba Hart aka the wholesaling badest bitch around",
      title: "Advisor to Michael Bachmann",
      bio: "There once was this amazing person named Makeba and she always questioned herself....but what she took forever to realize is that she is always enough and never falls short. No matter what the rest of the world might think she is the QUEEN BEA. She doesn't realized it yet but she is soon to be a millionaires!!!! And her friend Michael couldn't be more proud of her for staying in the game and fighting a good fight!!!!!",
      image: "/team-photos/makeba_hart.jpg",
      displayOrder: 2,
      hiddenFromWebsite: false
    },
    {
      id: 3,
      name: "Dave Lindahl",
      title: "Mentor",
      bio: "Dave Lindahl is a nationally renowned multifamily real estate investor, bestselling author, and respected mentor in the apartment syndication industry. With decades of hands-on experience acquiring, syndicating, and managing apartment communities, Dave has built a substantial multifamily portfolio and guided thousands of investors toward financial success.<br><br>As the author of several influential books—most notably Emerging Real Estate Markets (2007)—Dave established himself as a thought leader in identifying and capitalizing on dynamic market trends. His methodology is centered around understanding the four phases of the real estate market cycle, allowing investors to time their entry and exit strategies with precision. By targeting emerging markets before they peak and avoiding those in decline, Dave's approach helps maximize investor returns and minimize downside risk. At any given time, there may be a dozen or more emerging markets across the U.S., and his strategies allow MB Capital Group to enter markets where we can exit at optimal cap rates and deliver superior value to our investors.<br><br>Dave's expertise spans the full investment cycle—from acquisition and financing to property management and value creation—grounded in proven, time-tested strategies and innovative market insights.<br><br>Through his mentorship, Dave provides MB Capital Group with invaluable guidance in deal structuring, market analysis, conservative underwriting, and operational excellence. His emphasis on fundamentals—such as professional due diligence and ethical investing—ensures that our strategies are both robust and resilient across market cycles.<br><br>In addition to his educational programs and speaking engagements, Dave's extensive industry network enhances our access to off-market opportunities, financing relationships, and cutting-edge investment intelligence. His mentorship plays a critical role in aligning MB Capital Group's operations with best-in-class standards and our core commitment to delivering superior results for our investors.",
      image: "/team-photos/Dave-Lindahl.jpg",
      displayOrder: 3,
      hiddenFromWebsite: false
    },
    {
      id: 4,
      name: "Dean Graziosi",
      title: "Mentor",
      bio: "Dean Graziosi is a New York Times bestselling author, successful entrepreneur, and one of the most recognized names in real estate education. With decades of experience in business development and property investing, Dean brings invaluable insight to MB Capital Group's mentorship network—supporting both strategic growth and investor empowerment.<br><br>As the author of multiple bestselling books and a globally recognized speaker, Dean has helped millions of people understand the principles of real estate investing and wealth creation. His strength lies in simplifying complex ideas and building practical systems that individuals can use to create long-term financial freedom.<br><br>Dean's entrepreneurial success spans real estate, education, and digital business—giving him a unique ability to advise on scalability, branding, investor communication, and operational infrastructure. His focus on building systems that scale without sacrificing quality helps MB Capital Group design investor experiences and backend processes that are both efficient and trustworthy.<br><br>Dean's mentorship aligns with MB Capital Group's mission to deliver exceptional returns while building enduring relationships with investors. His guidance helps ensure that our approach to growth, education, and investor engagement is grounded in proven strategies that stand the test of time.",
      image: "/team-photos/Dean-Graziosi.jpg",
      displayOrder: 4,
      hiddenFromWebsite: false
    },
    {
      id: 5,
      name: "Tom Krol",
      title: "Mentor",
      bio: "Tom Krol is a nationally respected real estate coach, entrepreneur, and former host of the top-rated Wholesaling Inc. podcast, where he educated thousands of investors on creative deal-making and real estate business systems. Today, Tom is the founder and CEO of Coaching Inc., a platform dedicated to helping entrepreneurs build and scale coaching businesses that make a lasting impact.<br><br>Tom brings extensive expertise in real estate investing, deal analysis, and business development. His practical, system-driven approach has empowered countless investors to grow successful businesses by focusing on repeatable processes, strong communication, and disciplined execution.<br><br>While not directly affiliated with MB Capital Group, Tom's teachings and industry leadership have contributed to the broader investment philosophies and acquisition strategies embraced by our team. His influence continues to resonate throughout the real estate investment community as a model of integrity, creativity, and entrepreneurial excellence.",
      image: "/team-photos/Tom_krol.jpg",
      displayOrder: 5,
      hiddenFromWebsite: false
    },
    {
      id: 6,
      name: "Eric Stewart",
      title: "Owner of Atlantic Investment Capital, Inc.",
      bio: "Eric Stewart is the founder and president of Atlantic Investment Capital, Inc., a boutique commercial mortgage firm specializing in multifamily financing solutions. With over two decades of experience in commercial real estate lending, Eric brings a wealth of industry expertise and lender relationships to MB Capital Group's acquisition strategy.<br><br>Eric specializes in structuring tailored financing solutions for apartment acquisitions, including agency loans (Fannie Mae, Freddie Mac), traditional bank financing, bridge loans, and alternative debt sources. His deep understanding of underwriting guidelines, market trends, and lender appetite enables him to navigate complex capital stacks and secure optimal terms that align with each deal's investment thesis.<br><br>More than a broker, Eric is a strategic partner in the deal process—working closely with our acquisition and underwriting teams during due diligence to model financing scenarios, maximize leverage, and maintain strong debt service coverage. His ability to move quickly and provide flexible funding options gives MB Capital Group a significant edge in competitive bidding environments.<br><br>Eric also advises on refinancing strategies to enhance investor returns through cash-out opportunities or interest rate optimization. His proactive engagement with capital markets helps ensure we time debt decisions around favorable lending conditions, reducing cost of capital and improving overall performance.<br><br>Eric's ownership of Atlantic Investment Capital, combined with his hands-on expertise and long-standing lender network, provides MB Capital Group with institutional-level financing capabilities and a distinct advantage in sourcing, structuring, and executing successful multifamily investments.",
      image: "/team-photos/Eric_stewart.jpg",
      displayOrder: 6,
      hiddenFromWebsite: false
    },
    {
      id: 7,
      name: "Jeannie Orlowski",
      title: "Mentor & Coach",
      bio: "Jeannie Orlowski is a seasoned real estate coach and investor education specialist with over two decades of experience helping individuals build long-term wealth through multifamily investments. For more than 20 years, Jeannie has served alongside Dave Lindahl at ReMentor, one of the nation's leading multifamily education platforms, supporting both the internal team and thousands of real estate investors across the country.<br><br>At ReMentor, Jeannie plays a critical role in supporting the coaching infrastructure, helping ensure the success of Dave Lindahl's nationally recognized training programs. While she doesn't lead investor education at MB Capital Group, her deep experience and perspective provide invaluable context and strategic insight to our team and operations.<br><br>She is especially skilled in deal analysis and investor matchmaking—connecting individuals to the right partners, opportunities, and resources using the deep network and knowledge base she has cultivated over 20 years in the industry. Her understanding of the programs Dave has developed allows her to guide investors through complex decisions with clarity and confidence.<br><br>Jeannie's mentorship and coaching have played a vital role in shaping MB Capital Group's approach to investor alignment, communication, and operational integrity. Her commitment to transparency, long-term value creation, and ethical investing aligns perfectly with our mission to help investors build lasting wealth through multifamily real estate.",
      image: "/team-photos/Jeannie_orlowski.jpg",
      displayOrder: 7,
      hiddenFromWebsite: false
    },
    {
      id: 8,
      name: "Scott Stafford",
      title: "Demographer",
      bio: "Scott Stafford brings deep expertise in demographic analysis and market research to MB Capital Group, where he plays a critical role in identifying high-potential multifamily investment opportunities. His background in data analytics and economic modeling allows the team to make informed decisions rooted in future-facing market intelligence.<br><br>Scott's analysis goes far beyond surface-level metrics. He examines population trends, migration patterns, employment growth, household formation, and income demographics to forecast rental demand and market durability. His methodology combines federal census data, local economic indicators, and proprietary modeling tools to create detailed market profiles that guide both acquisitions and exit strategy planning.<br><br>By delivering insight into supply/demand dynamics, tenant profiles, and market timing, Scott ensures that MB Capital Group invests in locations with strong fundamentals and long-term upside. His research has proven instrumental in helping the firm identify markets on the rise—often before they become targets for mainstream investors.<br><br>Scott's ability to translate complex demographic and economic data into clear, actionable insights gives MB Capital Group a distinct competitive edge in both strategic planning and risk mitigation. His work continues to shape our market selection criteria and supports our mission to deliver consistent returns in high-growth environments.",
      image: "/team-photos/Scott.jpg",
      displayOrder: 8,
      hiddenFromWebsite: false
    }
  ]);
});

app.get('/api/markets', (req, res) => {
  res.json([
    {
      id: 1,
      marketId: "KC001",
      city: "Kansas City",
      state: "MO",
      averageRent: 1250,
      occupancyRate: 94.5,
      marketData: { population: 508000, medianIncome: 52000 }
    },
    {
      id: 2,
      marketId: "STL001", 
      city: "St. Louis",
      state: "MO",
      averageRent: 1180,
      occupancyRate: 92.8,
      marketData: { population: 315000, medianIncome: 48000 }
    }
  ]);
});

// Authentication routes
app.post('/api/auth/login', 
  passport.authenticate('local', { failureRedirect: '/admin/login' }),
  (req, res) => {
    res.json({ success: true, user: req.user });
  }
);

app.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ success: true });
  });
});

// Email submission (basic implementation)
app.post('/api/consultation-request', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    console.log('Consultation request received:', { firstName, lastName, email, phone });
    
    // In production, save to database and send email
    res.json({ success: true, message: 'Consultation request submitted successfully' });
  } catch (error) {
    console.error('Error processing consultation request:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// ADMIN LOGIN API ENDPOINT - ADDED
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password required' 
      });
    }
    
    const user = users.get(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      // Generate simple token (in production, use JWT or similar)
      const token = `admin_${username}_${Date.now()}`;
      
      res.json({
        success: true,
        message: 'Login successful',
        token: token,
        username: username
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Newsletter subscription
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Newsletter subscription:', email);
    
    res.json({ success: true, message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`MB Capital Group server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log('Database URL:', process.env.DATABASE_URL ? 'Connected' : 'Not configured');
  console.log('SendGrid API:', process.env.SENDGRID_API_KEY ? 'Configured' : 'Not configured');
});
