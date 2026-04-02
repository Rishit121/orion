
import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Send, Loader } from 'lucide-react';

mermaid.initialize({ 
  startOnLoad: false, 
  theme: 'dark',
  themeVariables: {
     primaryColor: '#1f1f1f',
     primaryTextColor: '#fff',
     primaryBorderColor: '#27272a',
     lineColor: '#a1a1aa',
     secondaryColor: '#4a4a4a',
     tertiaryColor: '#141414'
  }
});

export default function MindMapViewer() {
  const [query, setQuery] = useState('');
  const [mermaidCode, setMermaidCode] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (mermaidCode && containerRef.current) {
        containerRef.current.innerHTML = '';
        setTimeout(() => {
           try {
             mermaid.render('mermaid-chart', mermaidCode).then((result) => {
               containerRef.current.innerHTML = result.svg;
             });
           } catch (e) {
             console.error("Mermaid parsing error", e);
             containerRef.current.innerHTML = '<div style="color:red">Failed to render mind map</div>';
           }
        }, 100);
    }
  }, [mermaidCode]);

  const handleGenerate = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setMermaidCode('');
    try {
      const res = await fetch('/api/mindmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (res.ok) {
        const data = await res.json();
        setMermaidCode(data.mermaid_code);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem' }}>
       <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Concept Map Generator</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Extract entities and visualize their relationships natively.</p>
       </div>
       
       <div style={{ display: 'flex', gap: '1rem', position: 'relative', marginBottom: '2rem' }}>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="E.g., Quantum Computing or Photosynthesis"
            style={{ 
               flex: 1, padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', 
               backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
               color: 'var(--text-primary)', fontSize: '1rem', outline: 'none'
            }}
          />
          <button 
            className="btn-accent" 
            style={{ borderRadius: 'var(--radius-md)', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? <Loader size={18} className="lucide-spin" /> : <Send size={18} />} Generate Map
          </button>
        </div>

        <div style={{ 
           flex: 1, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', 
           borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
           overflow: 'auto', padding: '2rem'
        }}>
           {loading ? (
              <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                 <Loader size={40} className="lucide-spin" style={{ marginBottom: '1rem' }} />
                 Building visual graph...
              </div>
           ) : !mermaidCode ? (
              <div style={{ color: 'var(--text-secondary)' }}>Enter a concept above to map out its structure.</div>
           ) : (
              <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
           )}
        </div>
    </div>
  );
}
