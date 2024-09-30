const express = require("express");
const path = require("path");
const cors = require("cors");
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 10000;

// Allow all CORS requests
app.use(cors());

// Middleware to log incoming requests
app.use((req, res, next) => {
    const clientIp = req.ip;
    const referrer = req.get('Referer') || 'No referrer';
    console.log(`[dx-pdfjs-viewer] GET request made to: ${req.path} from IP: ${clientIp}, Referrer: ${referrer}`);
    console.log(`[dx-pdfjs-viewer] Full request URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
});

// Serve static files with correct MIME types
app.use((req, res, next) => {
    const fileExtension = path.extname(req.path);
    // Handle .mjs files with the correct MIME type
    if (fileExtension === ".mjs") {
        res.setHeader("Content-Type", "application/javascript");
    }
    next();
});

// Serve static files from the "web" directory
app.use("/hidden-reader/", express.static(path.join(__dirname, "web")));
app.use("/build", express.static(path.join(__dirname, "build")));

// Handle root URL and redirect to the viewer
app.get("/hidden-reader/", (req, res) => {
    res.redirect("/hidden-reader/viewer.html");
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
