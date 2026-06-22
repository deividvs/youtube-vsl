'use client'

import React from 'react'

/* VTurb / converteai player embed (lazy iframe, 16:9).
 *
 * Isolated in its own component and mounted imperatively so React never
 * reconciles the iframe while the chat re-renders for new messages/typing. */

const PLAYER_ID = '681696116fd9eb4b1a3122ec'
const PLAYER_ACCOUNT = 'fae52404-8fd3-4f9c-8167-946eb654f0d6'

export default class VideoPlayer extends React.Component {
  constructor(props) {
    super(props)
    this.mountRef = React.createRef()
    this.iframe = null
  }

  shouldComponentUpdate() {
    return false
  }

  componentDidMount() {
    if (!this.mountRef.current || this.iframe) return

    const wrapper = document.createElement('div')
    wrapper.id = `ifr_${PLAYER_ID}_wrapper`
    wrapper.style.cssText = 'margin:0 auto;width:100%;'

    const aspect = document.createElement('div')
    aspect.id = `ifr_${PLAYER_ID}_aspect`
    aspect.style.cssText = 'position:relative;padding:56.074766355140184% 0 0 0;'

    const iframe = document.createElement('iframe')
    const embedUrl = new URL(`https://scripts.converteai.net/${PLAYER_ACCOUNT}/players/${PLAYER_ID}/v4/embed.html`)
    const params = new URLSearchParams(window.location.search)
    params.delete('xcod')
    params.set('vl', window.location.href)
    embedUrl.search = params.toString()

    iframe.id = `ifr_${PLAYER_ID}`
    iframe.src = embedUrl.toString()
    iframe.frameBorder = '0'
    iframe.allowFullscreen = true
    iframe.referrerPolicy = 'origin'
    iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:0;'

    aspect.appendChild(iframe)
    wrapper.appendChild(aspect)
    this.mountRef.current.appendChild(wrapper)
    this.iframe = iframe
  }

  componentWillUnmount() {
    this.iframe = null
  }

  render() {
    return <div ref={this.mountRef} style={{ width: '100%' }} />
  }
}
