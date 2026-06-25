/* Floating WhatsApp button, fixed to the bottom-right of the viewport.
   Styles (.float / .my-float + pulse keyframes) live in globals.css and the
   Font Awesome icon font is loaded in app/layout.jsx <head>. */

const PHONE = '5531953475342'
const TEXT = 'Quero tirar uma dúvida'

export default function WhatsAppButton() {
  const href = `https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(TEXT)}`
  return (
    <a
      href={href}
      className="float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
    >
      <i className="fab fa-whatsapp my-float" />
    </a>
  )
}
