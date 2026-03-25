import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ChevronDown, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import t from '../data/translations.js';

const JIMMY_SYSTEM = `You are Jimmy, a warm, knowledgeable, and bilingual California organic certification expert. You help small farmers and food processors navigate the California CDFA organic certification process.

You have deep expertise in:
- Federal USDA National Organic Program (NOP) regulations: 7 CFR Part 205
- California State Organic Program (CASOP) - California's unique state-level requirements
- CDFA jurisdiction: raw agricultural products, livestock, eggs, raw dairy
- CDPH jurisdiction: processed foods, frozen foods, dietary supplements, cosmetics, pet food
- Registration processes: OPPR (Organic Processed Product Registration), PFR (Processed Food Registration)
- California state registration fees (tiered $25-$3,000 based on gross organic sales)
- Exemption: operations with ≤$5,000 gross organic sales are exempt from USDA certification (but still must comply and register with state)
- Certifying Agent selection (CCOF, MOCA, QAI, Oregon Tilth, etc.)
- Land transition: 3-year transition period free of prohibited substances before first organic harvest
- Dairy animal transition: 12 months continuous organic management before milk can be sold as organic
- Organic System Plan (OSP) requirements: practices, inputs, monitoring, audit trail (5-year records)
- Allowed and prohibited substances (OMRI list, NOP §205.601-205.604)
- Common non-compliance reasons: prohibited substances, inadequate recordkeeping, commingling, misrepresentation
- Financial assistance: OCCSP (Organic Certified Cost Share Program) - up to 75% reimbursement

Always:
- Be warm, encouraging, and practical
- Give specific, actionable answers
- Respond in the same language the user writes in (English or Spanish)
- Reference California-specific requirements when relevant
- Remind users to verify with their certifier and CDFA/CDPH directly for official guidance`;

async function callClaude(messages, onChunk, lang) {
  try {
    const systemMsg = JIMMY_SYSTEM + (lang === 'es' ? '\n\nIMPORTANT: The user is using the Spanish interface. Respond in Spanish unless they write in English.' : '');

    const res = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        system: systemMsg,
        stream: true,
      }),
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') return;
          try {
            const json = JSON.parse(data);
            const text = json.choices?.[0]?.delta?.content
              || json.delta?.text
              || json.content?.[0]?.text
              || '';
            if (text) onChunk(text);
          } catch {}
        }
      }
    }
  } catch (err) {
    onChunk(lang === 'es'
      ? '\n\n[Error conectando con Jimmy. Por favor intenta de nuevo.]'
      : '\n\n[Error connecting to Jimmy. Please try again.]');
  }
}

function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export default function ExpandableChat({ profile }) {
  const { lang } = useLanguage();
  const tx = t[lang].chat;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: tx.welcome }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const pendingRef = useRef('');

  // Reset welcome message on lang change
  useEffect(() => {
    setMessages([{ role: 'assistant', content: t[lang].chat.welcome }]);
  }, [lang]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    if (open) setTimeout(scrollToBottom, 50);
  }, [open, messages.length]);

  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 60);
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    pendingRef.current = '';

    // Add context about the user's operation
    const contextMsg = profile?.operationName
      ? `[Context: User's operation is "${profile.operationName}", type: ${profile.operationType || 'unknown'}, crops: ${profile.crops || 'unknown'}, county: ${profile.county || 'California'}]\n\n`
      : '';

    const apiMessages = newMessages.map((m, i) =>
      i === 0 && m.role === 'user'
        ? { ...m, content: contextMsg + m.content }
        : m
    );

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    await callClaude(apiMessages, (chunk) => {
      pendingRef.current += chunk;
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: pendingRef.current };
        return updated;
      });
      scrollToBottom();
    }, lang);

    setLoading(false);
  };

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 999,
          width: 56, height: 56, borderRadius: '50%',
          background: open ? '#374151' : 'var(--u-navy)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,45,84,0.35)',
          color: 'white',
        }}
        className="no-print"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={open ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X size={22} /> : <MessageCircle size={22} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', bottom: 96, right: 28, zIndex: 998,
              width: 390, height: 560,
              background: 'white',
              borderRadius: 18,
              boxShadow: '0 16px 60px rgba(0,0,0,0.2)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}
            className="no-print"
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, var(--u-navy-d), var(--u-navy))',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--u-gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Sparkles size={18} color="var(--u-navy)" />
              </div>
              <div>
                <p style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{tx.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{tx.tagline}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick chips */}
            <div style={{
              padding: '10px 14px 0',
              display: 'flex', flexWrap: 'wrap', gap: 6,
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: 10,
            }}>
              {tx.chips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  style={{
                    padding: '4px 11px', borderRadius: 12,
                    border: '1.5px solid #e2e8f0', background: '#f8fafc',
                    color: '#374151', fontSize: 11, cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--u-navy)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--u-navy)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div
              ref={scrollAreaRef}
              onScroll={handleScroll}
              style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{
                    maxWidth: '82%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user' ? 'var(--u-navy)' : '#f8fafc',
                    color: msg.role === 'user' ? 'white' : '#1e293b',
                    fontSize: 13,
                    lineHeight: 1.65,
                    border: msg.role === 'assistant' ? '1px solid #f1f5f9' : 'none',
                  }}>
                    {msg.role === 'assistant' && msg.content === '' && loading ? (
                      <div style={{ display: 'flex', gap: 4, padding: '2px 0' }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: '#cbd5e1',
                            animation: `bounce 1.4s infinite ease-in-out`,
                            animationDelay: `${i * 0.16}s`,
                          }} />
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{ whiteSpace: 'pre-wrap' }}
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                      />
                    )}
                    {msg.role === 'assistant' && msg.content && loading && i === messages.length - 1 && (
                      <span style={{ animation: 'caretBlink 0.8s step-end infinite' }}>▋</span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            {showScrollBtn && (
              <button
                onClick={scrollToBottom}
                style={{
                  position: 'absolute', bottom: 70, right: 16,
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--u-navy)', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <ChevronDown size={14} color="white" />
              </button>
            )}

            {/* Input */}
            <div style={{
              padding: '12px 14px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex', gap: 8, alignItems: 'flex-end',
            }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder={tx.placeholder}
                rows={1}
                style={{
                  flex: 1, padding: '9px 13px',
                  border: '1.5px solid #e2e8f0', borderRadius: 10,
                  fontSize: 13, fontFamily: 'Inter, sans-serif',
                  resize: 'none', outline: 'none',
                  maxHeight: 100, overflowY: 'auto',
                  lineHeight: 1.5,
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: input.trim() && !loading ? 'var(--u-navy)' : '#e2e8f0',
                  border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'background 0.15s',
                }}
              >
                <Send size={15} color={input.trim() && !loading ? 'white' : '#94a3b8'} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
