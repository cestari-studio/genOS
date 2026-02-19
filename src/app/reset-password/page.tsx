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
import { useTranslation } from '@/lib/i18n/context';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { t } = useTranslation();
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
      setError(t('resetPassword.passwordsMismatch'));
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError(t('resetPassword.passwordMinLength'));
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
          <p>{t('resetPassword.title')}</p>
        </div>

        <ProgressIndicator currentIndex={step} style={{ marginBottom: '2rem' }}>
          <ProgressStep label={t('resetPassword.stepLinkSent')} />
          <ProgressStep label={t('resetPassword.stepNewPassword')} />
          <ProgressStep label={t('resetPassword.stepCompleted')} />
        </ProgressIndicator>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <Checkmark size={48} style={{ color: 'var(--cds-support-success)', marginBottom: '1rem' }} />
            <InlineNotification
              kind="success"
              title={t('resetPassword.success')}
              subtitle={t('resetPassword.redirecting')}
              hideCloseButton
            />
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Stack gap={6}>
              {error && (
                <InlineNotification
                  kind="error"
                  title={t('login.errorTitle')}
                  subtitle={error}
                  hideCloseButton
                />
              )}

              <PasswordInput
                id="password"
                name="password"
                labelText={t('resetPassword.password')}
                placeholder={t('resetPassword.minCharsPlaceholder')}
                required
              />

              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                labelText={t('resetPassword.confirm')}
                placeholder={t('resetPassword.retypePlaceholder')}
                required
              />

              <Button
                type="submit"
                renderIcon={Password}
                disabled={loading}
                style={{ width: '100%', maxWidth: 'none' }}
              >
                {loading ? t('resetPassword.submitting') : t('resetPassword.submit')}
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
