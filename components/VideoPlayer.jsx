'use client'

import React from 'react'

const PLAYER_ID = '6a3a81f61fa755ae788ed0f8'
const PLAYER_ACCOUNT = 'fae52404-8fd3-4f9c-8167-946eb654f0d6'
const SMARTPLAYER_ID = `vid-${PLAYER_ID}`
const SCRIPT_ID = `vturb-player-${PLAYER_ID}`

export default class VideoPlayer extends React.Component {
  componentDidMount() {
    if (document.getElementById(SCRIPT_ID)) return

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = `https://scripts.converteai.net/${PLAYER_ACCOUNT}/players/${PLAYER_ID}/v4/player.js`
    script.async = true
    document.head.appendChild(script)
  }

  render() {
    return React.createElement('vturb-smartplayer', {
      id: SMARTPLAYER_ID,
      style: {
        display: 'block',
        margin: '0 auto',
        width: '100%',
      },
    })
  }
}
