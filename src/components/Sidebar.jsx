import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, LayoutDashboard, ClipboardCheck, Wand2, ListChecks, FileText, LogOut, Languages, Microscope, Receipt, Users, ClipboardList, DollarSign, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import t from '../data/translations.js';

const NAV_ITEMS = [
  { id: 'dashboard',   icon: LayoutDashboard },
  { id: 'eligibility', icon: ClipboardCheck },
  { id: 'wizard',      icon: Wand2 },
  { id: 'tracker',     icon: ListChecks },
  { id: 'osp',         icon: FileText },
];

const TOOLS_ITEMS = [
  { id: 'records',    icon: Microscope },
  { id: 'receipts',   icon: Receipt },
  { id: 'certifiers', icon: Users },
  { id: 'stateReg',   icon: ClipboardList },
  { id: 'occsp',      icon: DollarSign },
];

export default function Sidebar({ activePage, onNavigate, user, onLogout }) {
  const { lang, toggleLang } = useLanguage();
  const tx = t[lang].nav;
  const [toolsOpen, setToolsOpen] = useState(
    TOOLS_ITEMS.some(i => i.id === activePage)
  );

  const NavBtn = ({ id, icon: Icon }) => {
    const isActive = activePage === id;
    return (
      <motion.button
        onClick={() => onNavigate(id)}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '11px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
          marginBottom: 4,
          background: isActive ? 'rgba(253,189,16,0.18)' : 'transparent',
          color: isActive ? 'var(--u-gold)' : 'rgba(255,255,255,0.75)',
          fontFamily: 'Inter, sans-serif', fontSize: 14,
          fontWeight: isActive ? 600 : 400,
          transition: 'all 0.15s', textAlign: 'left',
        }}
      >
        <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
        {tx[id]}
      </motion.button>
    );
  };

  return (
    <div style={{
      width: 280, minWidth: 280, height: '100vh',
      background: 'linear-gradient(180deg, var(--u-navy-d) 0%, var(--u-navy) 100%)',
      display: 'flex', flexDirection: 'column', padding: '0',
      overflowY: 'auto', flexShrink: 0,
    }} className="no-print">

      {/* Brand Header */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, background: 'var(--u-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Leaf size={20} color="var(--u-navy)" />
          </div>
          <div>
            <div style={{ color: 'white', fontFamily: 'Lora, serif', fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>OrganicPath CA</div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 2 }}>
              {lang === 'en' ? 'Certification Assistant' : 'Asistente de Certificación'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {/* Main nav */}
        {NAV_ITEMS.map(({ id, icon }) => <NavBtn key={id} id={id} icon={icon} />)}

        {/* Divider */}
        <div style={{ margin: '10px 4px', borderTop: '1px solid rgba(255,255,255,0.1)' }} />

        {/* Compliance Tools section */}
        <button
          onClick={() => setToolsOpen(o => !o)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 14px', border: 'none', background: 'transparent', cursor: 'pointer',
            color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
            textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 4,
          }}
        >
          <span>{tx.tools}</span>
          <motion.div animate={{ rotate: toolsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={13} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {toolsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              {TOOLS_ITEMS.map(({ id, icon }) => <NavBtn key={id} id={id} icon={icon} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          onClick={toggleLang}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px',
            borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)',
            fontSize: 13, fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
            width: '100%', textAlign: 'left',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
        >
          <Languages size={16} />
          <span>{lang === 'en' ? '🇺🇸 English → Español' : '🇲🇽 Español → English'}</span>
        </button>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600 }}>{user.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{user.email}</div>
            </div>
            <button
              onClick={onLogout}
              title={tx.logout}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 4, borderRadius: 4, transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
