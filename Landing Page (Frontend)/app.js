const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const connectDB = require('./config/database');
const { router: authRouter } = require('./routes/auth');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/chaintorque'
  }),
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Auth routes
app.use('/auth', authRouter);

// Routes
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user || null }); // Pass user session to view
});

app.get('/library', (req, res) => {
    const dummyModels=[
         {
            _id: "1",
            title: "Gear Assembly",
            description: "A detailed CAD model of a gear assembly.",
            imageURL: "https://via.placeholder.com/300x200"
        },
        {
            _id: "2",
            title: "Engine Block",
            description: "3D model of a V8 engine block.",
            imageURL: "https://via.placeholder.com/300x200"
        }
    ];
    res.render('library', { models: dummyModels, user: req.session.user || null });
});

app.get('/login', (req, res) => {
    // Redirect to marketplace if already logged in
    if (req.session.user) {
        return res.redirect('http://localhost:8082');
    }
    res.render('login');
});

app.get('/signup', (req, res) => {
    // Redirect to marketplace if already logged in
    if (req.session.user) {
        return res.redirect('http://localhost:8082');
    }
    res.render('signup');
});

app.get('/upload', (req, res) => {
    res.render('upload', { user: req.session.user || null });
});

// API endpoint to check authentication status (for marketplace)
app.get('/api/auth-status', (req, res) => {
    if (req.session.user) {
        res.json({ authenticated: true, user: req.session.user });
    } else {
        res.json({ authenticated: false });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});