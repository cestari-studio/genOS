'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
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
} from '@carbon/react';
import { Save, User, Settings, Notification, Security } from '@carbon/icons-react';

export default function SettingsContent() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: false,
    language: 'pt-BR',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    in_app: true,
    whatsapp: false,
  });

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
          email: userData.email || '',
          phone: userData.phone || '',
          company: organizationName,
        });

        // Update notification preferences
        if (userData.notification_preferences) {
          setNotifications(userData.notification_preferences);
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
        </TabList>
        <TabPanels>
          {/* Perfil */}
          <TabPanel>
            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Informações do Perfil</h3>
              <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
                <TextInput
                  id="name"
                  labelText="Nome"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
                <TextInput
                  id="email"
                  labelText="Email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
                <TextInput
                  id="phone"
                  labelText="Telefone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
                <TextInput
                  id="company"
                  labelText="Empresa"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                />
                <Button renderIcon={Save} onClick={handleSave} style={{ marginTop: '1rem' }}>
                  Salvar Alterações
                </Button>
              </div>
            </Tile>
          </TabPanel>

          {/* Preferências */}
          <TabPanel>
            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Preferências do Sistema</h3>
              <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
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
                <Toggle
                  id="darkMode"
                  labelText="Modo Escuro"
                  labelA="Desativado"
                  labelB="Ativado"
                  toggled={preferences.darkMode}
                  onToggle={(checked) => setPreferences({ ...preferences, darkMode: checked })}
                />
                <Button renderIcon={Save} onClick={handleSave} style={{ marginTop: '1rem' }}>
                  Salvar Preferências
                </Button>
              </div>
            </Tile>
          </TabPanel>

          {/* Notificações */}
          <TabPanel>
            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Configurações de Notificações</h3>
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
                  toggled={notifications.in_app}
                  onToggle={(checked) => setNotifications({ ...notifications, in_app: checked })}
                />
                <Toggle
                  id="whatsappNotifications"
                  labelText="Notificações por WhatsApp"
                  labelA="Desativado"
                  labelB="Ativado"
                  toggled={notifications.whatsapp}
                  onToggle={(checked) => setNotifications({ ...notifications, whatsapp: checked })}
                />
                <Button renderIcon={Save} onClick={handleSave} style={{ marginTop: '1rem' }}>
                  Salvar Notificações
                </Button>
              </div>
            </Tile>
          </TabPanel>

          {/* Segurança */}
          <TabPanel>
            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Segurança da Conta</h3>
              <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
                <PasswordInput
                  id="currentPassword"
                  labelText="Senha Atual"
                />
                <PasswordInput
                  id="newPassword"
                  labelText="Nova Senha"
                />
                <PasswordInput
                  id="confirmPassword"
                  labelText="Confirmar Nova Senha"
                />
                <Button renderIcon={Save} onClick={handleSave} style={{ marginTop: '1rem' }}>
                  Alterar Senha
                </Button>
              </div>
            </Tile>

            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#da1e28' }}>Zona de Perigo</h3>
              <p style={{ color: '#525252', marginBottom: '1rem' }}>
                Ações irreversíveis para sua conta.
              </p>
              <Button kind="danger">Excluir Conta</Button>
            </Tile>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
