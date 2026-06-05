import React, { useState, useRef, useEffect, useCallback } from 'react';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';

const SUGGESTED_QUERIES = [
  { en: 'Show recent FIRs in Whitefield', kn: 'ವೈಟ್‌ಫೀಲ್ಡ್‌ನಲ್ಲಿ ಇತ್ತೀಚಿನ FIR ತೋರಿಸಿ', icon: '📋' },
  { en: 'Who are the top high-risk offenders?', kn: 'ಅತ್ಯಂತ ಅಪಾಯಕಾರಿ ಅಪರಾಧಿಗಳು ಯಾರು?', icon: '⚠️' },
  { en: 'Crime hotspots in Bengaluru last 30 days', kn: 'ಕಳೆದ 30 ದಿನಗಳ ಬೆಂಗಳೂರಿನ ಅಪರಾಧ ತಾಣಗಳು', icon: '🗺️' },
  { en: 'Show robbery trends for last 6 months', kn: 'ಕಳೆದ 6 ತಿಂಗಳ ದರೋಡೆ ಪ್ರವೃತ್ತಿ', icon: '📈' },
  { en: 'Predict crime hotspots for next month', kn: 'ಮುಂದಿನ ತಿಂಗಳಿಗೆ ಅಪರಾಧ ತಾಣ ಮುನ್ಸೂಚನೆ', icon: '🔮' },
  { en: 'Any gang activity in Kalaburagi?', kn: 'ಕಲಬುರಗಿಯಲ್ಲಿ ಗ್ಯಾಂಗ್ ಚಟುವಟಿಕೆ ಇದೆಯೇ?', icon: '🕵️' },
];

function MessageBubble({ msg, language }) {
  const isUser = msg.role === 'user';
  const formattedContent = msg.content.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <div key={i} style={{ fontWeight: 700, color: 'var(--color-primary)', marginTop: i > 0 ? '8px' : 0, marginBottom: '4px' }}>{line.replace(/\*\*/g, '')}</div>;
    }
    if (line.match(/^\*\*(.*?)\*\*/)) {
      const parts = line.split(/\*\*(.*?)\*\*/);
      return <div key={i}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: 'var(--text-primary)' }}>{p}</strong> : p)}</div>;
    }
    if (line.startsWith('•') || line.startsWith('-') || /^\d+\./.test(line)) {
      return <div key={i} style={{ marginLeft: '12px', marginTop: '3px', color: 'var(--text-secondary)' }}>{line}</div>;
    }
    if (line.startsWith('📋') || line.startsWith('📊') || line.startsWith('🔴') || line.startsWith('🟡') || line.startsWith('👤') || line.startsWith('⚠️') || line.startsWith('💡') || line.startsWith('🔺') || line.startsWith('🔻') || line.startsWith('🔮') || line.startsWith('🛡️')) {
      return <div key={i} style={{ marginTop: '8px', marginBottom: '2px' }}>{line}</div>;
    }
    return line ? <div key={i}>{line}</div> : <div key={i} style={{ height: '6px' }} />;
  });

  return (
    <div className={`message-row ${isUser ? 'user' : 'ai'}`}>
      <div className={`message-avatar ${isUser ? 'user' : 'ai'}`}>
        {isUser ? '👮' : '🤖'}
      </div>
      <div>
        <div className={`message-bubble ${isUser ? 'user' : 'ai'} ${language === 'kn' ? 'lang-kn' : ''}`}>
          {formattedContent}
        </div>
        {msg.citations && msg.citations.length > 0 && (
          <div className="message-citations">
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Sources:</span>
            {msg.citations.map((c, i) => (
              <span key={i} className="citation-tag">{c}</span>
            ))}
          </div>
        )}
        <div className="message-time">
          {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          {msg.language === 'kn' && <span className="badge badge-purple" style={{ fontSize: '9px', padding: '1px 5px' }}>ಕನ್ನಡ</span>}
        </div>
      </div>
    </div>
  );
}

export default function ChatInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: '0', role: 'ai', timestamp: Date.now(),
      content: `**ನಮಸ್ಕಾರ! Welcome to KSP Crime Intelligence Assistant** 🛡️\n\nI can help you query the Karnataka State Police crime database in **English** or **ಕನ್ನಡ**. You can also use the microphone button to speak your query.\n\n**What I can help with:**\n• FIR search and case status\n• Crime hotspot analysis\n• Accused / suspect profiles\n• Crime trends and patterns\n• Crime forecasting and alerts\n• Criminal network analysis\n\nType your query below or choose a suggestion to get started.`,
      citations: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId] = useState('session-' + Date.now());
  const [showExplain, setShowExplain] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now(), language };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const result = await chatAPI.sendMessage(text, sessionId, language);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: result.response,
        citations: result.citations || [],
        timestamp: Date.now(),
        language: result.language || language,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: 'ai', timestamp: Date.now(),
        content: '⚠️ Connection error. Please check your network and try again.',
        citations: []
      }]);
    } finally {
      setLoading(false);
    }
  }, [loading, language, sessionId]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input not supported in this browser. Please use Chrome.');
      return;
    }
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = language === 'kn' ? 'kn-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
    setIsRecording(true);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(249, 115, 22);
    doc.text('KSP Crime Intelligence — Conversation Export', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`Session: ${sessionId} | Exported by: ${user?.name} | ${new Date().toLocaleString('en-IN')}`, 14, 28);
    doc.setDrawColor(249, 115, 22);
    doc.line(14, 32, 196, 32);
    let y = 40;
    messages.forEach(msg => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(9);
      doc.setTextColor(msg.role === 'user' ? 59 : 16, msg.role === 'user' ? 130 : 185, msg.role === 'user' ? 246 : 129);
      doc.text(`[${msg.role.toUpperCase()}] ${new Date(msg.timestamp).toLocaleTimeString()}`, 14, y);
      y += 5;
      doc.setTextColor(241, 245, 249);
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(msg.content.replace(/\*\*/g, ''), 170);
      lines.forEach(line => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(line, 14, y); y += 4.5;
      });
      y += 4;
    });
    doc.save(`KSP-Chat-${sessionId}.pdf`);
  };

  const clearChat = () => {
    setMessages([{
      id: '0', role: 'ai', timestamp: Date.now(),
      content: 'Conversation cleared. How can I assist you?',
      citations: []
    }]);
  };

  return (
    <div style={{ height: 'calc(100vh - var(--topbar-height) - 48px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <div className="page-title">AI Crime Intelligence Chat</div>
          <div className="page-desc">Query the KSP crime database in English or Kannada · Voice enabled</div>
        </div>
        {/* Language toggle */}
        <div style={{ display: 'flex', background: 'var(--color-bg-surface)', borderRadius: '8px', padding: '3px', border: '1px solid var(--border-default)' }}>
          <button
            className={`btn btn-sm ${language === 'en' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '6px', padding: '5px 14px' }}
            onClick={() => setLanguage('en')}
          >🇬🇧 EN</button>
          <button
            className={`btn btn-sm ${language === 'kn' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '6px', padding: '5px 14px', fontFamily: 'var(--font-kn)' }}
            onClick={() => setLanguage('kn')}
          >🇮🇳 ಕನ್ನಡ</button>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowExplain(!showExplain)}>
          🧠 {showExplain ? 'Hide' : 'Show'} Context
        </button>
        <button className="btn btn-secondary btn-sm" onClick={exportPDF}>
          📄 Export PDF
        </button>
        <button className="btn btn-ghost btn-sm" onClick={clearChat}>🗑️ Clear</button>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '16px', minHeight: 0 }}>
        {/* Main Chat */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, gap: '12px' }}>
          {/* Messages */}
          <div className="chat-messages" style={{ flex: 1, minHeight: 0 }}>
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} language={language} />
            ))}
            {loading && (
              <div className="message-row ai">
                <div className="message-avatar ai">🤖</div>
                <div className="message-bubble ai">
                  <div className="typing-indicator">
                    <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>Analyzing crime database...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested queries */}
          {messages.length <= 2 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flexShrink: 0 }}>
              {SUGGESTED_QUERIES.map((q, i) => (
                <button
                  key={i}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '12px', border: '1px solid var(--border-default)' }}
                  onClick={() => sendMessage(language === 'kn' ? q.kn : q.en)}
                >
                  {q.icon} {language === 'kn' ? q.kn : q.en}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div className="chat-input-area" style={{ flexShrink: 0 }}>
            <div className="chat-input-row">
              <textarea
                ref={textareaRef}
                className={`chat-textarea ${language === 'kn' ? 'lang-kn' : ''}`}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === 'kn' ? 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾಡಲು ಮೈಕ್ ಬಳಸಿ...' : 'Ask about FIRs, crimes, offenders, hotspots, trends... (Enter to send, Shift+Enter for new line)'}
                rows={1}
                disabled={loading}
              />
              <button
                className={`btn-voice ${isRecording ? 'recording' : ''}`}
                onClick={toggleVoice}
                title={isRecording ? 'Stop Recording' : 'Voice Input'}
                style={{ fontSize: '16px', flexShrink: 0 }}
              >{isRecording ? '⏹️' : '🎙️'}</button>
              <button
                className="btn btn-primary"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                style={{ flexShrink: 0, height: '40px' }}
              >
                {loading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : '➤ Send'}
              </button>
            </div>
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>⌨️ <kbd style={{ padding: '1px 5px', borderRadius: '3px', border: '1px solid var(--border-default)', fontSize: '10px' }}>Enter</kbd> to send · <kbd style={{ padding: '1px 5px', borderRadius: '3px', border: '1px solid var(--border-default)', fontSize: '10px' }}>Shift+Enter</kbd> for new line</span>
              <span>🎙️ Voice supported: English & ಕನ್ನಡ</span>
              <span style={{ marginLeft: 'auto' }}>{messages.filter(m=>m.role==='user').length} queries in this session</span>
            </div>
          </div>
        </div>

        {/* Right sidebar — Explainability & Context */}
        {showExplain && (
          <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0 }}>
            <div className="card" style={{ padding: '16px' }}>
              <div className="card-title" style={{ marginBottom: '12px' }}>🧠 AI Reasoning</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Responses are generated by querying the KSP Data Store using ZCQL and augmented by Catalyst QuickML RAG grounded on Karnataka Police procedural documents.
              </div>
              <div className="divider" />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>LLM Model</span>
                  <span style={{ color: 'var(--color-secondary)' }}>QuickML RAG</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Knowledge Base</span>
                  <span style={{ color: 'var(--color-success)' }}>✓ Active</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Data Source</span>
                  <span style={{ color: 'var(--color-secondary)' }}>Catalyst Data Store</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Confidence</span>
                  <span style={{ color: 'var(--color-primary)' }}>High</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div className="card-title" style={{ marginBottom: '12px' }}>📂 Data Sources</div>
              {['KSP FIR Database', 'Accused Registry', 'Court Records', 'Financial Intelligence', 'Social Indicators'].map((src, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{src}</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <div className="card-title" style={{ marginBottom: '12px' }}>💬 Session</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <div style={{ marginBottom: '4px' }}>ID: {sessionId.substring(8)}</div>
                <div style={{ marginBottom: '4px' }}>User: {user?.badge}</div>
                <div>Msgs: {messages.length}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
