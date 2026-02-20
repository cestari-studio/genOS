import { I18nProvider } from '@/lib/i18n/context';
import '../globals.scss';
import './login.scss';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <I18nProvider>{children}</I18nProvider>;
}
