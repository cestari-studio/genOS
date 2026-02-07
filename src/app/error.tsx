'use client';

import { useEffect, useState } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error('[genOS Error Boundary]', error);
  }, [error]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)',
        padding: '2rem',
        textAlign: 'center',
        gap: '1rem',
        fontFamily: "'IBM Plex Sans', sans-serif",
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
          color: '#fff',
          fontSize: '28px',
          marginBottom: '1rem',
        }}
      >
        !
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
        Algo deu errado
      </h2>
      <p style={{ color: '#525252', maxWidth: '480px', lineHeight: 1.5 }}>
        Ocorreu um erro inesperado. Tente recarregar a página.
      </p>

      {/* Debug info - show error details */}
      <div style={{ marginTop: '1rem', width: '100%', maxWidth: '600px' }}>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: 'none',
            border: '1px solid #e0e0e0',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#525252',
            borderRadius: '4px',
          }}
        >
          {showDetails ? 'Ocultar detalhes' : 'Mostrar detalhes do erro'}
        </button>

        {showDetails && (
          <div
            style={{
              marginTop: '0.75rem',
              textAlign: 'left',
              background: '#262626',
              color: '#f4f4f4',
              padding: '1rem',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: "'IBM Plex Mono', monospace",
              overflow: 'auto',
              maxHeight: '300px',
              wordBreak: 'break-word',
            }}
          >
            <div style={{ color: '#fa4d56', marginBottom: '0.5rem', fontWeight: 600 }}>
              {error.name}: {error.message}
            </div>
            {error.digest && (
              <div style={{ color: '#78a9ff', marginBottom: '0.5rem' }}>
                Digest: {error.digest}
              </div>
            )}
            {error.stack && (
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#c6c6c6', fontSize: '11px' }}>
                {error.stack}
              </pre>
            )}
          </div>
        )}
      </div>

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
            color: '#0f62fe',
            border: '1px solid #0f62fe',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'inherit',
          }}
        >
          Ir ao Dashboard
        </button>
      </div>
    </div>
  );
}
