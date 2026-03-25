import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase.js';
import { getProfile, upsertProfile } from './lib/db.js';
import { saveToStorage, loadFromStorage } from './utils/storage.js';
import AuthScreen from './components/AuthScreen.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import EligibilityChecker from './components/EligibilityChecker.jsx';
import CertificationWizard from './components/CertificationWizard.jsx';
import ComplianceTracker from './components/ComplianceTracker.jsx';
import OSPGenerator from './components/OSPGenerator.jsx';
import ExpandableChat from './components/ExpandableChat.jsx';
import RecordGenerators from './components/RecordGenerators.jsx';
import ReceiptManager from './components/ReceiptManager.jsx';
import CertifierDirectory from './components/CertifierDirectory.jsx';
import StateRegistration from './components/StateRegistration.jsx';
import OCCSPAssistant from './components/OCCSPAssistant.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [profile, setProfile] = useState({});
  const [authLoading, setAuthLoading] = useState(true);

  // On mount: restore session from Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        const name = u.user_metadata?.name || u.email.split('@')[0];
        setUser({ id: u.id, name, email: u.email });
        loadUserProfile(u.id);
      }
      setAuthLoading(false);
    });

    // Listen for auth changes (login/logout/token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const name = u.user_metadata?.name || u.email.split('@')[0];
        setUser({ id: u.id, name, email: u.email });
        loadUserProfile(u.id);
      } else {
        setUser(null);
        setProfile({});
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    // Load from localStorage cache first (fast)
    const cached = loadFromStorage(`orgpath_profile_${userId}`, null);
    if (cached) setProfile(cached);

    // Then fetch from Supabase and merge
    const dbProfile = await getProfile(userId);
    if (dbProfile?.operation_data) {
      const merged = { ...(cached || {}), ...dbProfile.operation_data };
      setProfile(merged);
      saveToStorage(`orgpath_profile_${userId}`, merged);
    }
  };

  const handleLogin = (u) => {
    setUser(u);
    if (u.id) loadUserProfile(u.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile({});
  };

  const updateProfile = (data) => {
    const next = { ...profile, ...data };
    setProfile(next);
    if (user?.id) {
      saveToStorage(`orgpath_profile_${user.id}`, next);
      upsertProfile(user.id, { operation_data: next });
    }
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
        <div style={{ textAlign: 'center', color: 'var(--u-navy)' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--u-navy)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, opacity: 0.7 }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthScreen onLogin={handleLogin} />;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        user={user}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--cream)', position: 'relative' }}>
        {activePage === 'dashboard' && <Dashboard user={user} onNavigate={setActivePage} profile={profile} />}
        {activePage === 'eligibility' && <EligibilityChecker onNavigate={setActivePage} onUpdateProfile={updateProfile} />}
        {activePage === 'wizard' && <CertificationWizard profile={profile} onUpdateProfile={updateProfile} onNavigate={setActivePage} userId={user?.id} />}
        {activePage === 'tracker' && <ComplianceTracker userId={user?.id} />}
        {activePage === 'osp' && <OSPGenerator profile={profile} onNavigate={setActivePage} />}
        {activePage === 'records' && <RecordGenerators profile={profile} />}
        {activePage === 'receipts' && <ReceiptManager userId={user?.id} />}
        {activePage === 'certifiers' && <CertifierDirectory />}
        {activePage === 'stateReg' && <StateRegistration userId={user?.id} />}
        {activePage === 'occsp' && <OCCSPAssistant profile={profile} userId={user?.id} />}
      </main>

      <ExpandableChat profile={profile} />
    </div>
  );
}
