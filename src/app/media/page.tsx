'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import {
  Grid,
  Column,
  Tile,
  Button,
  Search,
  Tag,
  Modal,
  TextInput,
  Select,
  SelectItem,
  Checkbox,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  Breadcrumb,
  BreadcrumbItem,
  FileUploader,
} from '@carbon/react';
import {
  Add,
  Upload,
  Grid as GridIcon,
  List,
  Folder,
  Image,
  Document,
  Video,
  Music,
  Download,
  TrashCan,
  Edit,
  Copy,
  FolderAdd,
  Filter,
} from '@carbon/icons-react';

// TODO: Integrar com Supabase Storage

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio';
  size: string;
  url: string;
  thumbnail?: string;
  folder: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface MediaFolder {
  id: string;
  name: string;
  count: number;
}


const files: MediaFile[] = [
  { id: '1', name: 'logo-principal.svg', type: 'image', size: '24 KB', url: '#', folder: 'brand', uploadedAt: '2024-02-15', uploadedBy: 'João' },
  { id: '2', name: 'hero-banner.jpg', type: 'image', size: '1.2 MB', url: '#', folder: 'images', uploadedAt: '2024-02-14', uploadedBy: 'Maria' },
  { id: '3', name: 'apresentacao-cliente.pdf', type: 'document', size: '4.5 MB', url: '#', folder: 'documents', uploadedAt: '2024-02-13', uploadedBy: 'João' },
  { id: '4', name: 'video-institucional.mp4', type: 'video', size: '120 MB', url: '#', folder: 'videos', uploadedAt: '2024-02-12', uploadedBy: 'Carlos' },
  { id: '5', name: 'mockup-homepage.png', type: 'image', size: '2.3 MB', url: '#', folder: 'projects', uploadedAt: '2024-02-11', uploadedBy: 'João' },
  { id: '6', name: 'icones-pack.zip', type: 'document', size: '8.1 MB', url: '#', folder: 'brand', uploadedAt: '2024-02-10', uploadedBy: 'Maria' },
  { id: '7', name: 'foto-equipe.jpg', type: 'image', size: '3.2 MB', url: '#', folder: 'images', uploadedAt: '2024-02-09', uploadedBy: 'Carlos' },
  { id: '8', name: 'podcast-ep01.mp3', type: 'audio', size: '45 MB', url: '#', folder: 'all', uploadedAt: '2024-02-08', uploadedBy: 'João' },
];

const typeIcons = {
  image: Image,
  video: Video,
  document: Document,
  audio: Music,
};

const typeColors = {
  image: 'var(--cds-link-primary)',
  video: 'var(--cds-support-info)',
  document: 'var(--cds-support-error)',
  audio: 'var(--cds-support-success)',
};

export default function MediaPage() {
  const { t } = useTranslation();

  const folders: MediaFolder[] = [
    { id: 'all', name: t('media.allFiles'), count: 24 },
    { id: 'images', name: t('media.images'), count: 15 },
    { id: 'videos', name: t('media.videos'), count: 3 },
    { id: 'documents', name: t('media.documents'), count: 6 },
    { id: 'brand', name: t('media.brandIdentity'), count: 8 },
    { id: 'projects', name: t('media.projects'), count: 12 },
  ];

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);

  const filteredFiles = files.filter(file => {
    const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder;
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/dashboard">{t('sidebar.dashboard')}</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{t('media.title')}</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>{t('media.title')}</h1>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>{t('media.fileCount', { count: files.length, size: '185 MB' })}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button kind="secondary" size="sm" renderIcon={FolderAdd} onClick={() => setIsNewFolderModalOpen(true)}>
            {t('media.newFolder')}
          </Button>
          <Button size="sm" renderIcon={Upload} onClick={() => setIsUploadModalOpen(true)}>
            {t('media.upload')}
          </Button>
        </div>
      </div>

      <Grid>
        {/* Sidebar - Pastas */}
        <Column lg={3} md={2} sm={4}>
          <Tile style={{ padding: '1rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>{t('media.folders')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0.75rem',
                    background: selectedFolder === folder.id ? 'var(--cds-layer-accent-01)' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Folder size={16} />
                    <span style={{ fontSize: '0.875rem' }}>{folder.name}</span>
                  </div>
                  <Tag type="gray" size="sm">{folder.count}</Tag>
                </button>
              ))}
            </div>
          </Tile>
        </Column>

        {/* Main Content */}
        <Column lg={13} md={6} sm={4}>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <Search
                size="sm"
                placeholder={t('media.searchPlaceholder')}
                labelText={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Select id="filter-type" size="sm" style={{ minWidth: '120px' }}>
                <SelectItem value="all" text={t('media.all')} />
                <SelectItem value="image" text={t('media.images')} />
                <SelectItem value="video" text={t('media.videos')} />
                <SelectItem value="document" text={t('media.documents')} />
                <SelectItem value="audio" text={t('media.audio')} />
              </Select>
              <div style={{ display: 'flex', border: '1px solid var(--cds-border-subtle-01)', borderRadius: '4px' }}>
                <Button
                  kind={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  hasIconOnly
                  iconDescription={t('media.grid')}
                  renderIcon={GridIcon}
                  onClick={() => setViewMode('grid')}
                />
                <Button
                  kind={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  hasIconOnly
                  iconDescription={t('media.list')}
                  renderIcon={List}
                  onClick={() => setViewMode('list')}
                />
              </div>
            </div>
          </div>

          {/* Selected Actions */}
          {selectedFiles.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', padding: '0.75rem', background: 'var(--cds-layer-accent-01)', borderRadius: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
                {t('media.selectedCount', { count: selectedFiles.length })}
              </span>
              <Button kind="ghost" size="sm" renderIcon={Download}>{t('media.download')}</Button>
              <Button kind="ghost" size="sm" renderIcon={Copy}>{t('media.copyLink')}</Button>
              <Button kind="danger--ghost" size="sm" renderIcon={TrashCan}>{t('common.delete')}</Button>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <Grid>
              {filteredFiles.map(file => {
                const IconComponent = typeIcons[file.type];
                return (
                  <Column key={file.id} lg={4} md={4} sm={4}>
                    <Tile
                      style={{
                        padding: 0,
                        marginBottom: '1rem',
                        cursor: 'pointer',
                        border: selectedFiles.includes(file.id) ? '2px solid var(--cds-focus)' : '2px solid transparent',
                      }}
                      onClick={() => toggleFileSelection(file.id)}
                    >
                      {/* Preview */}
                      <div style={{
                        height: '120px',
                        background: 'var(--cds-background)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <IconComponent size={48} style={{ color: typeColors[file.type] }} />
                      </div>
                      {/* Info */}
                      <div style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {file.name}
                            </p>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>
                              {file.size} • {file.uploadedAt}
                            </p>
                          </div>
                          <OverflowMenu size="sm" flipped>
                            <OverflowMenuItem itemText={t('media.download')} />
                            <OverflowMenuItem itemText={t('media.copyLink')} />
                            <OverflowMenuItem itemText={t('media.rename')} />
                            <OverflowMenuItem itemText={t('common.delete')} hasDivider isDelete />
                          </OverflowMenu>
                        </div>
                      </div>
                    </Tile>
                  </Column>
                );
              })}
            </Grid>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <Tile style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--cds-border-subtle-01)', background: '#f4f4f4' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', width: '40px' }}></th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>{t('media.name')}</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>{t('media.type')}</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>{t('media.size')}</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>{t('media.date')}</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>{t('media.uploadedBy')}</th>
                    <th style={{ padding: '0.75rem', width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map(file => {
                    const IconComponent = typeIcons[file.type];
                    return (
                      <tr key={file.id} style={{ borderBottom: '1px solid var(--cds-border-subtle-01)' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <Checkbox
                            id={`select-${file.id}`}
                            labelText=""
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => toggleFileSelection(file.id)}
                          />
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <IconComponent size={20} style={{ color: typeColors[file.type] }} />
                            <span>{file.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <Tag type="gray" size="sm">{file.type}</Tag>
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--cds-text-secondary)' }}>{file.size}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--cds-text-secondary)' }}>{file.uploadedAt}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--cds-text-secondary)' }}>{file.uploadedBy}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <OverflowMenu size="sm" flipped>
                            <OverflowMenuItem itemText={t('media.download')} />
                            <OverflowMenuItem itemText={t('media.copyLink')} />
                            <OverflowMenuItem itemText={t('media.rename')} />
                            <OverflowMenuItem itemText={t('common.delete')} hasDivider isDelete />
                          </OverflowMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Tile>
          )}

          {/* Pagination */}
          <Pagination
            totalItems={filteredFiles.length}
            pageSize={12}
            pageSizes={[12, 24, 48]}
            style={{ marginTop: '1rem' }}
          />
        </Column>
      </Grid>

      {/* Upload Modal */}
      <Modal
        open={isUploadModalOpen}
        onRequestClose={() => setIsUploadModalOpen(false)}
        modalHeading={t('media.uploadTitle')}
        primaryButtonText={t('media.doUpload')}
        secondaryButtonText={t('common.cancel')}
      >
        <div style={{ marginBottom: '1rem' }}>
          <Select id="upload-folder" labelText={t('media.targetFolder')}>
            <SelectItem value="all" text={t('media.root')} />
            {folders.filter(f => f.id !== 'all').map(folder => (
              <SelectItem key={folder.id} value={folder.id} text={folder.name} />
            ))}
          </Select>
        </div>
        <FileUploader
          labelTitle={t('media.dragOrClick')}
          labelDescription={t('media.maxSize')}
          buttonLabel={t('media.addFiles')}
          filenameStatus="edit"
          accept={['.jpg', '.jpeg', '.png', '.gif', '.svg', '.pdf', '.doc', '.docx', '.mp4', '.mp3']}
          multiple
        />
      </Modal>

      {/* New Folder Modal */}
      <Modal
        open={isNewFolderModalOpen}
        onRequestClose={() => setIsNewFolderModalOpen(false)}
        modalHeading={t('media.newFolderTitle')}
        primaryButtonText={t('common.create')}
        secondaryButtonText={t('common.cancel')}
      >
        <TextInput
          id="folder-name"
          labelText={t('media.folderName')}
          placeholder={t('media.folderPlaceholder')}
        />
      </Modal>
    </div>
  );
}
