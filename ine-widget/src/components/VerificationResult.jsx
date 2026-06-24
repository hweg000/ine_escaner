const STATUS_CONFIG = {
  Approved: { color: '#16a34a', bg: '#f0fdf4', icon: '✅', label: 'INE VÁLIDA' },
  Declined: { color: '#dc2626', bg: '#fef2f2', icon: '❌', label: 'INE INVÁLIDA / RECHAZADA' },
  default:  { color: '#d97706', bg: '#fffbeb', icon: '⚠️', label: 'REVISIÓN REQUERIDA' },
};

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
      <span style={{ color: '#6b7280', minWidth: 140, fontSize: 13 }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: 13 }}>{value}</span>
    </div>
  );
}

export default function VerificationResult({ data, onReset }) {
  const idv = data?.id_verification;
  if (!idv) return null;

  const cfg = STATUS_CONFIG[idv.status] ?? STATUS_CONFIG.default;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Banner de estado */}
      <div
        style={{
          background: cfg.bg,
          border: `2px solid ${cfg.color}`,
          borderRadius: 12,
          padding: '16px 20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 36 }}>{cfg.icon}</div>
        <div style={{ color: cfg.color, fontWeight: 800, fontSize: 18, marginTop: 4 }}>
          {cfg.label}
        </div>
        <div style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>
          ID sesión: {data.request_id?.slice(0, 8)}…
        </div>
      </div>

      {/* Datos extraídos */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '16px 20px',
        }}
      >
        <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#374151' }}>
          📋 Datos extraídos
        </h3>
        <Field label="Nombre completo" value={idv.full_name} />
        <Field label="Fecha de nacimiento" value={idv.date_of_birth} />
        <Field label="Edad" value={idv.age != null ? `${idv.age} años` : null} />
        <Field label="Género" value={idv.gender === 'M' ? 'Masculino' : idv.gender === 'F' ? 'Femenino' : idv.gender} />
        <Field label="Tipo de documento" value={idv.document_type} />
        <Field label="Número de documento" value={idv.document_number} />
        <Field label="CURP / Número personal" value={idv.personal_number} />
        <Field label="Vigencia" value={idv.expiration_date} />
        <Field label="Emisión" value={idv.date_of_issue} />
        <Field label="País emisor" value={idv.issuing_state_name} />
        <Field label="Dirección" value={idv.address} />
      </div>

      {/* Advertencias */}
      {idv.warnings?.length > 0 && (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fbbf24',
            borderRadius: 12,
            padding: '12px 16px',
          }}
        >
          <h3 style={{ margin: '0 0 8px', fontSize: 13, color: '#92400e' }}>⚠️ Advertencias</h3>
          {idv.warnings.map((w, i) => (
            <div key={i} style={{ fontSize: 12, color: '#78350f', marginBottom: 4 }}>
              <strong>{w.risk}</strong> — {w.short_description}
            </div>
          ))}
        </div>
      )}

      {/* Botón de reinicio */}
      <button
        onClick={onReset}
        style={{
          padding: '10px 20px',
          background: 'transparent',
          color: '#2563eb',
          border: '2px solid #2563eb',
          borderRadius: 8,
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        ← Verificar otra INE
      </button>
    </div>
  );
}
