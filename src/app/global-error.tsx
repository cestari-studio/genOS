'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
            background: '#161616',
            color: '#f4f4f4',
            textAlign: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#da1e28',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              marginBottom: '1rem',
            }}
          >
            !
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Erro Crítico</h2>
          <p style={{ color: '#c6c6c6', maxWidth: '480px', lineHeight: 1.5 }}>
            Ocorreu um erro inesperado no genOS. Tente recarregar a página.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              onClick={() => reset()}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#0f62fe',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            >
              Tentar novamente
            </button>
            <button
              onClick={() => (window.location.href = '/dashboard')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                color: '#78a9ff',
                border: '1px solid #78a9ff',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            >
              Ir ao Dashboard
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
