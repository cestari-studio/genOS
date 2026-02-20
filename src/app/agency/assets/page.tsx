'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  FileUploader,
  Button,
  Search,
  Tag,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Modal,
} from '@carbon/react';
import {
  Image,
  Document,
  Upload,
  Folder,
  Download,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface Asset {
  id: number;
  name: string;
  type: string;
  format: string;
  size: string;
  category: string;
  updatedAt: string;
  thumbnail: string;
}

const assets: Asset[] = [
  { id: 1, name: 'Brand Template Pack', type: 'template', format: 'PSD', size: '24MB', category: 'templates', updatedAt: '2026-02-18', thumbnail: '/thumbnails/brand-template.png' },
  { id: 2, name: 'Social Media Kit', type: 'kit', format: 'ZIP', size: '56MB', category: 'media', updatedAt: '2026-02-17', thumbnail: '/thumbnails/social-kit.png' },
  { id: 3, name: 'Logo Guidelines', type: 'document', format: 'PDF', size: '8MB', category: 'documents', updatedAt: '2026-02-16', thumbnail: '/thumbnails/logo-guide.png' },
  { id: 4, name: 'Email Campaign Templates', type: 'template', format: 'HTML', size: '3MB', category: 'templates', updatedAt: '2026-02-15', thumbnail: '/thumbnails/email-templates.png' },
  { id: 5, name: 'Product Photography Set', type: 'media', format: 'JPG', size: '128MB', category: 'media', updatedAt: '2026-02-14', thumbnail: '/thumbnails/product-photos.png' },
  { id: 6, name: 'Brand Voice Document', type: 'document', format: 'DOCX', size: '2MB', category: 'documents', updatedAt: '2026-02-13', thumbnail: '/thumbnails/brand-voice.png' },
  { id: 7, name: 'Video Intro Sequence', type: 'media', format: 'MOV', size: '210MB', category: 'media', updatedAt: '2026-02-12', thumbnail: '/thumbnails/video-intro.png' },
  { id: 8, name: 'Pitch Deck Master', type: 'template', format: 'PPTX', size: '18MB', category: 'templates', updatedAt: '2026-02-11', thumbnail: '/thumbnails/pitch-deck.png' },
  { id: 9, name: 'Typography Specimen', type: 'document', format: 'PDF', size: '5MB', category: 'documents', updatedAt: '2026-02-10', thumbnail: '/thumbnails/typography.png' },
  { id: 10, name: 'Icon Library', type: 'kit', format: 'SVG', size: '12MB', category: 'media', updatedAt: '2026-02-09', thumbnail: '/thumbnails/icon-library.png' },
  { id: 11, name: 'Annual Report Template', type: 'template', format: 'INDD', size: '34MB', category: 'templates', updatedAt: '2026-02-08', thumbnail: '/thumbnails/annual-report.png' },
  { id: 12, name: 'Client Onboarding Packet', type: 'document', format: 'PDF', size: '6MB', category: 'documents', updatedAt: '2026-02-07', thumbnail: '/thumbnails/onboarding.png' },
];

const categoryMap: Record<string, string> = {
  templates: 'Templates',
  documents: 'Documents',
  media: 'Media',
};

function getAssetIcon(type: string) {
  switch (type) {
    case 'template':
    case 'kit':
      return <Folder size={20} />;
    case 'document':
      return <Document size={20} />;
    case 'media':
      return <Image size={20} />;
    default:
      return <Document size={20} />;
  }
}

function getFormatTagColor(format: string): string {
  const colorMap: Record<string, string> = {
    PSD: 'purple',
    ZIP: 'blue',
    PDF: 'red',
    HTML: 'teal',
    JPG: 'green',
    DOCX: 'cyan',
    MOV: 'magenta',
    PPTX: 'orange',
    SVG: 'warm-gray',
    INDD: 'purple',
  };
  return colorMap[format] || 'gray';
}

export default function AgencyAssetsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const tabCategories = ['all', 'templates', 'documents', 'media'];

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      searchQuery === '' ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      tabCategories[selectedTabIndex] === 'all' ||
      asset.category === tabCategories[selectedTabIndex];
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1>Agency Asset Library</h1>
        <p style={{ color: '#525252', marginTop: '0.5rem' }}>
          Manage and organize your agency creative assets, templates, and brand resources.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Search
            labelText="Search assets"
            placeholder="Search by asset name..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          kind="primary"
          renderIcon={Upload}
          onClick={() => setUploadModalOpen(true)}
        >
          Upload Asset
        </Button>
      </div>

      <Tabs
        selectedIndex={selectedTabIndex}
        onChange={({ selectedIndex }: { selectedIndex: number }) =>
          setSelectedTabIndex(selectedIndex)
        }
      >
        <TabList aria-label="Asset categories">
          <Tab>All ({assets.length})</Tab>
          <Tab>Templates ({assets.filter((a) => a.category === 'templates').length})</Tab>
          <Tab>Documents ({assets.filter((a) => a.category === 'documents').length})</Tab>
          <Tab>Media ({assets.filter((a) => a.category === 'media').length})</Tab>
        </TabList>
        <TabPanels>
          {tabCategories.map((category) => (
            <TabPanel key={category}>
              <Grid style={{ marginTop: '1rem' }}>
                {filteredAssets.map((asset) => (
                  <Column key={asset.id} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
                    <Tile style={{ height: '100%' }}>
                      <div
                        style={{
                          height: '120px',
                          background: '#e0e0e0',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '1rem',
                        }}
                      >
                        {getAssetIcon(asset.type)}
                      </div>
                      <h4 style={{ marginBottom: '0.5rem' }}>{asset.name}</h4>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                        <Tag size="sm" type={getFormatTagColor(asset.format) as any}>
                          {asset.format}
                        </Tag>
                        <Tag size="sm" type="gray">
                          {categoryMap[asset.category] || asset.category}
                        </Tag>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.75rem' }}>
                        {asset.size} &middot; Updated {asset.updatedAt}
                      </p>
                      <Button kind="ghost" size="sm" renderIcon={Download}>
                        Download
                      </Button>
                    </Tile>
                  </Column>
                ))}
              </Grid>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      <Modal
        open={uploadModalOpen}
        modalHeading="Upload New Asset"
        primaryButtonText="Upload"
        secondaryButtonText="Cancel"
        onRequestClose={() => setUploadModalOpen(false)}
        onRequestSubmit={() => setUploadModalOpen(false)}
      >
        <p style={{ marginBottom: '1rem' }}>
          Select files to upload to the agency asset library. Supported formats include PSD, PDF,
          DOCX, JPG, PNG, SVG, MOV, ZIP, and more.
        </p>
        <FileUploader
          labelTitle="Upload files"
          labelDescription="Max file size is 500MB. Only supported formats are accepted."
          buttonLabel="Add files"
          filenameStatus="edit"
          accept={['.psd', '.pdf', '.docx', '.jpg', '.png', '.svg', '.mov', '.zip', '.pptx', '.indd', '.html']}
          multiple
        />
      </Modal>
    </div>
  );
}
