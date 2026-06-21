'use client'

import React from 'react'

/* VTurb / converteai player embed (lazy iframe, 16:9).
 *
 * Isolated in its own component that renders EXACTLY ONCE: `shouldComponentUpdate`
 * returns false so the player's DOM is never reconciled. Without this, the parent
 * chat re-renders on every progressive message reveal (~75x) and every keystroke,
 * which makes React touch the iframe subtree and the player stutters/reloads. */

const PLAYER_ID = '681696116fd9eb4b1a3122ec'
const PLAYER_ACCOUNT = 'fae52404-8fd3-4f9c-8167-946eb654f0d6'

function videoHtml() {
  return `<div id="ifr_${PLAYER_ID}_wrapper" style="margin:0 auto;width:100%;"><div style="position:relative;padding:56.074766355140184% 0 0 0;" id="ifr_${PLAYER_ID}_aspect"><iframe frameborder="0" allowfullscreen src="about:blank" id="ifr_${PLAYER_ID}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" referrerpolicy="origin" onload=" this.onload=null, this.src='https://scripts.converteai.net/${PLAYER_ACCOUNT}/players/${PLAYER_ID}/v4/embed.html' +(location.search||'?') +'&vl=' +encodeURIComponent(location.href)"></iframe></div></div>`
}

export default class VideoPlayer extends React.Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return <div style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: videoHtml() }} />
  }
}
