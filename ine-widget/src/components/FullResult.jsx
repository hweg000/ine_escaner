// Resultado combinado: OCR + DB Validation + Liveness

const STATUS_CFG = {
  Approved: { color: '#16a34a', bg: '#f0fdf4', icon: '✅' },
  Declined: { color: '#dc2626', bg: '#fef2f2', icon: '❌' },
  Skipped:  { color: '#6b7280', bg: '#f9fafb', icon: '⏭️' },
  Error:    { color: '#d97706', bg: '#fffbeb', icon: '⚠️' },
  default:  { color: '#d97706', bg: '#fffbeb', icon: '⚠️' },
};

function StatusBadge({ status, label }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.default;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.color}`,
      borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 700,
    }}>
      {cfg.icon} {label ?? status}
    </div>
  );
}

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: '1px solid #f0f0f0' }}>
      <span style={{ color: '#6b7280', minWidth: 150, fontSize: 12 }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: 12 }}>{value}</span>
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

export default function FullResult({ ineResult, livenessResult, onReset }) {
  const idv = ineResult?.id_verification;
  const db  = ineResult?.db_validation;
  const lv  = livenessResult?.liveness;

  // Veredicto global
  const allOk =
    idv?.status === 'Approved' &&
    (db?.status === 'Approved' || db?.status === 'Skipped') &&
    lv?.status === 'Approved';

  const anyDeclined =
    idv?.status === 'Declined' ||
    db?.status === 'Declined' ||
    lv?.status === 'Declined';

  const globalStatus = allOk ? 'Approved' : anyDeclined ? 'Declined' : 'Review';
  const globalCfg = globalStatus === 'Approved'
    ? { color: '#16a34a', bg: '#f0fdf4', icon: '✅', label: 'VERIFICACIÓN EXITOSA' }
    : globalStatus === 'Declined'
    ? { color: '#dc2626', bg: '#fef2f2', icon: '❌', label: 'VERIFICACIÓN FALLIDA' }
    : { color: '#d97706', bg: '#fffbeb', icon: '⚠️', label: 'REQUIERE REVISIÓN' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Veredicto global */}
      <div style={{
        background: globalCfg.bg, border: `2px solid ${globalCfg.color}`,
        borderRadius: 12, padding: '16px 20px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 40 }}>{globalCfg.icon}</div>
        <div style={{ color: globalCfg.color, fontWeight: 800, fontSize: 18, marginTop: 4 }}>
          {globalCfg.label}
        </div>
      </div>

      {/* Resumen de los 3 checks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <div style={{ textAlign: 'center', background: '#f9fafb', borderRadius: 10, padding: 10 }}>
          <div style={{ fontSize: 20 }}>🪪</div>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Documento</div>
          <StatusBadge status={idv?.status ?? 'Error'} label={idv?.status} />
        </div>
        <div style={{ textAlign: 'center', background: '#f9fafb', borderRadius: 10, padding: 10 }}>
          <div style={{ fontSize: 20 }}>🏛️</div>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Padrón INE</div>
          <StatusBadge status={db?.status ?? 'Error'} label={db?.status} />
        </div>
        <div style={{ textAlign: 'center', background: '#f9fafb', borderRadius: 10, padding: 10 }}>
          <div style={{ fontSize: 20 }}>🤳</div>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Liveness</div>
          <StatusBadge status={lv?.status ?? 'Error'} label={lv?.status} />
        </div>
      </div>

      {/* Datos del documento */}
      {idv && (
        <Card title="📋 Datos extraídos del documento">
          <Field label="Nombre" value={idv.full_name} />
          <Field label="Fecha de nacimiento" value={idv.date_of_birth} />
          <Field label="Edad" value={idv.age != null ? `${idv.age} años` : null} />
          <Field label="Género" value={idv.gender === 'M' ? 'Masculino' : idv.gender === 'F' ? 'Femenino' : idv.gender} />
          <Field label="CURP" value={idv.personal_number} />
          <Field label="N° documento" value={idv.document_number} />
          <Field label="Tipo" value={idv.document_type} />
          <Field label="Vigencia" value={idv.expiration_date} />
          <Field label="Estado emisor" value={idv.issuing_state_name} />
        </Card>
      )}

      {/* DB Validation */}
      {db && db.status !== 'Skipped' && (
        <Card title="🏛️ Validación contra padrón INE">
          <Field label="Estado" value={db.status} />
          <Field label="Tipo de match" value={db.match_type} />
          {db.validations?.[0]?.validation && (
            <>
              <Field label="Nombre (match)" value={db.validations[0].validation.full_name} />
              <Field label="Fecha nac. (match)" value={db.validations[0].validation.date_of_birth} />
              <Field label="CURP (match)" value={db.validations[0].validation.identification_number} />
            </>
          )}
          {db.reason && <Field label="Nota" value={db.reason} />}
        </Card>
      )}
      {db?.status === 'Skipped' && (
        <Card title="🏛️ Validación contra padrón INE">
          <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
            ⏭️ {db.reason ?? 'CURP no detectado — validación omitida'}
          </p>
        </Card>
      )}

      {/* Liveness */}
      {lv && (
        <Card title="🤳 Passive Liveness">
          <Field label="Estado" value={lv.status} />
          <Field label="Score" value={lv.score != null ? `${lv.score}/100` : null} />
          {lv.warnings?.filter(w => w.log_type === 'error').map((w, i) => (
            <div key={i} style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>
              ❌ {w.short_description}
            </div>
          ))}
        </Card>
      )}

      {/* Advertencias del documento */}
      {idv?.warnings?.length > 0 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fbbf24', borderRadius: 10, padding: '10px 14px' }}>
          <strong style={{ fontSize: 12, color: '#92400e' }}>⚠️ Advertencias del documento</strong>
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
          padding: '10px 20px', background: 'transparent',
          color: '#2563eb', border: '2px solid #2563eb',
          borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14,
        }}
      >
        ← Verificar otra INE
      </button>
    </div>
  );
}
