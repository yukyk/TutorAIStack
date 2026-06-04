'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState('');
  const [nameMsg, setNameMsg] = useState('');
  const [nameSaving, setNameSaving] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);

  const [prefMode, setPrefMode] = useState('hint');
  const [prefLang, setPrefLang] = useState('python');

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session?.user?.name]);

  const isOAuth = !!session?.user?.image;

  const inp: React.CSSProperties = {
    background: '#0d1117', border: '1px solid #1e1e1e', borderRadius: '8px',
    color: '#f4f4f5', fontSize: '13px', padding: '9px 12px', outline: 'none', width: '100%', boxSizing: 'border-box',
  };
  const card: React.CSSProperties = { background: '#0d1117', borderRadius: '12px', border: '1px solid #1e1e1e', padding: '20px', marginBottom: '16px' };
  const sectionLabel: React.CSSProperties = { fontSize: '10px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' };
  const fieldLabel: React.CSSProperties = { fontSize: '11px', color: '#71717a', marginBottom: '5px', display: 'block' };

  async function saveName() {
    if (!name.trim()) return;
    setNameSaving(true);
    setNameMsg('');
    try {
      await axios.post('/api/settings/update', { name: name.trim() });
      setNameMsg('Name updated.');
    } catch {
      setNameMsg('Failed to update name.');
    } finally {
      setNameSaving(false);
    }
  }

  async function savePassword() {
    if (!newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) { setPwdMsg('Passwords do not match.'); return; }
    if (newPassword.length < 8) { setPwdMsg('Password must be at least 8 characters.'); return; }
    setPwdSaving(true);
    setPwdMsg('');
    try {
      await axios.post('/api/settings/update', { newPassword });
      setPwdMsg('Password updated.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwdMsg(err?.response?.data?.error || 'Failed to update password.');
    } finally {
      setPwdSaving(false);
    }
  }

  if (status === 'loading') return <div style={{ padding: '48px', color: '#52525b', fontSize: '13px' }}>Loading...</div>;

  return (
    <div style={{ padding: '28px 32px', maxWidth: '560px' }}>

      <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#f4f4f5', marginBottom: '20px' }}>Settings</h1>

      {/* Profile */}
      <div style={card}>
        <div style={sectionLabel}>Profile</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={fieldLabel}>Display Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={100}
              style={inp}
              placeholder="Your name"
            />
          </div>
          <div>
            <label style={fieldLabel}>Email</label>
            <input
              type="email"
              value={session?.user?.email || ''}
              readOnly
              style={{ ...inp, color: '#52525b', cursor: 'not-allowed' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={saveName}
              disabled={nameSaving || !name.trim()}
              style={{ padding: '9px 18px', borderRadius: '8px', background: '#3B82F6', color: '#fff', fontSize: '12px', fontWeight: '600', border: 'none', cursor: nameSaving ? 'not-allowed' : 'pointer', opacity: nameSaving ? 0.6 : 1 }}
            >
              {nameSaving ? 'Saving…' : 'Save Name'}
            </button>
            {nameMsg && <span style={{ fontSize: '12px', color: nameMsg.includes('updated') ? '#4ade80' : '#f87171' }}>{nameMsg}</span>}
          </div>
        </div>
      </div>

      {/* Password — credentials users only */}
      {!isOAuth && (
        <div style={card}>
          <div style={sectionLabel}>Change Password</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={fieldLabel}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={inp}
                placeholder="Min. 8 characters"
              />
            </div>
            <div>
              <label style={fieldLabel}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={inp}
                placeholder="Repeat password"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={savePassword}
                disabled={pwdSaving || !newPassword || !confirmPassword}
                style={{ padding: '9px 18px', borderRadius: '8px', background: '#3B82F6', color: '#fff', fontSize: '12px', fontWeight: '600', border: 'none', cursor: pwdSaving ? 'not-allowed' : 'pointer', opacity: pwdSaving ? 0.6 : 1 }}
              >
                {pwdSaving ? 'Saving…' : 'Update Password'}
              </button>
              {pwdMsg && <span style={{ fontSize: '12px', color: pwdMsg.includes('updated') ? '#4ade80' : '#f87171' }}>{pwdMsg}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Preferences */}
      <div style={card}>
        <div style={sectionLabel}>Preferences</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={fieldLabel}>Default Tutor Mode</label>
            <select
              value={prefMode}
              onChange={e => setPrefMode(e.target.value)}
              style={{ ...inp, cursor: 'pointer' }}
            >
              <option value="hint">Hint</option>
              <option value="logic">Logic</option>
              <option value="humanize">Humanize</option>
              <option value="debug">Debug</option>
              <option value="optimize">Optimize</option>
            </select>
          </div>
          <div>
            <label style={fieldLabel}>Default Language</label>
            <select
              value={prefLang}
              onChange={e => setPrefLang(e.target.value)}
              style={{ ...inp, cursor: 'pointer' }}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          <div style={{ fontSize: '11px', color: '#3f3f46' }}>Preference saving coming soon.</div>
        </div>
      </div>

    </div>
  );
}
