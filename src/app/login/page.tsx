'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextInput,
  PasswordInput,
  Button,
  Checkbox,
  InlineLoading,
  InlineNotification,
  Link,
} from '@carbon/react';
import { 
  ArrowRight, 
  ArrowLeft,
  Information,
  Checkmark,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import './login.scss';

type LoginStep = 'email' | 'password' | 'loading' | 'success';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  // UI state
  const [step, setStep] = useState<LoginStep>('email');
  const [errors, setErrors] = useState<FormErrors>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for remembered email
    const savedEmail = localStorage.getItem('genos_remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // Email validation
  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  // Step 1: Continue with email
  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email.trim()) {
      setErrors({ email: 'Email é obrigatório' });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Formato de email inválido' });
      return;
    }

    // Save email if remember is checked
    if (rememberMe) {
      localStorage.setItem('genos_remember_email', email);
    } else {
      localStorage.removeItem('genos_remember_email');
    }

    setStep('password');
  };

  // Step 2: Login with password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!password) {
      setErrors({ password: 'Senha é obrigatória' });
      return;
    }

    if (password.length < 6) {
      setErrors({ password: 'Senha deve ter pelo menos 6 caracteres' });
      return;
    }

    setStep('loading');

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setStep('password');
        if (authError.message.includes('Invalid login credentials')) {
          setErrors({ password: 'Senha incorreta. Verifique e tente novamente.' });
        } else if (authError.message.includes('Email not confirmed')) {
          setErrors({ general: 'Email não confirmado. Verifique sua caixa de entrada.' });
        } else {
          setErrors({ general: authError.message });
        }
        return;
      }

      setStep('success');
      
      // Brief delay to show success state
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 800);
      
    } catch (err) {
      setStep('password');
      setErrors({ general: 'Erro ao conectar com o servidor. Tente novamente.' });
    }
  };

  // Go back to email step
  const handleBackToEmail = () => {
    setStep('email');
    setPassword('');
    setErrors({});
  };

  // Handle OAuth login
  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        setErrors({ general: `Erro ao conectar com ${provider}` });
      }
    } catch (err) {
      setErrors({ general: 'Erro ao iniciar autenticação' });
    }
  };

  // Feature list for brand side
  const features = [
    'Gestão completa de clientes e projetos',
    'Briefings e documentos centralizados',
    'IA Helian para automação inteligente',
    'Analytics e relatórios em tempo real',
  ];

  const stats = [
    { value: '50+', label: 'Clientes ativos' },
    { value: '200+', label: 'Projetos entregues' },
    { value: '99%', label: 'Satisfação' },
  ];

  return (
    <div className={`login-page ${mounted ? 'login-page--mounted' : ''}`}>
      {/* Brand Side */}
      <div className="login-brand">
        <div className="login-brand__background">
          <div className="login-brand__mesh"></div>
          <div className="login-brand__gradient"></div>
          <div className="login-brand__noise"></div>
        </div>
        
        <div className="login-brand__content">
          <div className="login-brand__logo">
            <div className="login-brand__logo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="4" y="4" width="14" height="14" rx="2" fill="white"/>
                <rect x="22" y="4" width="14" height="14" rx="2" fill="white"/>
                <rect x="4" y="22" width="14" height="14" rx="2" fill="white"/>
                <rect x="22" y="22" width="14" height="14" rx="2" fill="white" fillOpacity="0.5"/>
              </svg>
            </div>
            <span className="login-brand__name">genOS</span>
          </div>
          
          <div className="login-brand__hero">
            <h1 className="login-brand__title">
              Content Factory
              <span className="login-brand__subtitle">by Cestari Studio</span>
            </h1>
            
            <p className="login-brand__description">
              Plataforma inteligente para gestão de projetos criativos, 
              briefings e automação com IA.
            </p>
          </div>

          <ul className="login-brand__features">
            {features.map((feature, index) => (
              <li key={index} className="feature-item">
                <span className="feature-item__icon">
                  <Checkmark size={16} />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="login-brand__stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-item__value">{stat.value}</span>
                <span className="stat-item__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="login-brand__footer">
          <p>© 2025 Cestari Studio. Todos os direitos reservados.</p>
          <div className="login-brand__links">
            <a href="https://cestari.studio" target="_blank" rel="noopener noreferrer">Site</a>
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="login-form-container">
        <div className="login-form-wrapper">
          {/* Mobile Logo */}
          <div className="login-form__mobile-logo">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect x="4" y="4" width="14" height="14" rx="2" fill="#0f62fe"/>
              <rect x="22" y="4" width="14" height="14" rx="2" fill="#0f62fe"/>
              <rect x="4" y="22" width="14" height="14" rx="2" fill="#0f62fe"/>
              <rect x="22" y="22" width="14" height="14" rx="2" fill="#0f62fe" fillOpacity="0.5"/>
            </svg>
            <span>genOS</span>
          </div>

          {/* Form Header */}
          <div className="login-form__header">
            <h2>Log in</h2>
            {step === 'email' && (
              <p>
                Não tem uma conta?{' '}
                <Link href="https://cestari.studio/contato" target="_blank">
                  Solicite acesso
                </Link>
              </p>
            )}
            {step === 'password' && (
              <p>
                Entrando como <strong>{email}</strong>{' '}
                <Link href="#" onClick={(e) => { e.preventDefault(); handleBackToEmail(); }}>
                  Não é você?
                </Link>
              </p>
            )}
            {step === 'loading' && (
              <p>Verificando suas credenciais...</p>
            )}
            {step === 'success' && (
              <p>Autenticação bem-sucedida!</p>
            )}
          </div>

          {/* Error Notification */}
          {errors.general && (
            <InlineNotification
              kind="error"
              title="Erro"
              subtitle={errors.general}
              onClose={() => setErrors(prev => ({ ...prev, general: undefined }))}
              lowContrast
              className="login-form__notification"
            />
          )}

          {/* Step 1: Email Form */}
          {step === 'email' && (
            <form onSubmit={handleEmailContinue} className="login-form">
              <div className="login-form__field">
                <div className="login-form__field-header">
                  <span className="login-form__field-label">Email</span>
                  <Link href="#" className="login-form__field-link">
                    Esqueceu o email?
                  </Link>
                </div>
                <TextInput
                  id="email"
                  labelText=""
                  hideLabel
                  placeholder="seu@email.com"
                  type="email"
                  size="lg"
                  value={email}
                  onChange={handleEmailChange}
                  invalid={!!errors.email}
                  invalidText={errors.email}
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={!email.trim()}
                className="login-form__submit"
                renderIcon={ArrowRight}
              >
                Continuar
              </Button>

              <div className="login-form__remember">
                <Checkbox
                  id="remember"
                  labelText="Lembrar meu email"
                  checked={rememberMe}
                  onChange={(_, { checked }) => setRememberMe(checked)}
                />
                <button 
                  type="button" 
                  className="login-form__info-btn"
                  title="Seu email será salvo neste navegador"
                >
                  <Information size={16} />
                </button>
              </div>

              <div className="login-form__divider">
                <span>Logins alternativos</span>
              </div>

              <div className="login-form__oauth">
                <Button
                  kind="tertiary"
                  size="lg"
                  className="login-form__oauth-btn"
                  onClick={() => handleOAuthLogin('google')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continuar com Google
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Password Form */}
          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="login-form login-form--slide-in">
              <div className="login-form__field">
                <div className="login-form__field-header">
                  <span className="login-form__field-label">Senha</span>
                  <Link href="#" className="login-form__field-link">
                    Esqueceu a senha?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  labelText=""
                  hideLabel
                  placeholder="Digite sua senha"
                  size="lg"
                  value={password}
                  onChange={handlePasswordChange}
                  invalid={!!errors.password}
                  invalidText={errors.password}
                  autoComplete="current-password"
                  autoFocus
                />
              </div>

              <div className="login-form__actions">
                <Button
                  kind="ghost"
                  size="lg"
                  className="login-form__back"
                  renderIcon={ArrowLeft}
                  onClick={handleBackToEmail}
                  type="button"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={!password}
                  className="login-form__submit login-form__submit--flex"
                  renderIcon={ArrowRight}
                >
                  Log in
                </Button>
              </div>
            </form>
          )}

          {/* Loading State */}
          {step === 'loading' && (
            <div className="login-form__loading">
              <InlineLoading 
                description="Autenticando..." 
                status="active"
              />
            </div>
          )}

          {/* Success State */}
          {step === 'success' && (
            <div className="login-form__success">
              <div className="login-form__success-icon">
                <Checkmark size={32} />
              </div>
              <InlineLoading 
                description="Redirecionando..." 
                status="active"
              />
            </div>
          )}

          {/* Help Link */}
          <div className="login-form__help">
            <p>
              Precisa de ajuda?{' '}
              <Link href="mailto:suporte@cestari.studio">
                Contate o suporte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
