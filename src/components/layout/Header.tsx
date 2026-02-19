'use client';

import { useRouter } from 'next/navigation';
import {
  Header as CarbonHeader,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from '@carbon/react';
import {
  Search,
  Notification,
  UserAvatar,
  Help,
  Logout,
  Asleep,
  Light,
  Language,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from '@/lib/theme/context';
import { useTranslation } from '@/lib/i18n/context';

interface HeaderProps {
  orgName?: string;
}

export default function Header({ orgName = 'Cestari Studio' }: HeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useTranslation();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleToggleLocale = () => {
    setLocale(locale === 'pt-BR' ? 'en' : 'pt-BR');
  };

  return (
    <CarbonHeader aria-label="genOS Content Factory" className="genos-header">
      <HeaderName prefix="">
        {orgName}
      </HeaderName>

      <HeaderGlobalBar>
        <HeaderGlobalAction aria-label={t('header.search')} tooltipAlignment="end">
          <Search size={20} />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label={t('header.notifications')} tooltipAlignment="end">
          <Notification size={20} />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label={t('header.help')} tooltipAlignment="end">
          <Help size={20} />
        </HeaderGlobalAction>
        <HeaderGlobalAction
          aria-label={t('header.toggleTheme')}
          tooltipAlignment="end"
          onClick={toggleTheme}
        >
          {theme === 'g10' ? <Asleep size={20} /> : <Light size={20} />}
        </HeaderGlobalAction>
        <HeaderGlobalAction
          aria-label={t('header.switchLanguage')}
          tooltipAlignment="end"
          onClick={handleToggleLocale}
        >
          <Language size={20} />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label={t('header.profile')} tooltipAlignment="end">
          <UserAvatar size={20} />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label={t('header.logout')} tooltipAlignment="end" onClick={handleLogout}>
          <Logout size={20} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </CarbonHeader>
  );
}
