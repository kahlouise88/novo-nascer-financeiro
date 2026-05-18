import { useState } from 'react'
import Landing from './components/Landing.jsx'
import ChatInterface from './components/ChatInterface.jsx'
import ThankYou from './components/ThankYou.jsx'

export default function App() {
  const [screen, setScreen] = useState(() => {
    const saved = localStorage.getItem('nnf_screen')
    return saved || 'landing'
  })

  const handleStart = () => {
    setScreen('chat')
    localStorage.setItem('nnf_screen', 'chat')
  }

  const handleDone = () => {
    setScreen('thankyou')
    localStorage.setItem('nnf_screen', 'thankyou')
    localStorage.removeItem('nnf_progress')
  }

  const handleRestart = () => {
    localStorage.removeItem('nnf_screen')
    localStorage.removeItem('nnf_progress')
    setScreen('landing')
  }

  return (
    <>
      {screen === 'landing' && <Landing onStart={handleStart} />}
      {screen === 'chat' && <ChatInterface onDone={handleDone} />}
      {screen === 'thankyou' && <ThankYou onRestart={handleRestart} />}
    </>
  )
}
