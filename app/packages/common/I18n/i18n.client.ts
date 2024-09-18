import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { i18nConfig } from './config';

export const initRemixI18n = async () => {
  await i18next.use(initReactI18next).use(LanguageDetector).use(Backend).init(i18nConfig);
};
