import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, MapPin, Phone, Mail, Filter } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import certifiers from '../data/certifiers.js';

const CA_CERTIFIERS = ['ccof', 'moca', 'monterey', 'occert', 'qai', 'primus', 'scs', 'yolo'];

export default function CertifierDirectory() {
  const { lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const tx = {
    title: lang === 'es' ? 'Directorio de Agentes Certificadores' : 'Certifying Agent Directory',
    subtitle: lang === 'es'
      ? 'Todos los agentes certificadores acreditados por el USDA que operan en California'
      : 'All USDA-accredited certifying agents operating in California',
    search: lang === 'es' ? 'Buscar por nombre, ubicación...' : 'Search by name, location...',
    all: lang === 'es' ? 'Todos' : 'All',
    caOnly: lang === 'es' ? 'Con sede en CA' : 'CA-Based',
    total: lang === 'es' ? 'Total de Certificadores' : 'Total Certifiers',
    caBased: lang === 'es' ? 'Con Sede en CA' : 'CA-Based',
    website: lang === 'es' ? 'Sitio Web' : 'Website',
    noResults: lang === 'es' ? 'No se encontraron resultados.' : 'No results found.',
    noteLabel: lang === 'es' ? 'Notas' : 'Notes',
    tip: lang === 'es'
      ? 'Consejo: Los certificadores con sede en California pueden tener más experiencia con los requisitos de CDFA. Solicita cotizaciones a varios antes de decidir.'
      : 'Tip: CA-based certifiers may have more experience with CDFA requirements. Request quotes from several before deciding.',
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return certifiers.filter(c => {
      const matchFilter = filter === 'all' || (filter === 'ca' && CA_CERTIFIERS.includes(c.id));
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q) || c.notes.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [search, filter]);

  const caCount = certifiers.filter(c => CA_CERTIFIERS.includes(c.id)).length;

  const inputStyle = {
    padding: '9px 12px', borderRadius: 8,
    border: '1.5px solid #e2e8f0', fontSize: 13,
    fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--u-navy)', fontFamily: 'Lora, serif', marginBottom: 6 }}>
          {tx.title}
        </h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>{tx.subtitle}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: tx.total, value: certifiers.length, color: 'var(--u-navy)' },
          { label: tx.caBased, value: caCount, color: '#1B6B2E' },
          { label: lang === 'es' ? 'Mostrando' : 'Showing', value: filtered.length, color: '#3AA8E4' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'white', borderRadius: 12, padding: '14px 20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 800, color }}>{value}</p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text" placeholder={tx.search} value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 32, width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Filter size={14} color="#94a3b8" />
          {[['all', tx.all], ['ca', tx.caOnly]].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} style={{
              padding: '8px 14px', borderRadius: 8, border: `1.5px solid ${filter === val ? 'var(--u-navy)' : '#e2e8f0'}`,
              background: filter === val ? 'var(--u-navy)' : 'white',
              color: filter === val ? 'white' : '#64748b',
              cursor: 'pointer', fontSize: 13, fontWeight: filter === val ? 600 : 400, fontFamily: 'Inter, sans-serif',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div style={{ padding: '10px 16px', background: '#eff6ff', borderRadius: 10, border: '1px solid #bfdbfe', marginBottom: 18, fontSize: 13, color: '#1e40af' }}>
        {tx.tip}
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8', background: 'white', borderRadius: 14, border: '1px solid #e2e8f0' }}>
          {tx.noResults}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              style={{
                background: 'white', borderRadius: 14, padding: 20,
                border: `1.5px solid ${CA_CERTIFIERS.includes(c.id) ? '#bbf7d0' : '#e2e8f0'}`,
                display: 'flex', flexDirection: 'column', gap: 10,
              }}
            >
              {/* Name + CA badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', lineHeight: 1.4 }}>{c.name}</h3>
                {CA_CERTIFIERS.includes(c.id) && (
                  <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: 12, whiteSpace: 'nowrap' }}>
                    CA
                  </span>
                )}
              </div>

              {/* Contact info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#64748b' }}>
                  <MapPin size={12} color="#94a3b8" /> {c.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#64748b' }}>
                  <Phone size={12} color="#94a3b8" /> {c.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#64748b', wordBreak: 'break-all' }}>
                  <Mail size={12} color="#94a3b8" />
                  <a href={`mailto:${c.email}`} style={{ color: '#64748b', textDecoration: 'none' }}>{c.email}</a>
                </div>
              </div>

              {/* Notes */}
              {c.notes && (
                <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                  {c.notes}
                </p>
              )}

              {/* Website link */}
              <a
                href={c.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 'auto',
                  fontSize: 12, color: 'var(--u-sky)', fontWeight: 600, textDecoration: 'none',
                  padding: '6px 12px', borderRadius: 8, border: '1.5px solid #bae6fd',
                  background: '#f0f9ff', width: 'fit-content',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--u-sky)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--u-sky)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f0f9ff'; e.currentTarget.style.color = 'var(--u-sky)'; e.currentTarget.style.borderColor = '#bae6fd'; }}
              >
                <ExternalLink size={11} /> {tx.website}
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
