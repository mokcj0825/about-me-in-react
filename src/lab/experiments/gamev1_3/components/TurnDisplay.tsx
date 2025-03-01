import React from 'react';
import type { TurnState } from '../types/TurnState';
import { DayIcon } from './icons/DayIcon';
import { NightIcon } from './icons/NightIcon';

interface Props {
  turn: TurnState;
}

export const TurnDisplay: React.FC<Props> = ({ turn }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: '10px 20px',
      borderRadius: '4px',
      color: 'white',
      fontSize: '14px',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      gap: '32px'
    }}>
      <div style={{ 
        opacity: turn.cycle === 'day' ? 1 : 0.3,
        transition: 'opacity 0.3s'
      }}>
        <DayIcon size={32} />
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px'
      }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          回合 {turn.number}
        </div>
        <div style={{ fontSize: '12px' }}>
          {turn.cycle === 'day' ? '白天' : '夜晚'}
        </div>
      </div>

      <div style={{ 
        opacity: turn.cycle === 'night' ? 1 : 0.3,
        transition: 'opacity 0.3s'
      }}>
        <NightIcon size={32} />
      </div>
    </div>
  );
}; 