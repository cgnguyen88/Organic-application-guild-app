import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Info, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import t from '../data/translations.js';
import complianceItems from '../data/compliance-items.js';
import { saveToStorage, loadFromStorage } from '../utils/storage.js';
import { getProfile, debouncedSync } from '../lib/db.js';

const CATEGORY_ORDER = ['precert', 'documentation', 'certifier', 'stateReg', 'annual'];
const CATEGORY_COLORS = {
  precert:       { color: '#3AA8E4', bg: '#e5f4fd', border: '#bae0f7' },
  documentation: { color: '#7c3aed', bg: '#f3f0ff', border: '#ddd6fe' },
  certifier:     { color: '#002D54', bg: '#e5f0fa', border: '#bfcfe8' },
  stateReg:      { color: '#1B6B2E', bg: '#e8f5e9', border: '#a7d7b2' },
  annual:        { color: '#bd8e00', bg: '#fff8e1', border: '#fde68a' },
};

export default function ComplianceTracker({ userId }) {
  const { lang } = useLanguage();
  const tx = t[lang].tracker;

  const [checked, setChecked] = useState(() => loadFromStorage('orgpath_compliance', {}));
  const [expanded, setExpanded] = useState({ precert: true, documentation: true, certifier: true, stateReg: true, annual: true });
  const [tooltip, setTooltip] = useState(null);

  // Load from Supabase on mount
  useEffect(() => {
    if (!userId) return;
    getProfile(userId).then(profile => {
      if (profile?.compliance_state && Object.keys(profile.compliance_state).length > 0) {
        setChecked(profile.compliance_state);
        saveToStorage('orgpath_compliance', profile.compliance_state);
      }
    });
  }, [userId]);

  useEffect(() => {
    saveToStorage('orgpath_compliance', checked);
  }, [checked]);

  const toggle = (id) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      debouncedSync(userId, 'compliance_state', next);
      return next;
    });
  };
  const toggleCategory = (cat) => setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));

  const totalItems = complianceItems.length;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progressPct = Math.round((checkedCount / totalItems) * 100);

  const byCategory = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = complianceItems.filter(item => item.category === cat);
    return acc;
  }, {});

  return (
    <div style={{ padding: '40px', maxWidth: 760, margin: '0 auto', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: 28, color: 'var(--u-navy)', marginBottom: 8 }}>
          {tx.title}
        </h1>
        <p style={{ color: '#64748b', fontSize: 15 }}>{tx.subtitle}</p>
      </div>

      {/* Overall progress */}
      <div style={{
        background: 'white', borderRadius: 14, padding: '24px 28px', marginBottom: 28,
        boxShadow: '0 4px 20px rgba(0,45,84,0.07)', border: '1px solid #f1f5f9',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--u-navy)' }}>{tx.progress}</span>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--u-navy)', marginLeft: 16 }}>
              {progressPct}%
            </span>
          </div>
          <div style={{ textAlign: 'right', fontSize: 13, color: '#64748b' }}>
            {checkedCount} / {totalItems} {lang === 'en' ? 'items complete' : 'elementos completados'}
          </div>
        </div>

        <div style={{ height: 10, background: '#e2e8f0', borderRadius: 5, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${progressPct}%` }}
            style={{
              height: '100%',
              background: progressPct === 100
                ? 'linear-gradient(90deg, #1B6B2E, #3aab5a)'
                : 'linear-gradient(90deg, var(--u-navy), var(--u-sky))',
              borderRadius: 5,
            }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Status badges */}
        <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
          {[
            { label: tx.complete,    count: checkedCount,           color: '#1B6B2E', bg: '#e8f5e9' },
            { label: tx.notStarted, count: totalItems - checkedCount, color: '#94a3b8', bg: '#f1f5f9' },
          ].map(({ label, count, color, bg }) => (
            <div key={label} style={{
              padding: '5px 14px', borderRadius: 20,
              background: bg, color, fontSize: 12, fontWeight: 600,
            }}>
              {count} {label}
            </div>
          ))}
        </div>

        <button
          onClick={() => setChecked({})}
          style={{
            marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 6,
            border: '1.5px solid #e2e8f0', background: 'white',
            color: '#94a3b8', fontSize: 12, cursor: 'pointer',
          }}
        >
          <RotateCcw size={12} /> {tx.reset}
        </button>
      </div>

      {/* Categories */}
      {CATEGORY_ORDER.map(cat => {
        const items = byCategory[cat];
        const catChecked = items.filter(item => checked[item.id]).length;
        const { color, bg, border } = CATEGORY_COLORS[cat];
        const isExpanded = expanded[cat];

        return (
          <div key={cat} style={{
            background: 'white', borderRadius: 14, marginBottom: 16,
            border: `1px solid ${border}`,
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,45,84,0.05)',
          }}>
            {/* Category header */}
            <button
              onClick={() => toggleCategory(cat)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 24px', background: bg, border: 'none', cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', background: color,
                }} />
                <span style={{ fontWeight: 700, fontSize: 15, color }}>
                  {tx.categories[cat]}
                </span>
                <span style={{
                  padding: '2px 10px', borderRadius: 12,
                  background: catChecked === items.length ? color : 'rgba(0,0,0,0.08)',
                  color: catChecked === items.length ? 'white' : color,
                  fontSize: 12, fontWeight: 600,
                }}>
                  {catChecked} / {items.length}
                </span>
              </div>
              {isExpanded ? <ChevronUp size={18} color={color} /> : <ChevronDown size={18} color={color} />}
            </button>

            {/* Items */}
            {isExpanded && (
              <div style={{ padding: '8px 0' }}>
                {items.map((item, idx) => {
                  const isDone = checked[item.id];
                  const isTooltipOpen = tooltip === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      style={{
                        padding: '14px 24px',
                        borderBottom: idx < items.length - 1 ? '1px solid #f8fafc' : 'none',
                        background: isDone ? '#fafffe' : 'white',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        {/* Checkbox */}
                        <button
                          onClick={() => toggle(item.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 2, flexShrink: 0 }}
                        >
                          {isDone
                            ? <CheckCircle size={22} color={color} />
                            : <Circle size={22} color="#cbd5e1" />
                          }
                        </button>

                        {/* Content */}
                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontSize: 14, fontWeight: isDone ? 500 : 600,
                            color: isDone ? '#94a3b8' : '#1e293b',
                            textDecoration: isDone ? 'line-through' : 'none',
                            marginBottom: 4,
                          }}>
                            {item.label[lang]}
                          </p>
                          <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
                            {item.description[lang]}
                          </p>

                          {/* "Why this matters" */}
                          <div style={{ marginTop: 8 }}>
                            <button
                              onClick={() => setTooltip(isTooltipOpen ? null : item.id)}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                padding: '3px 10px', borderRadius: 12,
                                border: `1px solid ${border}`, background: bg,
                                color, fontSize: 11, cursor: 'pointer',
                              }}
                            >
                              <Info size={11} /> {tx.whyMatters}
                            </button>

                            {isTooltipOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{
                                  marginTop: 8, padding: '10px 14px',
                                  background: bg, borderRadius: 8,
                                  border: `1px solid ${border}`,
                                  fontSize: 12, color, lineHeight: 1.7,
                                }}
                              >
                                {item.why[lang]}
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
