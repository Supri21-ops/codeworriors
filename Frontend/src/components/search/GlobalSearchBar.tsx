import React, { useState, useRef } from 'react';
import { COLORS } from '../../theme';

interface Suggestion {
  id: string;
  title: string;
  snippet: string;
  module: string;
  score: number;
}

export const GlobalSearchBar: React.FC<{ onSelect?: (s: Suggestion) => void }> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<number | null>(null);

  const fetchSuggestions = (q: string) => {
    if (!q) return setSuggestions([]);
    fetch(`/api/search?q=${encodeURIComponent(q)}&modules=all`)
      .then(res => res.json())
      .then(data => setSuggestions(data.results.slice(0, 5)));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setShowDropdown(true);
  if (debounceRef.current) window.clearTimeout(debounceRef.current);
  debounceRef.current = window.setTimeout(() => fetchSuggestions(val), 400);
  };

  const handleSelect = (s: Suggestion) => {
    setQuery(s.title);
    setShowDropdown(false);
    if (onSelect) onSelect(s);
  };

  return (
    <div style={{ position: 'relative', width: 320 }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
        style={{
          width: '100%',
          padding: '0.5rem 1rem',
          borderRadius: 8,
          border: `1.5px solid ${COLORS.secondary.indigo}`,
          fontSize: 16,
          outline: 'none',
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      {showDropdown && suggestions.length > 0 && (
        <div style={{ position: 'absolute', top: '110%', left: 0, width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(108,99,255,0.12)', zIndex: 10 }}>
          {suggestions.map(s => (
            <div
              key={s.id}
              style={{ padding: '0.7rem 1rem', cursor: 'pointer', borderBottom: '1px solid #F0F0F0' }}
              onMouseDown={() => handleSelect(s)}
            >
              <span style={{ color: COLORS.secondary.indigo, fontWeight: 700 }}>{s.title}</span>
              <div style={{ fontSize: 13, color: COLORS.background.steel }}>{s.snippet}</div>
              <div style={{ fontSize: 12, color: COLORS.background.steel, marginTop: 2 }}>{s.module}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
