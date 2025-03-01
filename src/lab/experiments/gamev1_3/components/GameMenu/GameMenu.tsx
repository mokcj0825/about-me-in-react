import React from 'react';
import type { TurnState } from '../../types/TurnState';

interface Props {
  turn: TurnState;
  onEndTurn: () => void;
  onClose: () => void;
}

export const GameMenu: React.FC<Props> = ({ turn, onEndTurn, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      padding: '20px',
      borderRadius: '8px',
      color: 'white',
      zIndex: 100,
      minWidth: '200px'
    }}>
      <div style={{ 
        fontSize: '18px', 
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        游戏菜单
      </div>
      
      <button
        onClick={onEndTurn}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        结束{turn.cycle === 'day' ? '白天' : '夜晚'}
      </button>

      <button
        onClick={onClose}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        关闭
      </button>
    </div>
  );
}; 