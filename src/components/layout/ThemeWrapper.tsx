'use client';

import { Theme } from '@carbon/react';
import { ThemeProvider, useTheme } from '@/lib/theme/context';
import { I18nProvider } from '@/lib/i18n/context';
import Sidebar from './Sidebar';
import Header from './Header';

function ThemeWrapperInner({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <Theme theme={theme}>
      <div className="app-container">
        <Theme theme="g100">
          <Sidebar />
        </Theme>
        <div className="main-wrapper">
          <Header />
          {children}
        </div>
      </div>
    </Theme>
  );
}

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ThemeProvider>
        <ThemeWrapperInner>{children}</ThemeWrapperInner>
      </ThemeProvider>
    </I18nProvider>
  );
}
