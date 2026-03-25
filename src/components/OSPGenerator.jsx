import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowRight, FileText, CheckCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import t from '../data/translations.js';
import { exportOSPtoWord } from '../utils/export.js';

export default function OSPGenerator({ profile, onNavigate }) {
  const { lang } = useLanguage();
  const tx = t[lang].osp;
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const hasProfile = profile && profile.operationName;

  const handleExport = async () => {
    if (!hasProfile || exporting) return;
    setExporting(true);
    try {
      await exportOSPtoWord(profile, lang);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setExporting(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: 760, margin: '0 auto', paddingBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: 28, color: 'var(--u-navy)', marginBottom: 8 }}>
          {tx.title}
        </h1>
        <p style={{ color: '#64748b', fontSize: 15 }}>{tx.subtitle}</p>
      </div>

      {!hasProfile ? (
        <div style={{
          background: 'white', borderRadius: 16, padding: '48px 36px',
          textAlign: 'center', border: '2px dashed #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,45,84,0.06)',
        }}>
          <FileText size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
          <p style={{ color: '#64748b', fontSize: 15, marginBottom: 24 }}>{tx.noProfile}</p>
          <button
            onClick={() => onNavigate('wizard')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 8,
              border: 'none', background: 'var(--u-navy)',
              color: 'white', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}
          >
            {tx.goToWizard} <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <>
          {/* Export Button */}
          <motion.button
            onClick={handleExport}
            disabled={exporting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 28px', borderRadius: 10,
              border: 'none',
              background: exported ? '#1B6B2E' : exporting ? '#94a3b8' : 'var(--u-navy)',
              color: 'white', fontSize: 15, fontWeight: 700,
              cursor: exporting ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              marginBottom: 32,
              transition: 'background 0.2s',
            }}
          >
            {exported ? <CheckCircle size={20} /> : <Download size={20} />}
            {exporting ? tx.exporting : exported
              ? (lang === 'en' ? '✅ Downloaded!' : '✅ ¡Descargado!')
              : tx.exportWord}
          </motion.button>

          {/* Preview */}
          <div style={{
            background: 'white', borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,45,84,0.08)',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
          }}>
            {/* Preview Header */}
            <div style={{
              background: 'var(--u-navy)', padding: '24px 32px',
            }}>
              <h2 style={{ fontFamily: 'Lora, serif', color: 'white', fontSize: 20, marginBottom: 4 }}>
                {lang === 'en' ? 'ORGANIC SYSTEM PLAN (OSP)' : 'PLAN DE SISTEMA ORGÁNICO (OSP)'}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                California State Organic Program (CASOP)
              </p>
            </div>

            <div style={{ padding: '32px' }}>
              {[
                {
                  num: '1',
                  title: tx.sections.operationInfo,
                  content: [
                    { label: lang === 'en' ? 'Operation' : 'Operación', val: profile.operationName },
                    { label: lang === 'en' ? 'Owner' : 'Propietario', val: profile.ownerName },
                    { label: lang === 'en' ? 'Type' : 'Tipo', val: profile.operationType },
                    { label: lang === 'en' ? 'Crops' : 'Cultivos', val: profile.crops },
                    { label: lang === 'en' ? 'County' : 'Condado', val: profile.county },
                    { label: lang === 'en' ? 'Registration Path' : 'Camino de Registro', val: profile.registrationPath },
                  ].filter(r => r.val),
                },
                {
                  num: '2',
                  title: tx.sections.practices,
                  text: profile.practices,
                },
                {
                  num: '3',
                  title: tx.sections.inputs,
                  text: profile.inputs,
                },
                {
                  num: '4',
                  title: tx.sections.monitoring,
                  text: profile.monitoring,
                },
                {
                  num: '5',
                  title: tx.sections.buffers,
                  text: profile.buffers,
                },
                {
                  num: '6',
                  title: tx.sections.certifier,
                  content: [
                    { label: lang === 'en' ? 'Certifier' : 'Certificador', val: profile.certifierName },
                    { label: lang === 'en' ? 'Contact' : 'Contacto', val: profile.certifierContact },
                  ].filter(r => r.val),
                },
              ].map((section) => (
                <div key={section.num} style={{ marginBottom: 28 }}>
                  <h3 style={{
                    fontSize: 14, fontWeight: 700, color: 'var(--u-navy)',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    marginBottom: 12, paddingBottom: 8,
                    borderBottom: '2px solid #e2e8f0',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: 'var(--u-navy)', color: 'white',
                      fontSize: 12, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>{section.num}</span>
                    {section.title}
                  </h3>

                  {section.content && section.content.map(({ label, val }) => (
                    <div key={label} style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: 14 }}>
                      <span style={{ color: '#94a3b8', minWidth: 140, flexShrink: 0 }}>{label}</span>
                      <span style={{ color: '#1e293b' }}>{val}</span>
                    </div>
                  ))}

                  {section.text && (
                    <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                      {section.text || <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>{lang === 'en' ? 'Not provided' : 'No proporcionado'}</span>}
                    </p>
                  )}
                </div>
              ))}

              {/* Declaration */}
              <div style={{
                background: '#f8fafc', borderRadius: 10, padding: '18px 20px',
                border: '1px solid #e2e8f0', marginTop: 24,
              }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--u-navy)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {tx.sections.declaration}
                </h3>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7 }}>{tx.declarationText}</p>
                <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {[lang === 'en' ? 'Signature' : 'Firma', lang === 'en' ? 'Date' : 'Fecha'].map(label => (
                    <div key={label}>
                      <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>{label}</p>
                      <div style={{ height: 1, background: '#374151', width: '80%' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
