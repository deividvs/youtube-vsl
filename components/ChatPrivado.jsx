'use client'

import React from 'react'
import VideoPlayer from './VideoPlayer.jsx'

/* ------------------------------------------------------------------ *
 * Data: avatar palette, scripted greetings + content messages.
 * Ported verbatim from the prototype (Chat Privado.dc.html).
 * ------------------------------------------------------------------ */

const AVS = ['#8d6e63', '#546e7a', '#5c6bc0', '#7e57c2', '#26a69a', '#455a64', '#ab47bc', '#6d4c41', '#0e9f6e', '#d4a017', '#c62828', '#00897b', '#5e35b1', '#43a047', '#795548', '#3949ab', '#00838f']

const GREETINGS = [
  ['lucas_mg', 'oi gente'],
  ['ana_pec', 'olá pessoal 👋'],
  ['joao_fazenda', 'cheguei agora'],
  ['marcos_go', 'boa noite a todos'],
  ['pec_minas', 'sou de MG, tem mais alguém?'],
  ['rancho_go', 'to de goiás aqui'],
  ['tiao_boi', 'presente!'],
  ['cleber_agro', 'salve salve'],
  ['vania_rural', 'demorei pra entrar kkk'],
  ['edu_pasto', 'bora começar'],
]

const RAW = [
  ['joaorural77', 'isso da arroba produzida eu nunca tinha feito conta 😳'],
  ['marcosfazenda', 'gastar pouco e produzir caro kkkk sou eu'],
  ['pecuarista_mg', 'o exemplo do seu joao doeu aqui 😂'],
  ['boi_gordo33', 'o mercado não salva produtor desorganizado'],
  ['agro_carlos', 'o problema é produzir arroba cara e nem saber'],
  ['fazenda_silva', 'quem não faz conta paga conta kkkkk verdade'],
  ['carlosboiadeiro', 'Faz sentido demais, eu olho só preço de compra'],
  ['fazenda_santana', 'gado não é dólar foi lapada kkkkk'],
  ['leandroagro', 'Esse trem de fazenda ser fábrica mudou minha cabeça'],
  ['zeca_do_gado', 'compra produção e venda, simples mas ninguém faz'],
  ['rodrigopec', 'o cara economiza no suplemento e perde no tempo'],
  ['agrobruto', 'Verdade demais, boi parado come lucro'],
  ['mariapecuaria', 'meu pai faz igual o seu João kkkk'],
  ['fazendeiro_raiz', 'essa conta dos 2,50 contra 5 reais foi pesada'],
  ['lucasagro', 'eu achava q gastar menos era sempre melhor'],
  ['thiagoboi', 'custo por arroba produzida é o jogo então'],
  ['renatocorte', 'nunca calculei diária por cabeça assim'],
  ['pedropecuaria', 'aí sim conteúdo de verdade 👏👏'],
  ['valterfazenda', 'isso explica pq trabalho e não vejo dinheiro sobrar'],
  ['eduardorural', 'eu vivo esperando arroba subir kkkk complicado'],
  ['agro_leo', 'se não produz peso todo dia ta dando prejuízo'],
  ['josepecuaria', 'essa parte do caixa separado é ouro'],
  ['fazenda_nova', 'eu quase usei todo dinheiro só pra comprar gado'],
  ['mateusgado', 'tem que entrar com caixa, não só com coragem'],
  ['neloreforte', 'preço médio de compra e venda faz muito sentido'],
  ['pecuarista_sp', 'venda acontece antes, essa foi boa'],
  ['boiadeiro_mg', 'se deixar pra vender no final fica na mão msm'],
  ['agroinvestidor', 'eu tenho outra renda e quero entrar sem fazer besteira'],
  ['leilao_rural', 'essa parte dos 6 critérios de compra foi top'],
  ['marcelofazenda', 'quantidade e localização eu nunca colocava na conta'],
  ['ranchoverde', 'homogeneidade do lote pouca gente olha'],
  ['pecuariareal', 'comprar barato sem peso é cilada'],
  ['ricardoagro', 'o barato sai caro até no bezerro kkkkk'],
  ['fazenda_ouro', 'padrão racial não é só raça, boa explicação'],
  ['boi_no_pasto', 'esse negócio de olhar costela e carcaça é detalhe q muda tudo'],
  ['agrodaniel', 'pasto é margem, confinamento é escala. anotado'],
  ['suplementacao_br', 'produzir o próprio suplemento parece ser onde mora a margem'],
  ['jonasgado', 'eu compro pronto e já vi que to pagando caro'],
  ['fazenda_boa', 'salto de 800g pra 1,1kg muda tudo'],
  ['agro_raiz', 'suplementação certa não é gasto, é investimento'],
  ['nelore_mg', 'capim sozinho não paga conta não'],
  ['pecuarista_21', 'rotacionado não é frescura então kkk'],
  ['marcosrural', 'altura de entrada e saída eu nunca respeitei'],
  ['boiadeiro77', 'agora entendi pq meu pasto não recupera'],
  ['fazendinha_top', 'cada kg importa demais'],
  ['luizpec', 'essa aula já valeu mais que muito curso por aí'],
  ['robertofazenda', 'quero ver mais sobre essa regra 60/40'],
  ['joaopauloagro', 'esse TRI parece ser o próximo passo mesmo'],
  ['fazenda_minas', 'tem isso explicado com planilha?'],
  ['nelorebr', 'onde entra pra ver as formulações?'],
  ['agroempreendedor', 'esse mapa do resultado parece bom pra quem ta começando'],
  ['pecuarista_novo', 'eu preciso organizar minha operação antes de comprar'],
  ['boigordo_oficial', 'não é sorte, é método. simples assim'],
  ['vitorrural', 'o erro é achar que pecuária é só comprar e soltar'],
  ['agrominas', 'essa parte de não depender da arroba subir é forte'],
  ['produtor_goias', 'deu até vergonha das minhas contas aqui'],
  ['pecuaria_lucro', 'esse vídeo abriu a mente'],
  ['agroforte', 'conteúdo direto, sem enrolação'],
  ['marianaagro', 'meu marido precisa ver isso urgente 😂'],
  ['paulo_rural', 'vou mandar no grupo da fazenda agora'],
  ['boiadeiro_raiz', 'essa aula devia passar em sindicato rural'],
]

/* Same-origin proxy: the Next.js route /api/lead forwards to the Clint CRM
   server-side (real webhook URL stays in env, no CORS, failures are logged). */
const DEFAULT_WEBHOOK = '/api/lead'
const KEY = 'chatPrivado_msgs_v1'
const LEADKEY = 'chatPrivado_lead_v1'

const HEART_SET = ['❤️', '🧡', '💛', '🔥', '😍', '⚽']

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default class ChatPrivado extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      msgs: [], draft: '', showReg: false, copyLabel: 'Copiar tudo',
      lead: null, showLead: false, leadName: '', leadPhone: '', leadEmail: '', leadErr: '', shown: 2,
    }
    this.chatRef = React.createRef()
    this.heartsRef = React.createRef()
    this._timer = null
    this._start = 0
  }

  get WEBHOOK() {
    return this.props.webhookUrl || DEFAULT_WEBHOOK
  }

  queue() {
    return this._q || (this._q = GREETINGS.concat(RAW))
  }

  buildFakes() {
    return this.queue().slice(0, this.state.shown).map((r, i) => ({
      handle: '@' + r[0],
      text: r[1],
      letter: r[0][0].toUpperCase(),
      bg: AVS[i % AVS.length],
      color: (i % 5 === 0) ? '#5fa463' : '#9aa0a6',
    }))
  }

  scheduleReveal = () => {
    const total = this.queue().length
    if (this.state.shown >= total) return
    const G = GREETINGS.length
    let delay
    if (this.state.shown < G) {
      delay = 1200 + Math.random() * 1600
    } else {
      const windowMs = (this.props.videoMinutes ?? 20) * 60000
      const elapsed = Date.now() - (this._start || Date.now())
      const remaining = total - this.state.shown
      const left = Math.max(windowMs - elapsed, remaining * 1500)
      const step = left / remaining
      delay = step * (0.6 + Math.random() * 0.8)
    }
    this._timer = setTimeout(() => {
      this.setState((s) => ({ shown: Math.min(s.shown + 1, total) }), () => this.maybeScroll(false))
      this.scheduleReveal()
    }, delay)
  }

  maybeScroll(force) {
    const el = this.chatRef.current
    if (!el) return
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 130
    if (force || near) requestAnimationFrame(() => { el.scrollTop = el.scrollHeight })
  }

  componentDidMount() {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) this.setState({ msgs: JSON.parse(raw) }, () => this.scrollDown())
      const lraw = localStorage.getItem(LEADKEY)
      if (lraw) this.setState({ lead: JSON.parse(lraw) })
    } catch (e) {}
    this._start = Date.now()
    this.scheduleReveal()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.msgs.length !== this.state.msgs.length) this.scrollDown()
  }

  componentWillUnmount() {
    clearTimeout(this._timer)
  }

  scrollDown() {
    const el = this.chatRef.current
    if (el) requestAnimationFrame(() => { el.scrollTop = el.scrollHeight })
  }

  persist(msgs) {
    try { localStorage.setItem(KEY, JSON.stringify(msgs)) } catch (e) {}
  }

  /* lead gate ------------------------------------------------------- */
  gate = () => {
    if (!this.state.lead) {
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur()
      this.setState({ showLead: true, leadErr: '' })
    }
  }
  onLeadName = (e) => this.setState({ leadName: e.target.value })
  onLeadPhone = (e) => this.setState({ leadPhone: e.target.value })
  onLeadEmail = (e) => this.setState({ leadEmail: e.target.value })
  closeLead = () => this.setState({ showLead: false })

  submitLead = () => {
    const name = this.state.leadName.trim()
    const phone = this.state.leadPhone.trim()
    const email = this.state.leadEmail.trim()
    if (name.length < 2) return this.setState({ leadErr: 'Informe seu nome completo.' })
    if (phone.replace(/\D/g, '').length < 8) return this.setState({ leadErr: 'Informe um telefone válido.' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return this.setState({ leadErr: 'Informe um e-mail válido.' })
    const lead = { name, phone, email, time: new Date().toLocaleString('pt-BR') }
    try { localStorage.setItem(LEADKEY, JSON.stringify(lead)) } catch (e) {}
    const url = this.WEBHOOK
    if (url) {
      try {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, data: lead.time, origem: location.href }),
          // keepalive: o envio sobrevive se o visitante fechar a aba / navegar
          // durante um cold start da função serverless — senão o lead se perde.
          keepalive: true,
        }).catch(() => {})
      } catch (e) {}
    }
    this.setState({ lead, showLead: false, leadErr: '' })
  }

  /* registro / backup ----------------------------------------------- */
  downloadCsv = () => {
    const l = this.state.lead || {}
    const rows = [['campo', 'valor'], ['nome', l.name || ''], ['telefone', l.phone || ''], ['email', l.email || ''], ['data', l.time || '']]
    this.state.msgs.forEach((m, i) => rows.push(['comentario ' + (i + 1), m.text]))
    const csv = rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'contato-' + String(l.name || 'participante').replace(/\s+/g, '-').toLowerCase() + '.csv'
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }

  openReg = () => this.setState({ showReg: true, copyLabel: 'Copiar tudo' })
  closeReg = () => this.setState({ showReg: false })
  copyAll = () => {
    const txt = this.state.msgs.map((m) => '[' + m.time + '] ' + m.text).join('\n')
    try { navigator.clipboard.writeText(txt) } catch (e) {}
    this.setState({ copyLabel: 'Copiado!' })
    setTimeout(() => this.setState({ copyLabel: 'Copiar tudo' }), 1500)
  }
  clearAll = () => {
    this.persist([])
    this.setState({ msgs: [] })
  }

  /* own messages ---------------------------------------------------- */
  send = () => {
    if (!this.state.lead) { this.setState({ showLead: true, leadErr: '' }); return }
    const t = this.state.draft.trim()
    if (!t) return
    const time = new Date().toLocaleString('pt-BR')
    const msgs = [...this.state.msgs, { id: Date.now(), text: t, time }]
    this.persist(msgs)
    this.setState({ msgs, draft: '' })
  }
  onDraft = (e) => { if (!this.state.lead) return; this.setState({ draft: e.target.value }) }
  onKey = (e) => { if (e.key === 'Enter') { e.preventDefault(); this.send() } }

  /* hearts ---------------------------------------------------------- */
  spawnHeart = () => {
    const layer = this.heartsRef.current
    if (!layer) return
    const n = 1 + Math.floor(Math.random() * 2)
    for (let i = 0; i < n; i++) {
      const h = document.createElement('div')
      h.textContent = HEART_SET[Math.floor(Math.random() * HEART_SET.length)]
      const drift = (Math.random() * 40 - 20) + 'px'
      h.style.cssText = 'position:absolute;bottom:0;right:' + (6 + Math.random() * 22) + 'px;font-size:' + (20 + Math.random() * 12) + 'px;animation:floatUp ' + (2 + Math.random() * 0.8) + 's ease-out forwards;--drift:' + drift + ';'
      layer.appendChild(h)
      setTimeout(() => h.remove(), 3000)
    }
  }

  /* render ---------------------------------------------------------- */
  render() {
    const { msgs, draft, lead, showLead, showReg, leadName, leadPhone, leadEmail, leadErr, copyLabel } = this.state
    const fakes = this.buildFakes()
    const sendBg = draft.trim() ? '#cc0000' : '#3a3a3a'

    return (
      <div className="stage">
        <div className="frame">
          <div className="notch" />
          <div className="screen">

            {/* status bar */}
            <StatusBar />

            {/* video */}
            <div style={{ position: 'relative', width: '100%', background: '#000', flex: 'none' }}>
              <LiveBadge />
              <VideoPlayer />
            </div>

            {/* chat sheet */}
            <div style={S.sheet}>
              <div style={S.handle} />

              {/* header */}
              <div style={S.header}>
                <div>
                  <div style={{ color: '#fff', fontSize: 21, fontWeight: 700, lineHeight: 1.1 }}>Chat ao vivo</div>
                  <div style={{ color: '#9a9a9a', fontSize: 13, marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                    Mensagens principais
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, marginLeft: 4 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 12 0v1" /></svg>
                      5,1 mi
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 3 }}>
                  <button onClick={this.openReg} style={S.iconBtn} title="Registro" aria-label="Registro do participante">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6" /><circle cx="9" cy="6" r="2" fill="#0f0f0f" /><line x1="4" y1="12" x2="20" y2="12" /><circle cx="15" cy="12" r="2" fill="#0f0f0f" /><line x1="4" y1="18" x2="20" y2="18" /><circle cx="8" cy="18" r="2" fill="#0f0f0f" /></svg>
                  </button>
                  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#cfcfcf" strokeWidth="2.2" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
                </div>
              </div>

              {/* messages */}
              <div ref={this.chatRef} className="chatScroll" style={S.msgList}>
                {fakes.map((f, i) => (
                  <div key={'f' + i} style={S.msgRow}>
                    <div style={{ ...S.avatar, background: f.bg }}>{f.letter}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.4 }}>
                      <span style={{ color: f.color, fontWeight: 700 }}>{f.handle}</span>{' '}
                      <span style={{ color: '#f1f1f1' }}>{f.text}</span>
                    </div>
                  </div>
                ))}

                {msgs.map((m) => (
                  <div key={m.id} style={{ ...S.msgRow, animation: 'msgIn .25s ease both' }}>
                    <div style={{ ...S.avatar, background: '#1565c0' }}>V</div>
                    <div style={{ fontSize: 14, lineHeight: 1.4 }}>
                      <span style={{ color: '#7cb3ff', fontWeight: 700 }}>@você</span>{' '}
                      <span style={{ color: '#f1f1f1' }}>{m.text}</span>
                    </div>
                  </div>
                ))}
                <div style={{ height: 4 }} />
              </div>

              {/* floating hearts layer */}
              <div ref={this.heartsRef} style={{ position: 'absolute', right: 14, bottom: 70, width: 60, height: 300, pointerEvents: 'none', zIndex: 30 }} />

              {/* composer */}
              <div style={S.composer}>
                <div style={{ ...S.avatar, background: '#1565c0' }}>V</div>
                <input
                  value={draft}
                  onInput={this.onDraft}
                  onChange={() => {}}
                  onKeyDown={this.onKey}
                  onFocus={this.gate}
                  placeholder="Comente algo..."
                  style={S.input}
                />
                <button onClick={this.spawnHeart} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }} aria-label="Enviar reação">
                  <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 12 5 4.5 4.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7 7-7z" /></svg>
                </button>
                <button onClick={this.send} style={{ ...S.sendBtn, background: sendBg }} aria-label="Enviar comentário">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="6 11 12 5 18 11" /></svg>
                </button>
              </div>
            </div>

            {/* lead capture overlay */}
            {showLead && (
              <div style={S.leadBackdrop}>
                <div style={S.leadCard}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ color: '#fff', fontSize: 19, fontWeight: 700 }}>Participe do chat</div>
                    <button onClick={this.closeLead} style={S.bareBtn} aria-label="Fechar">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.2" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
                    </button>
                  </div>
                  <div style={{ color: '#9a9a9a', fontSize: 13, marginTop: 4, marginBottom: 18 }}>Preencha seus dados para liberar seus comentários ao vivo.</div>
                  <input value={leadName} onInput={this.onLeadName} onChange={() => {}} placeholder="Nome completo" style={S.leadInput} />
                  <input value={leadPhone} onInput={this.onLeadPhone} onChange={() => {}} inputMode="tel" placeholder="Telefone / WhatsApp" style={S.leadInput} />
                  <input value={leadEmail} onInput={this.onLeadEmail} onChange={() => {}} inputMode="email" placeholder="E-mail" style={{ ...S.leadInput, marginBottom: 0 }} />
                  {leadErr && <div style={{ color: '#ff6b6b', fontSize: 12, marginTop: 10 }}>{leadErr}</div>}
                  <button onClick={this.submitLead} style={S.greenCta}>Liberar comentários</button>
                  <div style={{ color: '#666', fontSize: 11, textAlign: 'center', marginTop: 12 }}>Seus dados ficam salvos apenas neste dispositivo.</div>
                </div>
              </div>
            )}

            {/* registro overlay */}
            {showReg && (
              <div style={S.regBackdrop}>
                <div style={S.regSheet}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>Registro do participante</div>
                    <button onClick={this.closeReg} style={S.bareBtn} aria-label="Fechar">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.2" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
                    </button>
                  </div>
                  {lead && (
                    <div style={{ background: '#10271c', border: '1px solid #1c4a35', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
                      <div style={{ color: '#5fd6a0', fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: 4 }}>Participante</div>
                      <div style={{ color: '#eee', fontSize: 14 }}>{lead.name}</div>
                      <div style={{ color: '#9a9a9a', fontSize: 12 }}>{lead.phone} · {lead.email}</div>
                    </div>
                  )}
                  <div style={{ color: '#8a8a8a', fontSize: 13, marginBottom: 14 }}>{msgs.length} mensagem(ns) salvas neste dispositivo</div>
                  <div className="chatScroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {msgs.map((m) => (
                      <div key={m.id} style={{ background: '#262626', borderRadius: 10, padding: '10px 12px' }}>
                        <div style={{ color: '#7cb3ff', fontSize: 11, fontFamily: 'monospace', marginBottom: 3 }}>{m.time}</div>
                        <div style={{ color: '#eee', fontSize: 14 }}>{m.text}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                    <button onClick={this.downloadCsv} style={{ ...S.greenCta, flex: 1, marginTop: 0, padding: 13, fontSize: 14 }}>Baixar CSV</button>
                    <button onClick={this.copyAll} style={{ flex: 'none', padding: '13px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', background: '#2b2b2b', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>{copyLabel}</button>
                    <button onClick={this.clearAll} style={{ flex: 'none', padding: '13px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', background: '#3a1c1c', color: '#ff6b6b', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>Limpar</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    )
  }
}

/* ------------------------------------------------------------------ *
 * Presentational sub-components
 * ------------------------------------------------------------------ */

function StatusBar() {
  return (
    <div style={{ position: 'relative', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 30px 6px', color: '#fff', fontSize: 15, fontWeight: 600, flex: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>16:22</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 11 }}>
          <i style={{ width: 3, height: 4, background: '#fff', borderRadius: 1, display: 'block' }} />
          <i style={{ width: 3, height: 6, background: '#fff', borderRadius: 1, display: 'block' }} />
          <i style={{ width: 3, height: 8, background: '#fff', borderRadius: 1, display: 'block' }} />
          <i style={{ width: 3, height: 11, background: '#fff', borderRadius: 1, display: 'block' }} />
        </span>
        <svg width="17" height="13" viewBox="0 0 24 18" fill="#fff"><path d="M12 3C7.5 3 3.7 4.9 1 7.9l11 12.1L23 7.9C20.3 4.9 16.5 3 12 3z" /></svg>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ position: 'relative', width: 24, height: 12, border: '1.5px solid #fff', borderRadius: 3, display: 'inline-block' }}>
            <span style={{ position: 'absolute', left: 1, top: 1, bottom: 1, width: '55%', background: '#fff', borderRadius: 1 }} />
          </span>
          <b style={{ fontSize: 10 }}>54</b>
        </span>
      </div>
    </div>
  )
}

function LiveBadge() {
  return (
    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 20, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,.55)', padding: '4px 9px', borderRadius: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff3b30', display: 'block', animation: 'livePulse 1.6s infinite' }} />
      <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.06em' }}>AO VIVO</span>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Shared style objects
 * ------------------------------------------------------------------ */

const S = {
  sheet: { position: 'relative', flex: 1, minHeight: 0, background: '#0f0f0f', borderTopLeftRadius: 18, borderTopRightRadius: 18, marginTop: -14, display: 'flex', flexDirection: 'column', boxShadow: '0 -6px 20px rgba(0,0,0,.5)' },
  handle: { width: 38, height: 5, background: '#3a3a3a', borderRadius: 3, margin: '9px auto 4px', flex: 'none' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '4px 16px 12px', flex: 'none' },
  iconBtn: { background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#cfcfcf', display: 'flex' },
  bareBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' },
  msgList: { flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 14px 6px' },
  msgRow: { display: 'flex', gap: 9, padding: '7px 0', alignItems: 'flex-start', animation: 'msgIn .3s ease both' },
  avatar: { flex: 'none', width: 30, height: 30, borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 },
  composer: { flex: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px calc(10px + env(safe-area-inset-bottom))', borderTop: '1px solid #1f1f1f', background: '#0f0f0f' },
  input: { flex: 1, minWidth: 0, background: '#1f1f1f', border: 'none', outline: 'none', color: '#fff', fontSize: 14, padding: '11px 14px', borderRadius: 22, fontFamily: 'inherit' },
  sendBtn: { flex: 'none', width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  leadBackdrop: { position: 'absolute', inset: 0, zIndex: 90, background: 'rgba(0,0,0,.8)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 22 },
  leadCard: { width: '100%', background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: 18, padding: '22px 20px 20px' },
  leadInput: { width: '100%', boxSizing: 'border-box', background: '#262626', border: '1px solid #333', outline: 'none', color: '#fff', fontSize: 15, padding: '13px 14px', borderRadius: 11, marginBottom: 10, fontFamily: 'inherit' },
  greenCta: { width: '100%', marginTop: 16, padding: 14, borderRadius: 12, border: 'none', cursor: 'pointer', background: 'linear-gradient(180deg,#12b87f,#0a7d54)', color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'inherit' },
  regBackdrop: { position: 'absolute', inset: 0, zIndex: 80, background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', display: 'flex', flexDirection: 'column' },
  regSheet: { marginTop: 'auto', background: '#1a1a1a', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '78%', display: 'flex', flexDirection: 'column', padding: '18px 18px calc(18px + env(safe-area-inset-bottom))' },
}
