
import React, { useState } from 'react';
import { X, Upload, CheckCircle, Loader } from 'lucide-react';

export default function UploadModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setDone(true);
        setTimeout(() => onClose(), 1500);
      } else {
        const errorData = await res.json();
        setError(errorData.detail || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Is the backend running?");
    }
    setUploading(false);
  };

  return (
    <div style={{ 
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 
    }}>
      <div className="glass-panel" style={{ width: '400px', padding: '2rem', position: 'relative', backgroundColor: 'var(--bg-secondary)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-secondary)' }}>
          <X size={20} />
        </button>
        
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', textAlign: 'center' }}>Upload Study Material</h2>
        
        {!done ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
               border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', 
               padding: '2rem', width: '100%', textAlign: 'center', marginBottom: '1.5rem',
               backgroundColor: 'var(--bg-primary)'
            }}>
               <input 
                 type="file" 
                 accept=".pdf"
                 onChange={(e) => setFile(e.target.files[0])} 
                 style={{ display: 'none' }} 
                 id="file-upload" 
               />
               <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                 <Upload size={40} color="var(--accent-secondary)" />
                 <span style={{ fontWeight: 500 }}>{file ? file.name : "Click to select a PDF"}</span>
                 <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Max file size 50MB</span>
               </label>
            </div>
            
            {error && <div style={{ color: 'var(--accent-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
            
            <button 
              className="btn-accent" 
              style={{ width: '100%', opacity: file ? 1 : 0.5 }} 
              disabled={!file || uploading}
              onClick={handleUpload}
            >
              {uploading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><Loader size={16} className="lucide-spin" /> Indexing...</span> : "Upload & Index"}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0' }}>
            <CheckCircle size={48} color="#4ade80" />
            <h3>Success!</h3>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Document has been uploaded and added to the vector store.</p>
          </div>
        )}
      </div>
    </div>
  );
}
