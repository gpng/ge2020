import React, { Fragment } from 'react';
// contexts
import { LocaleProvider } from '../components/locale/LocaleContext';
// constants
import { COLORS } from '../constants/styles';
// styles
import 'typeface-lato';
import 'normalize.css';

// eslint-disable-next-line react/prop-types
const App = ({ Component, pageProps }) => (
  // eslint-disable-next-line react/jsx-fragments
  <Fragment>
    <LocaleProvider>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </LocaleProvider>
    <style global jsx>{`
      html,
      body,
      #__next {
        height: 100%;
      }

      *,
      *:before,
      *:after {
        box-sizing: border-box;
      }

      html {
        font-size: 16px;
      }

      body {
        font-family: Lato, BlinkMacSystemFont, -apple-system, Segoe UI, Helvetica Neue, Helvetica,
          Arial, sans-serif;
        background: ${COLORS.BACKGROUND_PRIMARY};
        color: ${COLORS.TEXT_PRIMARY};
      }

      p {
        margin: 0;
      }

      button {
        cursor: pointer;
        outline: none;
      }
    `}</style>
  </Fragment>
);

export default App;
