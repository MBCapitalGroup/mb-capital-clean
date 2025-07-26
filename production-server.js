const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Serve HTML files
function serveHtml(res, filePath) {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    res.sendFile(fullPath);
  } else {
    res.status(404).send('File not found');
  }
}

// Routes
app.get('/', (req, res) => serveHtml(res, 'index.html'));
app.get('/tax-calculator', (req, res) => serveHtml(res, 'tax-calculator.html'));
app.get('/tax-calculator.html', (req, res) => serveHtml(res, 'tax-calculator.html'));
app.get('/investor-portal', (req, res) => serveHtml(res, 'investor-portal.html'));
app.get('/investor-portal.html', (req, res) => serveHtml(res, 'investor-portal.html'));
app.get('/investor-portal-login', (req, res) => serveHtml(res, 'investor-portal-login.html'));
app.get('/investor-portal-login.html', (req, res) => serveHtml(res, 'investor-portal-login.html'));
app.get('/investor-portal-register', (req, res) => serveHtml(res, 'investor-portal-register.html'));
app.get('/investor-portal-register.html', (req, res) => serveHtml(res, 'investor-portal-register.html'));
app.get('/investor-registration', (req, res) => serveHtml(res, 'investor-registration.html'));
app.get('/investor-registration.html', (req, res) => serveHtml(res, 'investor-registration.html'));
app.get('/admin/login', (req, res) => serveHtml(res, 'static-admin/admin-login.html'));
app.get('/admin/dashboard', (req, res) => serveHtml(res, 'static-admin/admin-dashboard.html'));

// API Routes - Complete 8-person team
app.get('/api/team-members', (req, res) => {
  res.json([
    {
      id: 1,
      name: "Michael Bachmann",
      title: "Founder & Principal", 
      bio: "Michael Bachmann founded MB Capital Group after developing extensive experience in both business operations and real estate investment. Beginning as a store manager at Domino's Pizza at age 18, Michael quickly advanced to become one of the youngest franchisees in company history by age 21, eventually building a portfolio that included multiple Domino's locations across Missouri. His success in franchise operations provided him with a strong foundation in business management, customer service, and operational efficiency. Through his franchise experience, Michael developed critical skills in market analysis, location evaluation, and performance optimization—skills that directly translate to identifying and managing successful multifamily investment opportunities.",
      image: "/team-photos/michael-bachmann.jpg",
      displayOrder: 1,
      hiddenFromWebsite: false
    },
    {
      id: 2,
      name: "Makeba Hart",
      title: "Advisor to Michael Bachmann",
      bio: "There once was this amazing person named Makeba and she always questioned herself....but what she took forever to realize is that she is always enough and never falls short. No matter what the rest of the world might think she is the QUEEN BEA. She doesn't realized it yet but she is soon to be a millionaires!!!! And her friend Michael couldn't be more proud of her for staying in the game and fighting a good fight!!!!!",
      image: "/team-photos/makeba-hart.jpg",
      displayOrder: 2,
      hiddenFromWebsite: false
    },
    {
      id: 3,
      name: "Dave Lindahl",
      title: "Mentor",
      bio: "Dave Lindahl is a nationally recognized real estate investment expert and mentor who has significantly influenced Michael Bachmann's approach to multifamily syndication. As the founder of ReMentor and author of multiple real estate investment books, Dave has educated thousands of investors on building wealth through multifamily properties. His comprehensive training programs cover all aspects of multifamily investing, from market analysis and property acquisition to financing strategies and investor relations.",
      image: "/team-photos/dave-lindahl.jpg",
      displayOrder: 3,
      hiddenFromWebsite: false
    },
    {
      id: 4,
      name: "Dean Graziosi",
      title: "Real Estate Advisor",
      bio: "Dean Graziosi is a bestselling author, entrepreneur, and real estate investment expert whose strategic guidance helps shape MB Capital Group's approach to wealth-building through multifamily investments. With decades of experience in real estate and business development, Dean brings a unique perspective on market trends, investment strategies, and long-term wealth accumulation.",
      image: "/team-photos/dean-graziosi.jpg",
      displayOrder: 4,
      hiddenFromWebsite: false
    },
    {
      id: 5,
      name: "Tom Krol",
      title: "Marketing Mentor",
      bio: "Tom Krol is a leading real estate marketing expert and mentor who provides strategic guidance to MB Capital Group's investor outreach and education initiatives. With extensive experience in direct-response marketing and investor communication, Tom helps ensure that our investment opportunities reach qualified investors effectively and ethically.",
      image: "/team-photos/tom-krol.jpg",
      displayOrder: 5,
      hiddenFromWebsite: false
    },
    {
      id: 6,
      name: "Eric Stewart",
      title: "Lending & Capital Partner",
      bio: "Eric Stewart is a seasoned lending professional and capital partner who brings institutional-level financing expertise to MB Capital Group's multifamily investment platform. As the owner of Atlantic Investment Capital, Eric specializes in structuring creative financing solutions that maximize investor returns while minimizing risk exposure.",
      image: "/team-photos/eric-stewart.jpg",
      displayOrder: 6,
      hiddenFromWebsite: false
    },
    {
      id: 7,
      name: "Jeannie Orlowski",
      title: "Mentor & Coach",
      bio: "Jeannie Orlowski is a seasoned real estate coach and investor education specialist with over two decades of experience helping individuals build long-term wealth through multifamily investments. For more than 20 years, Jeannie has served alongside Dave Lindahl at ReMentor, one of the nation's leading multifamily education platforms, supporting both the internal team and thousands of real estate investors across the country.",
      image: "/team-photos/jeannie-orlowski.jpg",
      displayOrder: 7,
      hiddenFromWebsite: false
    },
    {
      id: 8,
      name: "Scott Stafford",
      title: "Demographer",
      bio: "Scott Stafford brings deep expertise in demographic analysis and market research to MB Capital Group, where he plays a critical role in identifying high-potential multifamily investment opportunities. His background in data analytics and economic modeling allows the team to make informed decisions rooted in future-facing market intelligence.",
      image: "/team-photos/scott-stafford.jpg",
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
      medianRent: 1250,
      occupancyRate: 94.2,
      populationGrowth: 2.3,
      jobGrowth: 3.1,
      medianIncome: 65000,
      capRateAverage: 7.2,
      pricePerUnit: 85000,
      vacancyTrend: "Decreasing",
      isActive: true
    },
    {
      id: 2,
      marketId: "STL001", 
      city: "St. Louis",
      state: "MO",
      medianRent: 1180,
      occupancyRate: 92.8,
      populationGrowth: 1.8,
      jobGrowth: 2.7,
      medianIncome: 58000,
      capRateAverage: 8.1,
      pricePerUnit: 75000,
      vacancyTrend: "Stable",
      isActive: true
    }
  ]);
});

// Form submission endpoint
app.post('/api/form-submissions', (req, res) => {
  console.log('Form submission received:', req.body);
  res.json({ success: true, message: 'Form submitted successfully' });
});

// Market report request endpoint
app.post('/api/market-report-requests', (req, res) => {
  console.log('Market report request received:', req.body);
  res.json({ success: true, message: 'Market report request submitted successfully' });
});

// AI recommendations endpoint
app.post('/api/ai-recommendations/email', (req, res) => {
  console.log('AI recommendations email request received:', req.body);
  res.json({ success: true, message: 'Recommendations emailed successfully' });
});

// Tax brackets endpoint
app.get('/api/tax-brackets/:year', (req, res) => {
  const year = req.params.year;
  const brackets = [
    { rate: 0.10, min: 0, max: 11000, label: "10%" },
    { rate: 0.12, min: 11001, max: 44725, label: "12%" },
    { rate: 0.22, min: 44726, max: 95375, label: "22%" },
    { rate: 0.24, min: 95376, max: 182050, label: "24%" },
    { rate: 0.32, min: 182051, max: 231250, label: "32%" },
    { rate: 0.35, min: 231251, max: 578125, label: "35%" },
    { rate: 0.37, min: 578126, max: Infinity, label: "37%" }
  ];
  
  res.json(brackets);
});

// Engagement tracking endpoint
app.post('/api/engagement/track', (req, res) => {
  console.log('Engagement tracking:', req.body);
  res.json({ success: true });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
