import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import YouTubeRecommendation from './YouTubeRecommendation';

export default function ChatBox() {
  const [messages, setMessages] = useState([{ role: 'ai', content: "Hi! I'm Orion. Upload some documents and ask me anything." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg })
      });
      const data = await res.json();
      
      if (res.ok) {
         setMessages(prev => [...prev, { role: 'ai', content: data.answer, youtube_url: data.youtube_url }]);
      } else {
         setMessages(prev => [...prev, { role: 'ai', content: `Error: ${data.detail || 'Failed to get answer'}` }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Network error occurred." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '1rem', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ 
               width: '36px', height: '36px', borderRadius: '50%', 
               backgroundColor: m.role === 'user' ? 'var(--bg-tertiary)' : 'var(--accent-secondary)',
               display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div style={{ 
               maxWidth: '80%', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)',
               backgroundColor: m.role === 'user' ? 'var(--bg-tertiary)' : 'rgba(255, 77, 77, 0.1)',
               border: m.role === 'user' ? '1px solid var(--border-color)' : '1px solid rgba(255, 77, 77, 0.2)',
               color: 'var(--text-primary)'
            }}>
               <ReactMarkdown>{m.content}</ReactMarkdown>
               {m.youtube_url && <YouTubeRecommendation url={m.youtube_url} />}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} />
            </div>
            <div style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'transparent' }}>
              <Loader size={20} className="lucide-spin" style={{ animation: 'spin 2s linear infinite' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Orion something about your materials..."
            style={{ 
               flex: 1, padding: '1rem 1.5rem', borderRadius: 'var(--radius-xl)', 
               backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
               color: 'var(--text-primary)', fontSize: '1rem', outline: 'none'
            }}
          />
          <button 
            className="btn-accent" 
            style={{ position: 'absolute', right: '0.5rem', top: '0.5rem', bottom: '0.5rem', borderRadius: 'var(--radius-lg)', padding: '0 1.25rem' }}
            onClick={handleSend}
            disabled={loading}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .lucide-spin { animation: spin 1s linear infinite; }
      `}} />
    </div>
  );
}
