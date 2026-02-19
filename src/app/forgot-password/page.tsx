'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Form,
  Stack,
  TextInput,
  Button,
  InlineNotification,
} from '@carbon/react';
import { ArrowLeft, Email } from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    const supabase = createClient();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>genOS</h1>
          <p>Recuperar Senha</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <InlineNotification
              kind="success"
              title="Email enviado!"
              subtitle="Verifique sua caixa de entrada para redefinir sua senha."
              hideCloseButton
            />
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--cds-link-primary)', textDecoration: 'none' }}>
              <ArrowLeft size={16} /> Voltar ao login
            </Link>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Stack gap={6}>
              {error && (
                <InlineNotification
                  kind="error"
                  title="Erro"
                  subtitle={error}
                  hideCloseButton
                />
              )}

              <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
                Digite seu email e enviaremos um link para redefinir sua senha.
              </p>

              <TextInput
                id="email"
                name="email"
                labelText="Email"
                type="email"
                placeholder="seu@email.com"
                required
              />

              <Button
                type="submit"
                renderIcon={Email}
                disabled={loading}
                style={{ width: '100%', maxWidth: 'none' }}
              >
                {loading ? 'Enviando...' : 'Enviar Link'}
              </Button>

              <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cds-link-primary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                <ArrowLeft size={16} /> Voltar ao login
              </Link>
            </Stack>
          </Form>
        )}
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--cds-background-inverse) 0%, #262626 100%);
        }
        .login-container {
          background: white;
          padding: 3rem;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 400px;
        }
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-header h1 {
          font-size: 2.5rem;
          font-weight: 600;
          color: var(--cds-text-primary);
          margin: 0;
        }
        .login-header p {
          color: var(--cds-text-secondary);
          margin: 0.5rem 0 0;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}
