'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  TextArea,
  Button,
  IconButton,
} from '@carbon/react';
import {
  Add,
  TrashCan,
  ChevronUp,
  ChevronDown,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface Slide {
  id: number;
  caption: string;
  color: string;
}

const initialSlides: Slide[] = [
  { id: 1, caption: 'Introducing our newest product line — designed for the modern creator.', color: '#4589ff' },
  { id: 2, caption: 'Built with sustainability in mind. Every detail matters.', color: '#0f62fe' },
  { id: 3, caption: 'Hear what our customers have to say about their experience.', color: '#0043ce' },
  { id: 4, caption: 'Available now. Swipe up to shop the collection.', color: '#002d9c' },
];

let nextId = 5;

export default function CarouselEditorPage() {
  const { t } = useTranslation();
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [previewIndex, setPreviewIndex] = useState(0);

  const colors = ['#4589ff', '#0f62fe', '#0043ce', '#002d9c', '#001d6c', '#24a148', '#da1e28', '#8a3ffc'];

  const addSlide = () => {
    const color = colors[slides.length % colors.length];
    setSlides([...slides, { id: nextId++, caption: '', color }]);
  };

  const removeSlide = (index: number) => {
    if (slides.length <= 1) return;
    const updated = slides.filter((_, i) => i !== index);
    setSlides(updated);
    if (previewIndex >= updated.length) {
      setPreviewIndex(Math.max(0, updated.length - 1));
    }
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;
    const updated = [...slides];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setSlides(updated);
  };

  const updateCaption = (index: number, caption: string) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], caption };
    setSlides(updated);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>
        {t('Content Carousel Editor')}
      </h1>
      <p style={{ marginBottom: '2rem', color: '#525252' }}>
        {t('Create and arrange carousel slides for your social media posts.')}
      </p>

      <Grid narrow>
        {/* Slide Editor Column */}
        <Column sm={4} md={5} lg={9}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>{t('Slides')} ({slides.length})</h3>
            <Button
              kind="primary"
              size="sm"
              renderIcon={Add}
              onClick={addSlide}
            >
              {t('Add Slide')}
            </Button>
          </div>

          <Grid narrow>
            {slides.map((slide, index) => (
              <Column key={slide.id} sm={4} md={4} lg={8} style={{ marginBottom: '1rem' }}>
                <Tile style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                      {t('Slide')} {index + 1}
                    </h4>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <IconButton
                        kind="ghost"
                        size="sm"
                        label={t('Move up')}
                        onClick={() => moveSlide(index, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp />
                      </IconButton>
                      <IconButton
                        kind="ghost"
                        size="sm"
                        label={t('Move down')}
                        onClick={() => moveSlide(index, 'down')}
                        disabled={index === slides.length - 1}
                      >
                        <ChevronDown />
                      </IconButton>
                      <IconButton
                        kind="ghost"
                        size="sm"
                        label={t('Remove slide')}
                        onClick={() => removeSlide(index)}
                        disabled={slides.length <= 1}
                      >
                        <TrashCan />
                      </IconButton>
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: slide.color,
                      height: '80px',
                      borderRadius: '4px',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </div>
                  <TextArea
                    id={`caption-${slide.id}`}
                    labelText={t('Caption')}
                    placeholder={t('Enter slide caption...')}
                    value={slide.caption}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateCaption(index, e.target.value)
                    }
                    rows={2}
                  />
                </Tile>
              </Column>
            ))}
          </Grid>
        </Column>

        {/* Preview Column */}
        <Column sm={4} md={3} lg={7}>
          <h3 style={{ marginBottom: '1rem' }}>{t('Preview')}</h3>
          <Tile style={{ padding: '1.5rem' }}>
            {slides.length > 0 && (
              <>
                <div
                  style={{
                    backgroundColor: slides[previewIndex]?.color || '#e0e0e0',
                    height: '300px',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '3rem',
                    fontWeight: 700,
                  }}
                >
                  {previewIndex + 1}
                </div>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem', minHeight: '2.5rem' }}>
                  {slides[previewIndex]?.caption || t('(No caption)')}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPreviewIndex(i)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: i === previewIndex ? '2px solid #0f62fe' : '1px solid #a8a8a8',
                        backgroundColor: i === previewIndex ? '#0f62fe' : 'transparent',
                        color: i === previewIndex ? '#fff' : '#161616',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </>
            )}
          </Tile>

          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>{t('Slide Sequence')}</h4>
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {slides.map((slide, i) => (
                <div
                  key={slide.id}
                  onClick={() => setPreviewIndex(i)}
                  style={{
                    minWidth: '64px',
                    height: '64px',
                    backgroundColor: slide.color,
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: i === previewIndex ? '2px solid #161616' : '2px solid transparent',
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </Column>
      </Grid>
    </div>
  );
}
