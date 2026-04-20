import { motion } from 'framer-motion';
import { Leaf, ArrowRight, ShieldCheck, Footprints } from 'lucide-react';

export default function CertificationStatusGate({ onSelect }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{ maxWidth: 800, width: '100%' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <div style={{ 
            width: 60, height: 60, background: 'var(--u-gold)', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' 
          }}>
            <Leaf size={32} color="var(--u-navy)" />
          </div>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: 32, color: 'var(--u-navy)', marginBottom: 16 }}>
            Welcome to OrganicPath CA
          </h1>
          <p style={{ fontSize: 18, color: '#64748b', maxWidth: 600, margin: '0 auto' }}>
            To provide the most relevant tools for your operation, please tell us your current status:
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          {/* Maintenance Path */}
          <motion.div
            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(27,107,46,0.15)' }}
            onClick={() => onSelect('certified')}
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 32,
              cursor: 'pointer',
              border: '2px solid transparent',
              transition: 'all 0.2s',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: '#1B6B2E' }} />
            <div style={{ width: 56, height: 56, background: '#e8f5e9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <ShieldCheck size={28} color="#1B6B2E" />
            </div>
            <h2 style={{ fontFamily: 'Lora, serif', fontSize: 22, color: 'var(--u-navy)', marginBottom: 12 }}>
              I am currently USDA-certified organic
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6, marginBottom: 24 }}>
              Maintain, renew, and defend your certification. Access annual OSP updates, 
              audit-readiness tools, and National List alerts.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1B6B2E', fontWeight: 600 }}>
              Enter Maintenance Module <ArrowRight size={18} />
            </div>
          </motion.div>

          {/* Pursuing Path */}
          <motion.div
            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,45,84,0.1)' }}
            onClick={() => onSelect('pursuing')}
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 32,
              cursor: 'pointer',
              border: '2px solid transparent',
              transition: 'all 0.2s',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: '#3AA8E4' }} />
            <div style={{ width: 56, height: 56, background: '#e5f4fd', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <Footprints size={28} color="#3AA8E4" />
            </div>
            <h2 style={{ fontFamily: 'Lora, serif', fontSize: 22, color: 'var(--u-navy)', marginBottom: 12 }}>
              I am pursuing certification
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6, marginBottom: 24 }}>
              First-year certification resources. Guided steps for operations transitioning 
              to organic and preparing their first application.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3AA8E4', fontWeight: 600 }}>
              Access Resources <ArrowRight size={18} />
            </div>
          </motion.div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 40, fontSize: 13, color: '#94a3b8' }}>
          You can always change this later in your profile settings.
        </p>
      </div>
    </div>
  );
}
