import ChatPrivado from '../components/ChatPrivado.jsx'

const PLAYER_ACCOUNT = 'fae52404-8fd3-4f9c-8167-946eb654f0d6'
const PLAYER_ID = '6ae6c5c96efe4af03916e60b'

export default function Page() {
  return <ChatPrivado videoMinutes={50} playerAccount={PLAYER_ACCOUNT} playerId={PLAYER_ID} />
}
