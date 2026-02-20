'use client';

import {
  Grid,
  Column,
  ClickableTile,
  Tag,
  Button,
  Breadcrumb,
  BreadcrumbItem,
} from '@carbon/react';
import { Add, Chemistry } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';
import Link from 'next/link';

interface Brand {
  id: string;
  name: string;
  description: string;
  color: string;
  hasDna: boolean;
}

const mockBrands: Brand[] = [
  {
    id: 'brand-1',
    name: 'Cestari Studio',
    description: 'Main agency brand focused on creative content production and digital strategy.',
    color: '#0f62fe',
    hasDna: true,
  },
  {
    id: 'brand-2',
    name: 'TechCorp Brasil',
    description: 'B2B technology company with an emphasis on innovation and digital transformation.',
    color: '#6929c4',
    hasDna: true,
  },
  {
    id: 'brand-3',
    name: 'Startup XYZ',
    description: 'Early-stage fintech startup targeting young professionals and digital natives.',
    color: '#009d9a',
    hasDna: false,
  },
  {
    id: 'brand-4',
    name: 'Empresa ABC',
    description: 'Traditional retail brand expanding its presence in e-commerce and social media.',
    color: '#da1e28',
    hasDna: false,
  },
];

export default function BrandsListContent() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/dashboard">{t('sidebar.dashboard')}</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{t('brands.title')}</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>{t('brands.title')}</h1>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>
            {t('brands.subtitle')}
          </p>
        </div>
        <Button renderIcon={Add} size="sm">
          {t('brands.newBrand')}
        </Button>
      </div>

      {/* Brand Cards */}
      <Grid fullWidth>
        {mockBrands.map((brand) => (
          <Column key={brand.id} lg={8} md={4} sm={4} style={{ marginBottom: '1rem' }}>
            <ClickableTile
              style={{ height: '100%', position: 'relative', overflow: 'hidden' }}
              href={`/brands/${brand.id}/dna`}
            >
              {/* Color accent bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: brand.color,
                }}
              />

              {/* Card content */}
              <div style={{ paddingTop: '0.75rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Brand color swatch */}
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: brand.color,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                        {brand.name}
                      </h3>
                      <Tag
                        type={brand.hasDna ? 'green' : 'gray'}
                        size="sm"
                        style={{ marginTop: '0.25rem' }}
                      >
                        {brand.hasDna ? t('brands.dnaConfigured') : t('brands.dnaPending')}
                      </Tag>
                    </div>
                  </div>
                </div>

                <p
                  style={{
                    color: 'var(--cds-text-secondary)',
                    fontSize: '0.875rem',
                    margin: '0 0 1rem',
                    lineHeight: '1.5',
                  }}
                >
                  {brand.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link
                    href={`/brands/${brand.id}/dna`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      kind="tertiary"
                      size="sm"
                      renderIcon={Chemistry}
                    >
                      {t('brands.configureDna')}
                    </Button>
                  </Link>
                </div>
              </div>
            </ClickableTile>
          </Column>
        ))}
      </Grid>
    </div>
  );
}
