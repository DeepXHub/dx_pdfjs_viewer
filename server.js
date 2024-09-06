const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files with correct MIME types
app.use((req, res, next) => {
  const fileExtension = path.extname(req.path);

  // Handle .mjs files with the correct MIME type
  if (fileExtension === '.mjs') {
    res.setHeader('Content-Type', 'application/javascript');
  }

  next();
});

// Serve static files from the "web" directory
app.use(express.static(path.join(__dirname, 'web')));
app.use('/build', express.static(path.join(__dirname, 'build')));

// Handle root URL and redirect to the viewer
app.get('/', (req, res) => {
  res.redirect('/viewer.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});