import type { AIGenerationRequest, BrandIdentityPackage } from './types';

const PLATFORM_LIMITS: Record<string, string> = {
  instagram: 'Limite de 2200 caracteres. Use emojis e hashtags.',
  twitter: 'Limite de 280 caracteres. Seja conciso e impactante.',
  linkedin: 'Tom profissional. Até 3000 caracteres. Use formatação com bullets.',
  facebook: 'Até 63206 caracteres. Incentive engajamento e compartilhamento.',
  blog: 'Formato longo. Use headings, subheadings e SEO keywords.',
  email: 'Assunto impactante. Corpo conciso. CTA claro.',
};

function buildBrandContext(brand: BrandIdentityPackage): string {
  const parts: string[] = [];

  if (brand.brandVoice) {
    parts.push(`VOZ DA MARCA: ${brand.brandVoice}`);
  }
  if (brand.targetAudience) {
    parts.push(`PÚBLICO-ALVO: ${brand.targetAudience}`);
  }
  if (brand.industry) {
    parts.push(`INDÚSTRIA: ${brand.industry}`);
  }
  if (brand.contentPillars?.length > 0) {
    parts.push(`PILARES DE CONTEÚDO: ${brand.contentPillars.join(', ')}`);
  }
  if (brand.regionalExpertise && Object.keys(brand.regionalExpertise).length > 0) {
    parts.push(`EXPERTISE REGIONAL: ${JSON.stringify(brand.regionalExpertise)}`);
  }

  return parts.join('\n');
}

function buildConstraints(brand: BrandIdentityPackage): string {
  const constraints: string[] = [];

  if (brand.forbiddenWords?.length > 0) {
    constraints.push(
      `PALAVRAS PROIBIDAS (nunca use): ${brand.forbiddenWords.join(', ')}`
    );
  }
  if (brand.mandatoryElements?.length > 0) {
    constraints.push(
      `ELEMENTOS OBRIGATÓRIOS (sempre inclua): ${brand.mandatoryElements.join(', ')}`
    );
  }

  return constraints.join('\n');
}

export function buildSystemPrompt(request: AIGenerationRequest): string {
  const { brandPackage, contentType, platform, language } = request;
  const lang = language ?? brandPackage.targetLanguage ?? 'pt-BR';

  const sections: string[] = [
    'Você é um assistente especializado em criação de conteúdo de marketing digital.',
    `Idioma de resposta: ${lang}`,
    '',
    '--- IDENTIDADE DA MARCA ---',
    buildBrandContext(brandPackage),
    '',
  ];

  const constraints = buildConstraints(brandPackage);
  if (constraints) {
    sections.push('--- RESTRIÇÕES ---', constraints, '');
  }

  sections.push(`TIPO DE CONTEÚDO: ${contentType}`);

  if (platform && PLATFORM_LIMITS[platform]) {
    sections.push(`PLATAFORMA: ${platform}`, PLATFORM_LIMITS[platform]);
  }

  if (request.tone) {
    sections.push(`TOM: ${request.tone}`);
  }

  sections.push(
    '',
    '--- REGRAS GERAIS ---',
    '- Gere conteúdo original e criativo',
    '- Mantenha consistência com a voz da marca',
    '- Adapte o formato para a plataforma alvo',
    '- Nunca mencione nomes de agências, ferramentas internas ou plataformas de gestão',
    '- Foque apenas na marca do cliente'
  );

  return sections.join('\n');
}
