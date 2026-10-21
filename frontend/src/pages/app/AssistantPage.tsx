import { useEffect, useRef, useState } from 'react'
import { Bot, Send, Sparkles, User } from 'lucide-react'
import { Button, ErrorMessage } from '@/components/ui'
import { PageHeader } from '@/components/app/parts'
import { api, getErrorMessage } from '@/lib/api'
import { cn } from '@/lib/cn'

interface Msg {
  id: number
  role: 'user' | 'assistant'
  text: string
}

const SUGGESTIONS = [
  'Create a workout plan for weight loss',
  'Explain how to do squats correctly',
  'What should I eat after a workout?',
  'How many rest days do I need?',
]

export function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 0, role: 'assistant', text: 'Hi! I am your AI fitness assistant. How can I help you today?' },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<{ text: string; retry: string } | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const nextId = useRef(1)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages, busy, error])

  async function send(text: string) {
    const message = text.trim()
    if (!message || busy) return
    setError(null)
    setInput('')
    setMessages((m) => [...m, { id: nextId.current++, role: 'user', text: message }])
    setBusy(true)
    try {
      const { data } = await api.post<{ reply: string; conversationId?: string }>('/ai/chat', {
        message,
        conversationId,
      })
      if (data.conversationId) setConversationId(data.conversationId)
      setMessages((m) => [...m, { id: nextId.current++, role: 'assistant', text: data.reply }])
    } catch (e) {
      setError({ text: getErrorMessage(e, 'The assistant could not answer right now.'), retry: message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-9rem)] min-h-[32rem] max-w-3xl flex-col">
      <PageHeader title="AI Fitness Assistant" subtitle="Ask anything about workouts, nutrition and recovery." />
      <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-line bg-card/50 p-4 sm:p-6" aria-live="polite" aria-label="Conversation">
        {messages.map((m) => (
          <div key={m.id} className={cn('flex gap-3', m.role === 'user' && 'flex-row-reverse')}>
            <span className={cn('grid size-9 shrink-0 place-items-center rounded-full', m.role === 'user' ? 'bg-primary/30 text-secondary' : 'bg-success/20 text-success-glow')}>
              {m.role === 'user' ? <User className="size-4" aria-hidden="true" /> : <Bot className="size-4" aria-hidden="true" />}
            </span>
            {/* Model output is untrusted: rendered as plain text only, never as HTML. */}
            <p className={cn('max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed', m.role === 'user' ? 'bg-primary/25' : 'border border-line bg-navy-800')}>
              {m.text}
            </p>
          </div>
        ))}
        {messages.length === 1 && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {SUGGESTIONS.map((s) => (
              <li key={s}>
                <button type="button" onClick={() => send(s)} className="flex w-full items-center gap-2.5 rounded-xl border border-line-strong bg-navy-800 px-4 py-3 text-left text-sm text-muted transition hover:border-secondary/60 hover:text-ink">
                  <Sparkles className="size-4 shrink-0 text-secondary" aria-hidden="true" /> {s}
                </button>
              </li>
            ))}
          </ul>
        )}
        {busy && <p className="text-sm text-muted" role="status">Thinking…</p>}
        {error && <ErrorMessage title="Message not sent" message={error.text} onRetry={() => send(error.retry)} />}
        <div ref={endRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void send(input)
        }}
        className="mt-4 flex gap-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1000}
          aria-label="Message"
          placeholder="Type your message…"
          className="h-12 flex-1 rounded-full border border-line-strong bg-navy-800 px-5 text-sm placeholder:text-faint focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
        />
        <Button type="submit" size="lg" aria-label="Send message" disabled={!input.trim() || busy}>
          <Send className="size-4" aria-hidden="true" />
        </Button>
      </form>
      <p className="mt-2 text-center text-xs text-faint">
        The assistant is not a doctor or a substitute for a qualified fitness professional.
      </p>
    </div>
  )
}
