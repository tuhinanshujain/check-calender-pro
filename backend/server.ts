
import express from 'express';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { query, initDb } from './db';
import { sendOtpEmail } from './firebase';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-123';

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: '*' })); // Open for development
app.use(express.json({ limit: '10kb' }));

// Rate Limiting for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    res.status(429).json({ error: "Too many attempts. Please wait 15 minutes." });
  }
});

// Authentication Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Authentication required" });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Invalid or expired session" });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---

app.post('/api/auth/request-otp', authLimiter, async (req, res) => {
  const { email } = req.body;
  console.log(`[API] OTP Request for: ${email}`);
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: "A valid email address is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    console.log(`[API] Saving OTP to database...`);
    await query('DELETE FROM otps WHERE email = $1', [email]);
    await query('INSERT INTO otps (email, code, expires_at) VALUES ($1, $2, $3)', [email, otp, expiresAt]);
    
    console.log(`[API] Triggering email sending...`);
    await sendOtpEmail(email, otp);
    
    console.log(`[API] OTP process complete.`);
    res.json({ message: "OTP sent successfully" });
  } catch (err: any) {
    console.error("[API] Error in request-otp:", err);
    res.status(500).json({ error: err.message || "Failed to process request." });
  }
});

app.post('/api/auth/verify', async (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const result = await query(
      'SELECT * FROM otps WHERE email = $1 AND code = $2 AND expires_at > NOW()',
      [email, otp]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    let userResult = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      userResult = await query('INSERT INTO users (email) VALUES ($1) RETURNING id', [email]);
    }

    const userId = userResult.rows[0].id;
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });

    await query('DELETE FROM otps WHERE email = $1', [email]);

    res.json({ token, email });
  } catch (err: any) {
    console.error("[API] Verification Error:", err);
    res.status(500).json({ error: "Server error during verification." });
  }
});

// --- PROTECTED ROUTES ---

app.get('/api/calendars', authenticateToken, async (req: any, res) => {
  try {
    const result = await query('SELECT * FROM calendars WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDb();
});
