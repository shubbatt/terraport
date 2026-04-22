const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'terraport_super_secret_key_123';

app.use(cors());
app.use(express.json());

// Setup Multer for document uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

// Middleware to authenticate
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, name, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Registration Endpoint
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err.message });
      if (row) return res.status(400).json({ message: 'Email already exists' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // Auto-assign admin role to specific email for testing purposes
      const role = email.toLowerCase() === 'admin@terraport.com' ? 'admin' : 'customer';

      db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
        [name, email, hashedPassword, role], 
        function(err) {
          if (err) return res.status(500).json({ message: 'Registration failed', error: err.message });
          
          const token = jwt.sign({ id: this.lastID, email, name, role }, JWT_SECRET, { expiresIn: '24h' });
          res.status(201).json({ message: 'Registered successfully', token, user: { id: this.lastID, name, email, role } });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Provide email and password' });

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
});

// Get User Profile
app.get('/api/user', authenticate, (req, res) => {
  db.get('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  });
});

// Upload Document Endpoint (Creates a Job)
app.post('/api/upload', authenticate, upload.single('document'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const ref = 'TLX-' + Math.floor(100000 + Math.random() * 900000);
  const serviceType = req.body.serviceType || 'Customs Clearance';

  db.run('INSERT INTO jobs (user_id, reference, service_type, filename, original_name) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, ref, serviceType, req.file.filename, req.file.originalname],
    function(err) {
      if (err) return res.status(500).json({ message: 'Error saving job', error: err.message });
      res.status(201).json({ message: 'Document uploaded successfully', reference: ref, jobId: this.lastID });
    }
  );
});

// Get Jobs (Back-office sees all, customer sees theirs)
app.get('/api/jobs', authenticate, (req, res) => {
  let query, params;
  if (req.user.role === 'admin') {
    query = 'SELECT jobs.*, users.name as customer_name, users.email as customer_email FROM jobs JOIN users ON jobs.user_id = users.id ORDER BY jobs.created_at DESC';
    params = [];
  } else {
    query = 'SELECT * FROM jobs WHERE user_id = ? ORDER BY created_at DESC';
    params = [req.user.id];
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    res.json({ jobs: rows });
  });
});

// Update Job Status (Admin only)
app.patch('/api/jobs/:id/status', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Back-office access required.' });
  }

  const { status } = req.body;
  const validStatuses = ['Pending', 'Processing', 'Cleared', 'Delivered', 'Rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  db.run('UPDATE jobs SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Status updated successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
