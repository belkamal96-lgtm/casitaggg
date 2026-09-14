import type { SyntheticEvent } from 'react';

export const CASH_APP_LOGO_URL = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="28" fill="%2300D632"/><path fill="%23ffffff" fill-rule="evenodd" clip-rule="evenodd" d="M53.5 18C52.1 18 51 19.1 51 20.5V26.2C45.3 27 40.9 31.8 40.5 37.7C40.1 44.1 45 48.1 51.5 50.2L54.5 51.1C58.8 52.5 61 54.1 60.9 56.6C60.8 59.5 57.9 61.3 53.1 61.3C47.9 61.3 42.9 59 39.8 55.2C38.9 54.2 37.5 54 36.4 54.9L31.7 58.6C30.7 59.4 30.6 60.8 31.4 61.8C35.5 67 42.1 70.4 49.3 70.9V77.5C49.3 78.9 50.5 80 51.8 80H56.2C57.5 80 58.7 78.9 58.7 77.5V71.7C64.7 70.9 69.2 66 69.5 59.9C69.8 53.1 64.6 49 57.9 46.9L54.9 45.9C50.7 44.6 48.7 43.1 48.8 40.7C48.9 38.1 51.8 36.5 55.9 36.5C60.3 36.5 64.7 38.3 67.6 41.4C68.4 42.2 69.8 42.3 70.7 41.5L75.4 37.4C76.4 36.6 76.5 35.1 75.6 34.2C71.7 29.7 65.8 26.9 58.7 26.2V20.5C58.7 19.1 57.5 18 56.2 18H53.5Z"/></svg>`;

export function getFallbackPortrait(): string {
  return CASH_APP_LOGO_URL;
}

export function getCashAppAvatarUrl(cashtagOrName?: string, customUrl?: string): string {
  if (customUrl && (customUrl.startsWith('http://') || customUrl.startsWith('https://') || customUrl.startsWith('data:'))) {
    return customUrl;
  }
  return CASH_APP_LOGO_URL;
}

export function handleAvatarImgError(e: SyntheticEvent<HTMLImageElement, Event>, _seed?: string) {
  const target = e.currentTarget;
  if (target.src !== CASH_APP_LOGO_URL) {
    target.src = CASH_APP_LOGO_URL;
  }
}

export const getRealAvatarUrl = getCashAppAvatarUrl;

