import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { typoProfonde } from '@/lib/typo';

export default getRequestConfig(async ({ requestLocale }) => {
  const demande = await requestLocale;
  const locale = hasLocale(routing.locales, demande) ? demande : routing.defaultLocale;
  const messages = (await import(`../messages/${locale}.json`)).default;
  return { locale, messages: locale === 'fr' ? typoProfonde(messages) : messages };
});
