'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Tag,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Dropdown,
  Section,
  Heading,
} from '@carbon/react';
import { ArrowUp, ArrowDown, NewTab } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const keywords = [
  { id: '1', keyword: 'AI content optimization', searchVolume: 12400, difficulty: 'hard', currentRank: 3, change: 'up', authorityScore: 92 },
  { id: '2', keyword: 'generative engine optimization', searchVolume: 8200, difficulty: 'medium', currentRank: 1, change: 'up', authorityScore: 96 },
  { id: '3', keyword: 'SEO automation tools', searchVolume: 6800, difficulty: 'hard', currentRank: 7, change: 'down', authorityScore: 78 },
  { id: '4', keyword: 'content strategy AI', searchVolume: 5400, difficulty: 'medium', currentRank: 5, change: 'up', authorityScore: 85 },
  { id: '5', keyword: 'brand voice generator', searchVolume: 4100, difficulty: 'easy', currentRank: 2, change: 'up', authorityScore: 91 },
  { id: '6', keyword: 'keyword clustering tool', searchVolume: 3900, difficulty: 'medium', currentRank: 11, change: 'down', authorityScore: 72 },
  { id: '7', keyword: 'semantic SEO platform', searchVolume: 3200, difficulty: 'hard', currentRank: 8, change: 'up', authorityScore: 80 },
  { id: '8', keyword: 'competitor content analysis', searchVolume: 2800, difficulty: 'easy', currentRank: 4, change: 'new', authorityScore: 88 },
  { id: '9', keyword: 'AI writing assistant enterprise', searchVolume: 2500, difficulty: 'hard', currentRank: 15, change: 'down', authorityScore: 65 },
  { id: '10', keyword: 'content performance analytics', searchVolume: 2200, difficulty: 'medium', currentRank: 9, change: 'up', authorityScore: 76 },
  { id: '11', keyword: 'multi-language SEO', searchVolume: 1900, difficulty: 'easy', currentRank: 6, change: 'new', authorityScore: 83 },
  { id: '12', keyword: 'GEO score tracker', searchVolume: 1600, difficulty: 'easy', currentRank: 1, change: 'up', authorityScore: 97 },
  { id: '13', keyword: 'viral content predictor', searchVolume: 1400, difficulty: 'medium', currentRank: 18, change: 'down', authorityScore: 59 },
  { id: '14', keyword: 'AI knowledge base builder', searchVolume: 1100, difficulty: 'medium', currentRank: 12, change: 'up', authorityScore: 71 },
  { id: '15', keyword: 'sentiment analysis marketing', searchVolume: 980, difficulty: 'easy', currentRank: 10, change: 'new', authorityScore: 74 },
];

const headers = [
  { key: 'keyword', header: 'Keyword' },
  { key: 'searchVolume', header: 'Search Volume' },
  { key: 'difficulty', header: 'Difficulty' },
  { key: 'currentRank', header: 'Current Rank' },
  { key: 'change', header: 'Change' },
  { key: 'authorityScore', header: 'Authority Score' },
];

const difficultyItems = [
  { id: 'all', text: 'All Difficulties' },
  { id: 'easy', text: 'Easy' },
  { id: 'medium', text: 'Medium' },
  { id: 'hard', text: 'Hard' },
];

function ChangeTag({ change }: { change: string }) {
  if (change === 'up') return <Tag type="green" size="sm" renderIcon={ArrowUp}>Up</Tag>;
  if (change === 'down') return <Tag type="red" size="sm" renderIcon={ArrowDown}>Down</Tag>;
  return <Tag type="purple" size="sm" renderIcon={NewTab}>New</Tag>;
}

function DifficultyTag({ difficulty }: { difficulty: string }) {
  if (difficulty === 'easy') return <Tag type="green" size="sm">Easy</Tag>;
  if (difficulty === 'medium') return <Tag type="teal" size="sm">Medium</Tag>;
  return <Tag type="red" size="sm">Hard</Tag>;
}

export default function KeywordsPage() {
  const { t } = useTranslation();
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = keywords.filter((kw) => {
    const matchesDifficulty = difficultyFilter === 'all' || kw.difficulty === difficultyFilter;
    const matchesSearch = kw.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  const rows = filtered.map((kw) => ({
    id: kw.id,
    keyword: kw.keyword,
    searchVolume: kw.searchVolume.toLocaleString(),
    difficulty: kw.difficulty,
    currentRank: kw.currentRank,
    change: kw.change,
    authorityScore: kw.authorityScore,
  }));

  return (
    <div style={{ padding: '2rem' }}>
      <Section level={1}>
        <Heading style={{ marginBottom: '0.5rem' }}>
          {t('Keyword Authority')}
        </Heading>
        <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '2rem' }}>
          {t('Track keyword rankings, search volume, and your authority score across target queries.')}
        </p>
      </Section>

      {/* Stats Tiles */}
      <Grid style={{ marginBottom: '2rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
              {t('Total Keywords')}
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: 600 }}>856</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
              {t('Top 10 Rankings')}
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: 600 }}>43</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
              {t('Avg Position')}
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: 600 }}>14.2</p>
          </Tile>
        </Column>
      </Grid>

      {/* Filter */}
      <Grid style={{ marginBottom: '1rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Dropdown
            id="difficulty-filter"
            titleText={t('Filter by Difficulty')}
            label={t('Select difficulty')}
            items={difficultyItems}
            itemToString={(item: any) => (item ? item.text : '')}
            onChange={({ selectedItem }: any) =>
              setDifficultyFilter(selectedItem?.id || 'all')
            }
          />
        </Column>
      </Grid>

      {/* Data Table */}
      <DataTable rows={rows} headers={headers}>
        {({
          rows: tableRows,
          headers: tableHeaders,
          getTableProps,
          getHeaderProps,
          getRowProps,
          onInputChange,
        }: any) => (
          <TableContainer title={t('Keyword Rankings')}>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  onChange={(e: any) => {
                    onInputChange(e);
                    setSearchTerm(e.target?.value || '');
                  }}
                  placeholder={t('Search keywords...')}
                />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header: any) => (
                    <TableHeader {...getHeaderProps({ header })} key={header.key}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((row: any) => (
                  <TableRow {...getRowProps({ row })} key={row.id}>
                    {row.cells.map((cell: any) => {
                      if (cell.info.header === 'change') {
                        return (
                          <TableCell key={cell.id}>
                            <ChangeTag change={cell.value} />
                          </TableCell>
                        );
                      }
                      if (cell.info.header === 'difficulty') {
                        return (
                          <TableCell key={cell.id}>
                            <DifficultyTag difficulty={cell.value} />
                          </TableCell>
                        );
                      }
                      if (cell.info.header === 'authorityScore') {
                        return (
                          <TableCell key={cell.id}>
                            <strong>{cell.value}</strong>/100
                          </TableCell>
                        );
                      }
                      if (cell.info.header === 'currentRank') {
                        return (
                          <TableCell key={cell.id}>#{cell.value}</TableCell>
                        );
                      }
                      return <TableCell key={cell.id}>{cell.value}</TableCell>;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
}
