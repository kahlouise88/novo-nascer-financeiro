import { useState } from 'react'
import Landing from './components/Landing.jsx'
import ChatInterface from './components/ChatInterface.jsx'
import ThankYou from './components/ThankYou.jsx'

export default function App() {
  const [screen, setScreen] = useState(() => {
    // ?reset=1 na URL sempre limpa tudo e volta para a landing
    if (window.location.search.includes('reset')) {
      localStorage.removeItem('nnf_screen')
      localStorage.removeItem('nnf_progress')
      return 'landing'
    }
    const saved = localStorage.getItem('nnf_screen')
    // Só restaura 'chat' se também houver progresso salvo — evita tela em branco
    if (saved === 'chat') {
      const hasProgress = localStorage.getItem('nnf_progress')
      if (!hasProgress) {
        localStorage.removeItem('nnf_screen')
        return 'landing'
      }
    }
    return saved || 'landing'
  })

  const handleStart = () => {
    setScreen('chat')
    localStorage.setItem('nnf_screen', 'chat')
  }

  const handleDone = () => {
    setScreen('thankyou')
    localStorage.removeItem('nnf_screen')
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
