import { useState, useEffect, useCallback } from 'react';
import SessionResult from './components/SessionResult.jsx';

// Extrae datos del documento desde la respuesta de Didit
function extractDocData(apiData) {
  // Log para depuración — ver en DevTools → Console
  console.log('🔍 Didit API response completo:', JSON.stringify(apiData, null, 2));

  const idv = apiData?.id_verifications?.[0];
  const fm  = apiData?.face_matches?.[0];
  const lv  = apiData?.liveness_checks?.[0];

  // Didit puede anidar el OCR en distintos sub-campos
  const doc =
    idv?.ocr_result         ??
    idv?.document_data      ??
    idv?.extracted_data     ??
    idv?.data               ??
    idv?.result             ??
    idv?.fields             ??
    idv ?? {};

  console.log('📄 idv:', JSON.stringify(idv, null, 2));
  console.log('📋 doc:', JSON.stringify(doc, null, 2));

  // Nombre: puede venir junto o separado
  const fullName =
    doc.full_name      ??
    doc.name           ??
    doc.fullName       ??
    ((doc.first_name || doc.given_name || doc.firstName)
      ? `${doc.first_name ?? doc.given_name ?? doc.firstName ?? ''} ${doc.last_name ?? doc.surname ?? doc.lastName ?? ''}`.trim()
      : '');

  return {
    full_name:            fullName,
    date_of_birth:        doc.date_of_birth    ?? doc.birth_date   ?? doc.dateOfBirth  ?? doc.dob         ?? '',
    curp:                 doc.curp             ?? doc.personal_number ?? doc.personalNumber ?? doc.id_number ?? '',
    document_number:      doc.document_number  ?? doc.documentNumber ?? doc.id          ?? doc.folio       ?? '',
    gender:               doc.gender           ?? doc.sex           ?? '',
    expiration_date:      doc.expiration_date  ?? doc.expiry_date   ?? doc.expiryDate   ?? doc.validity    ?? '',
    issuing_state:        doc.issuing_state    ?? doc.state         ?? doc.issuingState ?? doc.issued_by   ?? '',
    id_verification_status: idv?.status        ?? '',
    liveness_status:      lv?.status           ?? '',
    face_match_status:    fm?.status           ?? '',
    face_match_score:     fm?.similarity_score ?? fm?.score         ?? null,
  };
}

// Formulario pre-llenado que el agente revisa antes de guardar
function ClientForm({ sessionId, verificationData, onSaved, onCancel }) {
  const defaults = extractDocData(verificationData);
  const [form, setForm] = useState(defaults);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function field(label, key, type = 'text') {
    return (
      <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
          {label}
        </label>
        <input
          type={type}
          value={form[key] ?? ''}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          style={{
            padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6,
            fontSize: 13, fontFamily: 'inherit',
          }}
        />
      </div>
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // Determina el estado global desde los datos de Didit
      const globalStatus = verificationData?.status ?? verificationData?.decision ?? 'In Review';

      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          didit_session_id: sessionId,
          verification_status: globalStatus,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `Error ${res.status}`);
      onSaved(data);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{
        background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10,
        padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#15803d',
      }}>
        ✅ Verificación exitosa — revisa y confirma los datos del cliente
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {field('Nombre completo',    'full_name')}
        {field('CURP',               'curp')}
        {field('Fecha de nacimiento','date_of_birth', 'date')}
        {field('Género (M/F)',       'gender')}
        {field('N° Documento',       'document_number')}
        {field('Vigencia INE',       'expiration_date', 'date')}
        {field('Estado emisor',      'issuing_state')}

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #f87171', borderRadius: 8,
            padding: '8px 12px', fontSize: 13, color: '#b91c1c',
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            type="button" onClick={onCancel}
            style={{
              flex: 1, padding: '10px', background: '#f3f4f6', color: '#374151',
              border: '1px solid #d1d5db', borderRadius: 8, fontWeight: 600,
              fontSize: 14, cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            type="submit" disabled={saving}
            style={{
              flex: 2, padding: '10px', background: saving ? '#9ca3af' : '#1e3a5f',
              color: '#fff', border: 'none', borderRadius: 8,
              fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Guardando...' : '💾 Guardar cliente'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function IneVerification({ onClientSaved }) {
  const [state, setState] = useState('idle');   // idle | loading | verifying | fetching | done | error
  const [sessionUrl, setSessionUrl] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Escucha el postMessage que manda verification-done.html
  const onMessage = useCallback(async (e) => {
    if (e.data?.type !== 'didit-complete') return;
    const { sessionId: sid } = e.data;
    console.log('Didit callback recibido:', sid);
    setState('fetching');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/session/${sid}/result`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `Error ${res.status}`);
      setResult(data);
      setSessionId(sid);
      setState('done');
    } catch (err) {
      setError(`Error obteniendo resultado: ${err.message}`);
      setState('error');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onMessage]);

  async function startVerification() {
    setState('loading');
    setError(null);
    try {
      const callback = `${window.location.origin}/verification-done.html`;
      const token = localStorage.getItem('token');
      const res = await fetch('/api/start-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ callback }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `Error ${res.status}`);
      setSessionUrl(data.url);
      setSessionId(data.session_id);
      setState('verifying');
    } catch (err) {
      setError(`No se pudo iniciar la verificación: ${err.message}`);
      setState('error');
    }
  }

  function reset() {
    setState('idle');
    setSessionUrl(null);
    setSessionId(null);
    setResult(null);
    setError(null);
  }

  // ── Iframe a pantalla completa ──────────────────────────────────────────────
  if (state === 'verifying') {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#000', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 16px', background: '#111', color: '#fff',
        }}>
          <span style={{ fontSize: 14 }}>🪪 Verificación de identidad</span>
          <button
            onClick={reset}
            style={{
              background: 'none', border: '1px solid #444', color: '#fff',
              padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13,
            }}
          >
            ✕ Cancelar
          </button>
        </div>
        <iframe
          src={sessionUrl}
          style={{ flex: 1, border: 'none', width: '100%' }}
          allow="camera; microphone; fullscreen; autoplay; encrypted-media"
          title="Verificación Didit"
        />
      </div>
    );
  }

  // ── Cargando resultado ──────────────────────────────────────────────────────
  if (state === 'fetching') {
    return (
      <div style={{
        maxWidth: 400, margin: '0 auto', padding: 40,
        fontFamily: 'system-ui, sans-serif', textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <p style={{ color: '#4b5563', fontSize: 14 }}>Obteniendo resultado de verificación...</p>
      </div>
    );
  }

  // ── Resultado + formulario de cliente (modo inmobiliaria) ───────────────────
  if (state === 'done' && result && onClientSaved) {
    return (
      <ClientForm
        sessionId={sessionId}
        verificationData={result}
        onSaved={onClientSaved}
        onCancel={reset}
      />
    );
  }

  // ── Resultado standalone (modo demo sin guardar) ────────────────────────────
  if (state === 'done' && result) {
    return <SessionResult data={result} onReset={reset} />;
  }

  // ── Pantalla inicial / error ────────────────────────────────────────────────
  return (
    <div style={{
      maxWidth: 400, margin: '0 auto', padding: 32,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#fff', borderRadius: 16,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 56, marginBottom: 12 }}>🪪</div>
      <h2 style={{ margin: '0 0 8px', fontSize: 22 }}>Verificación de INE</h2>
      <p style={{ margin: '0 0 28px', color: '#6b7280', fontSize: 14, lineHeight: 1.6 }}>
        Verificamos la identidad del cliente usando su credencial de elector (INE) y una selfie.
        El proceso toma menos de 2 minutos.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
        {[
          { icon: '🪪', label: 'Foto de INE' },
          { icon: '🤳', label: 'Selfie' },
          { icon: '🔍', label: 'Liveness check' },
          { icon: '🔒', label: '100% seguro' },
        ].map(({ icon, label }) => (
          <div key={label} style={{
            background: '#f9fafb', borderRadius: 10, padding: '10px 8px',
            fontSize: 12, color: '#374151',
          }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
            {label}
          </div>
        ))}
      </div>

      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #f87171', borderRadius: 8,
          padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#b91c1c',
          textAlign: 'left',
        }}>
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={startVerification}
        disabled={state === 'loading'}
        style={{
          width: '100%', padding: '14px 24px',
          background: state === 'loading' ? '#9ca3af' : '#2563eb',
          color: '#fff', border: 'none', borderRadius: 10,
          fontWeight: 700, fontSize: 16, cursor: state === 'loading' ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {state === 'loading' ? '⏳ Iniciando...' : '🚀 Comenzar verificación'}
      </button>
    </div>
  );
}
