'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  Tag,
  Modal,
  TextInput,
  TextArea,
  Select,
  SelectItem,
  Breadcrumb,
  BreadcrumbItem,
} from '@carbon/react';
import {
  Add,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  View,
  List,
} from '@carbon/icons-react';

// TODO: Integrar @fullcalendar/react

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'content' | 'meeting' | 'deadline' | 'milestone';
  platform?: string;
  status: 'scheduled' | 'published' | 'draft';
}

const events: CalendarEvent[] = [
  { id: '1', title: 'Post Instagram - Dicas de Marketing', date: '2024-02-19', time: '10:00', type: 'content', platform: 'instagram', status: 'scheduled' },
  { id: '2', title: 'Post LinkedIn - Case Study', date: '2024-02-19', time: '14:00', type: 'content', platform: 'linkedin', status: 'scheduled' },
  { id: '3', title: 'Reunião com TechCorp', date: '2024-02-20', time: '09:00', type: 'meeting', status: 'scheduled' },
  { id: '4', title: 'Entrega Website v1', date: '2024-02-22', type: 'deadline', status: 'scheduled' },
  { id: '5', title: 'Story - Bastidores', date: '2024-02-21', time: '18:00', type: 'content', platform: 'instagram', status: 'draft' },
  { id: '6', title: 'Post Blog - Tendências 2024', date: '2024-02-23', time: '10:00', type: 'content', platform: 'blog', status: 'scheduled' },
  { id: '7', title: 'Aprovação Design Final', date: '2024-02-25', type: 'milestone', status: 'scheduled' },
];

const typeColors = {
  content: 'blue',
  meeting: 'purple',
  deadline: 'red',
  milestone: 'green',
} as const;

const typeLabels = {
  content: 'Conteúdo',
  meeting: 'Reunião',
  deadline: 'Prazo',
  milestone: 'Marco',
};

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 1)); // Fevereiro 2024
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };

  // Gerar dias do calendário
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Calendário Editorial</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Calendário Editorial</h1>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>Planeje e agende seus conteúdos</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="sm" renderIcon={Add} onClick={() => setIsModalOpen(true)}>
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <Tile style={{ marginBottom: '1rem', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Button kind="ghost" size="sm" hasIconOnly iconDescription="Mês anterior" renderIcon={ChevronLeft} onClick={prevMonth} />
            <h2 style={{ margin: 0, minWidth: '180px', textAlign: 'center' }}>
              {months[month]} {year}
            </h2>
            <Button kind="ghost" size="sm" hasIconOnly iconDescription="Próximo mês" renderIcon={ChevronRight} onClick={nextMonth} />
            <Button kind="tertiary" size="sm" onClick={goToToday}>Hoje</Button>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Tag type="blue" size="sm">
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--cds-link-primary)', marginRight: 4 }} />
                Conteúdo
              </Tag>
              <Tag type="purple" size="sm">
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--cds-support-info)', marginRight: 4 }} />
                Reunião
              </Tag>
              <Tag type="red" size="sm">
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--cds-support-error)', marginRight: 4 }} />
                Prazo
              </Tag>
              <Tag type="green" size="sm">
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--cds-support-success)', marginRight: 4 }} />
                Marco
              </Tag>
            </div>
            <div style={{ display: 'flex', border: '1px solid var(--cds-border-subtle-01)', borderRadius: '4px' }}>
              <Button
                kind={viewMode === 'month' ? 'secondary' : 'ghost'}
                size="sm"
                hasIconOnly
                iconDescription="Mês"
                renderIcon={CalendarIcon}
                onClick={() => setViewMode('month')}
              />
              <Button
                kind={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                hasIconOnly
                iconDescription="Lista"
                renderIcon={List}
                onClick={() => setViewMode('list')}
              />
            </div>
          </div>
        </div>
      </Tile>

      {/* Calendar Grid */}
      {viewMode === 'month' && (
        <Tile style={{ padding: 0 }}>
          {/* Weekday Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--cds-border-subtle-01)' }}>
            {weekDays.map(day => (
              <div
                key={day}
                style={{
                  padding: '0.75rem',
                  textAlign: 'center',
                  fontWeight: 600,
                  background: 'var(--cds-background)',
                  borderRight: '1px solid var(--cds-border-subtle-01)',
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {calendarDays.map((day, index) => {
              const dayEvents = day ? getEventsForDate(day) : [];
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

              return (
                <div
                  key={index}
                  style={{
                    minHeight: '120px',
                    padding: '0.5rem',
                    borderRight: '1px solid var(--cds-border-subtle-01)',
                    borderBottom: '1px solid var(--cds-border-subtle-01)',
                    background: day ? 'var(--cds-layer-01)' : 'var(--cds-background)',
                    cursor: day ? 'pointer' : 'default',
                  }}
                  onClick={() => day && handleDateClick(day)}
                >
                  {day && (
                    <>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isToday ? 'var(--cds-link-primary)' : 'transparent',
                        color: isToday ? 'white' : 'inherit',
                        fontWeight: isToday ? 600 : 400,
                        marginBottom: '0.5rem',
                      }}>
                        {day}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {dayEvents.slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.125rem 0.25rem',
                              borderRadius: '2px',
                              background: typeColors[event.type] === 'blue' ? '#d0e2ff' :
                                         typeColors[event.type] === 'purple' ? '#e8daff' :
                                         typeColors[event.type] === 'red' ? '#ffd7d9' : '#defbe6',
                              color: typeColors[event.type] === 'blue' ? '#0043ce' :
                                    typeColors[event.type] === 'purple' ? '#6929c4' :
                                    typeColors[event.type] === 'red' ? '#a2191f' : '#0e6027',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {event.time && `${event.time} `}{event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>
                            +{dayEvents.length - 3} mais
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Tile>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Tile style={{ padding: 0 }}>
          {events
            .filter(e => e.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
            .sort((a, b) => a.date.localeCompare(b.date))
            .map(event => (
              <div
                key={event.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderBottom: '1px solid var(--cds-border-subtle-01)',
                }}
              >
                <div style={{ width: '80px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    {new Date(event.date).getDate()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>
                    {weekDays[new Date(event.date).getDay()]}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <strong>{event.title}</strong>
                    <Tag type={typeColors[event.type]} size="sm">{typeLabels[event.type]}</Tag>
                    {event.platform && <Tag type="gray" size="sm">{event.platform}</Tag>}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
                    {event.time || 'Dia todo'}
                  </div>
                </div>
                <Button kind="ghost" size="sm" renderIcon={View}>Ver</Button>
              </div>
            ))}
        </Tile>
      )}

      {/* New Event Modal */}
      <Modal
        open={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setSelectedDate(null);
        }}
        modalHeading="Novo Evento"
        primaryButtonText="Salvar"
        secondaryButtonText="Cancelar"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextInput
            id="event-title"
            labelText="Título"
            placeholder="Ex: Post Instagram - Dicas"
          />
          <Select id="event-type" labelText="Tipo">
            <SelectItem value="content" text="Conteúdo" />
            <SelectItem value="meeting" text="Reunião" />
            <SelectItem value="deadline" text="Prazo" />
            <SelectItem value="milestone" text="Marco" />
          </Select>
          <Grid>
            <Column lg={8} md={4} sm={4}>
              <TextInput
                id="event-date"
                labelText="Data"
                type="date"
                defaultValue={selectedDate || ''}
              />
            </Column>
            <Column lg={8} md={4} sm={4}>
              <TextInput
                id="event-time"
                labelText="Horário"
                type="time"
              />
            </Column>
          </Grid>
          <Select id="event-platform" labelText="Plataforma (se conteúdo)">
            <SelectItem value="" text="Nenhuma" />
            <SelectItem value="instagram" text="Instagram" />
            <SelectItem value="linkedin" text="LinkedIn" />
            <SelectItem value="facebook" text="Facebook" />
            <SelectItem value="twitter" text="X (Twitter)" />
            <SelectItem value="blog" text="Blog" />
          </Select>
          <TextArea
            id="event-notes"
            labelText="Notas"
            rows={3}
          />
        </div>
      </Modal>
    </div>
  );
}
