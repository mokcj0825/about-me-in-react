import React from 'react';
import { Unit } from '../type/InstructionData';

export interface UnitCardProps {
  unit: Unit;
  isPlayerUnit: boolean;
  isActive?: boolean;
}

/**
 * Renders a card displaying unit information with visual indicators for HP, energy,
 * and status effects. Uses a three-column layout for better space utilization.
 */
export function UnitCard({ unit, isPlayerUnit, isActive = false }: UnitCardProps): React.ReactElement {
  const isKnockedOut = unit.hp <= 0;
  const isLowHp = unit.hp && unit.hp <= unit.maxHp * 0.3;
  
  const getHpColor = (): string => {
    if (isKnockedOut) return '#ff0000';
    if (isLowHp) return '#ff9800';
    return '#4caf50';
  };

  const getEnergyPercentage = (): number => {
    if (unit.energy === undefined || unit.maxEnergy === undefined) return 0;
    return (unit.energy / unit.maxEnergy) * 100;
  };

  const getHpPercentage = (): number => {
    return (unit.hp / unit.maxHp) * 100;
  };

  return (
    <div style={{
      padding: '12px',
      marginBottom: '12px',
      border: `2px solid ${isPlayerUnit ? '#2196F3' : '#FF5722'}`,
      borderRadius: '8px',
      background: isKnockedOut ? '#ffebee' : '#fff',
      transition: 'all 0.3s ease',
      position: 'relative' as const,
      ...(isActive ? { boxShadow: '0 0 15px rgba(33, 150, 243, 0.5)', transform: 'scale(1.02)' } : {})
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '33% 34% 33%',
        alignItems: 'center',
        gap: '10px'
      }}>
        {/* Left Column - Unit Info */}
        <div>
          <div style={{ 
            fontWeight: 'bold',
            color: isKnockedOut ? '#b71c1c' : 'inherit',
            fontSize: '1.1em',
            marginBottom: '4px',
            transition: 'color 0.3s ease'
          }}>
            {unit.name}
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '4px',
            fontSize: '0.9em',
            color: '#666'
          }}>
            {unit.attack && <div>ATK: {unit.attack}</div>}
            {unit.target_type && <div>Target: {unit.target_type}</div>}
          </div>
        </div>

        {/* Middle Column - Status */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {isKnockedOut && (
            <div style={{
              background: '#b71c1c',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.8em',
              fontWeight: 'bold',
              animation: 'fadeIn 0.3s ease'
            }}>
              K.O.
            </div>
          )}
          {isActive && (
            <div style={{
              background: '#2196F3',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.8em',
              fontWeight: 'bold',
              animation: 'fadeIn 0.3s ease'
            }}>
              Active
            </div>
          )}
        </div>

        {/* Right Column - Bars */}
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '8px',
          width: '90%'
        }}>
          {/* HP Bar */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '2px',
              fontSize: '0.9em',
              transition: 'all 0.3s ease'
            }}>
              <span>HP</span>
              <span style={{
                transition: 'all 0.3s ease',
                color: isLowHp ? '#ff9800' : 'inherit'
              }}>
                {unit.hp}/{unit.maxHp}
              </span>
            </div>
            <div style={{
              height: '6px',
              background: '#e0e0e0',
              borderRadius: '3px',
              overflow: 'hidden',
              width: '100%',
              position: 'relative' as const
            }}>
              <div style={{
                width: `${getHpPercentage()}%`,
                height: '100%',
                background: getHpColor(),
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative' as const
              }} />
            </div>
          </div>

          {/* Energy Bar */}
          {unit.energy !== undefined && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '2px',
                fontSize: '0.9em',
                transition: 'all 0.3s ease'
              }}>
                <span>Energy</span>
                <span>{unit.energy}/{unit.maxEnergy}</span>
              </div>
              <div style={{
                height: '6px',
                background: '#e0e0e0',
                borderRadius: '3px',
                overflow: 'hidden',
                width: '100%',
                position: 'relative' as const
              }}>
                <div style={{
                  width: `${getEnergyPercentage()}%`,
                  height: '100%',
                  background: '#2196F3',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative' as const
                }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  card: {
    padding: '15px',
    borderRadius: '8px',
    margin: '10px',
    width: '200px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
  },
  playerCard: {
    background: '#e3f2fd',
    border: '1px solid #90caf9'
  },
  enemyCard: {
    background: '#fbe9e7',
    border: '1px solid #ffccbc'
  },
  activeCard: {
    boxShadow: '0 0 15px rgba(33, 150, 243, 0.5)',
    transform: 'scale(1.02)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  name: {
    margin: '0',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  activeIndicator: {
    background: '#2196F3',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '12px'
  },
  stats: {
    marginBottom: '10px'
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '5px 0'
  },
  effects: {
    borderTop: '1px solid rgba(0,0,0,0.1)',
    paddingTop: '10px'
  },
  effectsTitle: {
    margin: '0 0 5px 0',
    fontSize: '14px'
  },
  effect: {
    fontSize: '12px',
    color: '#666',
    margin: '3px 0'
  }
};

export default UnitCard; 