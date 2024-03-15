const config = require('./config');
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || config.app.port || 8080; // Set your desired port number

// Serve static files from public directory 
app.use(express.static(path.join(__dirname, config.app.public_dirname)));

// Send main front-end page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, config.app.public_dirname, config.app.front_end_index_file));
});

// Invalid request redirects to main front-end page
app.use((req, res) => {
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});