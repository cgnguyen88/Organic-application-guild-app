import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, AlertCircle, Info } from 'lucide-react';
import { getProfile, debouncedSync } from '../../lib/db.js';
import { saveToStorage, loadFromStorage } from '../../utils/storage.js';

const CHECKLIST = [
  { id: 'seeds',   category: 'Inputs',    label: 'Seed/planting stock records with organic certificates',      nops: '§205.204' },
  { id: 'inputs',  category: 'Inputs',    label: 'Material application logs (date, rate, location, lot #)',    nops: '§205.103' },
  { id: 'harvest', category: 'Trails',    label: 'Harvest records showing quantity and field origin',          nops: '§205.103' },
  { id: 'sales',   category: 'Trails',    label: 'Sales invoices linking lot numbers back to harvest',         nops: '§205.103' },
  { id: 'clean',   category: 'Equipment', label: 'Clean-out logs for shared/custom equipment',                 nops: '§205.272' },
  { id: 'buffers', category: 'Land',      label: 'Documentation of buffer zone management',                    nops: '§205.202' },
  { id: 'compost', category: 'Materials', label: 'Compost production logs (time/temp) or supplier docs',       nops: '§205.203' },
];

// Prefix keys so they don't collide with ComplianceTracker items in compliance_state
const PREFIX = 'ar_';
const STORAGE_KEY = 'orgpath_audit_readiness';

function prefixed(raw) {
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [`${PREFIX}${k}`, v]));
}
function unprefixed(raw) {
  const result = {};
  for (const [k, v] of Object.entries(raw)) {
    if (k.startsWith(PREFIX)) result[k.slice(PREFIX.length)] = v;
  }
  return result;
}

export default function AuditReadinessCheck({ userId }) {
  const [checked, setChecked] = useState(() => loadFromStorage(STORAGE_KEY, {}));

  // Load from Supabase on mount — reads from compliance_state with ar_ prefix
  useEffect(() => {
    if (!userId) return;
    getProfile(userId).then(profile => {
      const saved = unprefixed(profile?.compliance_state || {});
      if (Object.keys(saved).length > 0) {
        setChecked(saved);
        saveToStorage(STORAGE_KEY, saved);
      }
    });
  }, [userId]);

  const toggle = (id) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      saveToStorage(STORAGE_KEY, next);
      if (userId) {
        // Merge prefixed keys into compliance_state (same column ComplianceTracker uses)
        getProfile(userId).then(profile => {
          const existing = profile?.compliance_state || {};
          debouncedSync(userId, 'compliance_state', { ...existing, ...prefixed(next) });
        });
      }
      return next;
    });
  };

  const progress = (Object.values(checked).filter(Boolean).length / CHECKLIST.length) * 100;
  const gaps = CHECKLIST.filter(item => !checked[item.id]);

  return (
    <div>
      {/* Score */}
      <div style={{ marginBottom: 32, background: '#f8fafc', padding: 24, borderRadius: 12 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Recordkeeping Readiness Score</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1, height: 12, background: '#e2e8f0', borderRadius: 6 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              style={{ height: '100%', background: progress === 100 ? '#10b981' : 'var(--u-navy)', borderRadius: 6 }}
            />
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, minWidth: 44 }}>{Math.round(progress)}%</span>
        </div>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 12 }}>
          {progress < 100
            ? `${gaps.length} gap${gaps.length !== 1 ? 's' : ''} identified — these are the records a certifier will ask for at your NOP §205.103 audit.`
            : 'All core records accounted for. Your operation is inspection-ready.'}
        </p>
      </div>

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CHECKLIST.map(item => {
          const done = !!checked[item.id];
          return (
            <div
              key={item.id}
              onClick={() => toggle(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                background: done ? '#f0fdf4' : 'white',
                borderRadius: 10,
                border: done ? '1.5px solid #bbf7d0' : '1.5px solid #e2e8f0',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {done ? <CheckCircle2 color="#10b981" size={22} /> : <Circle color="#cbd5e1" size={22} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: done ? '#166534' : 'var(--u-navy)' }}>{item.label}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{item.category}</span>
                  <span style={{ background: '#fff7ed', color: '#c2410c', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{item.nops}</span>
                </div>
              </div>
              {!done && (
                <div style={{ color: '#f59e0b', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  <AlertCircle size={14} /> Gap
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Jimmy tip */}
      <div style={{ marginTop: 32, padding: 16, background: '#fffbeb', borderRadius: 10, border: '1px solid #fde68a' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Info size={20} color="#b45309" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6 }}>
            <strong>Jimmy's Tip:</strong> Most non-compliances happen because the "paper trail" breaks.
            Auditors will pick a random sale and trace it all the way back to the seed — make sure
            your harvest dates match your planting records and bills of lading exactly.
            {!userId && <em style={{ display: 'block', marginTop: 6, opacity: 0.75 }}>Sign in to save your progress across sessions.</em>}
          </p>
        </div>
      </div>
    </div>
  );
}
