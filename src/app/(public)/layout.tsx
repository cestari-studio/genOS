import { I18nProvider } from '@/lib/i18n/context';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <div style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </I18nProvider>
  );
}
