import Script from 'next/script'
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
const PLAYER_ID = '681696116fd9eb4b1a3122ec'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Roboto (visual YouTube) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />

        {/* VTurb / converteai smartplayer preloads */}
        <link
          rel="preload"
          href={`https://scripts.converteai.net/${PLAYER_ACCOUNT}/players/${PLAYER_ID}/v4/embed.html`}
        />
        <link
          rel="preload"
          as="script"
          href={`https://scripts.converteai.net/${PLAYER_ACCOUNT}/players/${PLAYER_ID}/v4/player.js`}
        />
        <link
          rel="preload"
          as="script"
          href="https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js"
        />
        <link
          rel="preload"
          as="fetch"
          crossOrigin=""
          href={`https://cdn.converteai.net/${PLAYER_ACCOUNT}/681695f65a7f296ab51f0b29/main.m3u8`}
        />
        <link rel="dns-prefetch" href="https://cdn.converteai.net" />
        <link rel="dns-prefetch" href="https://scripts.converteai.net" />
        <link rel="dns-prefetch" href="https://images.converteai.net" />
        <link rel="dns-prefetch" href="https://license.vturb.com" />
      </head>
      <body>
        {/* smartplayer perf marker + SDK (run before hydration) */}
        <Script id="smartplayer-plt" strategy="beforeInteractive">
          {`!function(i,n){i._plt=i._plt||(n&&n.timeOrigin?n.timeOrigin+n.now():Date.now())}(window,performance);`}
        </Script>
        <Script
          src="https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  )
}
