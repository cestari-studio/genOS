'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Form,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  InlineNotification,
} from '@carbon/react';
import { Login } from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/lib/i18n/context';

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message === 'Invalid login credentials'
        ? t('login.invalidCredentials')
        : authError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
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

        <TextInput
          id="email"
          name="email"
          labelText={t('login.email')}
          type="email"
          placeholder={t('login.emailPlaceholder')}
          required
        />

        <PasswordInput
          id="password"
          name="password"
          labelText={t('login.password')}
          placeholder={t('login.passwordPlaceholder')}
          required
        />

        <Button
          type="submit"
          renderIcon={Login}
          disabled={loading}
          style={{ width: '100%', maxWidth: 'none' }}
        >
          {loading ? t('login.submitting') : t('login.submit')}
        </Button>
      </Stack>
    </Form>
  );
}
