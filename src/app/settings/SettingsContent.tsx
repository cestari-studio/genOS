'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TextInput,
  PasswordInput,
  Button,
  Toggle,
  Select,
  SelectItem,
  Tile,
  InlineNotification,
  Slider,
  NumberInput,
  Tag,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
} from '@carbon/react';
import {
  Save,
  User,
  Settings,
  Notification,
  Security,
  WatsonHealthAiResults,
  Connect,
  Moon,
  Light,
  Password,
  TrashCan,
  Renew,
  CheckmarkFilled,
  ErrorFilled,
  WarningFilled,
} from '@carbon/icons-react';
import './settings.scss';

interface AIConfig {
  provider: 'claude' | 'gemini' | 'openai';
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
}

interface Integration {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'disconnected';
  connectedAt?: string;
}

export default function SettingsContent() {
  const { theme, toggleTheme } = useTheme();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    avatar: '',
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    language: 'pt-BR',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'America/Sao_Paulo',
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
    whatsapp: false,
    categories: {
      projects: true,
      briefings: true,
      invoices: true,
      team: true,
    },
  });

  // Security state
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  });

  // AI Config state
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    provider: 'claude',
    model: 'claude-3-5-sonnet',
    apiKey: '',
    temperature: 0.7,
    maxTokens: 2048,
  });

  // Integrations state
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'google-drive', name: 'Google Drive', icon: 'drive', status: 'disconnected' },
    { id: 'slack', name: 'Slack', icon: 'slack', status: 'disconnected' },
    { id: 'whatsapp', name: 'WhatsApp Business', icon: 'whatsapp', status: 'disconnected' },
    { id: 'stripe', name: 'Stripe', icon: 'stripe', status: 'disconnected' },
  ]);

  const [activeSessions, setActiveSessions] = useState([
    {
      id: '1',
      device: 'Chrome no macOS',
      location: 'São Paulo, SP',
      lastActive: 'Agora',
      ip: '192.168.1.1',
    },
  ]);

  // Fetch user data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // Get authenticated user
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          setError('Erro ao carregar dados do usuário');
          setLoading(false);
          return;
        }

        const authUserId = authData.user.id;

        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', authUserId)
          .single();

        if (userError) {
          console.error('Error fetching user:', userError);
          setError('Erro ao carregar perfil do usuário');
          setLoading(false);
          return;
        }

        // Fetch organization name if available
        let organizationName = '';
        if (userData.organization_id) {
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('name')
            .eq('id', userData.organization_id)
            .single();

          if (!orgError && orgData) {
            organizationName = orgData.name;
          }
        }

        // Update profile state
        setProfile({
          name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
          email: userData.email || authData.user.email || '',
          phone: userData.phone || '',
          company: organizationName,
          avatar: userData.avatar_url || '',
        });

        // Load notification preferences
        if (userData.notification_preferences) {
          setNotifications(userData.notification_preferences);
        }

        // Load AI config from localStorage
        const savedAiConfig = localStorage.getItem('genos-ai-config');
        if (savedAiConfig) {
          setAiConfig(JSON.parse(savedAiConfig));
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Erro ao carregar dados do usuário');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      setError(null);
      const supabase = createClient();

      // Get authenticated user
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        setError('Erro ao salvar: usuário não autenticado');
        return;
      }

      const authUserId = authData.user.id;

      // Parse name into first and last name
      const nameParts = profile.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Update user record
      const { error: updateError } = await supabase
        .from('users')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: profile.phone,
          notification_preferences: notifications,
        })
        .eq('auth_user_id', authUserId);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        setError('Erro ao salvar configurações');
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Erro ao salvar configurações');
    }
  };

  const handleSaveAiConfig = () => {
    localStorage.setItem('genos-ai-config', JSON.stringify(aiConfig));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = async () => {
    if (security.newPassword !== security.confirmPassword) {
      setError('As senhas não correspondem');
      return;
    }

    if (security.newPassword.length < 8) {
      setError('A nova senha deve ter no mínimo 8 caracteres');
      return;
    }

    try {
      setError(null);
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        password: security.newPassword,
      });

      if (updateError) {
        setError('Erro ao atualizar senha');
        return;
      }

      setSecurity({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: security.twoFactorEnabled,
      });
      setShowPasswordForm(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Erro ao atualizar senha');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Tem certeza? Esta ação é irreversível. Sua conta e todos os dados serão deletados.')) {
      return;
    }

    try {
      setError(null);
      const supabase = createClient();

      // Delete user data first
      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) {
        await supabase
          .from('users')
          .delete()
          .eq('auth_user_id', authData.user.id);
      }

      // Delete auth user
      await supabase.auth.admin.deleteUser(authData.user!.id);

      setSaved(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Erro ao deletar conta');
    }
  };

  const handleIntegrationConnect = (integrationId: string) => {
    setIntegrations(
      integrations.map((int) =>
        int.id === integrationId ? { ...int, status: 'connected', connectedAt: new Date().toISOString() } : int
      )
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleIntegrationDisconnect = (integrationId: string) => {
    setIntegrations(
      integrations.map((int) =>
        int.id === integrationId ? { ...int, status: 'disconnected', connectedAt: undefined } : int
      )
    );
  };

  const getAiModels = (provider: string) => {
    const models: { [key: string]: string[] } = {
      claude: ['claude-3-5-sonnet', 'claude-3-opus', 'claude-3-haiku'],
      gemini: ['gemini-2.0-pro', 'gemini-1.5-pro', 'gemini-1.5-flash'],
      openai: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    };
    return models[provider] || [];
  };

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1>Configurações</h1>
          <p>Gerencie suas preferências do sistema</p>
        </div>
        <p>Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Configurações</h1>
        <p>Gerencie suas preferências do sistema</p>
      </div>

      {error && (
        <InlineNotification
          kind="error"
          title="Erro"
          subtitle={error}
          hideCloseButton
          style={{ marginBottom: '1rem' }}
        />
      )}

      {saved && (
        <InlineNotification
          kind="success"
          title="Sucesso"
          subtitle="Configurações salvas com sucesso!"
          hideCloseButton
          style={{ marginBottom: '1rem' }}
        />
      )}

      <Tabs>
        <TabList aria-label="Configurações">
          <Tab renderIcon={User}>Perfil</Tab>
          <Tab renderIcon={Settings}>Preferências</Tab>
          <Tab renderIcon={Notification}>Notificações</Tab>
          <Tab renderIcon={Security}>Segurança</Tab>
          <Tab renderIcon={WatsonHealthAiResults}>Sistema / IA</Tab>
          <Tab renderIcon={Connect}>Integrações</Tab>
        </TabList>
        <TabPanels>
          {/* ===== TAB 1: PERFIL ===== */}
          <TabPanel>
            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Informações do Perfil</h3>
              <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
                <TextInput
                  id="name"
                  labelText="Nome Completo"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Seu nome"
                />
                <TextInput
                  id="email"
                  labelText="Email"
                  type="email"
                  value={profile.email}
                  disabled
                  placeholder="seu@email.com"
                />
                <TextInput
                  id="phone"
                  labelText="Telefone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="(11) 98765-4321"
                />
                <TextInput
                  id="company"
                  labelText="Empresa"
                  value={profile.company}
                  disabled
                  placeholder="Sua organização"
                />
                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--cds-ui-04)' }}>
                    Avatar
                  </h4>
                  <Button kind="secondary" size="sm">
                    Enviar Foto
                  </Button>
                </div>
                <Button renderIcon={Save} onClick={handleSave} style={{ marginTop: '1rem' }}>
                  Salvar Alterações
                </Button>
              </div>
            </Tile>
          </TabPanel>

          {/* ===== TAB 2: PREFERÊNCIAS ===== */}
          <TabPanel>
            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Preferências do Sistema</h3>
              <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {theme === 'dark' ? <Moon size={20} /> : <Light size={20} />}
                    <label style={{ fontSize: '0.875rem' }}>Modo Escuro</label>
                  </div>
                  <Toggle
                    id="darkMode"
                    labelA="Desativado"
                    labelB="Ativado"
                    toggled={theme === 'dark'}
                    onToggle={toggleTheme}
                  />
                </div>

                <Select
                  id="language"
                  labelText="Idioma"
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                >
                  <SelectItem value="pt-BR" text="Português (Brasil)" />
                  <SelectItem value="en-US" text="English (US)" />
                  <SelectItem value="es" text="Español" />
                </Select>

                <Select
                  id="dateFormat"
                  labelText="Formato de Data"
                  value={preferences.dateFormat}
                  onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                >
                  <SelectItem value="DD/MM/YYYY" text="DD/MM/YYYY" />
                  <SelectItem value="MM/DD/YYYY" text="MM/DD/YYYY" />
                  <SelectItem value="YYYY-MM-DD" text="YYYY-MM-DD" />
                </Select>

                <Select
                  id="timezone"
                  labelText="Fuso Horário"
                  value={preferences.timezone}
                  onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                >
                  <SelectItem value="America/Sao_Paulo" text="São Paulo (UTC-3)" />
                  <SelectItem value="America/New_York" text="Nova York (UTC-5)" />
                  <SelectItem value="Europe/London" text="Londres (UTC+0)" />
                  <SelectItem value="Asia/Tokyo" text="Tóquio (UTC+9)" />
                </Select>

                <Button renderIcon={Save} onClick={handleSave} style={{ marginTop: '1rem' }}>
                  Salvar Preferências
                </Button>
              </div>
            </Tile>
          </TabPanel>

          {/* ===== TAB 3: NOTIFICAÇÕES ===== */}
          <TabPanel>
            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Canais de Notificação</h3>
              <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
                <Toggle
                  id="emailNotifications"
                  labelText="Notificações por Email"
                  labelA="Desativado"
                  labelB="Ativado"
                  toggled={notifications.email}
                  onToggle={(checked) => setNotifications({ ...notifications, email: checked })}
                />
                <Toggle
                  id="inAppNotifications"
                  labelText="Notificações no App"
                  labelA="Desativado"
                  labelB="Ativado"
                  toggled={notifications.inApp}
                  onToggle={(checked) => setNotifications({ ...notifications, inApp: checked })}
                />
                <Toggle
                  id="whatsappNotifications"
                  labelText="Notificações por WhatsApp"
                  labelA="Desativado"
                  labelB="Ativado"
                  toggled={notifications.whatsapp}
                  onToggle={(checked) => setNotifications({ ...notifications, whatsapp: checked })}
                />
              </div>
            </Tile>

            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Categorias</h3>
              <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
                <Toggle
                  id="projectsNotifications"
                  labelText="Notificações de Projetos"
                  labelA="Desativado"
                  labelB="Ativado"
                  toggled={notifications.categories.projects}
                  onToggle={(checked) =>
                    setNotifications({
                      ...notifications,
                      categories: { ...notifications.categories, projects: checked },
                    })
                  }
                />
                <Toggle
                  id="briefingsNotifications"
                  labelText="Notificações de Briefings"
                  labelA="Desativado"
                  labelB="Ativado"
                  toggled={notifications.categories.briefings}
                  onToggle={(checked) =>
                    setNotifications({
                      ...notifications,
                      categories: { ...notifications.categories, briefings: checked },
                    })
                  }
                />
                <Toggle
                  id="invoicesNotifications"
                  labelText="Notificações de Faturas"
                  labelA="Desativado"
                  labelB="Ativado"
                  toggled={notifications.categories.invoices}
                  onToggle={(checked) =>
                    setNotifications({
                      ...notifications,
                      categories: { ...notifications.categories, invoices: checked },
                    })
                  }
                />
                <Toggle
                  id="teamNotifications"
                  labelText="Notificações de Equipe"
                  labelA="Desativado"
                  labelB="Ativado"
                  toggled={notifications.categories.team}
                  onToggle={(checked) =>
                    setNotifications({
                      ...notifications,
                      categories: { ...notifications.categories, team: checked },
                    })
                  }
                />
                <Button renderIcon={Save} onClick={handleSave} style={{ marginTop: '1rem' }}>
                  Salvar Notificações
                </Button>
              </div>
            </Tile>
          </TabPanel>

          {/* ===== TAB 4: SEGURANÇA ===== */}
          <TabPanel>
            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Password size={20} />
                Alterar Senha
              </h3>
              {!showPasswordForm ? (
                <Button kind="secondary" onClick={() => setShowPasswordForm(true)}>
                  Alterar Senha
                </Button>
              ) : (
                <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
                  <PasswordInput
                    id="currentPassword"
                    labelText="Senha Atual"
                    value={security.currentPassword}
                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                  />
                  <PasswordInput
                    id="newPassword"
                    labelText="Nova Senha"
                    value={security.newPassword}
                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                  />
                  <PasswordInput
                    id="confirmPassword"
                    labelText="Confirmar Nova Senha"
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <Button kind="secondary" onClick={() => setShowPasswordForm(false)}>
                      Cancelar
                    </Button>
                    <Button renderIcon={Save} onClick={handleChangePassword}>
                      Atualizar Senha
                    </Button>
                  </div>
                </div>
              )}
            </Tile>

            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Autenticação de Dois Fatores</h3>
              <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
                <Toggle
                  id="twoFactorAuth"
                  labelText="Ativar 2FA"
                  labelA="Desativado"
                  labelB="Ativado"
                  toggled={security.twoFactorEnabled}
                  onToggle={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
                />
                <p style={{ fontSize: '0.875rem', color: 'var(--cds-ui-04)' }}>
                  Adicione uma camada extra de segurança à sua conta
                </p>
              </div>
            </Tile>

            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Sessões Ativas</h3>
              <StructuredListWrapper selection={false}>
                <StructuredListHead>
                  <StructuredListRow head>
                    <StructuredListCell head>Dispositivo</StructuredListCell>
                    <StructuredListCell head>Localização</StructuredListCell>
                    <StructuredListCell head>Último Acesso</StructuredListCell>
                  </StructuredListRow>
                </StructuredListHead>
                <StructuredListBody>
                  {activeSessions.map((session) => (
                    <StructuredListRow key={session.id}>
                      <StructuredListCell>{session.device}</StructuredListCell>
                      <StructuredListCell>{session.location}</StructuredListCell>
                      <StructuredListCell>{session.lastActive}</StructuredListCell>
                    </StructuredListRow>
                  ))}
                </StructuredListBody>
              </StructuredListWrapper>
            </Tile>

            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#da1e28', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <WarningFilled size={20} />
                Zona de Perigo
              </h3>
              <p style={{ color: 'var(--cds-ui-04)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                As ações nesta seção são irreversíveis. Por favor, tome cuidado.
              </p>
              <Button kind="danger" renderIcon={TrashCan} onClick={handleDeleteAccount}>
                Deletar Conta
              </Button>
            </Tile>
          </TabPanel>

          {/* ===== TAB 5: SISTEMA / IA ===== */}
          <TabPanel>
            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <WatsonHealthAiResults size={20} />
                Configuração de IA
              </h3>
              <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
                <Select
                  id="aiProvider"
                  labelText="Provedor de IA"
                  value={aiConfig.provider}
                  onChange={(e) => {
                    const newProvider = e.target.value as 'claude' | 'gemini' | 'openai';
                    setAiConfig({
                      ...aiConfig,
                      provider: newProvider,
                      model: getAiModels(newProvider)[0],
                    });
                  }}
                >
                  <SelectItem value="claude" text="Anthropic Claude" />
                  <SelectItem value="gemini" text="Google Gemini" />
                  <SelectItem value="openai" text="OpenAI GPT" />
                </Select>

                <Select
                  id="aiModel"
                  labelText="Modelo"
                  value={aiConfig.model}
                  onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })}
                >
                  {getAiModels(aiConfig.provider).map((model) => (
                    <SelectItem key={model} value={model} text={model} />
                  ))}
                </Select>

                <PasswordInput
                  id="apiKey"
                  labelText="Chave da API"
                  value={aiConfig.apiKey}
                  onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
                  placeholder="Sua chave de API (mascarada)"
                />

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    Temperatura: {aiConfig.temperature.toFixed(2)}
                  </label>
                  <Slider
                    min={0}
                    max={2}
                    step={0.1}
                    value={aiConfig.temperature}
                    onChange={({ value }: { value: number }) => setAiConfig({ ...aiConfig, temperature: value })}
                    labelText="Controla a criatividade das respostas"
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--cds-ui-04)', marginTop: '0.5rem' }}>
                    0 = Determinístico, 2 = Criativo
                  </p>
                </div>

                <NumberInput
                  id="maxTokens"
                  label="Máximo de Tokens"
                  value={aiConfig.maxTokens}
                  onChange={(_e: unknown, { value }: { value: number | string }) => {
                    setAiConfig({ ...aiConfig, maxTokens: typeof value === 'number' ? value : parseInt(String(value)) || aiConfig.maxTokens });
                  }}
                  min={100}
                  max={8192}
                />

                <Button renderIcon={Save} onClick={handleSaveAiConfig} style={{ marginTop: '1rem' }}>
                  Salvar Configuração de IA
                </Button>
              </div>
            </Tile>

            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Informações da IA Ativa</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--cds-ui-04)' }}>Provedor</p>
                  <Tag type="blue">{aiConfig.provider.toUpperCase()}</Tag>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--cds-ui-04)' }}>Modelo</p>
                  <p style={{ fontSize: '0.975rem' }}>{aiConfig.model}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--cds-ui-04)' }}>Status da Chave</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {aiConfig.apiKey ? (
                      <>
                        <CheckmarkFilled size={16} style={{ color: '#24a148' }} />
                        <span>Configurada</span>
                      </>
                    ) : (
                      <>
                        <ErrorFilled size={16} style={{ color: '#da1e28' }} />
                        <span>Não configurada</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Tile>
          </TabPanel>

          {/* ===== TAB 6: INTEGRAÇÕES ===== */}
          <TabPanel>
            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Connect size={20} />
                Integrações Externas
              </h3>
              <p style={{ color: 'var(--cds-ui-04)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                Conecte ferramentas externas para potencializar sua produtividade
              </p>
            </Tile>

            {integrations.map((integration) => (
              <Tile key={integration.id} style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>{integration.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {integration.status === 'connected' ? (
                        <>
                          <CheckmarkFilled size={16} style={{ color: '#24a148' }} />
                          <span style={{ fontSize: '0.875rem', color: '#24a148' }}>
                            Conectado
                            {integration.connectedAt && ` em ${new Date(integration.connectedAt).toLocaleDateString('pt-BR')}`}
                          </span>
                        </>
                      ) : (
                        <>
                          <ErrorFilled size={16} style={{ color: '#8d8d8d' }} />
                          <span style={{ fontSize: '0.875rem', color: 'var(--cds-ui-04)' }}>Não conectado</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {integration.status === 'disconnected' ? (
                      <Button
                        kind="secondary"
                        size="sm"
                        renderIcon={Connect}
                        onClick={() => handleIntegrationConnect(integration.id)}
                      >
                        Conectar
                      </Button>
                    ) : (
                      <Button
                        kind="danger--tertiary"
                        size="sm"
                        onClick={() => handleIntegrationDisconnect(integration.id)}
                      >
                        Desconectar
                      </Button>
                    )}
                  </div>
                </div>
              </Tile>
            ))}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
