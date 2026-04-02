import React, { useState } from 'react';
import ChatBox from './components/ChatBox';
import UploadModal from './components/UploadModal';
import QuizViewer from './components/QuizViewer';
import MindMapViewer from './components/MindMapViewer';
import { Settings, Upload, BrainCircuit, Activity } from 'lucide-react';

function App() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'quiz' | 'mindmap'

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      
      {/* Sidebar */}
      <div style={{ 
        width: '260px', 
        backgroundColor: 'var(--bg-secondary)', 
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem'
      }}>
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'var(--accent-secondary)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Activity size={20} color="white" />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Orion AI</h1>
        </div>

        <button 
          className="btn-accent" 
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}
          onClick={() => setIsUploadOpen(true)}
        >
          <Upload size={18} /> Upload Notes
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button 
             style={{ 
               display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
               borderRadius: 'var(--radius-md)', 
               backgroundColor: activeTab === 'chat' ? 'var(--bg-tertiary)' : 'transparent',
               textAlign: 'left'
             }}
             onClick={() => setActiveTab('chat')}
          >
             <span style={{ color: activeTab === 'chat' ? 'var(--accent-secondary)' : 'var(--text-secondary)' }}>Chat</span>
          </button>
          <button 
             style={{ 
               display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
               borderRadius: 'var(--radius-md)', 
               backgroundColor: activeTab === 'quiz' ? 'var(--bg-tertiary)' : 'transparent',
               textAlign: 'left'
             }}
             onClick={() => setActiveTab('quiz')}
          >
             <span style={{ color: activeTab === 'quiz' ? 'var(--accent-secondary)' : 'var(--text-secondary)' }}>Generate Quiz</span>
          </button>
          <button 
             style={{ 
               display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
               borderRadius: 'var(--radius-md)', 
               backgroundColor: activeTab === 'mindmap' ? 'var(--bg-tertiary)' : 'transparent',
               textAlign: 'left'
             }}
             onClick={() => setActiveTab('mindmap')}
          >
             <span style={{ color: activeTab === 'mindmap' ? 'var(--accent-secondary)' : 'var(--text-secondary)' }}>Concept Map</span>
          </button>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
            <Settings size={18} /> Settings
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
        {activeTab === 'chat' && <ChatBox />}
        {activeTab === 'quiz' && <QuizViewer />}
        {activeTab === 'mindmap' && <MindMapViewer />}
      </div>

      {/* Modals */}
      {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} />}
    </div>
  );
}

export default App;
