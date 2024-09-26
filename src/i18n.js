import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import idTranslation from './locales/id/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      id: {
        translation: idTranslation
      }
    },
    lng: "en", // اللغة الافتراضية
    fallbackLng: "en", // اللغة البديلة إذا لم تكن الترجمة موجودة
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
