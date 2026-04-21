import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import t from '../data/translations.js';
import { calculateStateFee } from '../data/wizard-steps.js';

const QUESTIONS = [
  { id: 'sells', key: 'q1', optKeys: ['q1_yes', 'q1_no'] },
  { id: 'sales', key: 'q2', optKeys: ['q2_a', 'q2_b', 'q2_c'] },
  { id: 'type', key: 'q3', optKeys: ['q3_a', 'q3_b', 'q3_c', 'q3_d'] },
  { id: 'land', key: 'q4', optKeys: ['q4_a', 'q4_b', 'q4_c'] },
  { id: 'dairy', key: 'q5', optKeys: ['q5_yes', 'q5_no'] },
];

function getResult(answers, tx) {
  if (answers.sells === 'q1_no') return { type: 'none', color: '#1B6B2E', bg: '#e8f5e9' };
  if (answers.sales === 'q2_a') return { type: 'exempt', color: '#bd8e00', bg: '#fff8e1' };

  let path = 'CDFA';
  if (answers.type === 'q3_b') path = 'CDPH';
  if (answers.type === 'q3_d') path = 'both';
  if (answers.type === 'q3_c') path = 'CDFA';

  const inTransition = answers.land === 'q4_a' || answers.land === 'q4_b';
  const isDairy = answers.dairy === 'q5_yes';

  let estimatedFee = 0;
  if (answers.sales === 'q2_b') estimatedFee = calculateStateFee(25000);
  if (answers.sales === 'q2_c') estimatedFee = calculateStateFee(100000);

  return { type: path, inTransition, isDairy, estimatedFee, color: '#002D54', bg: '#e5f0fa' };
}

export default function EligibilityChecker({ onNavigate, onUpdateProfile }) {
  const { lang } = useLanguage();
  const tx = t[lang].eligibility;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(null);

  const q = QUESTIONS[step];
  const currentAnswer = answers[q?.id];

  const handleSelect = (optKey) => {
    setAnswers(prev => ({ ...prev, [q.id]: optKey }));
  };

  const handleNext = () => {
    // Skip dairy question if not livestock
    if (step === 3 && answers.type !== 'q3_c') {
      const res = getResult({ ...answers, dairy: 'q5_no' }, tx);
      setResult(res);
      if (onUpdateProfile) onUpdateProfile({ eligibilityResult: res });
      setDone(true);
      return;
    }
    if (step === QUESTIONS.length - 1) {
      const res = getResult(answers, tx);
      setResult(res);
      if (onUpdateProfile) onUpdateProfile({ eligibilityResult: res });
      setDone(true);
      return;
    }
    setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleRestart = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
    setResult(null);
  };

  const progressPct = Math.round((step / QUESTIONS.length) * 100);

  return (
    <div style={{ padding: '40px', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: 28, color: 'var(--u-navy)', marginBottom: 8 }}>
          {tx.title}
        </h1>
        <p style={{ color: '#64748b', fontSize: 15 }}>{tx.subtitle}</p>
      </div>

      {!done ? (
        <div style={{ background: 'white', borderRadius: 16, padding: 36, boxShadow: '0 4px 24px rgba(0,45,84,0.08)' }}>
          {/* Progress bar */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>
              <span>{tx.step || 'Question'} {step + 1} / {QUESTIONS.length}</span>
              <span>{progressPct}%</span>
            </div>
            <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${progressPct}%` }}
                style={{ height: '100%', background: 'var(--u-navy)', borderRadius: 3 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 style={{ fontSize: 20, color: 'var(--u-navy)', marginBottom: 24, fontWeight: 600 }}>
                {tx[q.key]}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {q.optKeys.map(optKey => {
                  const isSelected = currentAnswer === optKey;
                  return (
                    <motion.button
                      key={optKey}
                      onClick={() => handleSelect(optKey)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      style={{
                        padding: '14px 20px',
                        borderRadius: 10,
                        border: isSelected ? '2px solid var(--u-navy)' : '2px solid #e2e8f0',
                        background: isSelected ? 'rgba(0,45,84,0.05)' : 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: 14,
                        color: isSelected ? 'var(--u-navy)' : '#374151',
                        fontWeight: isSelected ? 600 : 400,
                        display: 'flex', alignItems: 'center', gap: 12,
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        border: isSelected ? '6px solid var(--u-navy)' : '2px solid #cbd5e1',
                        flexShrink: 0, transition: 'all 0.15s',
                      }} />
                      {tx[optKey]}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            <button
              onClick={handleBack}
              disabled={step === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 8,
                border: '1.5px solid #e2e8f0', background: 'white',
                cursor: step === 0 ? 'not-allowed' : 'pointer',
                opacity: step === 0 ? 0.4 : 1,
                fontSize: 14, color: '#374151', fontFamily: 'Inter, sans-serif',
              }}
            >
              <ArrowLeft size={16} /> {tx.back}
            </button>

            <button
              onClick={handleNext}
              disabled={!currentAnswer}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 24px', borderRadius: 8,
                border: 'none', background: currentAnswer ? 'var(--u-navy)' : '#e2e8f0',
                cursor: currentAnswer ? 'pointer' : 'not-allowed',
                fontSize: 14, color: currentAnswer ? 'white' : '#94a3b8',
                fontFamily: 'Inter, sans-serif', fontWeight: 600,
                transition: 'all 0.15s',
              }}
            >
              {step === QUESTIONS.length - 1 ? tx.seeResult : tx.next}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <ResultCard result={result} tx={tx} lang={lang} onRestart={handleRestart} onNavigate={onNavigate} />
      )}
    </div>
  );
}

function ResultCard({ result, tx, lang, onRestart, onNavigate }) {
  if (!result) return null;

  const isExempt = result.type === 'exempt';
  const isNone = result.type === 'none';
  const isCDFA = result.type === 'CDFA';
  const isCDPH = result.type === 'CDPH';
  const isBoth = result.type === 'both';

  const titleKey = isNone ? 'resultNone' : isExempt ? 'resultExempt' :
    isCDFA ? 'resultCDFA' : isCDPH ? 'resultCDPH' : 'resultBoth';
  const descKey = isNone ? 'resultNoneDesc' : isExempt ? 'resultExemptDesc' :
    isCDFA ? 'resultCDFADesc' : isCDPH ? 'resultCDPHDesc' : 'resultBothDesc';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {/* Main result */}
      <div style={{
        background: 'white', borderRadius: 16, padding: 36,
        boxShadow: '0 4px 24px rgba(0,45,84,0.08)',
        borderTop: `5px solid ${result.color}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: result.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {isExempt || isNone
              ? <Info size={24} color={result.color} />
              : <CheckCircle size={24} color={result.color} />
            }
          </div>
          <div>
            <h2 style={{ fontFamily: 'Lora, serif', fontSize: 22, color: 'var(--u-navy)', marginBottom: 8 }}>
              {tx[titleKey]}
            </h2>
            <p style={{ color: '#4b5563', fontSize: 14, lineHeight: 1.7 }}>{tx[descKey]}</p>
          </div>
        </div>

        {result.estimatedFee > 0 && (
          <div style={{
            background: '#f8fafc', borderRadius: 10, padding: '14px 18px',
            border: '1px solid #e2e8f0', marginBottom: 16,
          }}>
            <p style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>
              💰 {tx.estimatedFees}: <span style={{ color: 'var(--u-navy)', fontSize: 15 }}>${result.estimatedFee}/year</span>
            </p>
          </div>
        )}

        {/* Transition warning */}
        {result.inTransition && (
          <div style={{
            background: '#fff8e1', borderRadius: 10, padding: '14px 18px',
            border: '1px solid #fde68a', marginBottom: 16,
            display: 'flex', gap: 12,
          }}>
            <AlertTriangle size={18} color="#bd8e00" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#7a6200', marginBottom: 4 }}>{tx.resultTransition}</p>
              <p style={{ fontSize: 13, color: '#7a6200' }}>{tx.resultTransitionDesc}</p>
            </div>
          </div>
        )}

        {/* Dairy note */}
        {result.isDairy && (
          <div style={{
            background: '#e5f4fd', borderRadius: 10, padding: '14px 18px',
            border: '1px solid #bae0f7', marginBottom: 16,
            display: 'flex', gap: 12,
          }}>
            <Info size={18} color="#005FAE" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#003d7a', marginBottom: 4 }}>{tx.resultDairy}</p>
              <p style={{ fontSize: 13, color: '#003d7a' }}>{tx.resultDairyDesc}</p>
            </div>
          </div>
        )}

        {/* Next step */}
        {!isNone && (
          <div style={{ marginTop: 24, borderTop: '1px solid #f1f5f9', paddingTop: 24 }}>
            <p style={{ fontSize: 14, color: '#374151', marginBottom: 16, fontWeight: 600 }}>{tx.nextStep}</p>
            <button
              onClick={() => onNavigate('osp')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 8,
                border: 'none', background: 'var(--u-navy)',
                color: 'white', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              {tx.startWizard} <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Restart */}
      <button
        onClick={onRestart}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 8,
          border: '1.5px solid #e2e8f0', background: 'white',
          color: '#64748b', fontSize: 13, cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', alignSelf: 'flex-start',
        }}
      >
        <RefreshCw size={14} /> {tx.restart}
      </button>
    </motion.div>
  );
}
