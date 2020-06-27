import { useContext } from 'react';
// components
import LocaleContext from '../components/locale/LocaleContext';
import translations, { LOCALES } from './index';

const accessNestedProperty = (obj, key) => {
  const keys = key.split('.');
  return keys.reduce((prop, k) => (prop?.hasOwnProperty(k) ? prop[k] : undefined), obj);
};

const useTranslations = () => {
  const { locale } = useContext(LocaleContext);

  const t = (key) => {
    const string = accessNestedProperty(translations[locale], key);
    if (!string) {
      // eslint-disable-next-line no-console
      console.warn(`Translation key "${key}" for locale "${locale}" not found`);
    }
    return string || translations[LOCALES.DEFAULT][key] || '';
  };

  return { t, locale };
};

export default useTranslations;
