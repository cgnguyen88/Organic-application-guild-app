import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Sparkles, ExternalLink, AlertCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { saveToStorage, loadFromStorage } from '../utils/storage.js';
import { getProfile, debouncedSync } from '../lib/db.js';

const STORAGE_KEY = 'orgpath_state_registration';

const CDFA_STEPS = [
  {
    id: 'cdfa_1',
    phase: 'Pre-Registration',
    title: { en: 'Obtain USDA/ACA Organic Certificate', es: 'Obtener Certificado Orgánico USDA/ACA' },
    desc: { en: 'You must first obtain your organic certificate from an accredited certifying agent (ACA) before registering with CDFA.', es: 'Primero debes obtener tu certificado orgánico de un agente certificador acreditado (ACA) antes de registrarte en CDFA.' },
    details: { en: 'Contact any USDA-accredited certifier (CCOF, OTCO, QAI, etc.) and complete the certification process. This takes 3-6 months typically.', es: 'Contacta a cualquier certificador acreditado por el USDA (CCOF, OTCO, QAI, etc.) y completa el proceso de certificación. Esto generalmente toma 3-6 meses.' },
    link: null,
  },
  {
    id: 'cdfa_2',
    phase: 'Pre-Registration',
    title: { en: 'Determine Your Products', es: 'Determinar Tus Productos' },
    desc: { en: 'Identify all raw agricultural products you will sell as organic (crops, livestock, eggs, raw dairy). CDFA jurisdiction covers unprocessed/raw organic ag products.', es: 'Identifica todos los productos agrícolas crudos que venderás como orgánicos (cultivos, ganado, huevos, lácteos crudos). La jurisdicción de CDFA cubre productos agrícolas crudos/sin procesar.' },
    details: { en: 'If your products are processed (frozen, canned, packaged), they may fall under CDPH jurisdiction instead. Consult with CDFA if unsure.', es: 'Si tus productos son procesados (congelados, enlatados, empacados), pueden estar bajo la jurisdicción de CDPH en cambio. Consulta con CDFA si no estás seguro.' },
    link: null,
  },
  {
    id: 'cdfa_3',
    phase: 'Registration',
    title: { en: 'Register on CDFA Organic Database', es: 'Registrarse en la Base de Datos Orgánica de CDFA' },
    desc: { en: 'Complete registration through the CDFA Organic Database portal before your first organic sale.', es: 'Completa el registro a través del portal de la Base de Datos Orgánica de CDFA antes de tu primera venta orgánica.' },
    details: { en: 'Required information: operation name/address, certificate number, certifying agent, products, counties of operation, responsible party contact info. Registration is free — no CDFA fee applies.', es: 'Información requerida: nombre/dirección de la operación, número de certificado, agente certificador, productos, condados de operación, información de contacto del responsable. El registro es gratuito — no aplica tarifa de CDFA.' },
    link: 'https://www.cdfa.ca.gov/is/i_&_c/organic.html',
    linkText: { en: 'CDFA Organic Database', es: 'Base de Datos Orgánica CDFA' },
  },
  {
    id: 'cdfa_4',
    phase: 'Registration',
    title: { en: 'Pay State Registration Fee (if applicable)', es: 'Pagar Tarifa de Registro Estatal (si aplica)' },
    desc: { en: 'California state registration fees are tiered based on annual gross organic sales (NOT the same as ACA certification fees).', es: 'Las tarifas de registro estatal de California son escalonadas según las ventas orgánicas brutas anuales (NO son las mismas que las tarifas de certificación de la ACA).' },
    details: { en: 'Fee tiers: $0–$5,000 sales = exempt from USDA cert but may still owe state fee | $5,001–$5,000 = $0 | Up to $10K = $25 | Up to $50K = $75 | Up to $100K = $175 | Up to $250K = $350 | Up to $500K = $700 | Up to $1M = $1,400 | Over $1M = $3,000. Confirm current rates with CDFA.', es: 'Niveles de tarifas: $0–$5,000 ventas = exento de certificación USDA pero puede deber tarifa estatal | Hasta $10K = $25 | Hasta $50K = $75 | Hasta $100K = $175 | Hasta $250K = $350 | Hasta $500K = $700 | Hasta $1M = $1,400 | Más de $1M = $3,000. Confirma las tarifas actuales con CDFA.' },
    link: null,
  },
  {
    id: 'cdfa_5',
    phase: 'Post-Registration',
    title: { en: 'Display Certificate at Point of Sale', es: 'Mostrar Certificado en el Punto de Venta' },
    desc: { en: 'Your organic certificate must be made available to customers or displayed if selling at farmers markets, farmstands, or direct-to-consumer.', es: 'Tu certificado orgánico debe estar disponible para los clientes o exhibido si vendes en mercados de agricultores, puestos de granja o directamente al consumidor.' },
    details: { en: 'Keep your original certificate on file. When selling wholesale, provide buyers with a copy of your current certificate per sale season.', es: 'Mantén tu certificado original archivado. Al vender al por mayor, proporciona a los compradores una copia de tu certificado actual por temporada de venta.' },
    link: null,
  },
  {
    id: 'cdfa_6',
    phase: 'Annual Renewal',
    title: { en: 'Submit Annual Update', es: 'Enviar Actualización Anual' },
    desc: { en: 'CDFA registration must be updated annually. Your certifier also requires an annual OSP update and inspection.', es: 'El registro en CDFA debe actualizarse anualmente. Tu certificador también requiere una actualización anual del OSP e inspección.' },
    details: { en: 'Update your CDFA registration whenever: your certificate is updated, you add new products, change counties, or your certifier changes. Annual renewal is required.', es: 'Actualiza tu registro en CDFA cuando: tu certificado se actualice, agregues nuevos productos, cambies de condados, o tu certificador cambie. Se requiere renovación anual.' },
    link: null,
  },
];

const CDPH_STEPS = [
  {
    id: 'cdph_1',
    phase: 'Pre-Registration',
    title: { en: 'Obtain Processed Food Registration (PFR)', es: 'Obtener Registro de Alimentos Procesados (PFR)' },
    desc: { en: 'Before registering organic processed products, you must first obtain a Processed Food Registration (PFR) from CDPH if you manufacture/pack/hold processed food in California.', es: 'Antes de registrar productos orgánicos procesados, primero debes obtener un Registro de Alimentos Procesados (PFR) de CDPH si fabricas/empacas/almacenas alimentos procesados en California.' },
    details: { en: 'PFR Form CDPH 8610 (new) or CDPH 8611 (renewal) filed with your county health department. Fee varies by county and facility type. Not required if you only wholesale to licensed retailers.', es: 'Formulario PFR CDPH 8610 (nuevo) o CDPH 8611 (renovación) presentado en el departamento de salud de tu condado. La tarifa varía según el condado y tipo de instalación. No se requiere si solo vendes al por mayor a minoristas con licencia.' },
    link: 'https://www.cdph.ca.gov/Programs/CEH/DFDCS/CDPH%20Document%20Library/FDB/FoodSafetyProgram/PFSPFORMS/FDB341.pdf',
    linkText: { en: 'PFR Form CDPH 8610', es: 'Formulario PFR CDPH 8610' },
  },
  {
    id: 'cdph_2',
    phase: 'Pre-Registration',
    title: { en: 'Obtain USDA/ACA Organic Certificate for Processed Products', es: 'Obtener Certificado Orgánico USDA/ACA para Productos Procesados' },
    desc: { en: 'Get certified by a USDA-accredited certifying agent for your handling/processing operation. Handlers must have a separate Organic System Plan (OSP) covering processing, labeling, and prevention of commingling.', es: 'Certifícate con un agente certificador acreditado por el USDA para tu operación de manejo/procesamiento. Los manejadores deben tener un Plan de Sistema Orgánico (OSP) separado que cubra procesamiento, etiquetado y prevención de mezcla.' },
    details: { en: 'Handler OSP must address: facility sanitation, ingredient sourcing verification, commingling prevention, labeling compliance (USDA Organic seal rules), and pest management.', es: 'El OSP del manejador debe abordar: saneamiento de instalaciones, verificación de origen de ingredientes, prevención de mezcla, cumplimiento de etiquetado (reglas del sello USDA Organic) y manejo de plagas.' },
    link: null,
  },
  {
    id: 'cdph_3',
    phase: 'Registration',
    title: { en: 'Complete OPPR Form CDPH 8593', es: 'Completar Formulario OPPR CDPH 8593' },
    desc: { en: 'Complete the Organic Processed Product Registration (OPPR) using DocuSign form CDPH 8593. This must be printed and mailed with payment.', es: 'Completa el Registro de Productos Orgánicos Procesados (OPPR) usando el formulario DocuSign CDPH 8593. Debe imprimirse y enviarse por correo con el pago.' },
    details: { en: 'Required information: business name/address, PFR number, ACA certificate number, list of organic products with brand names, labeling information, responsible party signature. Mail to: CDPH Food and Drug Branch, MS 7602, P.O. Box 997413, Sacramento, CA 95899-7413.', es: 'Información requerida: nombre/dirección del negocio, número PFR, número de certificado ACA, lista de productos orgánicos con nombres de marca, información de etiquetado, firma del responsable. Enviar a: CDPH Food and Drug Branch, MS 7602, P.O. Box 997413, Sacramento, CA 95899-7413.' },
    link: null,
  },
  {
    id: 'cdph_4',
    phase: 'Registration',
    title: { en: 'Pay CDPH OPPR Fee', es: 'Pagar Tarifa CDPH OPPR' },
    desc: { en: 'Pay the OPPR registration fee. Fee is based on the same tiered structure as CDFA (based on annual gross organic sales of processed products).', es: 'Paga la tarifa de registro OPPR. La tarifa se basa en la misma estructura escalonada que CDFA (basada en ventas orgánicas brutas anuales de productos procesados).' },
    details: { en: 'Include a check payable to "CDPH" with your mailed OPPR application. Keep a copy of your completed form and payment for your records. Processing can take 4-6 weeks.', es: 'Incluye un cheque a nombre de "CDPH" con tu solicitud OPPR enviada por correo. Guarda una copia de tu formulario completo y pago para tus registros. El procesamiento puede tomar 4-6 semanas.' },
    link: null,
  },
  {
    id: 'cdph_5',
    phase: 'Post-Registration',
    title: { en: 'Labeling Compliance Review', es: 'Revisión de Cumplimiento de Etiquetado' },
    desc: { en: 'All organic processed product labels must comply with USDA NOP labeling rules AND California state requirements.', es: 'Todas las etiquetas de productos orgánicos procesados deben cumplir con las reglas de etiquetado del USDA NOP Y los requisitos estatales de California.' },
    details: { en: 'Label categories: "100% Organic" (all organic), "Organic" (≥95% organic), "Made with Organic [ingredient]" (70-94% organic). Cannot use USDA seal on "Made with" products. California prohibits misrepresenting conventionally grown products as organic.', es: 'Categorías de etiquetas: "100% Orgánico" (todo orgánico), "Orgánico" (≥95% orgánico), "Hecho con [ingrediente] Orgánico" (70-94% orgánico). No se puede usar el sello USDA en productos "Hecho con". California prohíbe representar falsamente productos cultivados convencionalmente como orgánicos.' },
    link: null,
  },
  {
    id: 'cdph_6',
    phase: 'Annual Renewal',
    title: { en: 'Annual OPPR Renewal', es: 'Renovación Anual de OPPR' },
    desc: { en: 'CDPH OPPR must be renewed annually. Include updated product list and current ACA certificate.', es: 'El OPPR de CDPH debe renovarse anualmente. Incluye lista de productos actualizada y certificado ACA vigente.' },
    details: { en: 'Renewal reminders are sent by CDPH. Failure to renew means you cannot legally sell products labeled as organic in California. Allow 4-6 weeks for processing.', es: 'CDPH envía recordatorios de renovación. No renovar significa que no puedes vender legalmente productos etiquetados como orgánicos en California. Permite 4-6 semanas para el procesamiento.' },
    link: null,
  },
];

function StepCard({ step, checked, onToggle, lang }) {
  const [expanded, setExpanded] = useState(false);
  const phaseColors = { 'Pre-Registration': '#3AA8E4', 'Registration': '#1B6B2E', 'Post-Registration': '#FDBD10', 'Annual Renewal': '#7c3aed' };
  const color = phaseColors[step.phase] || '#64748b';

  return (
    <motion.div
      layout
      style={{
        background: 'white', borderRadius: 12, border: `1.5px solid ${checked ? '#bbf7d0' : '#e2e8f0'}`,
        overflow: 'hidden', transition: 'border-color 0.2s',
      }}
    >
      <div
        style={{ padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 14, cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        <button
          onClick={e => { e.stopPropagation(); onToggle(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, marginTop: 1 }}
        >
          {checked
            ? <CheckCircle2 size={22} color="#22c55e" />
            : <Circle size={22} color="#cbd5e1" />
          }
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color, padding: '2px 7px', background: `${color}18`, borderRadius: 6 }}>
              {step.phase}
            </span>
          </div>
          <p style={{ fontWeight: checked ? 500 : 700, color: checked ? '#94a3b8' : '#1e293b', fontSize: 14, textDecoration: checked ? 'line-through' : 'none' }}>
            {step.title[lang]}
          </p>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>{step.desc[lang]}</p>
        </div>
        <div style={{ color: '#cbd5e1', flexShrink: 0 }}>
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 18px 16px 54px', borderTop: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, marginTop: 10 }}>{step.details[lang]}</p>
              {step.link && (
                <a href={step.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 10, fontSize: 12, color: 'var(--u-sky)', fontWeight: 600, textDecoration: 'none' }}>
                  <ExternalLink size={12} /> {step.linkText[lang]}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function StateRegistration({ userId }) {
  const { lang } = useLanguage();

  const [registrationType, setRegistrationType] = useState(() => loadFromStorage('orgpath_reg_type', 'cdfa'));
  const [checked, setChecked] = useState(() => loadFromStorage('orgpath_state_registration', {}));

  // Load from Supabase on mount
  useEffect(() => {
    if (!userId) return;
    getProfile(userId).then(profile => {
      if (profile?.state_reg_type) {
        setRegistrationType(profile.state_reg_type);
        saveToStorage('orgpath_reg_type', profile.state_reg_type);
      }
      if (profile?.state_reg_state && Object.keys(profile.state_reg_state).length > 0) {
        setChecked(profile.state_reg_state);
        saveToStorage(STORAGE_KEY, profile.state_reg_state);
      }
    });
  }, [userId]);

  const setType = (t) => {
    setRegistrationType(t);
    saveToStorage('orgpath_reg_type', t);
    debouncedSync(userId, 'state_reg_type', t);
  };

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    saveToStorage(STORAGE_KEY, next);
    debouncedSync(userId, 'state_reg_state', next);
  };

  const steps = registrationType === 'cdfa' ? CDFA_STEPS : CDPH_STEPS;
  const completedCount = steps.filter(s => checked[s.id]).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  const tx = {
    title: lang === 'es' ? 'Registro Estatal de California' : 'California State Registration',
    subtitle: lang === 'es'
      ? 'Lista de verificación paso a paso para registro en CDFA o CDPH'
      : 'Step-by-step checklist for CDFA or CDPH registration',
    cdfa: lang === 'es' ? 'CDFA (Productos Agrícolas Crudos)' : 'CDFA (Raw Agricultural Products)',
    cdph: lang === 'es' ? 'CDPH (Productos Procesados)' : 'CDPH (Processed Products)',
    progress: lang === 'es' ? 'Progreso' : 'Progress',
    steps: lang === 'es' ? 'pasos completados' : 'steps completed',
    cdfaNote: lang === 'es'
      ? 'CDFA regula: cultivos orgánicos crudos, ganado, huevos, lácteos crudos vendidos en California.'
      : 'CDFA regulates: raw organic crops, livestock, eggs, raw dairy sold in California.',
    cdphNote: lang === 'es'
      ? 'CDPH regula: alimentos procesados y empacados, suplementos dietéticos, cosméticos, alimentos para mascotas.'
      : 'CDPH regulates: processed/packaged foods, dietary supplements, cosmetics, pet food.',
    bothNote: lang === 'es'
      ? '¿Vendes productos crudos Y procesados? Necesitarás completar AMBOS registros.'
      : 'Selling both raw AND processed products? You will need to complete BOTH registrations.',
  };

  const phases = [...new Set(steps.map(s => s.phase))];

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--u-navy)', fontFamily: 'Lora, serif', marginBottom: 6 }}>
          {tx.title}
        </h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>{tx.subtitle}</p>
      </div>

      {/* Type selector */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        {[['cdfa', tx.cdfa, '#1B6B2E'], ['cdph', tx.cdph, '#3AA8E4']].map(([val, label, color]) => (
          <button
            key={val}
            onClick={() => setType(val)}
            style={{
              padding: '10px 20px', borderRadius: 10, border: `2px solid ${registrationType === val ? color : '#e2e8f0'}`,
              background: registrationType === val ? `${color}12` : 'white',
              color: registrationType === val ? color : '#64748b',
              fontWeight: registrationType === val ? 700 : 500, fontSize: 14, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Note */}
      <div style={{ padding: '10px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, marginBottom: 18, fontSize: 13, color: '#166534' }}>
        {registrationType === 'cdfa' ? tx.cdfaNote : tx.cdphNote}
      </div>
      <div style={{ padding: '10px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, marginBottom: 24, fontSize: 13, color: '#92400e', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
        {tx.bothNote}
      </div>

      {/* Progress */}
      <div style={{ background: 'white', borderRadius: 12, padding: '14px 18px', border: '1px solid #e2e8f0', marginBottom: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{tx.progress}</span>
          <span style={{ color: '#64748b' }}>{completedCount}/{steps.length} {tx.steps}</span>
        </div>
        <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            style={{ height: '100%', background: progress === 100 ? '#22c55e' : 'var(--u-navy)', borderRadius: 4 }}
          />
        </div>
      </div>

      {/* Steps grouped by phase */}
      {phases.map(phase => (
        <div key={phase} style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{phase}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.filter(s => s.phase === phase).map(step => (
              <StepCard key={step.id} step={step} checked={!!checked[step.id]} onToggle={() => toggle(step.id)} lang={lang} />
            ))}
          </div>
        </div>
      ))}

      {/* Ask Jimmy */}
      <div style={{ marginTop: 24, padding: '16px 20px', background: 'linear-gradient(135deg, var(--u-navy-d), var(--u-navy))', borderRadius: 14, color: 'white', display: 'flex', alignItems: 'center', gap: 14 }}>
        <Sparkles size={20} color="var(--u-gold)" />
        <div>
          <p style={{ fontWeight: 700, marginBottom: 2 }}>
            {lang === 'es' ? '¿Tienes preguntas sobre el registro?' : 'Questions about the registration process?'}
          </p>
          <p style={{ fontSize: 13, opacity: 0.8 }}>
            {lang === 'es'
              ? 'Pregúntale a Jimmy usando el botón de chat en la esquina inferior derecha.'
              : 'Ask Jimmy using the chat button in the bottom-right corner.'}
          </p>
        </div>
      </div>
    </div>
  );
}
