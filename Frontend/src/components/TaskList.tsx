import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { COLORS } from '../theme';

export type Task = {
  id: string;
  operation: string;
  workCenter: string;
  status: 'Started' | 'Paused' | 'Done' | 'To Do';
  priority: 'urgent' | 'medium' | 'normal';
};

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const [timers, setTimers] = useState<Record<string, number>>({});
  const [running, setRunning] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const ids = Object.keys(running).filter((k) => running[k]);
    if (ids.length === 0) return;
    const iv = setInterval(() => {
      setTimers((prev) => {
        const copy = { ...prev };
        ids.forEach((id) => (copy[id] = (copy[id] || 0) + 1));
        return copy;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [running]);

  const toggleStart = (id: string) => {
    setRunning((r) => ({ ...r, [id]: !r[id] }));
  };

  const complete = (id: string) => {
    setRunning((r) => ({ ...r, [id]: false }));
  };

  const format = (s: number) => {
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <div style={{ background: COLORS.background.white, padding: 12, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left' }}>
            <th style={{ padding: 8 }}>Operation</th>
            <th style={{ padding: 8 }}>Work Center</th>
            <th style={{ padding: 8 }}>Status</th>
            <th style={{ padding: 8 }}>Timer</th>
            <th style={{ padding: 8 }}></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id} style={{ borderTop: '1px solid #EEE' }}>
              <td style={{ padding: 8 }}>{t.operation}</td>
              <td style={{ padding: 8 }}>{t.workCenter}</td>
              <td style={{ padding: 8 }}>
                {t.priority === 'urgent' && (
                  <span style={{ background: COLORS.priority.urgent, color: '#fff', padding: '0.25rem 0.5rem', borderRadius: 999, fontWeight: 700, fontSize: 12, marginRight: 8 }}>URGENT</span>
                )}
                <span>{t.status}</span>
              </td>
              <td style={{ padding: 8 }}>{format(timers[t.id] || 0)}</td>
              <td style={{ padding: 8, display: 'flex', gap: 8 }}>
                <Button variant={running[t.id] ? 'ghost' : 'primary'} onClick={() => toggleStart(t.id)}>{running[t.id] ? 'Pause' : 'Start'}</Button>
                <Button variant="ghost" onClick={() => complete(t.id)}>Complete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
