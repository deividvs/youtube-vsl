import Script from 'next/script'
import WhatsAppButton from '../components/WhatsAppButton.jsx'
import './globals.css'

export const metadata = {
  title: 'Chat ao vivo',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const PLAYER_ACCOUNT = 'fae52404-8fd3-4f9c-8167-946eb654f0d6'
const PLAYER_ID = '6a3a81f61fa755ae788ed0f8'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* jQuery — precisa carregar ANTES do GTM, pois há uma tag no container
            GTM-P83M3DV que usa jQuery/$ (senão: "ReferenceError: jQuery is not defined"). */}
        <Script
          src="https://code.jquery.com/jquery-3.7.1.min.js"
          integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />

        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P83M3DV');`}
        </Script>
        {/* End Google Tag Manager */}

        {/* Roboto (visual YouTube) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />

        {/* VTurb / converteai smartplayer */}
        <link
          rel="preload"
          as="script"
          href={`https://scripts.converteai.net/${PLAYER_ACCOUNT}/players/${PLAYER_ID}/v4/player.js`}
        />
        <link rel="dns-prefetch" href="https://cdn.converteai.net" />
        <link rel="dns-prefetch" href="https://scripts.converteai.net" />
        <link rel="dns-prefetch" href="https://images.converteai.net" />
        <link rel="dns-prefetch" href="https://license.vturb.com" />

        {/* Font Awesome (ícone do WhatsApp) */}
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.13.0/css/all.css"
          integrity="sha384-Bfad6CLCknfcloXFOyFnlgtENryhrpZCe29RTifKEixXQZ38WheV+i/6YWSzkz3V"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P83M3DV"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
        <WhatsAppButton />
      </body>
    </html>
  )
}
