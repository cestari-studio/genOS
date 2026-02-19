'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Form,
  Stack,
  PasswordInput,
  Button,
  InlineNotification,
  ProgressIndicator,
  ProgressStep,
} from '@carbon/react';
import { Password, Checkmark } from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setStep(2);
    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      router.push('/login');
    }, 3000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>genOS</h1>
          <p>Redefinir Senha</p>
        </div>

        <ProgressIndicator currentIndex={step} style={{ marginBottom: '2rem' }}>
          <ProgressStep label="Link enviado" />
          <ProgressStep label="Nova senha" />
          <ProgressStep label="Concluído" />
        </ProgressIndicator>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <Checkmark size={48} style={{ color: 'var(--cds-support-success)', marginBottom: '1rem' }} />
            <InlineNotification
              kind="success"
              title="Senha alterada!"
              subtitle="Redirecionando para o login..."
              hideCloseButton
            />
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

              <PasswordInput
                id="password"
                name="password"
                labelText="Nova Senha"
                placeholder="Mínimo 8 caracteres"
                required
              />

              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                labelText="Confirmar Senha"
                placeholder="Digite novamente"
                required
              />

              <Button
                type="submit"
                renderIcon={Password}
                disabled={loading}
                style={{ width: '100%', maxWidth: 'none' }}
              >
                {loading ? 'Salvando...' : 'Redefinir Senha'}
              </Button>
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
