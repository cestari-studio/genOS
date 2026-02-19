'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
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
  const { t } = useTranslation();
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
        <h1>{t('settings.title')}</h1>
        <p>{t('settings.subtitle')}</p>
      </div>

      {saved && (
        <InlineNotification
          kind="success"
          title={t('settings.savedSuccess')}
          subtitle={t('settings.savedMessage')}
          hideCloseButton
          style={{ marginBottom: '1rem' }}
        />
      )}

      <Tabs>
        <TabList aria-label={t('settings.title')}>
          <Tab renderIcon={User}>{t('settings.profile')}</Tab>
          <Tab renderIcon={Settings}>{t('settings.preferences')}</Tab>
          <Tab renderIcon={Notification}>{t('settings.notificationsTab')}</Tab>
          <Tab renderIcon={Security}>{t('settings.security')}</Tab>
        </TabList>
        <TabPanels>
          {/* Perfil */}
          <TabPanel>
            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>{t('settings.profileInfo')}</h3>
              <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
                <TextInput
                  id="name"
                  labelText={t('settings.name')}
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
                <TextInput
                  id="email"
                  labelText={t('settings.email')}
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
                <TextInput
                  id="phone"
                  labelText={t('settings.phone')}
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
                <TextInput
                  id="company"
                  labelText={t('settings.company')}
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                />
                <Button renderIcon={Save} onClick={handleSave} style={{ marginTop: '1rem' }}>
                  {t('settings.saveChanges')}
                </Button>
              </div>
            </Tile>
          </TabPanel>

          {/* Preferências */}
          <TabPanel>
            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>{t('settings.systemPreferences')}</h3>
              <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
                <Select
                  id="language"
                  labelText={t('settings.language')}
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                >
                  <SelectItem value="pt-BR" text={t('settings.languagePtBr')} />
                  <SelectItem value="en-US" text={t('settings.languageEn')} />
                  <SelectItem value="es" text={t('settings.languageEs')} />
                </Select>
                <Toggle
                  id="darkMode"
                  labelText={t('settings.darkMode')}
                  labelA={t('settings.disabled')}
                  labelB={t('settings.enabled')}
                  toggled={preferences.darkMode}
                  onToggle={(checked) => setPreferences({ ...preferences, darkMode: checked })}
                />
                <Button renderIcon={Save} onClick={handleSave} style={{ marginTop: '1rem' }}>
                  {t('settings.savePreferences')}
                </Button>
              </div>
            </Tile>
          </TabPanel>

          {/* Notificações */}
          <TabPanel>
            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>{t('settings.notificationSettings')}</h3>
              <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
                <Toggle
                  id="emailNotifications"
                  labelText={t('settings.emailNotifications')}
                  labelA={t('settings.disabled')}
                  labelB={t('settings.enabled')}
                  toggled={preferences.emailNotifications}
                  onToggle={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                />
                <Toggle
                  id="newClient"
                  labelText={t('settings.newClients')}
                  labelA={t('settings.disabled')}
                  labelB={t('settings.enabled')}
                  defaultToggled={true}
                />
                <Toggle
                  id="newBriefing"
                  labelText={t('settings.newBriefings')}
                  labelA={t('settings.disabled')}
                  labelB={t('settings.enabled')}
                  defaultToggled={true}
                />
                <Toggle
                  id="projectUpdates"
                  labelText={t('settings.projectUpdates')}
                  labelA={t('settings.disabled')}
                  labelB={t('settings.enabled')}
                  defaultToggled={true}
                />
                <Button renderIcon={Save} onClick={handleSave} style={{ marginTop: '1rem' }}>
                  {t('settings.saveNotifications')}
                </Button>
              </div>
            </Tile>
          </TabPanel>

          {/* Segurança */}
          <TabPanel>
            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>{t('settings.accountSecurity')}</h3>
              <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
                <PasswordInput
                  id="currentPassword"
                  labelText={t('settings.currentPassword')}
                />
                <PasswordInput
                  id="newPassword"
                  labelText={t('settings.newPassword')}
                />
                <PasswordInput
                  id="confirmPassword"
                  labelText={t('settings.confirmPassword')}
                />
                <Button renderIcon={Save} onClick={handleSave} style={{ marginTop: '1rem' }}>
                  {t('settings.changePassword')}
                </Button>
              </div>
            </Tile>

            <Tile style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--cds-support-error)' }}>{t('settings.dangerZone')}</h3>
              <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem' }}>
                {t('settings.dangerDescription')}
              </p>
              <Button kind="danger">{t('settings.deleteAccount')}</Button>
            </Tile>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
