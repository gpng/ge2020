import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
// constants
import { LOCALES } from '../../translations';

const LocaleContext = React.createContext({});

const LOCALE_ACTIONS = {
  UPDATE: 'update',
};

const localeReducer = (state, action) => {
  switch (action.type) {
    case LOCALE_ACTIONS.UPDATE: {
      return { locale: action.payload };
    }
    default: {
      // eslint-disable-next-line no-console
      console.warn(`Unhandled action type: ${action.type}`);
      return state;
    }
  }
};

const LocaleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(localeReducer, { locale: LOCALES.DEFAULT });

  const router = useRouter();

  useEffect(() => {
    let newLocale = router.query.locale;
    if (!newLocale || !Object.values(LOCALES).includes(newLocale)) {
      newLocale = LOCALES.DEFAULT;
    }
    dispatch({ type: LOCALE_ACTIONS.UPDATE, payload: newLocale });
  }, [router.query.locale]);

  return <LocaleContext.Provider value={state}>{children}</LocaleContext.Provider>;
};

LocaleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { LocaleProvider, LOCALES };
export default LocaleContext;
