'use client';

import { InlineLoading, SkeletonText, SkeletonPlaceholder } from '@carbon/react';
import './PageLoader.scss';

interface PageLoaderProps {
  type?: 'inline' | 'skeleton' | 'full';
  description?: string;
  rows?: number;
}

export default function PageLoader({ 
  type = 'inline', 
  description = 'Carregando...',
  rows = 3 
}: PageLoaderProps) {
  if (type === 'inline') {
    return (
      <div className="page-loader page-loader--inline">
        <InlineLoading description={description} status="active" />
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className="page-loader page-loader--skeleton">
        <div className="page-loader__header">
          <SkeletonText heading width="200px" />
          <SkeletonText paragraph lineCount={1} width="300px" />
        </div>
        <div className="page-loader__cards">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="page-loader__card">
              <SkeletonPlaceholder style={{ width: '100%', height: '100px' }} />
            </div>
          ))}
        </div>
        <div className="page-loader__content">
          <SkeletonText paragraph lineCount={rows} />
        </div>
      </div>
    );
  }

  return (
    <div className="page-loader page-loader--full">
      <div className="page-loader__spinner">
        <svg viewBox="0 0 100 100" className="page-loader__svg">
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            strokeWidth="8" 
            fill="none"
            className="page-loader__track"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            strokeWidth="8" 
            fill="none"
            className="page-loader__progress"
          />
        </svg>
        <div className="page-loader__logo">
          <span>g</span>
        </div>
      </div>
      <p className="page-loader__text">{description}</p>
    </div>
  );
}
