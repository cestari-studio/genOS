'use client';

import { useState, useEffect } from 'react';
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
import { createClient } from '@/lib/supabase/client';

interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// Helper function to map notification type from database to component type
const mapNotificationType = (dbType: string): 'info' | 'success' | 'warning' => {
  if (dbType === 'post_approved' || dbType === 'post_published') {
    return 'success';
  } else if (dbType.startsWith('credit_expiring_') || dbType === 'credit_expired') {
    return 'warning';
  }
  return 'info';
};

// Helper function to format date as relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'agora mesmo';
  if (diffMins < 60) return `${diffMins} minuto${diffMins > 1 ? 's' : ''} atrás`;
  if (diffHours < 24) return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
  if (diffDays < 30) return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;

  // For older dates, show the date
  return date.toLocaleDateString('pt-BR');
};

const iconMap = {
  info: <InformationFilled size={20} style={{ color: '#0f62fe' }} />,
  success: <CheckmarkFilled size={20} style={{ color: '#24a148' }} />,
  warning: <WarningFilled size={20} style={{ color: '#f1c21b' }} />,
};

export default function NotificationsContent() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications from Supabase
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const supabase = createClient();

        // Get auth user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser) {
          throw new Error('Unable to get authenticated user');
        }

        // Get the cestari user
        const { data: cestariUser, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_user_id', authUser.id)
          .single();

        if (userError || !cestariUser) {
          throw new Error('Unable to get user profile');
        }

        // Query notifications
        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', cestariUser.id)
          .order('created_at', { ascending: false });

        if (notificationsError) {
          throw notificationsError;
        }

        // Map and transform the data
        const mappedNotifications: NotificationItem[] = (notificationsData || []).map((notification: any) => ({
          id: notification.id,
          type: mapNotificationType(notification.type),
          title: notification.title,
          message: notification.message,
          time: formatRelativeTime(notification.created_at),
          read: notification.read_at !== null,
        }));

        setNotifications(mappedNotifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err instanceof Error ? err.message : 'Failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const supabase = createClient();
      await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', id);

      // Update local state
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const supabase = createClient();
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);

      if (unreadIds.length === 0) return;

      await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .in('id', unreadIds);

      // Update local state
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const supabase = createClient();
      await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      // Update local state
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1>Notificações</h1>
            <p>Acompanhe as atualizações do sistema</p>
          </div>
        </div>
        <Tile style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#525252' }}>Carregando notificações...</p>
        </Tile>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1>Notificações</h1>
            <p>Acompanhe as atualizações do sistema</p>
          </div>
        </div>
        <Tile style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fff4f4' }}>
          <p style={{ color: '#da1e28' }}>Erro ao carregar notificações: {error}</p>
        </Tile>
      </div>
    );
  }

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
