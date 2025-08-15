const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index');
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
    res.render('library', { models: dummyModels });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/upload', (req, res) => {
    res.render('upload');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ChainTorque Landing Page running on http://localhost:${PORT}`);
});