'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Select,
  SelectItem,
  Button,
  Section,
  Heading,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  CodeSnippet,
} from '@carbon/react';
import { Add } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface Override {
  id: string;
  key: string;
  value: string;
  region: string;
}

const initialOverrides: Override[] = [
  { id: '1', key: 'currency_symbol', value: 'R$', region: 'Brazil' },
  { id: '2', key: 'date_format', value: 'DD/MM/YYYY', region: 'Brazil' },
  { id: '3', key: 'currency_symbol', value: '$', region: 'US' },
  { id: '4', key: 'date_format', value: 'MM/DD/YYYY', region: 'US' },
  { id: '5', key: 'currency_symbol', value: '€', region: 'EU' },
  { id: '6', key: 'date_format', value: 'DD.MM.YYYY', region: 'EU' },
  { id: '7', key: 'decimal_separator', value: ',', region: 'Brazil' },
  { id: '8', key: 'decimal_separator', value: '.', region: 'US' },
  { id: '9', key: 'currency_symbol', value: '¥', region: 'APAC' },
  { id: '10', key: 'date_format', value: 'YYYY/MM/DD', region: 'APAC' },
  { id: '11', key: 'measurement_unit', value: 'metric', region: 'EU' },
  { id: '12', key: 'measurement_unit', value: 'imperial', region: 'US' },
];

const headers = [
  { key: 'key', header: 'Key' },
  { key: 'value', header: 'Value' },
  { key: 'region', header: 'Region' },
];

export default function RegionalConfigPage() {
  const { t } = useTranslation();
  const [region, setRegion] = useState('Brazil');
  const [language, setLanguage] = useState('pt-BR');
  const [overrides] = useState<Override[]>(initialOverrides);

  const filteredOverrides = overrides.filter((o) => o.region === region);

  const regionLanguageMap: Record<string, { value: string; label: string }[]> = {
    Brazil: [
      { value: 'pt-BR', label: 'Portuguese (Brazil)' },
      { value: 'en-US', label: 'English (US)' },
    ],
    US: [
      { value: 'en-US', label: 'English (US)' },
      { value: 'es-US', label: 'Spanish (US)' },
    ],
    EU: [
      { value: 'en-GB', label: 'English (UK)' },
      { value: 'de-DE', label: 'German' },
      { value: 'fr-FR', label: 'French' },
      { value: 'es-ES', label: 'Spanish (Spain)' },
    ],
    APAC: [
      { value: 'ja-JP', label: 'Japanese' },
      { value: 'zh-CN', label: 'Chinese (Simplified)' },
      { value: 'ko-KR', label: 'Korean' },
    ],
  };

  const jsonPreview = JSON.stringify(
    {
      region,
      language,
      overrides: filteredOverrides.reduce(
        (acc, o) => ({ ...acc, [o.key]: o.value }),
        {} as Record<string, string>
      ),
    },
    null,
    2
  );

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <Section level={1}>
          <Heading style={{ marginBottom: '1.5rem' }}>
            {t('Regional Configuration')}
          </Heading>
        </Section>
      </Column>

      {/* Region & Language Selectors */}
      <Column lg={4} md={4} sm={4} style={{ marginBottom: '1.5rem' }}>
        <Select
          id="region-select"
          labelText={t('Region')}
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
            const langs = regionLanguageMap[e.target.value];
            if (langs && langs.length > 0) {
              setLanguage(langs[0].value);
            }
          }}
        >
          <SelectItem value="Brazil" text="Brazil" />
          <SelectItem value="US" text="US" />
          <SelectItem value="EU" text="EU" />
          <SelectItem value="APAC" text="APAC" />
        </Select>
      </Column>

      <Column lg={4} md={4} sm={4} style={{ marginBottom: '1.5rem' }}>
        <Select
          id="language-select"
          labelText={t('Language')}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {(regionLanguageMap[region] || []).map((lang) => (
            <SelectItem key={lang.value} value={lang.value} text={lang.label} />
          ))}
        </Select>
      </Column>

      <Column lg={8} md={8} sm={4} style={{ marginBottom: '1.5rem' }} />

      {/* Data Table */}
      <Column lg={10} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
        <DataTable rows={filteredOverrides} headers={headers}>
          {({
            rows,
            headers: tableHeaders,
            getTableProps,
            getHeaderProps,
            getRowProps,
          }: {
            rows: any[];
            headers: any[];
            getTableProps: () => any;
            getHeaderProps: (args: { header: any }) => any;
            getRowProps: (args: { row: any }) => any;
          }) => (
            <TableContainer
              title={t('Locale-Specific Overrides')}
              description={t(`Showing overrides for ${region}`)}
            >
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {tableHeaders.map((header: any) => {
                      const headerProps = getHeaderProps({ header });
                      return (
                        <TableHeader key={header.key} {...headerProps}>
                          {header.header}
                        </TableHeader>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: any) => {
                    const rowProps = getRowProps({ row });
                    return (
                      <TableRow key={row.id} {...rowProps}>
                        {row.cells.map((cell: any) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
        <div style={{ marginTop: '1rem' }}>
          <Button renderIcon={Add} kind="tertiary" size="sm">
            {t('Add Override')}
          </Button>
        </div>
      </Column>

      {/* JSON Preview */}
      <Column lg={6} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
        <Tile style={{ padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>{t('JSON Preview')}</h4>
          <CodeSnippet type="multi" feedback={t('Copied!')}>
            {jsonPreview}
          </CodeSnippet>
        </Tile>
      </Column>
    </Grid>
  );
}
