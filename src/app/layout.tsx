import type { Metadata } from 'next';
import { Content, Theme } from '@carbon/react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import './globals.scss';

export const metadata: Metadata = {
  title: 'genOS Content Factory',
  description: 'Sistema de gestão de conteúdo - Cestari Studio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Theme theme="g10">
          <div className="app-container">
            <Theme theme="g100">
              <Sidebar />
            </Theme>
            <div className="main-wrapper">
              <Header />
              <Content className="main-content">
                {children}
              </Content>
            </div>
          </div>
        </Theme>
      </body>
    </html>
  );
}
