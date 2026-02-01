'use client';

import { useState } from 'react';
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
  info: <InformationFilled size={20} style={{ color: '#0f62fe' }} />,
  success: <CheckmarkFilled size={20} style={{ color: '#24a148' }} />,
  warning: <WarningFilled size={20} style={{ color: '#f1c21b' }} />,
};

export default function NotificationsContent() {
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
          <h1>Notificações</h1>
          <p>Acompanhe as atualizações do sistema</p>
        </div>
        {unreadCount > 0 && (
          <Button kind="ghost" size="sm" onClick={markAllAsRead}>
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {unreadCount > 0 && (
        <Tag type="blue" style={{ marginBottom: '1rem' }}>
          {unreadCount} não lida{unreadCount > 1 ? 's' : ''}
        </Tag>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {notifications.length === 0 ? (
          <Tile style={{ textAlign: 'center', padding: '3rem' }}>
            <Notification size={48} style={{ color: '#8d8d8d', marginBottom: '1rem' }} />
            <p style={{ color: '#8d8d8d' }}>Nenhuma notificação</p>
          </Tile>
        ) : (
          notifications.map((notification) => (
            <Tile
              key={notification.id}
              style={{
                opacity: notification.read ? 0.7 : 1,
                borderLeft: notification.read ? 'none' : '3px solid #0f62fe',
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
                    <p style={{ margin: 0, color: '#525252', fontSize: '0.875rem' }}>
                      {notification.message}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#8d8d8d', marginTop: '0.5rem', display: 'block' }}>
                      {notification.time}
                    </span>
                  </div>
                </div>
                <Button
                  kind="ghost"
                  size="sm"
                  hasIconOnly
                  iconDescription="Excluir"
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
