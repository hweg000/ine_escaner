import { useRef, useState } from 'react';

export default function SelfieUploader({ onSubmit, loading }) {
  const [file, setFile] = useState(null);
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    onSubmit(file);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        onClick={() => inputRef.current.click()}
        style={{
          border: '2px dashed #ccc',
          borderRadius: 12,
          padding: 24,
          textAlign: 'center',
          cursor: 'pointer',
          background: file ? '#f0fdf4' : '#fafafa',
          minHeight: 160,
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
          accept="image/jpeg,image/png,image/webp"
          capture="user"
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files[0] || null)}
        />
        {file ? (
          <>
            <img
              src={URL.createObjectURL(file)}
              alt="selfie"
              style={{ maxHeight: 140, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }}
            />
            <span style={{ fontSize: 12, color: '#16a34a' }}>✓ {file.name}</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: 48 }}>🤳</span>
            <span style={{ fontWeight: 600 }}>Toma una selfie</span>
            <span style={{ fontSize: 12, color: '#888' }}>
              Asegúrate de que tu cara esté bien iluminada y centrada
            </span>
          </>
        )}
      </div>

      <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 12, color: '#6b7280', lineHeight: 1.8 }}>
        <li>Fondo neutro, sin reflejos</li>
        <li>Cara centrada y completa en la foto</li>
        <li>Sin lentes oscuros ni cubrebocas</li>
      </ul>

      <button
        type="submit"
        disabled={!file || loading}
        style={{
          padding: '12px 24px',
          background: !file || loading ? '#9ca3af' : '#7c3aed',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontWeight: 700,
          fontSize: 16,
          cursor: !file || loading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {loading ? '⏳ Analizando...' : '🔍 Verificar liveness'}
      </button>
    </form>
  );
}
