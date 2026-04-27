import { useState, useEffect } from 'react';
import axios from 'axios';
import './HistoryPage.css';

const LANG_NAMES = {
  en: 'English', es: 'Spanish', fr: 'French', de: 'German',
  it: 'Italian', pt: 'Portuguese', ru: 'Russian', zh: 'Chinese',
  ja: 'Japanese', ar: 'Arabic', hi: 'Hindi', ko: 'Korean',
  nl: 'Dutch', pl: 'Polish', tr: 'Turkish', vi: 'Vietnamese'
};

const fmt = (lang) => LANG_NAMES[lang] || lang?.toUpperCase();

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get('/api/history');
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await axios.delete(`/api/history/${id}`);
      setHistory(prev => prev.filter(h => h._id !== id));
    } catch (err) { console.error(err); }
  };

  const clearAll = async () => {
    if (!window.confirm('Clear all translation history?')) return;
    setClearing(true);
    try {
      await axios.delete('/api/history');
      setHistory([]);
    } catch (err) { console.error(err); }
    setClearing(false);
  };

  const filtered = history.filter(h =>
    !filter ||
    h.sourceText.toLowerCase().includes(filter.toLowerCase()) ||
    h.translatedText.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return (
    <div className="history-page">
      <div style={{display:'flex',justifyContent:'center',padding:'4rem'}}>
        <div className="spinner" style={{width:32,height:32}} />
      </div>
    </div>
  );

  return (
    <div className="history-page fade-in">
      <div className="history-header">
        <div>
          <h1>Translation History</h1>
          <p>{history.length} translation{history.length !== 1 ? 's' : ''} saved</p>
        </div>
        {history.length > 0 && (
          <button className="clear-all-btn" onClick={clearAll} disabled={clearing}>
            {clearing ? <span className="spinner" /> : '🗑 Clear All'}
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search translations…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{history.length === 0 ? '📭' : '🔍'}</div>
          <h3>{history.length === 0 ? 'No translations yet' : 'No results found'}</h3>
          <p>{history.length === 0
            ? 'Your translation history will appear here'
            : 'Try a different search term'}
          </p>
        </div>
      ) : (
        <div className="history-list">
          {filtered.map(entry => (
            <div key={entry._id} className="history-card">
              <div className="history-langs">
                <span className="lang-badge">{fmt(entry.sourceLang)}</span>
                <span className="lang-arrow">→</span>
                <span className="lang-badge target">{fmt(entry.targetLang)}</span>
                <span className="history-time">{timeAgo(entry.createdAt)}</span>
              </div>
              <div className="history-texts">
                <div className="history-source">
                  <label>Original</label>
                  <p>{entry.sourceText}</p>
                </div>
                <div className="history-divider">→</div>
                <div className="history-result">
                  <label>Translation</label>
                  <p>{entry.translatedText}</p>
                </div>
              </div>
              <button
                className="delete-btn"
                onClick={() => deleteEntry(entry._id)}
                title="Delete"
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
