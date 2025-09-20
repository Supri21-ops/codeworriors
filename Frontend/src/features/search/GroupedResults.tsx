import React from 'react';
import { COLORS } from '../../theme';

interface Result {
  id: string;
  title: string;
  snippet: string;
  module: string;
  score: number;
  priority?: string;
}

export const GroupedResults: React.FC<{ results: Result[] }> = ({ results }) => {
  // Sort by score, then priority for orders
  const sorted = [...results].sort((a, b) => {
    if (a.module === 'Orders' && b.module === 'Orders') {
      if (a.priority && b.priority) return b.priority.localeCompare(a.priority) || b.score - a.score;
    }
    return b.score - a.score;
  });

  if (sorted.length === 0) return <div style={{ color: COLORS.background.steel, fontSize: 15 }}>No results found.</div>;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {sorted.map(r => (
        <div key={r.id} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(108,99,255,0.08)', padding: 16 }}>
          <div style={{ fontWeight: 700, color: COLORS.secondary.indigo, fontSize: 17 }}>{r.title}</div>
          <div style={{ fontSize: 14, color: COLORS.background.steel, margin: '6px 0' }}>
            {highlightSnippet(r.snippet)}
          </div>
          <div style={{ fontSize: 13, color: COLORS.background.steel }}>{r.module}</div>
        </div>
      ))}
    </div>
  );
};

function highlightSnippet(snippet: string) {
  // Simple highlight: wrap matched terms in indigo
  // In real use, API should return matched terms/positions
  return snippet.split(/(\*\*.+?\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <span key={i} style={{ color: '#6C63FF', fontWeight: 700 }}>{part.replace(/\*\*/g, '')}</span>
    ) : part
  );
}
