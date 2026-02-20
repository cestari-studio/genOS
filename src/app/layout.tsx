import type { Metadata } from 'next';
import { Content } from '@carbon/react';
import ThemeWrapper from '@/components/layout/ThemeWrapper';
import './globals.scss';

export const metadata: Metadata = {
  title: 'genOS Content Factory',
  description: 'Sistema de gestão de conteúdo - Cestari Studio',
  other: {
    'theme-color': '#0f62fe',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeWrapper>
          <Content>
            {children}
          </Content>
        </ThemeWrapper>
      </body>
    </html>
  );
}
