const express = require('express');
const { models } = require('mongoose');
const path = require('path');

const app = express();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index'); // This will render views/index.ejs
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
    res.render('library', { models:dummyModels}); // This will render views/library.ejs
});

app.get('/login', (req, res) => {
    res.render('login'); // This will render views/login.ejs
});

app.get('/signup', (req, res) => {
    res.render('signup'); // This will render views/signup.ejs
});

app.get('/upload', (req, res) => {
    res.render('upload'); // This will render views/upload.ejs
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});