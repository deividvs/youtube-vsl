import ChatPrivado from '../../components/ChatPrivado.jsx'

const PLAYER_ACCOUNT = 'fae52404-8fd3-4f9c-8167-946eb654f0d6'
const PLAYER_ID = '6ae6cd767593c921f4385621'

export default function PvPage() {
  return <ChatPrivado videoMinutes={50} playerAccount={PLAYER_ACCOUNT} playerId={PLAYER_ID} />
}
