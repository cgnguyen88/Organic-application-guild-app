import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, LayoutDashboard, ClipboardCheck, Wand2, ListChecks, FileText,
  LogOut, Languages, Microscope, Receipt, Users, ClipboardList, DollarSign,
  ChevronDown, ShieldCheck, FlaskConical, BadgeCheck, ShieldHalf,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import t from '../data/translations.js';

// Per-item accent colors for icon badges
const ITEM_COLORS = {
  dashboard:   { from: '#3b82f6', to: '#6366f1' },
  maintenance: { from: '#10b981', to: '#059669' },
  wizard:      { from: '#a78bfa', to: '#7c3aed' },
  tracker:     { from: '#8b5cf6', to: '#6d28d9' },
  osp:         { from: '#f97316', to: '#ea580c' },
  eligibility: { from: '#0ea5e9', to: '#0284c7' },
  records:     { from: '#14b8a6', to: '#0d9488' },
  receipts:    { from: '#ec4899', to: '#db2777' },
  certifiers:  { from: '#f59e0b', to: '#d97706' },
  soilLabs:    { from: '#84cc16', to: '#65a30d' },
  omriGuide:   { from: '#22c55e', to: '#16a34a' },
  foodSafety:  { from: '#ef4444', to: '#dc2626' },
  stateReg:    { from: '#6366f1', to: '#4f46e5' },
  occsp:       { from: '#eab308', to: '#ca8a04' },
};

export default function Sidebar({ activePage, onNavigate, user, onLogout, certificationStatus }) {
  const { lang, toggleLang } = useLanguage();
  const tx = t[lang].nav;

  const NAV_ITEMS = [
    { id: 'dashboard',   icon: LayoutDashboard },
    ...(certificationStatus === 'certified'
      ? [{ id: 'maintenance', icon: ShieldCheck }]
      : [{ id: 'wizard',      icon: Wand2 }]),
    { id: 'tracker',     icon: ListChecks },
    { id: 'osp',         icon: FileText },
  ];

  const TOOLS_ITEMS = [
    ...(certificationStatus === 'certified' ? [{ id: 'wizard', icon: Wand2 }] : []),
    { id: 'eligibility', icon: ClipboardCheck },
    { id: 'records',     icon: Microscope },
    { id: 'receipts',    icon: Receipt },
    { id: 'certifiers',  icon: Users },
    { id: 'soilLabs',    icon: FlaskConical },
    { id: 'omriGuide',   icon: BadgeCheck },
    { id: 'foodSafety',  icon: ShieldHalf },
    { id: 'stateReg',    icon: ClipboardList },
    { id: 'occsp',       icon: DollarSign },
  ];

  const [toolsOpen, setToolsOpen] = useState(
    TOOLS_ITEMS.some(i => i.id === activePage)
  );

  // Initials avatar for user
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const NavBtn = ({ id, icon: Icon }) => {
    const isActive = activePage === id;
    const colors = ITEM_COLORS[id] || { from: '#94a3b8', to: '#64748b' };

    return (
      <motion.button
        onClick={() => onNavigate(id)}
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 11,
          padding: '9px 10px 9px 10px', borderRadius: 10, border: 'none', cursor: 'pointer',
          marginBottom: 2,
          background: isActive
            ? 'linear-gradient(90deg, rgba(253,189,16,0.22) 0%, rgba(253,189,16,0.06) 100%)'
            : 'transparent',
          boxShadow: isActive ? 'inset 0 0 0 1px rgba(253,189,16,0.25)' : 'none',
          color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
          fontFamily: 'Inter, sans-serif', fontSize: 13.5,
          fontWeight: isActive ? 600 : 400,
          transition: 'all 0.15s', textAlign: 'left',
          position: 'relative',
        }}
      >
        {/* Active left accent bar */}
        {isActive && (
          <div style={{
            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
            width: 3, height: 20, borderRadius: 4,
            background: `linear-gradient(180deg, ${colors.from}, ${colors.to})`,
            boxShadow: `0 0 8px ${colors.from}88`,
          }} />
        )}

        {/* Colored icon badge */}
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: isActive
            ? `linear-gradient(135deg, ${colors.from}, ${colors.to})`
            : `linear-gradient(135deg, ${colors.from}30, ${colors.to}20)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isActive ? `0 2px 8px ${colors.from}55` : 'none',
          transition: 'all 0.2s',
        }}>
          <Icon
            size={15}
            strokeWidth={isActive ? 2.2 : 1.8}
            color={isActive ? '#fff' : colors.from}
          />
        </div>

        <span style={{ flex: 1 }}>{tx[id]}</span>

        {/* Active dot */}
        {isActive && (
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--u-gold)',
            boxShadow: '0 0 6px rgba(253,189,16,0.8)',
            flexShrink: 0,
          }} />
        )}
      </motion.button>
    );
  };

  return (
    <div
      style={{
        width: 272, minWidth: 272, height: '100vh',
        background: 'linear-gradient(175deg, #001a38 0%, #002D54 60%, #001f3f 100%)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto', flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
      className="no-print"
    >
      {/* Brand Header — glassmorphism */}
      <div style={{
        padding: '22px 18px 18px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Logo mark with glow ring */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 42, height: 42,
              background: 'linear-gradient(135deg, #FDBD10, #f59e0b)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(253,189,16,0.45), 0 4px 12px rgba(0,0,0,0.3)',
            }}>
              <Leaf size={22} color="#002D54" strokeWidth={2.5} />
            </div>
            {/* Glow pulse ring */}
            <div style={{
              position: 'absolute', inset: -3,
              borderRadius: 15,
              border: '1.5px solid rgba(253,189,16,0.3)',
              animation: 'pulse-ring 3s ease-in-out infinite',
            }} />
          </div>
          <div>
            <div style={{
              color: 'white', fontFamily: 'Lora, serif', fontWeight: 700,
              fontSize: 15.5, lineHeight: 1.2, letterSpacing: '-0.01em',
            }}>
              OrganicPath CA
            </div>
            <div style={{
              color: 'rgba(253,189,16,0.7)', fontSize: 10.5, marginTop: 3,
              fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              {lang === 'en' ? 'Certification Assistant' : 'Asistente de Certificación'}
            </div>
          </div>
        </div>

        {/* Certification status pill */}
        {certificationStatus && (
          <div style={{
            marginTop: 14,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: certificationStatus === 'certified'
              ? 'rgba(16,185,129,0.15)' : 'rgba(253,189,16,0.12)',
            border: certificationStatus === 'certified'
              ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(253,189,16,0.25)',
            borderRadius: 20, padding: '4px 10px',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: certificationStatus === 'certified' ? '#10b981' : '#FDBD10',
              boxShadow: certificationStatus === 'certified'
                ? '0 0 5px #10b981' : '0 0 5px #FDBD10',
            }} />
            <span style={{
              fontSize: 10.5, fontWeight: 600,
              color: certificationStatus === 'certified'
                ? '#34d399' : 'rgba(253,189,16,0.9)',
              letterSpacing: '0.03em',
            }}>
              {certificationStatus === 'certified'
                ? (lang === 'en' ? 'Certified Organic' : 'Certificado Orgánico')
                : (lang === 'en' ? 'In Certification' : 'En Certificación')}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '14px 10px 10px' }}>

        {/* Section label: Core */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 6px', marginBottom: 8,
        }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.12), transparent)' }} />
          <span style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {lang === 'en' ? 'Core' : 'Principal'}
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12))' }} />
        </div>

        {NAV_ITEMS.map(({ id, icon }) => <NavBtn key={id} id={id} icon={icon} />)}

        {/* Section label: Tools */}
        <div style={{ marginTop: 14, marginBottom: 4 }}>
          <button
            onClick={() => setToolsOpen(o => !o)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 6px', border: 'none', background: 'transparent', cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.12), transparent)' }} />
              <span style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {tx.tools}
              </span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12))' }} />
            </div>
            <motion.div
              animate={{ rotate: toolsOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ marginLeft: 8, flexShrink: 0 }}
            >
              <ChevronDown size={12} color="rgba(255,255,255,0.3)" />
            </motion.div>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {toolsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: 'hidden' }}
            >
              {TOOLS_ITEMS.map(({ id, icon }) => <NavBtn key={id} id={id} icon={icon} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Footer */}
      <div style={{
        padding: '12px 10px',
        background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.25))',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {/* Language toggle */}
        <motion.button
          onClick={toggleLang}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.65)',
            fontSize: 12.5, fontFamily: 'Inter, sans-serif',
            width: '100%', textAlign: 'left',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
        >
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Languages size={14} />
          </div>
          <span>{lang === 'en' ? '🇺🇸 English → Español' : '🇲🇽 Español → English'}</span>
        </motion.button>

        {/* User card */}
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 10,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {/* Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: 9, flexShrink: 0,
              background: 'linear-gradient(135deg, #FDBD10, #f59e0b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800, color: '#002D54',
              boxShadow: '0 2px 8px rgba(253,189,16,0.3)',
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'rgba(255,255,255,0.92)', fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
            <motion.button
              onClick={onLogout}
              title={tx.logout}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer', color: 'rgba(255,255,255,0.45)',
                padding: 6, borderRadius: 7, transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.15)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              <LogOut size={14} />
            </motion.button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.8; transform: scale(1.04); }
        }
      `}</style>
    </div>
  );
}
