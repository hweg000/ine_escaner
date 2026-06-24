import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

let pool;

export async function getDb() {
  if (!pool) {
    pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'inmobiliaria',
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

export async function initDb() {
  // Crear la base de datos si no existe (conexión sin DB)
  const tmp = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
  });
  await tmp.execute('CREATE DATABASE IF NOT EXISTS inmobiliaria');
  await tmp.end();

  const db = await getDb();

  // ── Tabla: usuarios del sistema (agentes / admins) ──────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS system_users (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      name         VARCHAR(100) NOT NULL,
      email        VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role         ENUM('admin','agent') DEFAULT 'agent',
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ── Tabla: clientes verificados ─────────────────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS clients (
      id                      INT AUTO_INCREMENT PRIMARY KEY,
      agent_id                INT,
      didit_session_id        VARCHAR(100),
      verification_status     VARCHAR(50),
      -- Datos del documento (INE)
      full_name               VARCHAR(200),
      date_of_birth           DATE,
      curp                    VARCHAR(20),
      document_number         VARCHAR(50),
      gender                  CHAR(1),
      expiration_date         DATE,
      issuing_state           VARCHAR(100),
      -- Resultados de los checks
      id_verification_status  VARCHAR(50),
      liveness_status         VARCHAR(50),
      face_match_status       VARCHAR(50),
      face_match_score        DECIMAL(5,2),
      -- Timestamps
      created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (agent_id) REFERENCES system_users(id)
    )
  `);

  // ── Seed: usuario admin por defecto ─────────────────────────────────────
  const [[existing]] = await db.execute(
    'SELECT id FROM system_users WHERE email = ?',
    ['admin@inmobiliaria.com']
  );

  if (!existing) {
    const hash = await bcrypt.hash('admin123', 10);
    await db.execute(
      'INSERT INTO system_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      ['Administrador', 'admin@inmobiliaria.com', hash, 'admin']
    );
    console.log('👤 Usuario admin creado: admin@inmobiliaria.com / admin123');
  }

  console.log('✅ Base de datos lista');
}
