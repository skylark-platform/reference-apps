import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html dir="ltr" lang="en">
      <Head>
        <link
          href="/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link
          href="/favicon-32x32.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/favicon-16x16.png"
          rel="icon"
          sizes="16x16"
          type="image/png"
        />
        <link href="/site.webmanifest" rel="manifest" />
      </Head>
      <body className="overflow-x-hidden bg-gray-900 font-body">
        <Main />
        <NextScript />
      </body>

      <script
        dangerouslySetInnerHTML={{
          __html: `
              window.intercomSettings = {
                api_base: "https://api-iam.intercom.io",
                app_id: "t104fsur"
              };
                  `,
        }}
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
              {/* We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/t104fsur' */}
              (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/t104fsur';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();                  `,
        }}
      ></script>
    </Html>
  );
}
