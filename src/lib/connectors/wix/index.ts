import 'server-only';

import type { SyncResult } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = import('@supabase/supabase-js').SupabaseClient<any, any, any>;

interface WixContact {
  id: string;
  info: {
    name?: { first?: string; last?: string };
    emails?: { email: string }[];
    phones?: { phone: string }[];
    company?: string;
  };
}

async function wixFetch(apiKey: string, path: string, body?: unknown) {
  const res = await fetch(`https://www.wixapis.com/contacts/v4${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: apiKey,
      'Content-Type': 'application/json',
      'wix-site-id': '', // extracted from settings
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    throw new Error(`Wix API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function testWixConnection(apiKey: string): Promise<boolean> {
  try {
    await wixFetch(apiKey, '/contacts/query', { query: { paging: { limit: 1 } } });
    return true;
  } catch {
    return false;
  }
}

export async function syncWixContacts(
  supabase: AnySupabaseClient,
  apiKey: string,
  orgId: string
): Promise<SyncResult> {
  const result: SyncResult = {
    connector: 'wix',
    syncedAt: new Date().toISOString(),
    created: 0,
    updated: 0,
    errors: [],
  };

  try {
    const data = await wixFetch(apiKey, '/contacts/query', {
      query: { paging: { limit: 100 } },
    });

    const contacts: WixContact[] = data.contacts ?? [];

    for (const contact of contacts) {
      const name = [contact.info.name?.first, contact.info.name?.last]
        .filter(Boolean)
        .join(' ') || 'Sem nome';

      const email = contact.info.emails?.[0]?.email;
      const phone = contact.info.phones?.[0]?.phone;

      // Check if contact already synced
      const { data: existing } = await supabase
        .from('clients')
        .select('id')
        .eq('wix_contact_id', contact.id)
        .eq('organization_id', orgId)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('clients')
          .update({ name, email, phone, company: contact.info.company })
          .eq('id', existing.id);

        if (error) result.errors.push(`Update ${contact.id}: ${error.message}`);
        else result.updated++;
      } else {
        const { error } = await supabase
          .from('clients')
          .insert({
            name,
            email,
            phone,
            company: contact.info.company,
            wix_contact_id: contact.id,
            organization_id: orgId,
          });

        if (error) result.errors.push(`Create ${contact.id}: ${error.message}`);
        else result.created++;
      }
    }
  } catch (err) {
    result.errors.push(err instanceof Error ? err.message : 'Unknown error');
  }

  return result;
}
