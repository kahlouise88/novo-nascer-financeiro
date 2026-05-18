import { useState, useEffect, useRef } from 'react'
import { FLOW, TOTAL_LAYERS, getStep } from '../lib/flow.js'

const DELAY = 800

function resolve(val, vars) {
  return typeof val === 'function' ? val(vars) : val
}

export default function ChatInterface({ onDone }) {
  const saved = JSON.parse(localStorage.getItem('nnf_progress') || 'null')

  const [messages, setMessages] = useState(saved?.messages || [])
  const [currentStepId, setCurrentStepId] = useState(saved?.currentStepId || 'welcome')
  const [vars, setVars] = useState(saved?.vars || {})
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentLayer, setCurrentLayer] = useState(saved?.currentLayer || 0)
  const [waitingForInput, setWaitingForInput] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const saveProgress = (msgs, stepId, v, layer) => {
    localStorage.setItem('nnf_progress', JSON.stringify({
      messages: msgs, currentStepId: stepId, vars: v, currentLayer: layer
    }))
  }

  const addAgentMessage = (text) => {
    setMessages((prev) => [...prev, { role: 'agent', text }])
  }

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { role: 'user', text }])
  }

  const processStep = (stepId, currentVars, currentMsgs, layer) => {
    const step = getStep(stepId)
    if (!step) return

    if (step.layer) {
      layer = step.layer
      setCurrentLayer(step.layer)
    }

    if (step.type === 'agent') {
      setIsTyping(true)
      setTimeout(() => {
        const text = resolve(step.text, currentVars)
        const newMsgs = [...currentMsgs, { role: 'agent', text }]
        setMessages(newMsgs)
        setIsTyping(false)
        const nextId = resolve(step.next, currentVars)
        saveProgress(newMsgs, nextId, currentVars, layer)
        processStep(nextId, currentVars, newMsgs, layer)
      }, DELAY)

    } else if (step.type === 'input' || step.type === 'choice') {
      setCurrentStepId(stepId)
      setWaitingForInput(true)
      saveProgress(currentMsgs, stepId, currentVars, layer)

    } else if (step.type === 'generating') {
      setCurrentStepId('generating')
      setWaitingForInput(false)
      submitDiagnostic(currentVars)

    } else if (step.type === 'done') {
      onDone()
    }
  }

  const handleUserAnswer = (value) => {
    const step = getStep(currentStepId)
    if (!step) return

    const newVars = { ...vars, [step.variable]: value }
    setVars(newVars)
    setWaitingForInput(false)
    setInputValue('')

    const newMsgs = [...messages, { role: 'user', text: value }]
    setMessages(newMsgs)

    const nextId = resolve(step.next, value)
    processStep(nextId, newVars, newMsgs, currentLayer)
  }

  const handleInputSubmit = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    handleUserAnswer(inputValue.trim())
  }

  const submitDiagnostic = async (finalVars) => {
    const step = getStep('final_msg')
    const newMsgs = [...messages]

    try {
      await fetch('/.netlify/functions/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalVars),
      })
    } catch (e) {
      console.error('Erro ao gerar relatório:', e)
    }

    onDone()
  }

  // Bootstrap: run first step on mount if no saved state
  useEffect(() => {
    if (messages.length === 0) {
      processStep('welcome', {}, [], 0)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (waitingForInput && inputRef.current) {
      inputRef.current.focus()
    }
  }, [waitingForInput, currentStepId])

  const currentStep = getStep(currentStepId)
  const progress = Math.min((currentLayer / TOTAL_LAYERS) * 100, 100)

  return (
    <div className="chat-wrapper">
      <header className="chat-header">
        <div className="chat-header-inner">
          <div className="chat-header-text">
            <h1 className="chat-title">O Novo Nascer Financeiro</h1>
            <p className="chat-subtitle">por Katharine Louise</p>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`msg msg-${msg.role}`}>
            {msg.role === 'agent' && (
              <div className="avatar">K</div>
            )}
            <div className="msg-bubble">{msg.text}</div>
          </div>
        ))}

        {isTyping && (
          <div className="msg msg-agent">
            <div className="avatar">K</div>
            <div className="msg-bubble typing">
              <span /><span /><span />
            </div>
          </div>
        )}

        {currentStepId === 'generating' && (
          <div className="msg msg-agent">
            <div className="avatar">K</div>
            <div className="msg-bubble generating">
              <div className="spinner" />
              <span>Gerando seu relatório personalizado...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      <footer className="chat-footer">
        {waitingForInput && currentStep?.type === 'choice' && (
          <div className="choices">
            {currentStep.options.map((opt) => (
              <button key={opt} className="choice-btn" onClick={() => handleUserAnswer(opt)}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {waitingForInput && currentStep?.type === 'input' && (
          <form className="input-form" onSubmit={handleInputSubmit}>
            <input
              ref={inputRef}
              className="chat-input"
              type={currentStep.inputType || 'text'}
              placeholder={resolve(currentStep.placeholder, vars)}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="send-btn" disabled={!inputValue.trim()}>
              →
            </button>
          </form>
        )}
      </footer>
    </div>
  )
}
