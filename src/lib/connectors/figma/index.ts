import 'server-only';

import type { SyncResult } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = import('@supabase/supabase-js').SupabaseClient<any, any, any>;

interface FigmaImage {
  nodeId: string;
  url: string;
  name: string;
}

async function figmaFetch(accessToken: string, path: string) {
  const res = await fetch(`https://api.figma.com/v1${path}`, {
    headers: { 'X-FIGMA-TOKEN': accessToken },
  });

  if (!res.ok) {
    throw new Error(`Figma API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function testFigmaConnection(accessToken: string): Promise<boolean> {
  try {
    await figmaFetch(accessToken, '/me');
    return true;
  } catch {
    return false;
  }
}

export async function syncFigmaAssets(
  supabase: AnySupabaseClient,
  accessToken: string,
  fileKey: string,
  orgId: string
): Promise<SyncResult> {
  const result: SyncResult = {
    connector: 'figma',
    syncedAt: new Date().toISOString(),
    created: 0,
    updated: 0,
    errors: [],
  };

  try {
    // Get images from the Figma file
    const fileData = await figmaFetch(accessToken, `/files/${fileKey}`);
    const nodeIds: string[] = [];

    // Traverse the document to collect frame node IDs (top-level only)
    const pages = fileData.document?.children ?? [];
    for (const page of pages) {
      for (const child of page.children ?? []) {
        if (child.type === 'FRAME' || child.type === 'COMPONENT') {
          nodeIds.push(child.id);
        }
      }
    }

    if (nodeIds.length === 0) return result;

    // Export images
    const ids = nodeIds.slice(0, 50).join(','); // limit to 50
    const imagesData = await figmaFetch(
      accessToken,
      `/images/${fileKey}?ids=${ids}&format=png&scale=2`
    );

    const images: Record<string, string> = imagesData.images ?? {};

    for (const [nodeId, imageUrl] of Object.entries(images)) {
      if (!imageUrl) continue;

      try {
        // Download the image
        const imgRes = await fetch(imageUrl);
        if (!imgRes.ok) continue;

        const buffer = Buffer.from(await imgRes.arrayBuffer());
        const safeName = `${nodeId.replace(':', '-')}.png`;
        const filePath = `${orgId}/figma/${safeName}`;

        const { error } = await supabase.storage
          .from('media')
          .upload(filePath, buffer, {
            contentType: 'image/png',
            upsert: true,
          });

        if (error) {
          result.errors.push(`Upload ${nodeId}: ${error.message}`);
        } else {
          result.created++;
        }
      } catch (err) {
        result.errors.push(`Download ${nodeId}: ${err instanceof Error ? err.message : 'unknown'}`);
      }
    }
  } catch (err) {
    result.errors.push(err instanceof Error ? err.message : 'Unknown error');
  }

  return result;
}
