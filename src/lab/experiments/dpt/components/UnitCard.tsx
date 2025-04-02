import React from 'react';
import { TurnUnit } from '../type/TurnSystem';

export interface UnitCardProps {
  unit: TurnUnit;
  isPlayerUnit: boolean;
  isActive?: boolean;
}

export function UnitCard({ unit, isPlayerUnit, isActive = false }: UnitCardProps): React.ReactElement {
  const isKnockedOut = unit.hp <= 0 && !unit.wasResurrected;
  const isLowHp = unit.hp && unit.hp <= unit.maxHp * 0.3;

  const getHpColor = (): string => {
    if (isKnockedOut) return '#ff0000';
    if (isLowHp) return '#ff9800';
    return '#4caf50';
  };

  return (
    <div
      style={{
        padding: '12px',
        marginBottom: '12px',
        border: `2px solid ${isPlayerUnit ? '#2196F3' : '#FF5722'}`,
        borderRadius: '8px',
        background: isKnockedOut ? '#ffebee' : '#fff',
        transition: 'all 0.3s ease',
        position: 'relative' as const,
        ...(isActive ? { boxShadow: '0 0 15px rgba(33, 150, 243, 0.5)', transform: 'scale(1.02)' } : {})
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '33% 34% 33%', alignItems: 'center', gap: '10px' }}>
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
          <div style={{ fontSize: '0.9em', color: '#666' }}>
            {unit.attack && <div>ATK: {unit.attack}</div>}
            {unit.target_type && <div>Target: {unit.target_type}</div>}
          </div>
        </div>

        {/* Middle Column - Status */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {isKnockedOut && (
            <div style={{
              background: '#b71c1c',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.8em',
              fontWeight: 'bold'
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
              fontWeight: 'bold'
            }}>
              Active
            </div>
          )}
        </div>

        {/* Right Column - Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '90%' }}>
          {/* HP Bar */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.9em'
            }}>
              <span>HP</span>
              <span style={{
                color: isLowHp ? '#ff9800' : 'inherit'
              }}>
                {unit.hp}/{unit.maxHp}
              </span>
            </div>
            <div className="bar-container">
              <div className="bar-background" />
              <div 
                className={`bar-fill width-${Math.round((unit.hp / unit.maxHp) * 100)}`}
                style={{
                  backgroundColor: getHpColor()
                }}
              />
            </div>
          </div>

          {/* Energy Bar */}
          {unit.energy !== undefined && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.9em'
              }}>
                <span>Energy</span>
                <span>{unit.energy}/{unit.maxEnergy}</span>
              </div>
              <div className="bar-container">
                <div className="bar-background" />
                <div 
                  className={`bar-fill width-${Math.round((unit.energy / unit.maxEnergy) * 100)}`}
                  style={{
                    backgroundColor: '#2196F3'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          .bar-container {
            height: 6px;
            border-radius: 3px;
            overflow: hidden;
            width: 100%;
            position: relative;
          }

          .bar-background {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 100%;
            background: #e0e0e0;
          }

          .bar-fill {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 0%;
            transition: width 800ms ease-in-out;
            will-change: width;
          }

          ${[...Array(101)].map((_, i) => `
            .width-${i} {
              width: ${i}%;
            }
          `).join('\n')}
        `}
      </style>
    </div>
  );
}

export default UnitCard;