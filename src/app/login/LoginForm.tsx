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

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        ? 'Email ou senha incorretos'
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
            title="Erro"
            subtitle={error}
            hideCloseButton
          />
        )}

        <TextInput
          id="email"
          name="email"
          labelText="Email"
          type="email"
          placeholder="seu@email.com"
          required
        />

        <PasswordInput
          id="password"
          name="password"
          labelText="Senha"
          placeholder="Sua senha"
          required
        />

        <Button
          type="submit"
          renderIcon={Login}
          disabled={loading}
          style={{ width: '100%', maxWidth: 'none' }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </Stack>
    </Form>
  );
}
