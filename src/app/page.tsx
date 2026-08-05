'use client'

import { useChat } from 'ai/react'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Send, Mic, MicOff, Volume2, VolumeX, Square, Trash2 } from 'lucide-react'
import { RazielAvatar } from '@/features/raziel/components/RazielAvatar'
import { ChatMessage, TypingIndicator } from '@/features/raziel/components/ChatMessage'
import { useVoice } from '@/features/raziel/hooks/useVoice'

const HISTORY_KEY = 'raziel-history-v1'

function loadHistory(): any[] {
  if (typeof window === 'undefined') return []
  try {
    const saved = localStorage.getItem(HISTORY_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

type AvatarState = 'humano' | 'soul_reaver'

function detectState(content: string): AvatarState | null {
  const match = content.match(/^\[ESTADO:(humano|soul_reaver)\]/)
  if (match) return match[1] as AvatarState
  return null
}

function cleanContent(content: string): string {
  return content.replace(/^\[ESTADO:(humano|soul_reaver)\]\n?/, '').trim()
}

export default function RazielPage() {
  const [avatarState, setAvatarState] = useState<AvatarState>('humano')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  const {
    speak, stopSpeaking, isSpeaking, mouthOpen,
    startListening, stopListening, isListening, interimText,
    autoSpeak, setAutoSpeak,
  } = useVoice()

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, setMessages } = useChat({
    api: '/api/chat',
    onFinish: (message) => {
      const content = typeof message.content === 'string' ? message.content : ''
      const state = detectState(content)
      if (state) setAvatarState(state)
      // Auto-speak if enabled
      if (autoSpeak) {
        speak(cleanContent(content))
      }
    },
  })

  // Detect state from streaming (early detection)
  useEffect(() => {
    if (messages.length === 0) return
    const last = messages[messages.length - 1]
    if (last.role === 'assistant') {
      const content = typeof last.content === 'string' ? last.content : ''
      const state = detectState(content)
      if (state) setAvatarState(state)
    }
  }, [messages])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Load history from localStorage ONLY on client (avoids hydration mismatch)
  useEffect(() => {
    const saved = loadHistory()
    if (saved.length > 0) setMessages(saved)
    setMounted(true)
  }, [setMessages])

  // Persist history to localStorage
  useEffect(() => {
    if (!mounted) return
    if (messages.length === 0) return
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(messages))
    } catch { /* quota exceeded — ignore */ }
  }, [messages, mounted])

  const clearHistory = () => {
    if (!confirm('¿Borrar todo el historial de conversación?')) return
    try { localStorage.removeItem(HISTORY_KEY) } catch { /* ignore */ }
    setMessages([])
    setAvatarState('humano')
  }

  const isThinking = isLoading

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        handleSubmit(e as unknown as React.FormEvent)
      }
    }
  }

  const handleMic = () => {
    if (isListening) return  // stop is handled by the send button
    startListening((transcript) => {
      append({ role: 'user', content: transcript })
    })
  }

  const handleMicSend = () => {
    stopListening()  // stops recording and triggers onResult → append
  }

  const sendSuggestion = (text: string) => {
    append({ role: 'user', content: text })
  }

  return (
    <div className="h-screen flex flex-col bg-[#060810] bg-particles overflow-hidden min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1a2744] bg-[#0d1117]/60 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full transition-colors duration-700
            ${avatarState === 'soul_reaver'
              ? 'bg-[#00d4ff] shadow-[0_0_8px_rgba(0,212,255,0.9)]'
              : 'bg-[#c4a882] shadow-[0_0_6px_rgba(196,168,130,0.6)]'}`}
          />
          <span className="text-[#e2e8f0] font-semibold tracking-wide">Raziel</span>
          <span className="text-xs text-[#64748b] tracking-widest uppercase">Asesor Comercial</span>
          <Link href="/avatar" className="text-[10px] text-[#475569] hover:text-[#00d4ff] border border-[#1a2744] hover:border-[#00d4ff]/40 rounded-lg px-2 py-1 transition-all duration-200 tracking-widest uppercase">
            Avatar
          </Link>
          <Link href="/oferta" className="text-[10px] text-[#475569] hover:text-[#00d4ff] border border-[#1a2744] hover:border-[#00d4ff]/40 rounded-lg px-2 py-1 transition-all duration-200 tracking-widest uppercase">
            Oferta
          </Link>
          <Link href="/propuesta" className="text-[10px] text-[#475569] hover:text-[#00d4ff] border border-[#1a2744] hover:border-[#00d4ff]/40 rounded-lg px-2 py-1 transition-all duration-200 tracking-widest uppercase">
            Propuesta
          </Link>
          <Link href="/auditoria" className="text-[10px] text-[#475569] hover:text-red-400 border border-[#1a2744] hover:border-red-400/40 rounded-lg px-2 py-1 transition-all duration-200 tracking-widest uppercase">
            Auditoría
          </Link>
          <Link href="/legal" className="text-[10px] text-[#475569] hover:text-[#00d4ff] border border-[#1a2744] hover:border-[#00d4ff]/40 rounded-lg px-2 py-1 transition-all duration-200 tracking-widest uppercase">
            Legal
          </Link>
          <Link href="/contenido" className="text-[10px] text-[#475569] hover:text-[#00d4ff] border border-[#1a2744] hover:border-[#00d4ff]/40 rounded-lg px-2 py-1 transition-all duration-200 tracking-widest uppercase">
            Contenido
          </Link>
          <Link href="/docs-proyecto" className="text-[10px] text-[#475569] hover:text-[#00d4ff] border border-[#1a2744] hover:border-[#00d4ff]/40 rounded-lg px-2 py-1 transition-all duration-200 tracking-widest uppercase">
            Docs
          </Link>
          <Link href="/branding" className="text-[10px] text-[#475569] hover:text-[#00d4ff] border border-[#1a2744] hover:border-[#00d4ff]/40 rounded-lg px-2 py-1 transition-all duration-200 tracking-widest uppercase">
            Branding
          </Link>
          <Link href="/business-os" className="text-[10px] text-[#475569] hover:text-[#00d4ff] border border-[#1a2744] hover:border-[#00d4ff]/40 rounded-lg px-2 py-1 transition-all duration-200 tracking-widest uppercase">
            Business OS
          </Link>
          <Link href="/cfo" className="text-[10px] text-[#475569] hover:text-[#00d4ff] border border-[#1a2744] hover:border-[#00d4ff]/40 rounded-lg px-2 py-1 transition-all duration-200 tracking-widest uppercase">
            CFO
          </Link>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <span className={`text-xs transition-colors duration-500
            ${avatarState === 'soul_reaver' ? 'text-[#00d4ff]' : 'text-[rgba(196,168,130,0.6)]'}`}>
            {avatarState === 'soul_reaver' ? 'Soul Reaver activo' : 'Modo humano'}
          </span>

          {/* Auto-speak toggle */}
          <button
            type="button"
            onClick={() => { setAutoSpeak(!autoSpeak); stopSpeaking() }}
            title={autoSpeak ? 'Desactivar voz' : 'Activar voz'}
            aria-label={autoSpeak ? 'Desactivar voz' : 'Activar voz'}
            className={`p-1.5 rounded-lg transition-all duration-200
              ${autoSpeak
                ? 'text-[#00d4ff] bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)]'
                : 'text-[#475569] hover:text-[#64748b] border border-[#1a2744]'}`}
          >
            {autoSpeak ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          {/* Stop speaking */}
          {isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              title="Detener voz"
              aria-label="Detener voz"
              className="p-1.5 rounded-lg text-[#f97316] border border-[rgba(249,115,22,0.3)] bg-[rgba(249,115,22,0.1)]"
            >
              <Square size={14} />
            </button>
          )}

          {/* Clear history — only render after mount to avoid hydration mismatch */}
          {mounted && messages.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              title="Limpiar historial"
              aria-label="Limpiar historial"
              className="p-1.5 rounded-lg text-[#475569] hover:text-red-400 border border-[#1a2744] hover:border-red-400/40 transition-all duration-200"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar — Avatar */}
        <div className="hidden lg:flex flex-col items-center justify-between px-4 py-5 border-r border-[#1a2744] bg-[#090c14] flex-shrink-0 w-52 overflow-y-auto">
          <div className="flex flex-col items-center gap-4 w-full">
            <RazielAvatar state={avatarState} isThinking={isThinking} isSpeaking={isSpeaking} mouthOpen={mouthOpen} />

            {/* Capacities */}
            <div className="w-full space-y-1.5">
              <p className="text-[9px] text-[#475569] uppercase tracking-widest text-center mb-2">Capacidades</p>
              {[
                { icon: '📊', label: 'Marketing & Ofertas' },
                { icon: '💰', label: 'CFO Virtual' },
                { icon: '⚙️', label: 'Business OS' },
                { icon: '🔒', label: 'Auditoría Seguridad' },
                { icon: '⚖️', label: 'Docs Legal' },
                { icon: '📋', label: 'Propuesta Tech' },
                { icon: '📁', label: 'Docs por Proyecto' },
              ].map((cap) => (
                <div key={cap.label}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#060810] border border-[#1a2744]">
                  <span className="text-[11px]">{cap.icon}</span>
                  <span className="text-[11px] text-[#94a3b8] leading-tight">{cap.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4">

            {/* Welcome */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="md:hidden">
                  <RazielAvatar state={avatarState} isThinking={isThinking} isSpeaking={isSpeaking} mouthOpen={mouthOpen} />
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {isThinking && messages[messages.length - 1]?.role === 'user' && (
              <TypingIndicator />
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="flex-shrink-0 px-4 md:px-6 py-4 border-t border-[#1a2744] bg-[#090c14]">
            <form onSubmit={handleSubmit} className="flex gap-2 items-end">

              {/* Mic button */}
              <button
                type="button"
                onClick={handleMic}
                disabled={isListening}
                title="Hablar con Raziel"
                className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200
                  ${isListening
                    ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.7)] animate-pulse cursor-default'
                    : 'bg-[#0d1117] border border-[#1a2744] text-[#64748b] hover:border-[#0ea5e9] hover:text-[#0ea5e9]'}`}
              >
                {isListening ? <Mic size={16} /> : <Mic size={16} />}
              </button>

              {/* Text input */}
              <div className="relative flex-1">
                <textarea
                  value={isListening ? interimText : input}
                  onChange={isListening ? undefined : handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? '🎙 Escuchando...' : 'Habla o escribe con Raziel...'}
                  readOnly={isListening}
                  rows={1}
                  disabled={isLoading}
                  className={`w-full resize-none rounded-xl px-4 py-3 text-sm textarea-field-size
                    bg-[#0d1117] border text-[#e2e8f0]
                    placeholder-[#475569] outline-none
                    transition-all duration-200 max-h-32
                    ${isListening
                      ? 'border-red-500/60 ring-1 ring-red-500/30 text-[#94a3b8] italic'
                      : 'border-[#1a2744] focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]/30'}
                    ${isLoading ? 'opacity-60' : ''}`}
                />
                {isListening && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-0.5">
                    <span className="mic-bar mic-bar-1 w-1 h-3 bg-red-500 rounded-full" />
                    <span className="mic-bar mic-bar-2 w-1 h-3 bg-red-500 rounded-full" />
                    <span className="mic-bar mic-bar-3 w-1 h-3 bg-red-500 rounded-full" />
                  </div>
                )}
              </div>

              {/* Send / Stop-and-send button */}
              {isListening ? (
                <button
                  type="button"
                  onClick={handleMicSend}
                  aria-label="Detener y enviar"
                  title="Detener y enviar"
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
                    bg-red-600 hover:bg-red-700 text-white transition-all duration-200
                    shadow-[0_0_12px_rgba(220,38,38,0.5)]"
                >
                  <Send size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  aria-label="Enviar mensaje"
                  title="Enviar mensaje"
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
                    bg-[#0ea5e9] hover:bg-[#0284c7] disabled:bg-[#1a2744] disabled:text-[#475569]
                    text-white transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              )}
            </form>

            <div className="flex items-center justify-between mt-2 px-1">
              <p className="text-[10px] text-[#475569]">
                {isListening
                  ? '🔴 Grabando... toca el micrófono para enviar'
                  : 'Enter enviar · Shift+Enter nueva línea · 🎙 micrófono para voz'}
              </p>
              <p className={`text-[10px] transition-colors ${autoSpeak ? 'text-[#00d4ff]' : 'text-[#475569]'}`}>
                {autoSpeak ? '🔊 Voz activada' : '🔇 Voz desactivada'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
