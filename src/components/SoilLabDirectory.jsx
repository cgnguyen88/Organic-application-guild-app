import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, MapPin, Phone, Mail, Filter, FlaskConical, Leaf, Info } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import soilLabs from '../data/soilLabs.js';

const SPECIALTY_COLORS = {
  'Soil Chemistry':       { bg: '#e8f5e9', color: '#1B6B2E' },
  'Plant Tissue':         { bg: '#e5f4fd', color: '#0369a1' },
  'Soil Biology':         { bg: '#f3f0ff', color: '#7c3aed' },
  'Microbial Biomass':    { bg: '#f3f0ff', color: '#7c3aed' },
  'PLFA':                 { bg: '#f3f0ff', color: '#7c3aed' },
  'Nematodes':            { bg: '#f3f0ff', color: '#7c3aed' },
  'Active Carbon':        { bg: '#f3f0ff', color: '#7c3aed' },
  'Biological Indices':   { bg: '#f3f0ff', color: '#7c3aed' },
  'Haney Soil Health':    { bg: '#fef9c3', color: '#854d0e' },
  'Base Saturation':      { bg: '#fef9c3', color: '#854d0e' },
  'Compost':              { bg: '#fff7ed', color: '#c2410c' },
  'Organic Amendments':   { bg: '#fff7ed', color: '#c2410c' },
  'Biosolids':            { bg: '#fff7ed', color: '#c2410c' },
  'Water':                { bg: '#eff6ff', color: '#1d4ed8' },
  'Manure':               { bg: '#fdf4ff', color: '#9333ea' },
  'Feed':                 { bg: '#fdf4ff', color: '#9333ea' },
  'Fertilizer Analysis':  { bg: '#f0fdf4', color: '#166534' },
  'Environmental':        { bg: '#f1f5f9', color: '#475569' },
};

const REGION_LABELS = { ca: 'CA-Based', west: 'West Coast', national: 'National' };
const REGION_COLORS  = { ca: '#1B6B2E', west: '#0369a1', national: '#6b7280' };
const REGION_BG      = { ca: '#dcfce7', west: '#dbeafe', national: '#f1f5f9' };

const SPECIALTY_GROUPS = [
  { key: 'chemistry', label: 'Soil Chemistry',   match: s => s.includes('Soil Chemistry') },
  { key: 'biology',   label: 'Soil Biology',      match: s => s.some(x => ['Soil Biology','Microbial Biomass','PLFA','Nematodes','Active Carbon','Biological Indices','Haney Soil Health'].includes(x)) },
  { key: 'tissue',    label: 'Plant Tissue',       match: s => s.includes('Plant Tissue') },
  { key: 'compost',   label: 'Compost/Amendments', match: s => s.some(x => ['Compost','Organic Amendments','Biosolids'].includes(x)) },
];

export default function SoilLabDirectory() {
  const { lang } = useLanguage();
  const [search, setSearch]         = useState('');
  const [regionFilter, setRegion]   = useState('all');
  const [specialtyFilter, setSpec]  = useState('all');
  const [organicOnly, setOrganicOnly] = useState(false);

  const tx = {
    title:    lang === 'es' ? 'Directorio de Laboratorios de Suelos — California' : 'Soil Testing Lab Directory — California',
    subtitle: lang === 'es'
      ? 'Laboratorios que sirven a productores orgánicos certificados en California'
      : 'Labs serving certified organic producers in California — soil, plant tissue, biology, and compost testing',
    searchPh: lang === 'es' ? 'Buscar por nombre, ubicación, especialidad…' : 'Search by name, location, specialty…',
    allRegions: lang === 'es' ? 'Todas las regiones' : 'All Regions',
    allSpecs:   lang === 'es' ? 'Todas las especialidades' : 'All Specialties',
    organicPkg: lang === 'es' ? 'Solo paquetes orgánicos' : 'Organic packages only',
    website:   lang === 'es' ? 'Sitio Web' : 'Website',
    noResults: lang === 'es' ? 'Sin resultados.' : 'No results found.',
    total:     lang === 'es' ? 'Total Labs' : 'Total Labs',
    caBased:   lang === 'es' ? 'Con sede en CA' : 'CA-Based',
    showing:   lang === 'es' ? 'Mostrando' : 'Showing',
    tip: lang === 'es'
      ? 'Consejo: Los laboratorios con sede en CA tienen la ventaja de conocer los cultivos y condiciones del suelo locales. Para evaluaciones biológicas, considere Earthfort o Logan Labs. Verifique la información de contacto directamente en el sitio web del laboratorio.'
      : 'Tip: CA-based labs have the advantage of familiarity with local crops and soil conditions. For biological assessments, consider Earthfort or Logan Labs. Always verify contact information directly on the lab\'s website before submitting samples.',
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return soilLabs.filter(lab => {
      if (regionFilter !== 'all' && lab.region !== regionFilter) return false;
      if (specialtyFilter !== 'all') {
        const group = SPECIALTY_GROUPS.find(g => g.key === specialtyFilter);
        if (group && !group.match(lab.specialties)) return false;
      }
      if (organicOnly && !lab.organicPackages) return false;
      if (q && !lab.name.toLowerCase().includes(q) && !lab.location.toLowerCase().includes(q) && !lab.notes.toLowerCase().includes(q) && !lab.specialties.some(s => s.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [search, regionFilter, specialtyFilter, organicOnly]);

  const caCount = soilLabs.filter(l => l.region === 'ca').length;

  const inputStyle = {
    padding: '9px 12px', borderRadius: 8,
    border: '1.5px solid #e2e8f0', fontSize: 13,
    fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 40, height: 40, background: '#e8f5e9', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FlaskConical size={20} color="#1B6B2E" />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--u-navy)', fontFamily: 'Lora, serif', margin: 0 }}>
            {tx.title}
          </h1>
        </div>
        <p style={{ color: '#64748b', fontSize: 14, marginLeft: 52 }}>{tx.subtitle}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: tx.total,   value: soilLabs.length, color: 'var(--u-navy)' },
          { label: tx.caBased, value: caCount,         color: '#1B6B2E' },
          { label: tx.showing, value: filtered.length, color: '#3AA8E4' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'white', borderRadius: 12, padding: '14px 20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 800, color, margin: 0 }}>{value}</p>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text" placeholder={tx.searchPh} value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 32, width: '100%' }}
          />
        </div>

        {/* Region filter */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <Filter size={13} color="#94a3b8" />
          {[['all', tx.allRegions], ['ca', 'CA-Based'], ['west', 'West Coast'], ['national', 'National']].map(([val, label]) => (
            <button key={val} onClick={() => setRegion(val)} style={{
              padding: '7px 12px', borderRadius: 8,
              border: `1.5px solid ${regionFilter === val ? 'var(--u-navy)' : '#e2e8f0'}`,
              background: regionFilter === val ? 'var(--u-navy)' : 'white',
              color: regionFilter === val ? 'white' : '#64748b',
              cursor: 'pointer', fontSize: 12, fontWeight: regionFilter === val ? 600 : 400,
              fontFamily: 'Inter, sans-serif',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Specialty + organic filter row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[['all', tx.allSpecs], ...SPECIALTY_GROUPS.map(g => [g.key, g.label])].map(([val, label]) => (
            <button key={val} onClick={() => setSpec(val)} style={{
              padding: '6px 12px', borderRadius: 20,
              border: `1.5px solid ${specialtyFilter === val ? '#7c3aed' : '#e2e8f0'}`,
              background: specialtyFilter === val ? '#7c3aed' : 'white',
              color: specialtyFilter === val ? 'white' : '#64748b',
              cursor: 'pointer', fontSize: 12, fontWeight: specialtyFilter === val ? 600 : 400,
              fontFamily: 'Inter, sans-serif',
            }}>{label}</button>
          ))}
        </div>

        {/* Organic packages toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, color: '#475569', marginLeft: 'auto' }}>
          <div
            onClick={() => setOrganicOnly(v => !v)}
            style={{
              width: 36, height: 20, borderRadius: 10, cursor: 'pointer',
              background: organicOnly ? '#1B6B2E' : '#e2e8f0',
              position: 'relative', transition: 'background 0.2s',
            }}
          >
            <div style={{
              position: 'absolute', top: 2, left: organicOnly ? 18 : 2,
              width: 16, height: 16, borderRadius: '50%', background: 'white',
              transition: 'left 0.2s',
            }} />
          </div>
          <Leaf size={13} color={organicOnly ? '#1B6B2E' : '#94a3b8'} />
          {tx.organicPkg}
        </label>
      </div>

      {/* Tip */}
      <div style={{ padding: '10px 14px', background: '#fffbeb', borderRadius: 10, border: '1px solid #fde68a', marginBottom: 20, fontSize: 13, color: '#92400e', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Info size={15} color="#b45309" style={{ flexShrink: 0, marginTop: 1 }} />
        <span>{tx.tip}</span>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8', background: 'white', borderRadius: 14, border: '1px solid #e2e8f0' }}>
          {tx.noResults}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: 16 }}>
          {filtered.map((lab, i) => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              style={{
                background: 'white', borderRadius: 14, padding: 20,
                border: `1.5px solid ${lab.region === 'ca' ? '#bbf7d0' : '#e2e8f0'}`,
                display: 'flex', flexDirection: 'column', gap: 10,
              }}
            >
              {/* Name + region badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', lineHeight: 1.4, margin: 0 }}>{lab.name}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: REGION_COLORS[lab.region], background: REGION_BG[lab.region],
                    padding: '2px 8px', borderRadius: 12, whiteSpace: 'nowrap',
                  }}>
                    {REGION_LABELS[lab.region]}
                  </span>
                  {lab.organicPackages && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#1B6B2E', background: '#dcfce7', padding: '2px 8px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Leaf size={9} /> Organic Pkg
                    </span>
                  )}
                </div>
              </div>

              {/* Contact info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#64748b' }}>
                  <MapPin size={12} color="#94a3b8" /> {lab.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#64748b' }}>
                  <Phone size={12} color="#94a3b8" /> {lab.phone}
                </div>
                {lab.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#64748b', wordBreak: 'break-all' }}>
                    <Mail size={12} color="#94a3b8" />
                    <a href={`mailto:${lab.email}`} style={{ color: '#64748b', textDecoration: 'none' }}>{lab.email}</a>
                  </div>
                )}
              </div>

              {/* Specialty tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {lab.specialties.map(s => {
                  const style = SPECIALTY_COLORS[s] || { bg: '#f1f5f9', color: '#475569' };
                  return (
                    <span key={s} style={{ fontSize: 10, fontWeight: 600, background: style.bg, color: style.color, padding: '2px 7px', borderRadius: 12 }}>
                      {s}
                    </span>
                  );
                })}
              </div>

              {/* Notes */}
              {lab.notes && (
                <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, borderTop: '1px solid #f1f5f9', paddingTop: 8, margin: 0 }}>
                  {lab.notes}
                </p>
              )}

              {/* Website link */}
              <a
                href={lab.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 'auto',
                  fontSize: 12, color: '#1B6B2E', fontWeight: 600, textDecoration: 'none',
                  padding: '6px 12px', borderRadius: 8,
                  border: '1.5px solid #bbf7d0', background: '#f0fdf4',
                  width: 'fit-content', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1B6B2E'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#1B6B2E'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = '#1B6B2E'; e.currentTarget.style.borderColor = '#bbf7d0'; }}
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
