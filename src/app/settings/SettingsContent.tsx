'use client';

import { useState } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TextInput,
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
  const [profile, setProfile] = useState({
    name: 'Octavio Cestari',
    email: 'mail@cestari.studio',
    phone: '',
    company: 'Cestari Studio',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: false,
    language: 'pt-BR',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Configurações</h1>
        <p>Gerencie suas preferências do sistema</p>
      </div>

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
                  toggled={preferences.emailNotifications}
                  onToggle={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                />
                <Toggle
                  id="newClient"
                  labelText="Novos clientes"
                  labelA="Desativado"
                  labelB="Ativado"
                  defaultToggled={true}
                />
                <Toggle
                  id="newBriefing"
                  labelText="Novos briefings"
                  labelA="Desativado"
                  labelB="Ativado"
                  defaultToggled={true}
                />
                <Toggle
                  id="projectUpdates"
                  labelText="Atualizações de projetos"
                  labelA="Desativado"
                  labelB="Ativado"
                  defaultToggled={true}
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
                <TextInput.PasswordInput
                  id="currentPassword"
                  labelText="Senha Atual"
                />
                <TextInput.PasswordInput
                  id="newPassword"
                  labelText="Nova Senha"
                />
                <TextInput.PasswordInput
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
