'use client';

import { useEffect } from 'react';
import { Button } from '@carbon/react';
import { Renew, Home } from '@carbon/icons-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--cds-support-error, #da1e28)',
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
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--cds-text-primary, #161616)' }}>
        Algo deu errado
      </h2>
      <p style={{ color: 'var(--cds-text-secondary, #525252)', maxWidth: '480px', lineHeight: 1.5 }}>
        Ocorreu um erro inesperado. Tente recarregar a página ou voltar ao início.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        <Button kind="primary" renderIcon={Renew} onClick={() => reset()}>
          Tentar novamente
        </Button>
        <Button kind="tertiary" renderIcon={Home} href="/dashboard">
          Ir ao Dashboard
        </Button>
      </div>
    </div>
  );
}
