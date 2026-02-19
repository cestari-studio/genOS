'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import {
  Tile,
  Button,
  Tag,
} from '@carbon/react';
import {
  Notification,
  CheckmarkFilled,
  WarningFilled,
  InformationFilled,
  TrashCan,
} from '@carbon/icons-react';

interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'success',
    title: 'Novo cliente cadastrado',
    message: 'José Victor Ferreira de Carvalho foi adicionado ao sistema.',
    time: '2 horas atrás',
    read: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'Briefing recebido',
    message: 'Um novo briefing foi submetido por Bruno Corbucci.',
    time: '5 horas atrás',
    read: false,
  },
  {
    id: '3',
    type: 'warning',
    title: 'Projeto pendente',
    message: 'O projeto "Redesign Website" está aguardando aprovação.',
    time: '1 dia atrás',
    read: true,
  },
  {
    id: '4',
    type: 'info',
    title: 'Documento enviado',
    message: 'Contrato de serviço foi enviado para Gabriel Salvadeo.',
    time: '2 dias atrás',
    read: true,
  },
];

const iconMap = {
  info: <InformationFilled size={20} style={{ color: 'var(--cds-link-primary)' }} />,
  success: <CheckmarkFilled size={20} style={{ color: 'var(--cds-support-success)' }} />,
  warning: <WarningFilled size={20} style={{ color: 'var(--cds-support-warning)' }} />,
};

export default function NotificationsContent() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>{t('notifications.title')}</h1>
          <p>{t('notifications.subtitle')}</p>
        </div>
        {unreadCount > 0 && (
          <Button kind="ghost" size="sm" onClick={markAllAsRead}>
            {t('notifications.markAllRead')}
          </Button>
        )}
      </div>

      {unreadCount > 0 && (
        <Tag type="blue" style={{ marginBottom: '1rem' }}>
          {t('notifications.unreadCount', { count: unreadCount })}
        </Tag>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {notifications.length === 0 ? (
          <Tile style={{ textAlign: 'center', padding: '3rem' }}>
            <Notification size={48} style={{ color: 'var(--cds-text-helper)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--cds-text-helper)' }}>{t('notifications.noNotifications')}</p>
          </Tile>
        ) : (
          notifications.map((notification) => (
            <Tile
              key={notification.id}
              style={{
                opacity: notification.read ? 0.7 : 1,
                borderLeft: notification.read ? 'none' : '3px solid var(--cds-link-primary)',
                cursor: 'pointer',
              }}
              onClick={() => markAsRead(notification.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div>{iconMap[notification.type]}</div>
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>
                      {notification.title}
                    </strong>
                    <p style={{ margin: 0, color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
                      {notification.message}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--cds-text-helper)', marginTop: '0.5rem', display: 'block' }}>
                      {notification.time}
                    </span>
                  </div>
                </div>
                <Button
                  kind="ghost"
                  size="sm"
                  hasIconOnly
                  iconDescription={t('common.delete')}
                  renderIcon={TrashCan}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                />
              </div>
            </Tile>
          ))
        )}
      </div>
    </div>
  );
}
