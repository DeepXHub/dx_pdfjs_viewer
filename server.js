const express = require("express");
const path = require("path");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// CORS options
const corsOptions = {
    origin: function (origin, callback) {
        console.log('Incoming origin:', origin); // Log the incoming origin
        // Allow requests from deepxhub.com subdomains
        if (!origin || /^https?:\/\/([^.]+\.|)deepxhub\.com$/.test(origin)) {
            callback(null, true); // Allow request
        } else {
            callback(new Error('Not allowed by CORS')); // Reject request
        }
    },
};

// Allow all CORS requests
// app.use(cors());

// Use CORS with our settings
app.use(cors(corsOptions));

// Logging incoming requests to the console
app.use((req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress; // Get client IP address
    const referrer = req.get('Referrer') || req.get('Referer') || 'No referrer'; // Get referrer

    console.log(`${req.method} request made to: ${req.url} from IP: ${clientIP}, Referrer: ${referrer}`);
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
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
