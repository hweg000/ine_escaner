import { useRef, useState } from 'react';

const ACCEPT = 'image/jpeg,image/png,image/webp';

function ImageBox({ label, file, onChange }) {
  const inputRef = useRef();

  return (
    <div
      onClick={() => inputRef.current.click()}
      style={{
        border: '2px dashed #ccc',
        borderRadius: 12,
        padding: 16,
        textAlign: 'center',
        cursor: 'pointer',
        background: file ? '#f0fdf4' : '#fafafa',
        transition: 'background 0.2s',
        minHeight: 140,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        style={{ display: 'none' }}
        onChange={(e) => onChange(e.target.files[0] || null)}
      />
      {file ? (
        <>
          <img
            src={URL.createObjectURL(file)}
            alt={label}
            style={{ maxHeight: 120, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }}
          />
          <span style={{ fontSize: 12, color: '#16a34a' }}>✓ {file.name}</span>
        </>
      ) : (
        <>
          <span style={{ fontSize: 32 }}>📷</span>
          <span style={{ fontWeight: 600 }}>{label}</span>
          <span style={{ fontSize: 12, color: '#888' }}>Haz clic para seleccionar imagen</span>
        </>
      )}
    </div>
  );
}

export default function IneUploader({ onSubmit, loading }) {
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!front) return;
    onSubmit({ front, back });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <ImageBox label="Frente de INE" file={front} onChange={setFront} />
        <ImageBox label="Reverso de INE" file={back} onChange={setBack} />
      </div>

      <p style={{ margin: 0, fontSize: 12, color: '#888', textAlign: 'center' }}>
        Asegúrate de que las 4 esquinas del documento sean visibles.
      </p>

      <button
        type="submit"
        disabled={!front || loading}
        style={{
          padding: '12px 24px',
          background: !front || loading ? '#9ca3af' : '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontWeight: 700,
          fontSize: 16,
          cursor: !front || loading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {loading ? '⏳ Verificando...' : '🔍 Verificar INE'}
      </button>
    </form>
  );
}
