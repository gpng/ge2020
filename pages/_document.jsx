import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const isProduction = process.env.NODE_ENV === 'production';
    return { ...initialProps, isProduction };
  }

  render() {
    const { isProduction } = this.props;

    return (
      <Html>
        <Head>
          {isProduction && (
            <>
              <script async src="https://www.googletagmanager.com/gtag/js?id=UA-156385404-1" />
              <script
                /* eslint-disable-next-line react/no-danger */
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    
                    gtag('config', 'UA-156385404-1');
                  `,
                }}
              />
            </>
          )}
          <script
            /* eslint-disable-next-line react/no-danger */
            dangerouslySetInnerHTML={{
              __html: `
              window.$crisp = [];
              window.CRISP_READY_TRIGGER = function() {
                window.$crisp.push(["do", "chat:hide"]);
                window.$crisp.push(["on", "chat:closed", () => {
                  window.$crisp.push(["do", "chat:hide"]);
                }])
              }
              window.CRISP_WEBSITE_ID = '428d2a17-1b94-43ac-b04a-1ed701139023';
              (function() {
                d = document;
                s = d.createElement('script');
                s.src = 'https://client.crisp.chat/l.js';
                s.async = 1;
                d.getElementsByTagName('head')[0].appendChild(s);
              })();
            `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
