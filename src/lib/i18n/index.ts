export type Locale = 'pt-BR' | 'en';

export const defaultLocale: Locale = 'pt-BR';

export const locales: Locale[] = ['pt-BR', 'en'];

export async function getDictionary(locale: Locale) {
  switch (locale) {
    case 'en':
      return (await import('./dictionaries/en')).default;
    case 'pt-BR':
    default:
      return (await import('./dictionaries/pt-BR')).default;
  }
}

export type Dictionary = typeof import('./dictionaries/pt-BR')['default'];
