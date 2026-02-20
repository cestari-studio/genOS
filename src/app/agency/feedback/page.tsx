'use client';

import { useState } from 'react';
import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  Tag,
  Button,
  Tile,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from '@carbon/react';
import {
  Chat,
  Checkmark,
  Time,
  WarningAlt,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

type FeedbackStatus = 'pending' | 'approved' | 'changes_requested';
type Priority = 'high' | 'medium' | 'low';

interface FeedbackItem {
  id: number;
  client: string;
  content: string;
  message: string;
  status: FeedbackStatus;
  priority: Priority;
  date: string;
  reviewer: string;
}

const feedbackItems: FeedbackItem[] = [
  {
    id: 1,
    client: 'Acme Corp',
    content: 'Instagram Post #234',
    message: 'Please adjust the color palette to match our updated brand guidelines. The blue tones are slightly off.',
    status: 'pending',
    priority: 'high',
    date: '2026-02-19',
    reviewer: 'Sarah Chen',
  },
  {
    id: 2,
    client: 'TechStart Inc',
    content: 'Blog Header Image',
    message: 'Looks great! Approved for publishing.',
    status: 'approved',
    priority: 'low',
    date: '2026-02-18',
    reviewer: 'Mike Torres',
  },
  {
    id: 3,
    client: 'GreenLeaf Co',
    content: 'Email Campaign Banner',
    message: 'The CTA button needs to be more prominent. Can we increase the size and contrast?',
    status: 'changes_requested',
    priority: 'medium',
    date: '2026-02-18',
    reviewer: 'Lisa Patel',
  },
  {
    id: 4,
    client: 'Acme Corp',
    content: 'LinkedIn Ad Set #12',
    message: 'Waiting on final copy review from the marketing director.',
    status: 'pending',
    priority: 'medium',
    date: '2026-02-17',
    reviewer: 'Sarah Chen',
  },
  {
    id: 5,
    client: 'Nova Retail',
    content: 'Product Launch Video',
    message: 'Approved with minor tweaks to the end card. See annotated version.',
    status: 'approved',
    priority: 'low',
    date: '2026-02-17',
    reviewer: 'James Wright',
  },
  {
    id: 6,
    client: 'BlueSky Health',
    content: 'Newsletter Template',
    message: 'Please revise the header section. The font size is too small for accessibility compliance.',
    status: 'changes_requested',
    priority: 'high',
    date: '2026-02-16',
    reviewer: 'Dr. Ana Ruiz',
  },
  {
    id: 7,
    client: 'TechStart Inc',
    content: 'Social Media Calendar Q2',
    message: 'Pending review from the content strategy team.',
    status: 'pending',
    priority: 'medium',
    date: '2026-02-15',
    reviewer: 'Mike Torres',
  },
  {
    id: 8,
    client: 'GreenLeaf Co',
    content: 'Annual Report Cover',
    message: 'The layout looks clean and modern. Approved as-is.',
    status: 'approved',
    priority: 'low',
    date: '2026-02-14',
    reviewer: 'Lisa Patel',
  },
];

function getPriorityTagType(priority: Priority): string {
  switch (priority) {
    case 'high':
      return 'red';
    case 'medium':
      return 'blue';
    case 'low':
      return 'green';
    default:
      return 'gray';
  }
}

function getStatusIcon(status: FeedbackStatus) {
  switch (status) {
    case 'pending':
      return <Time size={20} />;
    case 'approved':
      return <Checkmark size={20} />;
    case 'changes_requested':
      return <WarningAlt size={20} />;
    default:
      return <Chat size={20} />;
  }
}

function getStatusLabel(status: FeedbackStatus): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'approved':
      return 'Approved';
    case 'changes_requested':
      return 'Changes Requested';
    default:
      return status;
  }
}

function getStatusTagType(status: FeedbackStatus): string {
  switch (status) {
    case 'pending':
      return 'blue';
    case 'approved':
      return 'green';
    case 'changes_requested':
      return 'purple';
    default:
      return 'gray';
  }
}

export default function AgencyFeedbackPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<FeedbackItem[]>(feedbackItems);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const tabStatuses: (FeedbackStatus | 'all')[] = ['pending', 'approved', 'changes_requested'];

  const handleApprove = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'approved' as FeedbackStatus } : item
      )
    );
  };

  const handleRequestChanges = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'changes_requested' as FeedbackStatus } : item
      )
    );
  };

  const getFilteredItems = (status: FeedbackStatus) => {
    return items.filter((item) => item.status === status);
  };

  const pendingCount = items.filter((i) => i.status === 'pending').length;
  const approvedCount = items.filter((i) => i.status === 'approved').length;
  const changesCount = items.filter((i) => i.status === 'changes_requested').length;

  const renderFeedbackList = (filteredItems: FeedbackItem[]) => (
    <StructuredListWrapper selection={false} style={{ marginTop: '1rem' }}>
      <StructuredListHead>
        <StructuredListRow head>
          <StructuredListCell head>Status</StructuredListCell>
          <StructuredListCell head>Client</StructuredListCell>
          <StructuredListCell head>Content</StructuredListCell>
          <StructuredListCell head>Feedback</StructuredListCell>
          <StructuredListCell head>Priority</StructuredListCell>
          <StructuredListCell head>Date</StructuredListCell>
          <StructuredListCell head>Actions</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        {filteredItems.length === 0 ? (
          <StructuredListRow>
            <StructuredListCell>
              <p style={{ textAlign: 'center', padding: '2rem', color: '#525252' }}>
                No feedback items in this category.
              </p>
            </StructuredListCell>
          </StructuredListRow>
        ) : (
          filteredItems.map((item) => (
            <StructuredListRow key={item.id}>
              <StructuredListCell>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getStatusIcon(item.status)}
                  <Tag size="sm" type={getStatusTagType(item.status) as any}>
                    {getStatusLabel(item.status)}
                  </Tag>
                </div>
              </StructuredListCell>
              <StructuredListCell>
                <strong>{item.client}</strong>
                <br />
                <span style={{ fontSize: '0.75rem', color: '#525252' }}>{item.reviewer}</span>
              </StructuredListCell>
              <StructuredListCell>{item.content}</StructuredListCell>
              <StructuredListCell>
                <p style={{ fontSize: '0.875rem', maxWidth: '300px' }}>{item.message}</p>
              </StructuredListCell>
              <StructuredListCell>
                <Tag size="sm" type={getPriorityTagType(item.priority) as any}>
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </Tag>
              </StructuredListCell>
              <StructuredListCell>{item.date}</StructuredListCell>
              <StructuredListCell>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {item.status !== 'approved' && (
                    <Button
                      kind="primary"
                      size="sm"
                      renderIcon={Checkmark}
                      onClick={() => handleApprove(item.id)}
                    >
                      Approve
                    </Button>
                  )}
                  {item.status !== 'changes_requested' && (
                    <Button
                      kind="tertiary"
                      size="sm"
                      renderIcon={WarningAlt}
                      onClick={() => handleRequestChanges(item.id)}
                    >
                      Request Changes
                    </Button>
                  )}
                </div>
              </StructuredListCell>
            </StructuredListRow>
          ))
        )}
      </StructuredListBody>
    </StructuredListWrapper>
  );

  return (
    <div style={{ padding: '2rem' }}>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1>Feedback Inbox</h1>
        <p style={{ color: '#525252', marginTop: '0.5rem' }}>
          Review and manage client feedback on creative deliverables across all active projects.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <Tile style={{ flex: 1, textAlign: 'center' }}>
          <Chat size={20} />
          <h3 style={{ margin: '0.5rem 0 0.25rem' }}>{pendingCount}</h3>
          <p style={{ fontSize: '0.75rem', color: '#525252' }}>Pending Review</p>
        </Tile>
        <Tile style={{ flex: 1, textAlign: 'center' }}>
          <Checkmark size={20} />
          <h3 style={{ margin: '0.5rem 0 0.25rem' }}>{approvedCount}</h3>
          <p style={{ fontSize: '0.75rem', color: '#525252' }}>Approved</p>
        </Tile>
        <Tile style={{ flex: 1, textAlign: 'center' }}>
          <WarningAlt size={20} />
          <h3 style={{ margin: '0.5rem 0 0.25rem' }}>{changesCount}</h3>
          <p style={{ fontSize: '0.75rem', color: '#525252' }}>Changes Requested</p>
        </Tile>
      </div>

      <Tabs
        selectedIndex={selectedTabIndex}
        onChange={({ selectedIndex }: { selectedIndex: number }) =>
          setSelectedTabIndex(selectedIndex)
        }
      >
        <TabList aria-label="Feedback status tabs">
          <Tab>Pending ({pendingCount})</Tab>
          <Tab>Approved ({approvedCount})</Tab>
          <Tab>Changes Requested ({changesCount})</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{renderFeedbackList(getFilteredItems('pending'))}</TabPanel>
          <TabPanel>{renderFeedbackList(getFilteredItems('approved'))}</TabPanel>
          <TabPanel>{renderFeedbackList(getFilteredItems('changes_requested'))}</TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
