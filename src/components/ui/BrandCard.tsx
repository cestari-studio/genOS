'use client';

import React, { useMemo } from 'react';
import { Tile, Tag } from '@carbon/react';
import {
  LogoInstagram,
  LogoFacebook,
  LogoLinkedin,
  LogoX,
} from '@carbon/icons-react';
import type { Brand } from '@/types/database';

/**
 * Props for the BrandCard component
 */
interface BrandCardProps {
  /** Brand data object from database */
  brand: Brand;
  /** Total number of posts for this brand (optional) */
  totalPosts?: number;
  /** Callback when card is clicked */
  onClick?: () => void;
}

/**
 * Helper function to generate avatar initials from brand name
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Helper function to generate a consistent color from string
 */
function getColorFromString(str: string): string {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
    '#F8B88B',
    '#ABEBC6',
  ];
  const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

/**
 * BrandCard Component
 *
 * A compact card component for displaying brand summary information.
 * Features brand avatar, name, tagline, social media icons, keywords,
 * and post count with active/inactive status indicator.
 *
 * @example
 * ```tsx
 * <BrandCard
 *   brand={brandData}
 *   totalPosts={42}
 *   onClick={() => handleBrandSelect(brand.id)}
 * />
 * ```
 */
export default function BrandCard({ brand, totalPosts = 0, onClick }: BrandCardProps) {
  const avatarColor = useMemo(
    () => brand.primary_color || getColorFromString(brand.name),
    [brand.primary_color, brand.name]
  );

  const initials = useMemo(() => getInitials(brand.name), [brand.name]);

  const socialIcons = useMemo(() => {
    return [
      {
        handle: brand.instagram_handle,
        icon: LogoInstagram,
        platform: 'Instagram',
      },
      {
        handle: brand.facebook_page,
        icon: LogoFacebook,
        platform: 'Facebook',
      },
      {
        handle: brand.linkedin_page,
        icon: LogoLinkedin,
        platform: 'LinkedIn',
      },
      {
        handle: brand.twitter_handle,
        icon: LogoX,
        platform: 'Twitter/X',
      },
      {
        handle: brand.tiktok_handle,
        icon: LogoX,
        platform: 'TikTok',
      },
    ].filter((item) => item.handle);
  }, [
    brand.instagram_handle,
    brand.facebook_page,
    brand.linkedin_page,
    brand.twitter_handle,
    brand.tiktok_handle,
  ]);

  const displayedKeywords = useMemo(() => {
    const keywords = brand.keywords || [];
    if (keywords.length <= 3) {
      return keywords;
    }
    return [...keywords.slice(0, 3)];
  }, [brand.keywords]);

  const hasMoreKeywords = (brand.keywords || []).length > 3;
  const overflowCount = Math.max(0, (brand.keywords || []).length - 3);

  return (
    <Tile
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        padding: '16px',
        transition: 'all 0.2s ease',
      }}
      className="brand-card"
    >
      {/* Header with Avatar and Brand Info */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '12px',
          alignItems: 'flex-start',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '48px',
            height: '48px',
            minWidth: '48px',
            borderRadius: '50%',
            backgroundColor: avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 'bold',
            overflow: 'hidden',
          }}
        >
          {brand.logo_url ? (
            <img
              src={brand.logo_url}
              alt={brand.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            initials
          )}
        </div>

        {/* Name and Tagline */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              margin: '0 0 4px 0',
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'var(--genos-text-primary, #161616)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {brand.name}
          </h3>
          {brand.tagline && (
            <p
              style={{
                margin: '0',
                fontSize: '12px',
                color: 'var(--genos-text-secondary, #525252)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {brand.tagline}
            </p>
          )}
        </div>

        {/* Status Indicator */}
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: brand.is_active
              ? 'var(--genos-success, #24A148)'
              : 'var(--genos-border-subtle, #E0E0E0)',
            marginTop: '4px',
            flexShrink: 0,
          }}
          title={brand.is_active ? 'Ativa' : 'Inativa'}
        />
      </div>

      {/* Social Media Icons */}
      {socialIcons.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '12px',
            flexWrap: 'wrap',
          }}
        >
          {socialIcons.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.platform}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--genos-border-subtle, #E0E0E0)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
                title={item.platform}
              >
                <Icon size={14} style={{ color: avatarColor }} />
              </div>
            );
          })}
        </div>
      )}

      {/* Keywords as Tags */}
      {displayedKeywords.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '12px',
            flexWrap: 'wrap',
          }}
        >
          {displayedKeywords.map((keyword, idx) => (
            <Tag key={idx} type="cool-gray" size="sm">
              {keyword}
            </Tag>
          ))}
          {hasMoreKeywords && (
            <Tag type="outline" size="sm">
              +{overflowCount}
            </Tag>
          )}
        </div>
      )}

      {/* Footer with Posts Count */}
      <div
        style={{
          fontSize: '12px',
          color: 'var(--genos-text-secondary, #525252)',
          borderTop: '1px solid var(--genos-border-subtle, #E0E0E0)',
          paddingTop: '8px',
          marginTop: '8px',
        }}
      >
        <span>
          <strong>{totalPosts}</strong> post{totalPosts !== 1 ? 's' : ''}
        </span>
      </div>
    </Tile>
  );
}
