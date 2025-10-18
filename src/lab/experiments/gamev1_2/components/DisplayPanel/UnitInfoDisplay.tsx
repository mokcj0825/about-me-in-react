import React from 'react';
import { UnitData } from '../../types/UnitData';
import { MOVEMENT_TYPE_LABELS } from '../../movement/types';

interface Props {
  /** The unit data to display information for */
  unit: UnitData;
  
  /** The current mouse position to position the info display */
  mousePosition: { x: number; y: number };
}

/**
 * UnitInfoDisplay component - Renders a floating information panel for units
 * Shows comprehensive unit information in a compact, organized layout
 */
export const UnitInfoDisplay: React.FC<Props> = ({ unit, mousePosition }) => {
  // Add a buffer zone around the middle
  const MIDDLE_BUFFER = 100; // pixels from center where we'll force a side
  const screenMiddle = window.innerWidth / 2;
  const isLeftSide = mousePosition.x < (screenMiddle - MIDDLE_BUFFER);
  const isRightSide = mousePosition.x > (screenMiddle + MIDDLE_BUFFER);
  
  // If in buffer zone, default to right side
  const displaySide = isLeftSide ? 'right' : 'left';

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 10,
    [displaySide]: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    padding: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    zIndex: 99,
    width: '280px',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    fontSize: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '8px',
    padding: '4px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const statRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '2px 0',
  };

  const labelStyle: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.7)',
  };

  const valueStyle: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      {/* Header Section */}
      <div style={{ ...sectionStyle, borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
          {unit.name || 'Unknown Unit'}
        </div>
        <div style={statRowStyle}>
          <span>职业: {unit.class || 'Unknown'}</span>
          <span>阵营: {unit.fraction || 'Neutral'}</span>
        </div>
      </div>

      {/* Combat Stats Section */}
      <div style={sectionStyle}>
        <div style={{ fontSize: '14px', marginBottom: '4px' }}>属性数据</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
        <div style={statRowStyle}>
            <span style={labelStyle}>生命值</span>
            <span style={valueStyle}>{unit.hitpoint}</span>
          </div>
          <div style={statRowStyle}>
            <span style={labelStyle}>攻击力</span>
            <span style={valueStyle}>{unit.attack}</span>
          </div>
          <div style={statRowStyle}>
            <span style={labelStyle}>防御力</span>
            <span style={valueStyle}>{unit.defense}</span>
          </div>
          <div style={statRowStyle}>
            <span style={labelStyle}>敏捷</span>
            <span style={valueStyle}>{unit.agility}</span>
          </div>
        </div>
      </div>

      {/* Movement Section */}
      <div style={sectionStyle}>
        <div style={statRowStyle}>
          <span style={labelStyle}>移动速度</span>
          <span style={valueStyle}>
            {unit.movement} ({MOVEMENT_TYPE_LABELS[unit.movementType]})
          </span>
        </div>
        <div style={statRowStyle}>
          <span style={labelStyle}>朝向</span>
          <span style={valueStyle}>{unit.direction}</span>
        </div>
        <div style={statRowStyle}>
          <span style={labelStyle}>坐标</span>
          <span style={valueStyle}>x:{unit.position.x}, y:{unit.position.y}</span>
        </div>
      </div>

      {/* Critical & Effect Stats */}
      <div style={sectionStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          <div style={statRowStyle}>
            <span style={labelStyle}>暴击率</span>
            <span style={valueStyle}>{unit.critRate}%</span>
          </div>
          <div style={statRowStyle}>
            <span style={labelStyle}>暴击伤害</span>
            <span style={valueStyle}>{unit.critDamage}%</span>
          </div>
          <div style={statRowStyle}>
            <span style={labelStyle}>效果命中</span>
            <span style={valueStyle}>{unit.effectHitRate}%</span>
          </div>
          <div style={statRowStyle}>
            <span style={labelStyle}>效果抵抗</span>
            <span style={valueStyle}>{unit.effectResist}%</span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
        {unit.description || 'No description available.'}
      </div>
    </div>
  );
};

UnitInfoDisplay.displayName = 'UnitInfoDisplay'; 