// Muestra el resultado de una sesión de Workflow de Didit

const STATUS_CFG = {
  Approved:  { color: '#16a34a', bg: '#f0fdf4', icon: '✅' },
  Declined:  { color: '#dc2626', bg: '#fef2f2', icon: '❌' },
  'In Review': { color: '#d97706', bg: '#fffbeb', icon: '⏳' },
  default:   { color: '#6b7280', bg: '#f9fafb', icon: '❓' },
};

function cfg(status) {
  return STATUS_CFG[status] ?? STATUS_CFG.default;
}

function Badge({ status }) {
  const c = cfg(status);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: c.bg, color: c.color,
      border: `1px solid ${c.color}`,
      borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700,
    }}>
      {c.icon} {status}
    </span>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ color: '#6b7280', minWidth: 140, fontSize: 12, flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: 12, wordBreak: 'break-all' }}>{value}</span>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb',
      borderRadius: 12, padding: '14px 16px',
    }}>
      <h3 style={{ margin: '0 0 10px', fontSize: 13, color: '#374151' }}>{title}</h3>
      {children}
    </div>
  );
}

export default function SessionResult({ data, onReset }) {
  // La Sessions API devuelve arrays con nombres en plural
  const idv = data?.id_verifications?.[0];
  const lv  = data?.liveness_checks?.[0];
  const fm  = data?.face_matches?.[0];
  const ip  = data?.ip_analyses?.[0];

  const globalStatus = data?.status ?? 'Unknown';
  const globalCfg = cfg(globalStatus);

  return (
    <div style={{
      maxWidth: 480, margin: '0 auto', padding: '20px 16px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      {/* Veredicto global */}
      <div style={{
        background: globalCfg.bg, border: `2px solid ${globalCfg.color}`,
        borderRadius: 14, padding: '20px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 48 }}>{globalCfg.icon}</div>
        <div style={{ color: globalCfg.color, fontWeight: 800, fontSize: 20, marginTop: 6 }}>
          {globalStatus === 'Approved' ? 'VERIFICACIÓN EXITOSA'
            : globalStatus === 'Declined' ? 'VERIFICACIÓN FALLIDA'
            : globalStatus === 'In Review' ? 'EN REVISIÓN MANUAL'
            : globalStatus.toUpperCase()}
        </div>
        {data?.session_id && (
          <div style={{ fontSize: 10, color: globalCfg.color, marginTop: 4, opacity: 0.7 }}>
            ID: {data.session_id}
          </div>
        )}
      </div>

      {/* Resumen de checks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {[
          { icon: '🪪', label: 'INE', status: idv?.status },
          { icon: '🤳', label: 'Liveness', status: lv?.status },
          { icon: '👤', label: 'Face Match', status: fm?.status },
          { icon: '🌐', label: 'IP', status: ip?.status },
        ].map(({ icon, label, status }) => (
          <div key={label} style={{
            textAlign: 'center', background: '#f9fafb',
            borderRadius: 10, padding: '8px 4px',
          }}>
            <div style={{ fontSize: 18 }}>{icon}</div>
            <div style={{ fontSize: 10, color: '#6b7280', margin: '2px 0' }}>{label}</div>
            <div style={{ fontSize: 16 }}>{cfg(status ?? 'default').icon}</div>
          </div>
        ))}
      </div>

      {/* Datos del documento */}
      {idv && (
        <Card title="📋 Documento">
          <Row label="Nombre" value={idv.full_name} />
          <Row label="Fecha de nacimiento" value={idv.date_of_birth} />
          <Row label="Edad" value={idv.age != null ? `${idv.age} años` : null} />
          <Row label="Género" value={idv.gender === 'M' ? 'Masculino' : idv.gender === 'F' ? 'Femenino' : idv.gender} />
          <Row label="CURP" value={idv.personal_number} />
          <Row label="N° documento" value={idv.document_number} />
          <Row label="Tipo" value={idv.document_type} />
          <Row label="Vigencia" value={idv.expiration_date} />
          <Row label="País emisor" value={idv.issuing_state_name} />
          <div style={{ marginTop: 6 }}><Badge status={idv.status} /></div>
        </Card>
      )}

      {/* Liveness */}
      {lv && (
        <Card title="🤳 Liveness">
          <Row label="Estado" value={lv.status} />
          <Row label="Score" value={lv.score != null ? `${lv.score}/100` : null} />
          <div style={{ marginTop: 6 }}><Badge status={lv.status} /></div>
        </Card>
      )}

      {/* Face Match */}
      {fm && (
        <Card title="👤 Face Match">
          <Row label="Estado" value={fm.status} />
          <Row label="Similitud" value={fm.score != null ? `${fm.score}%` : null} />
          <div style={{ marginTop: 6 }}><Badge status={fm.status} /></div>
        </Card>
      )}

      {/* Advertencias */}
      {idv?.warnings?.length > 0 && (
        <div style={{
          background: '#fffbeb', border: '1px solid #fbbf24',
          borderRadius: 10, padding: '10px 14px',
        }}>
          <strong style={{ fontSize: 12, color: '#92400e' }}>⚠️ Advertencias</strong>
          {idv.warnings.map((w, i) => (
            <div key={i} style={{ fontSize: 11, color: '#78350f', marginTop: 4 }}>
              {w.risk} — {w.short_description}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onReset}
        style={{
          padding: '11px 20px', background: 'transparent',
          color: '#2563eb', border: '2px solid #2563eb',
          borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14,
        }}
      >
        ← Verificar otra INE
      </button>
    </div>
  );
}
