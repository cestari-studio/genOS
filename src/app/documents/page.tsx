'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbarSearch,
  Button,
  Tag,
  Modal,
  TextInput,
  TextArea,
  Select,
  SelectItem,
  Pagination,
  InlineLoading,
  Dropdown,
  OverflowMenu,
  OverflowMenuItem,
  FileUploader,
  FileUploaderDropContainer,
  FileUploaderItem,
  ContentSwitcher,
  Switch,
  Breadcrumb,
  BreadcrumbItem,
  Tile,
  ProgressBar,
} from '@carbon/react';
import {
  Add,
  Edit,
  TrashCan,
  View,
  Download,
  Document,
  DocumentPdf,
  DocumentWordProcessor,
  Image,
  Video,
  Folder,
  FolderAdd,
  Upload,
  Share,
  Link as LinkIcon,
  Copy,
  Search,
  Grid as GridIcon,
  List,
  Calendar,
  UserMultiple,
  CheckmarkFilled,
  Time,
  CloudUpload,
  DocumentAttachment,
  DocumentBlank,
  Zip,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import './documents.scss';

interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string | null;
  folder_id: string | null;
  client_id: string | null;
  client_name?: string | null;
  project_id: string | null;
  project_title?: string | null;
  status: 'draft' | 'pending' | 'approved' | 'archived';
  version: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

interface DocFolder {
  id: string;
  name: string;
  parent_id: string | null;
  color: string;
  documents_count: number;
}

interface Client {
  id: string;
  name: string;
}

interface Project {
  id: string;
  title: string;
  client_id: string;
}

const statusConfig = {
  draft: { label: 'Rascunho', type: 'gray' as const },
  pending: { label: 'Pendente', type: 'blue' as const },
  approved: { label: 'Aprovado', type: 'green' as const },
  archived: { label: 'Arquivado', type: 'purple' as const },
};

const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return DocumentPdf;
  if (type.includes('word') || type.includes('doc')) return DocumentWordProcessor;
  if (type.includes('image') || type.includes('png') || type.includes('jpg')) return Image;
  if (type.includes('video')) return Video;
  if (type.includes('zip') || type.includes('rar')) return Zip;
  return DocumentBlank;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [folders, setFolders] = useState<DocFolder[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null; name: string }[]>([{ id: null, name: 'Documentos' }]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [viewDocModal, setViewDocModal] = useState<DocumentFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [folderFormData, setFolderFormData] = useState({ name: '', color: 'blue' });
  const [uploadFormData, setUploadFormData] = useState({ client_id: '', project_id: '', folder_id: '' });

  useEffect(() => {
    loadData();
  }, [currentFolder]);

  const loadData = async () => {
    try {
      const supabase = createClient();
      
      const [docsRes, foldersRes, clientsRes, projectsRes] = await Promise.all([
        supabase.from('documents').select(`*, clients (name), projects (title)`).eq('folder_id', currentFolder).order('created_at', { ascending: false }),
        supabase.from('document_folders').select('*').eq('parent_id', currentFolder),
        supabase.from('clients').select('id, name').eq('status', 'active'),
        supabase.from('projects').select('id, title, client_id'),
      ]);

      if (docsRes.data) {
        const docsWithRelations = docsRes.data.map((d: { clients?: { name: string } | null; projects?: { title: string } | null } & Omit<DocumentFile, 'client_name' | 'project_title'>) => ({
          ...d,
          client_name: d.clients?.name || null,
          project_title: d.projects?.title || null,
        }));
        setDocuments(docsWithRelations);
      }
      
      if (foldersRes.data) setFolders(foldersRes.data);
      if (clientsRes.data) setClients(clientsRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folder: DocFolder) => {
    setCurrentFolder(folder.id);
    setBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }]);
    setCurrentPage(1);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentFolder(newBreadcrumbs[newBreadcrumbs.length - 1].id);
    setCurrentPage(1);
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;
    
    try {
      const supabase = createClient();
      setUploadProgress(0);
      
      for (let i = 0; i < uploadFiles.length; i++) {
        const file = uploadFiles[i];
        const fileName = `${Date.now()}-${file.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(fileName);
        
        await supabase.from('documents').insert([{
          name: file.name,
          type: file.type,
          size: file.size,
          url: publicUrl,
          folder_id: uploadFormData.folder_id || currentFolder,
          client_id: uploadFormData.client_id || null,
          project_id: uploadFormData.project_id || null,
          status: 'draft',
          version: 1,
        }]);
        
        setUploadProgress(Math.round(((i + 1) / uploadFiles.length) * 100));
      }
      
      setUploadModalOpen(false);
      setUploadFiles([]);
      setUploadProgress(null);
      loadData();
    } catch (error) {
      console.error('Error uploading:', error);
      setUploadProgress(null);
    }
  };

  const handleCreateFolder = async () => {
    try {
      const supabase = createClient();
      await supabase.from('document_folders').insert([{
        name: folderFormData.name,
        color: folderFormData.color,
        parent_id: currentFolder,
      }]);
      setFolderModalOpen(false);
      setFolderFormData({ name: '', color: 'blue' });
      loadData();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return;
    try {
      const supabase = createClient();
      await supabase.from('documents').delete().eq('id', id);
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    if (!confirm('Excluir pasta e todo seu conteúdo?')) return;
    try {
      const supabase = createClient();
      await supabase.from('document_folders').delete().eq('id', id);
      loadData();
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesType = typeFilter === 'all' || doc.type.includes(typeFilter);
    return matchesSearch && matchesStatus && matchesType;
  });

  const paginatedDocuments = filteredDocuments.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const filteredProjects = projects.filter(p => !uploadFormData.client_id || p.client_id === uploadFormData.client_id);

  const getStats = () => {
    const total = documents.length;
    const totalSize = documents.reduce((acc, d) => acc + d.size, 0);
    return { total, totalSize: formatFileSize(totalSize), folders: folders.length };
  };

  const stats = getStats();

  return (
    <>
      <div className="page-header">
        <div className="page-header__content">
          <div className="page-header__title-group">
            <h1>Documentos</h1>
            <p>Gerencie arquivos e documentos dos projetos</p>
          </div>
          <div className="page-header__actions">
            <Button kind="tertiary" renderIcon={FolderAdd} onClick={() => setFolderModalOpen(true)}>Nova Pasta</Button>
            <Button renderIcon={Upload} onClick={() => setUploadModalOpen(true)}>Upload</Button>
          </div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-mini-card"><span className="stat-mini-card__value">{stats.total}</span><span className="stat-mini-card__label">Documentos</span></div>
        <div className="stat-mini-card stat-mini-card--blue"><span className="stat-mini-card__value">{stats.folders}</span><span className="stat-mini-card__label">Pastas</span></div>
        <div className="stat-mini-card stat-mini-card--teal"><span className="stat-mini-card__value">{stats.totalSize}</span><span className="stat-mini-card__label">Armazenado</span></div>
      </div>

      <div className="documents-navigation">
        <Breadcrumb>
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem key={crumb.id || 'root'} isCurrentPage={index === breadcrumbs.length - 1}>
              <button onClick={() => handleBreadcrumbClick(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
                {crumb.name}
              </button>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      </div>

      <div className="filters-bar">
        <div className="filters-bar__search">
          <TableToolbarSearch placeholder="Buscar documentos..." onChange={(e) => setSearchTerm(typeof e === 'string' ? '' : e.target.value)} persistent />
        </div>
        <div className="filters-bar__filters">
          <Dropdown<{ id: string; text: string }> id="status-filter" titleText="" label="Status" items={[{ id: 'all', text: 'Todos' }, { id: 'draft', text: 'Rascunho' }, { id: 'pending', text: 'Pendente' }, { id: 'approved', text: 'Aprovado' }]} itemToString={(item) => item?.text || ''} onChange={({ selectedItem }) => setStatusFilter(selectedItem?.id || 'all')} size="md" />
          <Dropdown<{ id: string; text: string }> id="type-filter" titleText="" label="Tipo" items={[{ id: 'all', text: 'Todos' }, { id: 'pdf', text: 'PDF' }, { id: 'image', text: 'Imagem' }, { id: 'doc', text: 'Word' }]} itemToString={(item) => item?.text || ''} onChange={({ selectedItem }) => setTypeFilter(selectedItem?.id || 'all')} size="md" />
          <ContentSwitcher size="md" selectedIndex={viewMode === 'grid' ? 0 : 1} onChange={(e) => setViewMode((e.index || 0) === 0 ? 'grid' : 'list')}><Switch name="grid"><GridIcon size={16} /></Switch><Switch name="list"><List size={16} /></Switch></ContentSwitcher>
        </div>
      </div>

      {loading ? (
        <div className="loading-state"><InlineLoading description="Carregando documentos..." /></div>
      ) : (
        <div className="documents-content">
          {folders.length > 0 && (
            <div className="folders-section">
              <h3>Pastas</h3>
              <div className="folders-grid">
                {folders.map((folder) => (
                  <div key={folder.id} className={`folder-card folder-card--${folder.color}`} onClick={() => handleFolderClick(folder)}>
                    <div className="folder-card__icon"><Folder size={32} /></div>
                    <div className="folder-card__info">
                      <span className="folder-card__name">{folder.name}</span>
                      <span className="folder-card__count">{folder.documents_count || 0} itens</span>
                    </div>
                    <OverflowMenu flipped size="sm" ariaLabel="Ações" onClick={(e) => e.stopPropagation()}>
                      <OverflowMenuItem itemText="Renomear" />
                      <OverflowMenuItem itemText="Mover" />
                      <OverflowMenuItem itemText="Excluir" isDelete onClick={() => handleDeleteFolder(folder.id)} />
                    </OverflowMenu>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredDocuments.length === 0 && folders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon"><Document size={64} /></div>
              <h3 className="empty-state__title">{searchTerm ? 'Nenhum documento encontrado' : 'Pasta vazia'}</h3>
              <p className="empty-state__description">Faça upload de arquivos ou crie uma pasta</p>
              <div className="empty-state__actions">
                <Button kind="tertiary" renderIcon={FolderAdd} onClick={() => setFolderModalOpen(true)}>Nova Pasta</Button>
                <Button renderIcon={Upload} onClick={() => setUploadModalOpen(true)}>Upload</Button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="documents-grid">
              {paginatedDocuments.map((doc) => {
                const FileIcon = getFileIcon(doc.type);
                return (
                  <div key={doc.id} className="document-card">
                    <div className="document-card__preview">
                      <FileIcon size={48} />
                    </div>
                    <div className="document-card__info">
                      <h4 className="document-card__name" title={doc.name}>{doc.name}</h4>
                      <div className="document-card__meta">
                        <span>{formatFileSize(doc.size)}</span>
                        <span>•</span>
                        <span>{new Date(doc.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                      {doc.client_name && <span className="document-card__client"><UserMultiple size={12} />{doc.client_name}</span>}
                    </div>
                    <div className="document-card__footer">
                      <Tag type={statusConfig[doc.status].type} size="sm">{statusConfig[doc.status].label}</Tag>
                      <OverflowMenu flipped size="sm" ariaLabel="Ações">
                        <OverflowMenuItem itemText="Visualizar" onClick={() => setViewDocModal(doc)} />
                        <OverflowMenuItem itemText="Download" onClick={() => doc.url && window.open(doc.url)} />
                        <OverflowMenuItem itemText="Copiar link" />
                        <OverflowMenuItem itemText="Mover" />
                        <OverflowMenuItem itemText="Excluir" isDelete onClick={() => handleDelete(doc.id)} />
                      </OverflowMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="content-card">
              <Table>
                <TableHead><TableRow><TableHeader>Nome</TableHeader><TableHeader>Tipo</TableHeader><TableHeader>Tamanho</TableHeader><TableHeader>Cliente</TableHeader><TableHeader>Status</TableHeader><TableHeader>Data</TableHeader><TableHeader></TableHeader></TableRow></TableHead>
                <TableBody>
                  {paginatedDocuments.map((doc) => {
                    const FileIcon = getFileIcon(doc.type);
                    return (
                      <TableRow key={doc.id}>
                        <TableCell><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FileIcon size={20} /><strong>{doc.name}</strong></div></TableCell>
                        <TableCell>{doc.type.split('/')[1]?.toUpperCase() || doc.type}</TableCell>
                        <TableCell>{formatFileSize(doc.size)}</TableCell>
                        <TableCell>{doc.client_name || '-'}</TableCell>
                        <TableCell><Tag type={statusConfig[doc.status].type} size="sm">{statusConfig[doc.status].label}</Tag></TableCell>
                        <TableCell>{new Date(doc.created_at).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell><OverflowMenu flipped size="sm" ariaLabel="Ações"><OverflowMenuItem itemText="Download" onClick={() => doc.url && window.open(doc.url)} /><OverflowMenuItem itemText="Excluir" isDelete onClick={() => handleDelete(doc.id)} /></OverflowMenu></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {filteredDocuments.length > pageSize && (
        <Pagination totalItems={filteredDocuments.length} pageSize={pageSize} page={currentPage} pageSizes={[20, 40, 100]} onChange={({ page, pageSize }) => { setCurrentPage(page); setPageSize(pageSize); }} />
      )}

      {/* Upload Modal */}
      <Modal open={uploadModalOpen} onRequestClose={() => { setUploadModalOpen(false); setUploadFiles([]); }} onRequestSubmit={handleUpload} modalHeading="Upload de Documentos" primaryButtonText="Enviar" secondaryButtonText="Cancelar" primaryButtonDisabled={uploadFiles.length === 0} size="md">
        <div className="modal-form">
          <FileUploaderDropContainer
            accept={['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg', '.gif', '.zip']}
            labelText="Arraste arquivos aqui ou clique para selecionar"
            multiple
            onAddFiles={(e, { addedFiles }) => {
              const files = addedFiles.map((f) => (f as unknown as { file: File }).file || f);
              setUploadFiles(prev => [...prev, ...files.filter((f): f is File => f instanceof File)]);
            }}
          />
          {uploadFiles.length > 0 && (
            <div className="upload-files-list">
              {uploadFiles.map((file, index) => (
                <FileUploaderItem
                  key={index}
                  name={file.name}
                  status="edit"
                  onDelete={() => setUploadFiles(prev => prev.filter((_, i) => i !== index))}
                />
              ))}
            </div>
          )}
          {uploadProgress !== null && <ProgressBar label="Enviando..." value={uploadProgress} />}
          <div className="form-row form-row--split">
            <Select id="upload-client" labelText="Cliente (opcional)" value={uploadFormData.client_id} onChange={(e) => setUploadFormData({ ...uploadFormData, client_id: e.target.value, project_id: '' })}><SelectItem value="" text="Nenhum" />{clients.map((c) => (<SelectItem key={c.id} value={c.id} text={c.name} />))}</Select>
            <Select id="upload-project" labelText="Projeto (opcional)" value={uploadFormData.project_id} onChange={(e) => setUploadFormData({ ...uploadFormData, project_id: e.target.value })} disabled={!uploadFormData.client_id}><SelectItem value="" text="Nenhum" />{filteredProjects.map((p) => (<SelectItem key={p.id} value={p.id} text={p.title} />))}</Select>
          </div>
        </div>
      </Modal>

      {/* Create Folder Modal */}
      <Modal open={folderModalOpen} onRequestClose={() => setFolderModalOpen(false)} onRequestSubmit={handleCreateFolder} modalHeading="Nova Pasta" primaryButtonText="Criar" secondaryButtonText="Cancelar" primaryButtonDisabled={!folderFormData.name} size="sm">
        <div className="modal-form">
          <TextInput id="folder-name" labelText="Nome da pasta *" value={folderFormData.name} onChange={(e) => setFolderFormData({ ...folderFormData, name: e.target.value })} required />
          <Select id="folder-color" labelText="Cor" value={folderFormData.color} onChange={(e) => setFolderFormData({ ...folderFormData, color: e.target.value })}>
            <SelectItem value="blue" text="Azul" />
            <SelectItem value="green" text="Verde" />
            <SelectItem value="purple" text="Roxo" />
            <SelectItem value="red" text="Vermelho" />
            <SelectItem value="yellow" text="Amarelo" />
          </Select>
        </div>
      </Modal>

      {/* View Document Modal */}
      <Modal open={!!viewDocModal} onRequestClose={() => setViewDocModal(null)} modalHeading={viewDocModal?.name || ''} passiveModal size="lg">
        {viewDocModal && (
          <div className="document-view">
            <div className="document-view__preview">
              {viewDocModal.type.includes('image') && viewDocModal.url ? (
                <img src={viewDocModal.url} alt={viewDocModal.name} />
              ) : (
                <div className="document-view__icon">{(() => { const Icon = getFileIcon(viewDocModal.type); return <Icon size={64} />; })()}</div>
              )}
            </div>
            <div className="document-view__info">
              <div><strong>Tipo:</strong> {viewDocModal.type}</div>
              <div><strong>Tamanho:</strong> {formatFileSize(viewDocModal.size)}</div>
              <div><strong>Versão:</strong> {viewDocModal.version}</div>
              <div><strong>Criado:</strong> {new Date(viewDocModal.created_at).toLocaleString('pt-BR')}</div>
              {viewDocModal.client_name && <div><strong>Cliente:</strong> {viewDocModal.client_name}</div>}
              {viewDocModal.project_title && <div><strong>Projeto:</strong> {viewDocModal.project_title}</div>}
            </div>
            <div className="document-view__actions">
              <Button kind="tertiary" renderIcon={Copy}>Copiar Link</Button>
              <Button kind="tertiary" renderIcon={Share}>Compartilhar</Button>
              <Button kind="primary" renderIcon={Download} onClick={() => viewDocModal.url && window.open(viewDocModal.url)}>Download</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
