// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

import _Document, { Html, Head, Main, NextScript } from "next/document";

class Document extends _Document {
  render() {
    return (
      <Html lang="nl">
        <Head>
        </Head>
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
