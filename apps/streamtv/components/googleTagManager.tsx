import Script from "next/script";

interface GoogleTagManagerProps {
  id: string;
}

export const GoogleTagManagerScript = ({ id }: GoogleTagManagerProps) => (
  <Script id="google-tag-manager" strategy="afterInteractive">
    {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${id}');
      `}
  </Script>
);

export const GoogleTagManagerBodyNoScript = ({ id }: GoogleTagManagerProps) => {
  <noscript
    dangerouslySetInnerHTML={{
      __html: `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
    }}
  />;
};

const noScriptId = "google-tag-manager-no-script";

export const addGoogleTagManagerNoScriptToBody = (
  id: GoogleTagManagerProps["id"],
) => {
  if (!document.getElementById(noScriptId)) {
    const noscript = document.createElement("noscript");
    noscript.id = noScriptId;

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${id}`;
    iframe.height = "0";
    iframe.width = "0";
    iframe.setAttribute("style", "display:none;visibility:hidden");

    noscript.appendChild(iframe);

    document.body.appendChild(noscript);
  }
};

export const removeGoogleTagManagerNoScriptFromBody = () => {
  const el = document.getElementById(noScriptId);
  if (el) {
    el.remove();
  }
};
