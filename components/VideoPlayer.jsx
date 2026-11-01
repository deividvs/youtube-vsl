'use client'

import React from 'react'

export default class VideoPlayer extends React.Component {
  componentDidMount() {
    const { playerAccount, playerId } = this.props
    const scriptId = `vturb-player-${playerId}`
    if (document.getElementById(scriptId)) return

    const script = document.createElement('script')
    script.id = scriptId
    script.src = `https://scripts.converteai.net/${playerAccount}/players/${playerId}/v4/player.js`
    script.async = true
    document.head.appendChild(script)
  }

  render() {
    const { playerId } = this.props
    return React.createElement('vturb-smartplayer', {
      id: `vid-${playerId}`,
      style: {
        display: 'block',
        margin: '0 auto',
        width: '100%',
      },
    }, React.createElement('div', {
      className: 'vturb-player-placeholder',
      style: {
        position: 'relative',
        width: '100%',
        padding: '56.25% 0 0',
        zIndex: 0,
        backgroundColor: 'black',
      },
    }))
  }
}
