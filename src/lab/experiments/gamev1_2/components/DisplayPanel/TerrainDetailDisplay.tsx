import React from 'react';
import type { TerrainType } from '../../movement/types';
import { getTerrainDescription } from '../../utils/terrainUtils';
import { DEFAULT_MOVEMENT_COSTS } from '../../movement/constants';
import { TERRAIN_LABELS } from '../../utils/terrainUtils';
import { MOVEMENT_TYPE_LABELS, MovementType } from '../../movement/types';

interface Props {
  visible: boolean;
  terrain: TerrainType;
  onClose: () => void;
}

export const TerrainDetailDisplay: React.FC<Props> = ({ visible, terrain, onClose }) => {
  if (!visible) return null;

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    zIndex: 100,
    width: '600px',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
  };

  const renderMovementCosts = () => {
    const costs = DEFAULT_MOVEMENT_COSTS[terrain];
    return (
      <div style={{ marginTop: '8px', fontSize: '12px' }}>
        <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
          移动消耗:
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '4px',
          fontSize: '11px'
        }}>
          {(Object.keys(costs) as MovementType[]).map(type => (
            <div key={type}>
              {MOVEMENT_TYPE_LABELS[type]}: {costs[type] === 999 ? '不可通行' : costs[type]}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={{ 
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)', 
        paddingBottom: '10px',
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>地形信息</h2>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px'
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '20px',
      }}>
        {/* Left side - Image */}
        <div style={{
          width: '200px',
          height: '200px',
          borderRadius: '4px',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <img 
            src={`/terrain-image/background_${terrain}.jpeg`}
            alt={TERRAIN_LABELS[terrain]}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>

        {/* Right side - Content */}
        <div style={{
          flex: 1,
        }}>
          <div style={{ 
            padding: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginBottom: '8px'
            }}>
              <img 
                src={`/map-terrain/${terrain}.svg`}
                alt={TERRAIN_LABELS[terrain]}
                style={{ width: '24px', height: '24px' }}
              />
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {TERRAIN_LABELS[terrain]}
              </span>
            </div>
            
            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {getTerrainDescription(terrain)}
            </div>

            {renderMovementCosts()}
          </div>
        </div>
      </div>
    </div>
  );
}; 