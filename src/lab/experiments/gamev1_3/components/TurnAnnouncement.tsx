import React, { useEffect, useState } from 'react';
import type { TurnState } from '../types/TurnState';

interface Props {
  message: string;
}

export const TurnAnnouncement: React.FC<Props> = ({ message }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      fontSize: '32px',
      fontWeight: 'bold',
      zIndex: 1000,
      animation: 'fadeInOut 1s ease-in-out',
    }}>
      {message}
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export function getAnnouncementMessage(turnState: TurnState): string {
    console.log('turnState', turnState);
  if (turnState.phase === 'ally') return '盟军行动';
  if (turnState.phase === 'enemy') return '敌军行动';
  if (turnState.phase === 'player') {
    return `第${turnState.number}回合 - ${turnState.cycle === 'day' ? '白天' : '夜晚'}`;
  }
  return '';
} 