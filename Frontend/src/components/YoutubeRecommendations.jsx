import React from 'react';
import { Video } from 'lucide-react';

export default function YouTubeRecommendation({ url }) {
  if (!url) return null;

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Recommended Deep Dive
      </p>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '0.75rem', 
          padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', 
          backgroundColor: 'rgba(255, 0, 0, 0.1)', border: '1px solid rgba(255, 0, 0, 0.2)',
          color: '#ff4d4d', textDecoration: 'none', transition: 'all 0.2s',
          fontWeight: 500
        }}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.2)' }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.1)' }}
      >
        <Video size={20} />
        Watch on YouTube
      </a>
    </div>
  );
}
