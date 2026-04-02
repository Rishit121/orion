import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle, Loader } from 'lucide-react';

export default function QuizViewer() {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    setQuiz(null);
    setAnswers({});
    setSubmitted(false);
    
    try {
      const res = await fetch('/api/quiz', { method: 'POST' });
      if (res.ok) {
         const data = await res.json();
         setQuiz(data.quiz);
      } else {
         console.error("Quiz gen failed");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSelect = (qIdx, opt) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: opt }));
  };

  const score = quiz ? quiz.reduce((acc, q, i) => acc + (answers[i] === q.correct_answer ? 1 : 0), 0) : 0;

  return (
    <div style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
         <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Knowledge Check</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Test your understanding of the uploaded materials</p>
         </div>
         <button className="btn-accent" onClick={generateQuiz} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {loading ? <Loader size={18} className="lucide-spin" /> : <Brain size={18} />} Generate New Quiz
         </button>
      </div>

      {!quiz && !loading && (
         <div style={{ padding: '4rem', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <Brain size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-secondary)' }}>Click generate to create an AI quiz based on your notes.</p>
         </div>
      )}

      {loading && (
         <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Loader size={48} className="lucide-spin" color="var(--accent-secondary)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Analyzing concepts and writing questions...</p>
         </div>
      )}

      {quiz && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           {quiz.map((q, i) => (
             <div key={i} className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 500 }}>{i + 1}. {q.question}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                   {q.options.map((opt, j) => {
                      const isSelected = answers[i] === opt;
                      const isCorrect = opt === q.correct_answer;
                      
                      let bgColor = 'var(--bg-primary)';
                      let borderColor = 'var(--border-color)';
                      let textColor = 'var(--text-primary)';
                      
                      if (submitted) {
                         if (isCorrect) {
                            bgColor = 'rgba(74, 222, 128, 0.1)';
                            borderColor = '#4ade80';
                         } else if (isSelected && !isCorrect) {
                            bgColor = 'rgba(255, 77, 77, 0.1)';
                            borderColor = 'var(--accent-secondary)';
                         }
                      } else if (isSelected) {
                         borderColor = 'var(--text-primary)';
                      }

                      return (
                         <button 
                            key={j} 
                            onClick={() => handleSelect(i, opt)}
                            style={{ 
                               textAlign: 'left', padding: '1rem', borderRadius: 'var(--radius-md)',
                               backgroundColor: bgColor, border: `1px solid ${borderColor}`,
                               color: textColor, display: 'flex', justifyContent: 'space-between',
                               transition: 'all 0.2s'
                            }}
                         >
                            {opt}
                            {submitted && isCorrect && <CheckCircle size={18} color="#4ade80" />}
                            {submitted && isSelected && !isCorrect && <XCircle size={18} color="var(--accent-secondary)" />}
                         </button>
                      )
                   })}
                </div>
             </div>
           ))}
           
           {!submitted ? (
              <button 
                 className="btn-accent" 
                 style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem' }}
                 onClick={() => setSubmitted(true)}
                 disabled={Object.keys(answers).length !== quiz.length}
              >
                 Submit Answers
              </button>
           ) : (
              <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Score: {score} / {quiz.length}</div>
                 {score === quiz.length ? <span style={{ color: '#4ade80' }}>Perfect! 🎉</span> : <span style={{ color: 'var(--text-secondary)' }}>Review the ones you missed.</span>}
              </div>
           )}
        </div>
      )}
    </div>
  );
}
