import type { Metadata } from 'next';
import { Content } from '@carbon/react';
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
        <div className="app-container">
          <Sidebar />
          <div className="main-wrapper">
            <Header />
            <Content className="main-content">
              {children}
            </Content>
          </div>
        </div>
      </body>
    </html>
  );
}
