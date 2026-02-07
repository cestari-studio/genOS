'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextInput,
  PasswordInput,
  Button,
  InlineLoading,
  InlineNotification,
} from '@carbon/react';
import { ArrowRight, Checkmark } from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import './login.scss';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedEmail = localStorage.getItem('genos_remember_email');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email.trim()) {
      setErrors({ email: 'Email é obrigatório' });
      return;
    }

    if (!password) {
      setErrors({ password: 'Senha é obrigatória' });
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setLoading(false);
        if (authError.message.includes('Invalid login credentials')) {
          setErrors({ password: 'Email ou senha incorretos.' });
        } else if (authError.message.includes('Email not confirmed')) {
          setErrors({ general: 'Email não confirmado. Verifique sua caixa de entrada.' });
        } else {
          setErrors({ general: authError.message });
        }
        return;
      }

      localStorage.setItem('genos_remember_email', email);
      setSuccess(true);

      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 600);
    } catch {
      setLoading(false);
      setErrors({ general: 'Erro ao conectar. Tente novamente.' });
    }
  };

  if (success) {
    return (
      <div className={`login-page ${mounted ? 'login-page--mounted' : ''}`}>
        <div className="login-center">
          <div className="login-success">
            <div className="login-success__icon">
              <Checkmark size={32} />
            </div>
            <InlineLoading description="Entrando..." status="active" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`login-page ${mounted ? 'login-page--mounted' : ''}`}>
      <div className="login-center">
        <div className="login-logo">
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
            <rect x="4" y="4" width="14" height="14" rx="2" fill="#0f62fe"/>
            <rect x="22" y="4" width="14" height="14" rx="2" fill="#0f62fe"/>
            <rect x="4" y="22" width="14" height="14" rx="2" fill="#0f62fe"/>
            <rect x="22" y="22" width="14" height="14" rx="2" fill="#0f62fe" fillOpacity="0.4"/>
          </svg>
          <span>genOS</span>
        </div>

        {errors.general && (
          <InlineNotification
            kind="error"
            title=""
            subtitle={errors.general}
            onClose={() => setErrors(prev => ({ ...prev, general: undefined }))}
            lowContrast
            className="login-notification"
          />
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <TextInput
            id="email"
            labelText="Email"
            placeholder="seu@email.com"
            type="email"
            size="lg"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: undefined })); }}
            invalid={!!errors.email}
            invalidText={errors.email}
            autoComplete="email"
            autoFocus
          />

          <PasswordInput
            id="password"
            labelText="Senha"
            placeholder="••••••••"
            size="lg"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(prev => ({ ...prev, password: undefined })); }}
            invalid={!!errors.password}
            invalidText={errors.password}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            size="lg"
            disabled={loading || !email.trim() || !password}
            className="login-submit"
            renderIcon={loading ? undefined : ArrowRight}
          >
            {loading ? <InlineLoading description="Entrando..." status="active" /> : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  );
}
