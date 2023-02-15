import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationBS from './utils/translations/bs.json'
import translationEN from './utils/translations/en.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translationEN },
    bs: { translation: translationBS },
  },
  lng: 'bs',
  fallbackLng: 'bs',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
