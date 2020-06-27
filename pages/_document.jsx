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
