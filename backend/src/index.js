import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initDb, getDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 4000;
const DIDIT_API_KEY    = process.env.DIDIT_API_KEY;
const DIDIT_WORKFLOW_ID = process.env.DIDIT_WORKFLOW_ID;
const DIDIT_BASE       = 'https://verification.didit.me';
const JWT_SECRET       = process.env.JWT_SECRET || 'inmobiliaria_secret_2024';

app.use(cors({ origin: true }));
app.use(express.json());

// ─── Middleware JWT ───────────────────────────────────────────────────────────
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'No autorizado' });
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });

  try {
    const db = await getDb();
    const [[user]] = await db.execute(
      'SELECT * FROM system_users WHERE email = ?', [email]
    );
    if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', auth, (req, res) => res.json(req.user));

// ─── Clientes ─────────────────────────────────────────────────────────────────

// GET /api/clients
app.get('/api/clients', auth, async (req, res) => {
  try {
    const db = await getDb();
    const [rows] = await db.execute(`
      SELECT c.*, u.name AS agent_name
      FROM clients c
      LEFT JOIN system_users u ON c.agent_id = u.id
      ORDER BY c.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/clients/:id
app.get('/api/clients/:id', auth, async (req, res) => {
  try {
    const db = await getDb();
    const [[row]] = await db.execute(
      'SELECT * FROM clients WHERE id = ?', [req.params.id]
    );
    if (!row) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/clients  — guarda cliente después de verificación Didit
app.post('/api/clients', auth, async (req, res) => {
  const {
    didit_session_id, verification_status,
    full_name, date_of_birth, curp, document_number,
    gender, expiration_date, issuing_state,
    id_verification_status, liveness_status,
    face_match_status, face_match_score,
  } = req.body;

  try {
    const db = await getDb();
    const [result] = await db.execute(`
      INSERT INTO clients (
        agent_id, didit_session_id, verification_status,
        full_name, date_of_birth, curp, document_number,
        gender, expiration_date, issuing_state,
        id_verification_status, liveness_status,
        face_match_status, face_match_score
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id, didit_session_id, verification_status,
      full_name, date_of_birth || null, curp, document_number,
      gender, expiration_date || null, issuing_state,
      id_verification_status, liveness_status,
      face_match_status, face_match_score || null,
    ]);

    const [[created]] = await db.execute('SELECT * FROM clients WHERE id = ?', [result.insertId]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Didit Sessions ───────────────────────────────────────────────────────────

function checkEnv(res) {
  if (!DIDIT_API_KEY)     { res.status(500).json({ error: 'DIDIT_API_KEY no configurada' }); return false; }
  if (!DIDIT_WORKFLOW_ID) { res.status(500).json({ error: 'DIDIT_WORKFLOW_ID no configurada' }); return false; }
  return true;
}

// POST /api/start-session
app.post('/api/start-session', auth, async (req, res) => {
  if (!checkEnv(res)) return;
  const { callback, vendor_data } = req.body;

  try {
    const response = await fetch(`${DIDIT_BASE}/v3/session/`, {
      method: 'POST',
      headers: { 'x-api-key': DIDIT_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workflow_id: DIDIT_WORKFLOW_ID,
        vendor_data: vendor_data || crypto.randomUUID(),
        callback,
        callback_method: 'both',
        language: 'es',
        expected_details: { expected_document_types: ['ID'] },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const msg = data?.detail ?? data?.error ?? JSON.stringify(data);
      return res.status(response.status).json({ error: msg });
    }

    console.log(`✅ Sesión Didit creada: ${data.session_id}`);
    res.json({ session_id: data.session_id, url: data.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/session/:sessionId/result
app.get('/api/session/:sessionId/result', auth, async (req, res) => {
  if (!checkEnv(res)) return;

  try {
    const response = await fetch(
      `${DIDIT_BASE}/v3/session/${req.params.sessionId}/decision/`,
      { headers: { 'x-api-key': DIDIT_API_KEY } }
    );

    const data = await response.json();
    if (!response.ok) {
      const msg = data?.detail ?? data?.error ?? JSON.stringify(data);
      return res.status(response.status).json({ error: msg });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

// ─── Arranque ─────────────────────────────────────────────────────────────────
async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Error al iniciar:', err.message);
  process.exit(1);
});
