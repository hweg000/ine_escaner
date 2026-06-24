import { useState, useEffect, Suspense, lazy } from 'react';
import { apiFetch } from '../auth.js';

const IneVerification = lazy(() => import('ine_widget/IneVerification'));

const STATUS_COLOR = {
  Approved:   { color: '#16a34a', bg: '#f0fdf4' },
  Declined:   { color: '#dc2626', bg: '#fef2f2' },
  'In Review':{ color: '#d97706', bg: '#fffbeb' },
};

function Badge({ status }) {
  const s = STATUS_COLOR[status] ?? { color: '#6b7280', bg: '#f9fafb' };
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.color}`,
    }}>
      {status ?? '—'}
    </span>
  );
}

// ── Modal de nueva verificación ───────────────────────────────────────────────
function NewClientModal({ onClose, onSaved }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480,
        maxHeight: '90vh', overflow: 'auto', padding: 24, position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none', fontSize: 20,
            cursor: 'pointer', color: '#6b7280',
          }}
        >✕</button>
        <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>Nuevo cliente</h2>
        <Suspense fallback={<p style={{ color: '#6b7280' }}>Cargando verificación...</p>}>
          <IneVerification onClientSaved={(client) => { onSaved(client); onClose(); }} />
        </Suspense>
      </div>
    </div>
  );
}

// ── Vista de detalle de cliente ───────────────────────────────────────────────
function ClientDetail({ client, onBack }) {
  return (
    <div>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: 14, marginBottom: 20 }}>
        ← Volver a clientes
      </button>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>{client.full_name ?? 'Sin nombre'}</h2>
            <div style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Cliente #{client.id}</div>
          </div>
          <Badge status={client.verification_status} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            ['CURP', client.curp],
            ['Fecha de nacimiento', client.date_of_birth?.split('T')[0]],
            ['Género', client.gender === 'M' ? 'Masculino' : client.gender === 'F' ? 'Femenino' : client.gender],
            ['N° Documento', client.document_number],
            ['Vigencia INE', client.expiration_date?.split('T')[0]],
            ['Estado emisor', client.issuing_state],
            ['Verificación INE', client.id_verification_status],
            ['Liveness', client.liveness_status],
            ['Face Match', client.face_match_status],
            ['Score face match', client.face_match_score != null ? `${client.face_match_score}%` : null],
          ].map(([label, value]) => value ? (
            <div key={label}>
              <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
            </div>
          ) : null)}
        </div>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f3f4f6', fontSize: 12, color: '#9ca3af' }}>
          Registrado el {new Date(client.created_at).toLocaleString('es-MX')}
          {client.agent_name && ` · por ${client.agent_name}`}
        </div>
      </div>
    </div>
  );
}

// ── Página principal de clientes ──────────────────────────────────────────────
export default function Clients() {
  const [clients, setClients]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState('');

  async function loadClients() {
    setLoading(true);
    const res = await apiFetch('/api/clients');
    if (res.ok) setClients(await res.json());
    setLoading(false);
  }

  useEffect(() => { loadClients(); }, []);

  function handleSaved(client) {
    setClients(prev => [client, ...prev]);
  }

  if (selected) return (
    <div style={{ padding: 32 }}>
      <ClientDetail client={selected} onBack={() => setSelected(null)} />
    </div>
  );

  const filtered = clients.filter(c =>
    !search || c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.curp?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, color: '#111827' }}>Clientes</h1>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 13 }}>
            {clients.length} cliente{clients.length !== 1 ? 's' : ''} registrado{clients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 20px', background: '#1e3a5f', color: '#fff',
            border: 'none', borderRadius: 8, fontWeight: 700,
            fontSize: 14, cursor: 'pointer',
          }}
        >
          + Nuevo cliente
        </button>
      </div>

      {/* Buscador */}
      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Buscar por nombre o CURP..."
        style={{
          width: '100%', maxWidth: 360, padding: '9px 14px',
          border: '1px solid #d1d5db', borderRadius: 8,
          fontSize: 13, marginBottom: 16, boxSizing: 'border-box',
        }}
      />

      {/* Tabla */}
      {loading ? (
        <p style={{ color: '#6b7280' }}>Cargando...</p>
      ) : filtered.length === 0 ? (
        <div style={{
          background: '#fff', borderRadius: 12, padding: 48,
          textAlign: 'center', color: '#9ca3af',
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>👥</div>
          <p style={{ margin: 0 }}>
            {search ? 'No se encontraron resultados' : 'Aún no hay clientes. Agrega el primero.'}
          </p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                {['Nombre', 'CURP', 'F. Nacimiento', 'Estado', 'Registrado', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 11 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f3f4f6' : 'none' }}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{c.full_name ?? '—'}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12 }}>{c.curp ?? '—'}</td>
                  <td style={{ padding: '14px 16px', color: '#6b7280' }}>{c.date_of_birth?.split('T')[0] ?? '—'}</td>
                  <td style={{ padding: '14px 16px' }}><Badge status={c.verification_status} /></td>
                  <td style={{ padding: '14px 16px', color: '#6b7280' }}>
                    {new Date(c.created_at).toLocaleDateString('es-MX')}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => setSelected(c)}
                      style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: 12 }}
                    >
                      Ver detalle →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <NewClientModal onClose={() => setShowModal(false)} onSaved={handleSaved} />
      )}
    </div>
  );
}
