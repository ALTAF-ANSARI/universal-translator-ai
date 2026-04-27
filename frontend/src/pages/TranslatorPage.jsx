import { useState, useEffect } from 'react';
import axios from 'axios';
import './TranslatorPage.css';

const LANG_NAMES = {
  en: 'English', es: 'Spanish', fr: 'French', de: 'German',
  it: 'Italian', pt: 'Portuguese', ru: 'Russian', zh: 'Chinese',
  ja: 'Japanese', ar: 'Arabic', hi: 'Hindi', ko: 'Korean',
  nl: 'Dutch', pl: 'Polish', tr: 'Turkish', vi: 'Vietnamese'
};

export default function TranslatorPage() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    axios.get('/api/translate/languages')
      .then(res => setLanguages(res.data))
      .catch(() => {
        setLanguages(Object.entries(LANG_NAMES).map(([code, name]) => ({ code, name })));
      });
  }, []);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/translate', {
        text: sourceText,
        source: sourceLang,
        target: targetLang
      });
      setTranslatedText(data.translatedText);
    } catch (err) {
      setError(err.response?.data?.message || 'Translation failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setSourceText('');
    setTranslatedText('');
    setError('');
    setCharCount(0);
  };

  return (
    <div className="translator-page fade-in">
      <div className="translator-header">
        <h1>Dynamic Translator</h1>
        <p>Translate text with regional phrase & idiom support</p>
      </div>

      <div className="lang-bar">
        <div className="lang-select-wrap">
          <label>From</label>
          <select value={sourceLang} onChange={e => setSourceLang(e.target.value)}>
            {languages.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>

        <button className="swap-btn" onClick={swapLanguages} title="Swap languages">
          ⇄
        </button>

        <div className="lang-select-wrap">
          <label>To</label>
          <select value={targetLang} onChange={e => setTargetLang(e.target.value)}>
            {languages.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="translator-grid">
        <div className="text-panel">
          <div className="panel-header">
            <span>{languages.find(l => l.code === sourceLang)?.name || sourceLang}</span>
            <span className="char-count">{charCount} / 1000</span>
          </div>
          <textarea
            value={sourceText}
            onChange={e => {
              const val = e.target.value.slice(0, 1000);
              setSourceText(val);
              setCharCount(val.length);
            }}
            placeholder="Enter text to translate..."
            className="text-area"
          />
          <div className="panel-footer">
            {sourceText && (
              <button className="clear-btn" onClick={clearAll}>✕ Clear</button>
            )}
            <button
              className="translate-btn"
              onClick={handleTranslate}
              disabled={loading || !sourceText.trim()}
            >
              {loading ? <><span className="spinner" /> Translating…</> : '⚡ Translate'}
            </button>
          </div>
        </div>

        <div className="text-panel result-panel">
          <div className="panel-header">
            <span>{languages.find(l => l.code === targetLang)?.name || targetLang}</span>
            {translatedText && (
              <button className="copy-btn" onClick={copyToClipboard}>
                {copied ? '✓ Copied' : '⎘ Copy'}
              </button>
            )}
          </div>
          <div className={`text-area result-text ${translatedText ? '' : 'empty'}`}>
            {loading
              ? <div className="loading-dots"><span/><span/><span/></div>
              : translatedText || <span className="placeholder-text">Translation will appear here…</span>
            }
          </div>
          {error && <div className="translate-error">{error}</div>}
        </div>
      </div>
    </div>
  );
}
