import { EntryContext, createCookie } from '@remix-run/node';
import { createInstance } from 'i18next';
import Backend from 'i18next-fs-backend';
import { initReactI18next } from 'react-i18next';
import { i18nConfig } from './config';
import { RemixServerI18next } from '~/shared/RemixJS/server';

export const localeCookie = createCookie('lng', {
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
});

export const i18nServer = new RemixServerI18next({
  detection: {
    supportedLanguages: i18nConfig.supportedLngs,
    fallbackLanguage: i18nConfig.fallbackLng,
    cookie: localeCookie,
  },
  i18next: {
    ...i18nConfig,
  },
  plugins: [Backend],
});

interface InitRemixI18n {
  request: Request;
  remixContext: EntryContext;
}
export const initRemixI18n = async ({ remixContext, request }: InitRemixI18n) => {
  const instance = createInstance();
  const lng = await i18nServer.getLocale(request);
  const ns = i18nServer.getRouteNamespaces(remixContext);

  await instance.use(initReactI18next).init({
    ...i18nConfig,
    lng,
    ns,
  });

  return instance;
};
