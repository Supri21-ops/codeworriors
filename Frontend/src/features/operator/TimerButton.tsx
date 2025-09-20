import React, { useState, useRef, useEffect } from 'react';
import { COLORS } from '../../theme';

interface Props {
  status: 'To Do' | 'Started' | 'Paused' | 'Done';
  onStart: () => void;
  onPause: () => void;
  onComplete: (elapsed: number) => void;
  initialSeconds?: number;
}

export const TimerButton: React.FC<Props> = ({ status, onStart, onPause, onComplete, initialSeconds = 0 }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(status === 'Started');
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running]);

  const format = (s: number) => {
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontWeight: 700 }}>{format(seconds)}</span>
      {status === 'To Do' || status === 'Paused' ? (
        <button style={{ background: COLORS.primary.blue, color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setRunning(true); onStart(); }}>Start</button>
      ) : null}
      {status === 'Started' ? (
        <>
          <button style={{ background: COLORS.secondary.indigo, color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setRunning(false); onPause(); }}>Pause</button>
          <button style={{ background: COLORS.status.success, color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer', fontWeight: 600 }} onClick={() => setShowModal(true)}>Complete</button>
        </>
      ) : null}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}>
            <h3 style={{ marginBottom: 16 }}>Confirm completion?</h3>
            <p>Elapsed time: <b>{format(seconds)}</b></p>
            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <button style={{ background: COLORS.status.success, color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem', fontWeight: 600 }} onClick={() => { setShowModal(false); onComplete(seconds); }}>Confirm</button>
              <button style={{ background: COLORS.priority.urgent, color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem', fontWeight: 600 }} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerButton;
