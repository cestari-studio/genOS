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
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';

interface HeaderProps {
  orgName?: string;
}

export default function Header({ orgName = 'Cestari Studio' }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <CarbonHeader aria-label="genOS Content Factory" className="genos-header">
      <HeaderName prefix="">
        {orgName}
      </HeaderName>

      <HeaderGlobalBar>
        <HeaderGlobalAction aria-label="Buscar" tooltipAlignment="end">
          <Search size={20} />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label="Notificações" tooltipAlignment="end">
          <Notification size={20} />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label="Ajuda" tooltipAlignment="end">
          <Help size={20} />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label="Perfil" tooltipAlignment="end">
          <UserAvatar size={20} />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label="Sair" tooltipAlignment="end" onClick={handleLogout}>
          <Logout size={20} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </CarbonHeader>
  );
}
