'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TextArea,
  TextInput,
  Select,
  SelectItem,
  Tag,
  Button,
  Section,
  Heading,
} from '@carbon/react';
import { Save, Add } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

export default function DnaEditorPage() {
  const { t } = useTranslation();

  // Voice state
  const [voiceDescription, setVoiceDescription] = useState(
    'Our brand voice is confident yet approachable. We communicate complex ideas in simple, human terms. We are experts who never talk down to our audience. We inspire action through clarity and purpose.'
  );
  const [tone, setTone] = useState('professional');
  const [keywords, setKeywords] = useState([
    'Innovative',
    'Trustworthy',
    'Bold',
    'Human-Centric',
    'Forward-Thinking',
    'Empowering',
  ]);
  const [newKeyword, setNewKeyword] = useState('');

  // Visual state
  const [primaryColor, setPrimaryColor] = useState('#0F62FE');
  const [secondaryColor, setSecondaryColor] = useState('#6929C4');
  const [accentColor, setAccentColor] = useState('#009D9A');

  // Strategy state
  const [contentPillars, setContentPillars] = useState(
    '1. Thought Leadership — Publish insights on emerging trends in our industry\n2. Product Innovation — Showcase how our solutions solve real-world problems\n3. Customer Success — Amplify stories from customers achieving their goals\n4. Culture & Values — Share our company culture and social impact initiatives'
  );
  const [forbiddenWords, setForbiddenWords] = useState(
    'cheap, guarantee, best-in-class, synergy, disrupt, pivot, leverage (as verb), guru, ninja, rockstar, game-changer, bleeding edge, circle back, move the needle'
  );

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <Section level={1}>
          <Heading style={{ marginBottom: '1.5rem' }}>{t('DNA Editor')}</Heading>
        </Section>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <Tabs>
          <TabList aria-label="DNA Editor tabs">
            <Tab>{t('Voice')}</Tab>
            <Tab>{t('Visual')}</Tab>
            <Tab>{t('Strategy')}</Tab>
          </TabList>
          <TabPanels>
            {/* Voice Tab */}
            <TabPanel>
              <Grid fullWidth style={{ marginTop: '1.5rem' }}>
                <Column lg={10} md={6} sm={4} style={{ marginBottom: '1.5rem' }}>
                  <Tile style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>{t('Brand Voice')}</h4>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <TextArea
                        id="voice-description"
                        labelText={t('Voice Description')}
                        value={voiceDescription}
                        onChange={(e) => setVoiceDescription(e.target.value)}
                        rows={6}
                        helperText={t('Describe how your brand communicates with its audience')}
                      />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <Select
                        id="tone-select"
                        labelText={t('Tone')}
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                      >
                        <SelectItem value="professional" text={t('Professional')} />
                        <SelectItem value="casual" text={t('Casual')} />
                        <SelectItem value="playful" text={t('Playful')} />
                        <SelectItem value="authoritative" text={t('Authoritative')} />
                      </Select>
                    </div>
                  </Tile>
                </Column>

                <Column lg={6} md={6} sm={4} style={{ marginBottom: '1.5rem' }}>
                  <Tile style={{ padding: '1.5rem', height: '100%' }}>
                    <h4 style={{ marginBottom: '1rem' }}>{t('Voice Keywords')}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {keywords.map((keyword) => (
                        <Tag
                          key={keyword}
                          type="purple"
                          filter
                          onClose={() => handleRemoveKeyword(keyword)}
                        >
                          {keyword}
                        </Tag>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                      <TextInput
                        id="new-keyword"
                        labelText={t('Add Keyword')}
                        placeholder={t('Enter keyword...')}
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                        size="sm"
                      />
                      <Button
                        size="sm"
                        kind="ghost"
                        renderIcon={Add}
                        hasIconOnly
                        iconDescription={t('Add keyword')}
                        onClick={handleAddKeyword}
                      />
                    </div>
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>

            {/* Visual Tab */}
            <TabPanel>
              <Grid fullWidth style={{ marginTop: '1.5rem' }}>
                <Column lg={5} md={4} sm={4} style={{ marginBottom: '1.5rem' }}>
                  <Tile style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>{t('Primary Color')}</h4>
                    <div
                      style={{
                        width: '100%',
                        height: '100px',
                        backgroundColor: primaryColor,
                        borderRadius: '4px',
                        marginBottom: '1rem',
                      }}
                    />
                    <TextInput
                      id="primary-color"
                      labelText={t('Hex Value')}
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#000000"
                    />
                  </Tile>
                </Column>
                <Column lg={5} md={4} sm={4} style={{ marginBottom: '1.5rem' }}>
                  <Tile style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>{t('Secondary Color')}</h4>
                    <div
                      style={{
                        width: '100%',
                        height: '100px',
                        backgroundColor: secondaryColor,
                        borderRadius: '4px',
                        marginBottom: '1rem',
                      }}
                    />
                    <TextInput
                      id="secondary-color"
                      labelText={t('Hex Value')}
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      placeholder="#000000"
                    />
                  </Tile>
                </Column>
                <Column lg={5} md={4} sm={4} style={{ marginBottom: '1.5rem' }}>
                  <Tile style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>{t('Accent Color')}</h4>
                    <div
                      style={{
                        width: '100%',
                        height: '100px',
                        backgroundColor: accentColor,
                        borderRadius: '4px',
                        marginBottom: '1rem',
                      }}
                    />
                    <TextInput
                      id="accent-color"
                      labelText={t('Hex Value')}
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      placeholder="#000000"
                    />
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>

            {/* Strategy Tab */}
            <TabPanel>
              <Grid fullWidth style={{ marginTop: '1.5rem' }}>
                <Column lg={8} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
                  <Tile style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>{t('Content Pillars')}</h4>
                    <TextArea
                      id="content-pillars"
                      labelText={t('Define your core content themes and pillars')}
                      value={contentPillars}
                      onChange={(e) => setContentPillars(e.target.value)}
                      rows={8}
                      helperText={t('These pillars guide all content creation decisions')}
                    />
                  </Tile>
                </Column>
                <Column lg={8} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
                  <Tile style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>{t('Forbidden Words & Phrases')}</h4>
                    <TextArea
                      id="forbidden-words"
                      labelText={t('Words and phrases to avoid in all content')}
                      value={forbiddenWords}
                      onChange={(e) => setForbiddenWords(e.target.value)}
                      rows={8}
                      helperText={t('Comma-separated list of words and phrases your brand should never use')}
                    />
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>

      {/* Save Button */}
      <Column lg={16} md={8} sm={4}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Button renderIcon={Save} size="lg">
            {t('Save DNA Configuration')}
          </Button>
        </div>
      </Column>
    </Grid>
  );
}
