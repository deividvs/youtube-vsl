# Handoff: Chat Privado ao Vivo (Live com captura de leads)

## Stack & como rodar (Next.js)
Implementado em **Next.js 14 (App Router)** + React 18.

```bash
npm install
cp .env.example .env.local   # ajuste CLINT_WEBHOOK_URL se necessário
npm run dev                  # http://localhost:3000
npm run build && npm run start
```

Estrutura:
- `app/layout.jsx` — `<head>` (fonts Roboto, preloads do player VTurb, SDK smartplayer).
- `app/page.jsx` — renderiza o componente do chat (`videoMinutes` configurável).
- `app/globals.css` — estilos globais + keyframes (`msgIn`, `floatUp`, `livePulse`).
- `components/ChatPrivado.jsx` — `'use client'`, toda a lógica do chat (classe React).
- `app/api/lead/route.js` — **proxy server-side** que recebe o lead e repassa ao CRM Clint.

O cliente faz `POST /api/lead` (mesma origem, JSON). A URL real do Clint vive em
`CLINT_WEBHOOK_URL` (env) e **nunca** vai para o navegador.

## Visão geral
Uma interface mobile que simula uma **transmissão ao vivo com chat** (estilo YouTube/CazéTV) usada como página de VSL/webinar para o público de pecuária do **Victor Darido**. Cada participante:

1. Assiste a um vídeo (player VTurb/converteai embutido).
2. Vê um **chat ao vivo** com comentários que entram aos poucos ao longo do vídeo.
3. Pode **escrever** os próprios comentários — mas, ao tentar comentar, um **popup pede nome, telefone e e-mail** (captura de lead) que é enviado para o CRM.

**Regra central de privacidade:** cada participante **NÃO vê** o que os outros participantes reais escrevem. Os comentários "ao vivo" são um roteiro pré-definido (fake/scripted); as mensagens que o participante envia aparecem só para ele mesmo (`@você`) e são salvas localmente + enviadas ao CRM. É um ambiente isolado por dispositivo, não um chat em tempo real compartilhado.

## Sobre os arquivos de design
O arquivo deste pacote (`Chat Privado.dc.html`) é uma **referência de design feita em HTML** — um protótipo que demonstra o visual e o comportamento pretendidos, **não** é código de produção para copiar diretamente. A tarefa é **recriar este design no ambiente do seu codebase** (React/Next, Vue, etc.), usando seus padrões e bibliotecas estabelecidos. Se não houver ambiente ainda, escolha o framework mais adequado (recomendado: **React + Vite/Next**, já que a lógica do protótipo é uma classe estilo-React).

> Observação técnica: o protótipo usa um runtime interno ("DCLogic", tags `<x-dc>`, `<sc-for>`, `<sc-if>`, `{{ }}`). **Ignore esse runtime** — ele é só do ambiente de prototipagem. O que importa é a estrutura visual, a lógica (na classe `Component`) e os tokens abaixo. Toda a lógica é JS puro de classe React (state, setState, lifecycle).

## Fidelidade
**Alta fidelidade (hifi).** Cores, tipografia, espaçamentos, raios e interações são finais. Recrie a UI pixel-a-pixel. Atenção: o visual é **escuro estilo YouTube/CazéTV** (preto/cinza), por escolha do cliente — **NÃO** é o tema claro/verde do design system Victor Darido. Mantenha o tema escuro desta tela.

---

## Telas / Views

É uma **única tela** (mockup de iPhone) com 3 overlays. Largura de design do conteúdo: **370px** (tela interna do iPhone), moldura total 392×840px. Em produção, renderize em tela cheia no mobile (sem a moldura do iPhone — ela é só para apresentação).

### Estrutura vertical (de cima para baixo)
1. **Status bar** (relógio 16:22, sinal, wifi, bateria 54%) — decorativo, pode usar o status bar nativo do dispositivo em produção.
2. **Vídeo** — player embutido, proporção 16:9 (`padding-top: 56.0747%`), fundo preto. Badge "AO VIVO" no canto superior esquerdo (ponto vermelho `#ff3b30` pulsando + texto).
3. **Chat sheet** — painel `#0f0f0f` com cantos superiores arredondados (18px), sobrepondo o vídeo em `-14px`. Contém: handle (barrinha cinza), header, lista de mensagens, composer.

### Componentes do chat sheet

**Header**
- Título "Chat ao vivo" — `#fff`, 21px, weight 700.
- Subtítulo "Mensagens principais" + ícone usuário + contador "5,1 mi" — `#9a9a9a`, 13px.
- Ícones à direita: botão de **registro** (abre painel de registro) e um X decorativo. `#cfcfcf`, 22-23px.

**Lista de mensagens** (scroll vertical, scrollbar oculta)
- Cada linha: avatar circular 30px (inicial do @, cor de fundo variada) + texto.
  - Gap 9px, padding vertical 7px, `align-items:flex-start`.
  - Handle: weight 700. Cor `#9aa0a6` (cinza) ou `#5fa463` (verde, em ~1 a cada 5 — simula "membro").
  - Texto: `#f1f1f1`, 14px, line-height 1.4.
  - Animação de entrada: `msgIn` (fade + translateY 8px→0, 0.3s ease).
- Mensagens do próprio participante: avatar azul `#1565c0` com "V", handle `@você` em azul `#7cb3ff`.

**Composer** (rodapé fixo)
- Avatar 30px azul "V" + input arredondado (`#1f1f1f`, radius 22px, placeholder "Comente algo...") + botão coração (reações) + botão enviar (círculo 38px).
- Botão enviar muda de cor: `#3a3a3a` (vazio) → `#cc0000` (com texto).
- Camada de **corações flutuantes** sobe da direita (animação `floatUp`, 2-2.8s).

### Overlay 1 — Captura de lead ("Participe do chat")
Abre ao focar/clicar no input ou no enviar, **se ainda não houver lead salvo**.
- Fundo escurecido `rgba(0,0,0,.8)` + blur 4px. Card `#1c1c1c`, borda `#2a2a2a`, radius 18px, padding 22px.
- Título "Participe do chat" (19px, 700) + botão fechar (X).
- Subtítulo: "Preencha seus dados para liberar seus comentários ao vivo."
- 3 inputs: **Nome completo**, **Telefone / WhatsApp** (`inputMode=tel`), **E-mail** (`inputMode=email`). Fundo `#262626`, borda `#333`, radius 11px, texto branco 15px.
- Mensagem de erro: `#ff6b6b`, 12px.
- Botão "Liberar comentários": gradiente verde `linear-gradient(180deg,#12b87f,#0a7d54)`, branco, 700.
- Rodapé: "Seus dados ficam salvos apenas neste dispositivo." (`#666`, 11px).

### Overlay 2 — Registro do participante
Abre pelo ícone de registro no header. Bottom-sheet `#1a1a1a`, cantos superiores 20px, max-height 78%.
- Título "Registro do participante" + X.
- Card verde do lead capturado (nome, telefone · email) — fundo `#10271c`, borda `#1c4a35`.
- Contador "N mensagem(ns) salvas neste dispositivo".
- Lista das mensagens do participante (cada uma em card `#262626` com timestamp `#7cb3ff` mono).
- Botões: **Baixar CSV** (verde, exporta lead + mensagens), **Copiar tudo**, **Limpar** (vermelho `#3a1c1c`/`#ff6b6b`).

---

## Interações & Comportamento

### Revelação progressiva das mensagens do chat
- O chat começa com **2 mensagens** visíveis.
- Uma fila ordenada de mensagens é revelada uma a uma via `setTimeout` recursivo:
  - **Fase de saudações** (10 primeiras: "oi gente", "olá pessoal", "cheguei agora", "sou de MG, tem mais alguém?", etc.): delay aleatório **1200–2800ms**.
  - **Fase de conteúdo** (comentários sobre pecuária/lucro): os delays são **distribuídos ao longo da duração do vídeo** para que a última mensagem chegue perto do fim. Cálculo:
    ```
    windowMs   = videoMinutes * 60000
    elapsed    = agora - inícioDoMount
    remaining  = total - jáMostradas
    left       = max(windowMs - elapsed, remaining * 1500)   // nunca abaixo de 1,5s por msg
    step       = left / remaining
    delay      = step * (0.6 + random*0.8)                   // jitter ±40%
    ```
  - `videoMinutes` é configurável (default **20**, range 3–120). Ajuste para a duração real do vídeo.
- **Autoscroll**: ao chegar mensagem nova, rola para o fim **apenas se** o usuário já está perto do fim (`scrollHeight - scrollTop - clientHeight < 130px`). Se ele rolou para cima lendo, não força o scroll.

### Gate de comentário (captura de lead)
- Ao **focar** o input (`onFocus`) ou clicar em **enviar**, se `lead == null`: faz blur do input e abre o overlay de captura.
- Enquanto não houver lead, `onDraft` ignora digitação (input fica bloqueado).
- **Validação** no submit:
  - Nome: ≥ 2 caracteres.
  - Telefone: ≥ 8 dígitos (após remover não-dígitos).
  - E-mail: regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
  - Erros mostram mensagem em pt-BR.
- Ao validar: salva lead em localStorage, **envia ao CRM** (ver abaixo), fecha o overlay. A partir daí o participante comenta livremente.

### Envio das próprias mensagens
- Enter ou botão enviar adiciona `{id, text, time}` ao array `msgs`, persiste em localStorage e limpa o draft.
- Aparece no chat como `@você`. Não vai para o CRM nem para outros participantes.

### Reações (corações)
- Botão coração cria 1-2 elementos emoji (`❤️🧡💛🔥😍⚽`) que sobem e somem (animação `floatUp`, removidos após 3s).

---

## Integração com CRM (Clint) — via proxy server-side ✅

Ao validar o formulário de lead, o cliente dispara um **POST `/api/lead`** (mesma
origem, JSON) e a rota Next encaminha ao webhook do Clint **a partir do servidor**.
Isso resolve os pontos levantados no protótipo: sem CORS/perda silenciosa, telefone
normalizado, URL do webhook fora do client e falhas registradas no log do servidor.

### Cliente → `/api/lead` (`components/ChatPrivado.jsx`)
- **Método:** `POST`, `Content-Type: application/json`.
- **Payload:** `{ name, email, phone, data, origem }`.
- `webhookUrl` (prop) continua configurável; default `/api/lead`.

### `/api/lead` → Clint (`app/api/lead/route.js`)
- Valida nome (≥2), telefone (≥8 dígitos) e e-mail; rejeita com `400` **sem** chamar o Clint.
- URL real do Clint vem de **`CLINT_WEBHOOK_URL`** (env); fallback embutido:
  `https://functions-api.clint.digital/endpoints/integration/webhook/bf9aa1eb-e684-4c0a-803d-2cd8314fc0b2`
- Encaminha `POST` JSON com o payload em **inglês e português** (para garantir o mapeamento no Clint):
  ```json
  {
    "name": "...", "email": "...", "phone": "...",
    "nome": "...", "telefone": "...",
    "data": "19/06/2026 16:22:00",
    "origem": "https://url-da-pagina"
  }
  ```
- Resposta: `{ ok: true }` em sucesso; `502` (+ log) se o Clint falhar.

### Backup local
- **Baixar CSV** no painel de registro gera um CSV (UTF-8 com BOM) com lead + comentários daquele dispositivo.

---

## Gerenciamento de estado

Estado (classe `Component`):
- `msgs: []` — mensagens do próprio participante (persistidas em `localStorage['chatPrivado_msgs_v1']`).
- `draft: ''` — texto sendo digitado.
- `shown: 2` — quantas mensagens da fila já apareceram (driver da revelação progressiva).
- `lead: null | {name, phone, email, time}` — persistido em `localStorage['chatPrivado_lead_v1']`.
- `showLead, showReg: bool` — visibilidade dos overlays.
- `leadName, leadPhone, leadEmail, leadErr` — campos e erro do form de captura.
- `copyLabel` — label do botão copiar (feedback "Copiado!").

Refs: `chatRef` (lista, para scroll), `heartsRef` (camada de corações).
Timers: `_timer` (revelação, limpo no unmount), `_start` (timestamp do mount).

Props (configuráveis):
- `videoMinutes: number` (default 20) — duração do vídeo, controla a distribuição das mensagens.
- `webhookUrl: string` — endpoint do CRM.

---

## Design Tokens (desta tela — tema escuro)

**Cores**
| Uso | Hex |
|---|---|
| Fundo da tela / chat | `#0a0a0a` / `#0f0f0f` |
| Bottom-sheets / cards overlay | `#1a1a1a` / `#1c1c1c` / `#262626` |
| Input do chat | `#1f1f1f` |
| Texto principal | `#f1f1f1` / `#fff` |
| Texto secundário | `#9a9a9a` / `#8a8a8a` |
| Handle cinza | `#9aa0a6` |
| Handle "membro" (verde) | `#5fa463` |
| Avatar/handle do participante | `#1565c0` / `#7cb3ff` |
| Botão enviar ativo | `#cc0000` / inativo `#3a3a3a` |
| CTA verde (lead/CSV) | `linear-gradient(180deg,#12b87f,#0a7d54)` |
| Erro / destrutivo | `#ff6b6b` sobre `#3a1c1c` |
| AO VIVO | `#ff3b30` |
| Card lead (registro) | fundo `#10271c`, borda `#1c4a35`, label `#5fd6a0` |
| Cores de avatar (rodízio) | `#8d6e63 #546e7a #5c6bc0 #7e57c2 #26a69a #455a64 #ab47bc #6d4c41 #0e9f6e #d4a017 #c62828 #00897b #5e35b1 #43a047 #795548 #3949ab #00838f` |

**Tipografia**
- Família: `'Roboto', -apple-system, 'Segoe UI', sans-serif` (visual YouTube). Números/timestamps em `monospace`.
- Tamanhos: título 21px/700, header overlay 18-19px/700, mensagens 14px/1.4, handle 14px/700, subtítulos 11-13px, timestamp 11px mono.

**Espaçamento / raios / sombras**
- Raios: input do chat 22px (pill); cards/botões overlay 10-12px; bottom-sheet 18-20px; moldura iPhone 46-56px; avatares full.
- Mensagem: padding 7px vertical, gap 9px.
- Sombra do chat sheet: `0 -6px 20px rgba(0,0,0,.5)`.

**Animações (keyframes)**
- `msgIn`: opacity 0→1, translateY 8px→0, 0.3s ease.
- `floatUp`: sobe ~260px, scale 0.6→1.25, fade out, com drift horizontal aleatório, 2-2.8s.
- `livePulse`: opacidade 1↔0.35, 1.6s infinito (ponto AO VIVO).

---

## Assets
- **Player de vídeo:** embed VTurb/converteai (smartplayer). ID do player no protótipo: `681696116fd9eb4b1a3122ec` / conta `fae52404-8fd3-4f9c-8167-946eb654f0d6`. Em produção, troque pelo embed do vídeo correto. O embed é um `<iframe>` que carrega `embed.html` no `onload` (lazy). Proporção 16:9.
- **`assets/field-poster.jpg`** — pôster estático usado antes de integrar o player (pode descartar).
- **Ícones:** line icons inline estilo Lucide (`viewBox 0 0 24 24`, `stroke=currentColor`, `stroke-width 2`). Em produção, use a biblioteca Lucide.
- **Sem imagens de marca** além do player. O design system Victor Darido (verde/claro) **não** se aplica a esta tela escura — use-o apenas se criar telas auxiliares no tema da marca.

## Arquivos
- `Chat Privado.dc.html` — protótipo completo (estrutura HTML inline + classe de lógica `Component` no `<script type="text/x-dc">` ao final). Leia a classe `Component` para toda a lógica de estado, revelação progressiva, validação e envio ao CRM.
