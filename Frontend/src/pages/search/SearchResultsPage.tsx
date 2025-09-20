import React, { useState, useEffect } from 'react';
// Sidebar provided by layout; remove local Sidebar import
import { Topbar } from '../../components/Topbar';
import { GlobalSearchBar } from '../../components/search/GlobalSearchBar';
import { GroupedResults } from '../../features/search/GroupedResults';
import { COLORS } from '../../theme';

const MODULES = ['Orders', 'BOMs', 'Work Orders', 'Inventory', 'Work Centers', 'Reports'];

const SearchResultsPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ id: string; title: string; snippet: string; module: string; score: number; priority?: string }>>([]);
  const [activeTab, setActiveTab] = useState(MODULES[0]);

  useEffect(() => {
    if (!query) return setResults([]);
    fetch(`/api/search?q=${encodeURIComponent(query)}&modules=all`)
      .then(res => res.json())
      .then(data => setResults(data.results));
  }, [query]);

  // Realtime refresh (pseudo-code)
  // useEffect(() => {
  //   const sub = subscribe('search.index.updated', () => setQuery(q => q));
  //   return () => sub.unsubscribe();
  // }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.background.lightGray }}>
      <div style={{ flex: 1 }}>
  <Topbar right={<GlobalSearchBar onSelect={s => setQuery(s.title)} />} />
        <main style={{ padding: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Search Results</h2>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {MODULES.map(m => (
              <button
                key={m}
                onClick={() => setActiveTab(m)}
                style={{
                  padding: '0.5rem 1.2rem',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === m ? COLORS.secondary.indigo : '#F0F0F0',
                  color: activeTab === m ? '#fff' : COLORS.background.steel,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <GroupedResults results={results.filter(r => r.module === activeTab)} />
        </main>
      </div>
    </div>
  );
};

export default SearchResultsPage;
