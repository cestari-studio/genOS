'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  Section,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TextInput,
  PasswordInput,
  Toggle,
} from '@carbon/react';
import { Save } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

export default function AccountSettingsPage() {
  const { t } = useTranslation();

  // Profile state
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [email, setEmail] = useState('admin@acme.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFaEnabled, setTwoFaEnabled] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState({
    emailCampaignUpdates: true,
    emailWeeklyDigest: true,
    emailBillingAlerts: true,
    emailSecurityAlerts: true,
    pushNewComments: false,
    pushTaskAssignments: true,
    pushApprovalRequests: true,
    pushSystemAlerts: false,
  });

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={16} md={8} sm={4}>
        <Section level={1}>
          <Heading style={{ marginBottom: '1.5rem' }}>
            {t('Account Settings')}
          </Heading>
        </Section>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <Tabs>
          <TabList aria-label="Settings tabs">
            <Tab>{t('Profile')}</Tab>
            <Tab>{t('Security')}</Tab>
            <Tab>{t('Notifications')}</Tab>
          </TabList>
          <TabPanels>
            {/* Profile Tab */}
            <TabPanel>
              <Grid fullWidth style={{ marginTop: '1.5rem' }}>
                <Column lg={8} md={6} sm={4}>
                  <Tile style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1.5rem' }}>
                      {t('Company Information')}
                    </h4>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <TextInput
                        id="company-name"
                        labelText={t('Company Name')}
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <TextInput
                        id="company-email"
                        labelText={t('Email Address')}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <TextInput
                        id="company-phone"
                        labelText={t('Phone Number')}
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <Button renderIcon={Save}>
                      {t('Save Profile')}
                    </Button>
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel>
              <Grid fullWidth style={{ marginTop: '1.5rem' }}>
                <Column lg={8} md={6} sm={4} style={{ marginBottom: '1.5rem' }}>
                  <Tile style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1.5rem' }}>
                      {t('Change Password')}
                    </h4>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <PasswordInput
                        id="current-password"
                        labelText={t('Current Password')}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        tooltipPosition="left"
                      />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <PasswordInput
                        id="new-password"
                        labelText={t('New Password')}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        helperText={t(
                          'Must be at least 12 characters with uppercase, lowercase, number, and special character'
                        )}
                        tooltipPosition="left"
                      />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <PasswordInput
                        id="confirm-password"
                        labelText={t('Confirm New Password')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        tooltipPosition="left"
                      />
                    </div>
                    <Button renderIcon={Save}>
                      {t('Update Password')}
                    </Button>
                  </Tile>
                </Column>

                <Column lg={8} md={6} sm={4} style={{ marginBottom: '1.5rem' }}>
                  <Tile style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>
                      {t('Two-Factor Authentication')}
                    </h4>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: '#525252',
                        marginBottom: '1.5rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {t(
                        'Add an extra layer of security to your account. When enabled, you will need to provide a verification code from your authenticator app in addition to your password.'
                      )}
                    </p>
                    <Toggle
                      id="two-fa-toggle"
                      labelText={t('Two-Factor Authentication')}
                      toggled={twoFaEnabled}
                      onToggle={() => setTwoFaEnabled(!twoFaEnabled)}
                      labelA={t('Disabled')}
                      labelB={t('Enabled')}
                    />
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel>
              <Grid fullWidth style={{ marginTop: '1.5rem' }}>
                <Column lg={8} md={6} sm={4} style={{ marginBottom: '1.5rem' }}>
                  <Tile style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1.5rem' }}>
                      {t('Email Notifications')}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <Toggle
                        id="email-campaign-updates"
                        labelText={t('Campaign Updates')}
                        toggled={notifications.emailCampaignUpdates}
                        onToggle={() =>
                          handleNotificationToggle('emailCampaignUpdates')
                        }
                        labelA={t('Off')}
                        labelB={t('On')}
                      />
                      <Toggle
                        id="email-weekly-digest"
                        labelText={t('Weekly Digest')}
                        toggled={notifications.emailWeeklyDigest}
                        onToggle={() =>
                          handleNotificationToggle('emailWeeklyDigest')
                        }
                        labelA={t('Off')}
                        labelB={t('On')}
                      />
                      <Toggle
                        id="email-billing-alerts"
                        labelText={t('Billing Alerts')}
                        toggled={notifications.emailBillingAlerts}
                        onToggle={() =>
                          handleNotificationToggle('emailBillingAlerts')
                        }
                        labelA={t('Off')}
                        labelB={t('On')}
                      />
                      <Toggle
                        id="email-security-alerts"
                        labelText={t('Security Alerts')}
                        toggled={notifications.emailSecurityAlerts}
                        onToggle={() =>
                          handleNotificationToggle('emailSecurityAlerts')
                        }
                        labelA={t('Off')}
                        labelB={t('On')}
                      />
                    </div>
                  </Tile>
                </Column>

                <Column lg={8} md={6} sm={4} style={{ marginBottom: '1.5rem' }}>
                  <Tile style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1.5rem' }}>
                      {t('Push Notifications')}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <Toggle
                        id="push-new-comments"
                        labelText={t('New Comments')}
                        toggled={notifications.pushNewComments}
                        onToggle={() =>
                          handleNotificationToggle('pushNewComments')
                        }
                        labelA={t('Off')}
                        labelB={t('On')}
                      />
                      <Toggle
                        id="push-task-assignments"
                        labelText={t('Task Assignments')}
                        toggled={notifications.pushTaskAssignments}
                        onToggle={() =>
                          handleNotificationToggle('pushTaskAssignments')
                        }
                        labelA={t('Off')}
                        labelB={t('On')}
                      />
                      <Toggle
                        id="push-approval-requests"
                        labelText={t('Approval Requests')}
                        toggled={notifications.pushApprovalRequests}
                        onToggle={() =>
                          handleNotificationToggle('pushApprovalRequests')
                        }
                        labelA={t('Off')}
                        labelB={t('On')}
                      />
                      <Toggle
                        id="push-system-alerts"
                        labelText={t('System Alerts')}
                        toggled={notifications.pushSystemAlerts}
                        onToggle={() =>
                          handleNotificationToggle('pushSystemAlerts')
                        }
                        labelA={t('Off')}
                        labelB={t('On')}
                      />
                    </div>
                  </Tile>
                </Column>

                <Column lg={16} md={8} sm={4}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button renderIcon={Save}>
                      {t('Save Notification Preferences')}
                    </Button>
                  </div>
                </Column>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
    </Grid>
  );
}
