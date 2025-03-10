import React from 'react';
import { UnitData } from '../../types/UnitData';
import { MOVEMENT_TYPE_LABELS } from '../../movement/types';
import {Z_INDEX} from "../../constants/zIndex";

interface Props {
  unit?: UnitData;
  units?: UnitData[];
  mousePosition: { x: number; y: number };
  isMultiple?: boolean;
}

/**
 * UnitInfoDisplay component - Renders a floating information panel for units
 * Shows comprehensive unit information in a compact, organized layout
 */
export const UnitInfoDisplay: React.FC<Props> = ({ unit, units, mousePosition, isMultiple }) => {
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
    zIndex: Z_INDEX.UNIT_INFO,
    width: '280px',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    fontSize: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  };

  return (
    <div style={containerStyle}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginBottom: '8px' 
      }}>
        <div>{unit?.name || 'Unknown Unit'}</div>
        {unit?.hasMoved && (
          <IsMovedTag />
        )}
      </div>

      {/* Header Section */}
      <div style={{ ...sectionStyle, borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
          {unit?.name || 'Unknown Unit'}
        </div>
        <div style={statRowStyle}>
          <span>职业: {unit?.class || 'Unknown'}</span>
          <span>阵营: {unit?.faction || 'Neutral'}</span>
        </div>
        <StateRow label={`职业：${unit?.class || 'Unknown'}`} value={`阵营：${unit?.faction || 'Neutral'}`} />
      </div>

      {/* Combat Stats Section */}
      <div style={sectionStyle}>
        <div style={{ fontSize: '14px', marginBottom: '4px' }}>属性数据</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          <StateRow label={'生命值'} value={`${unit?.hitpoint}`} />
          <StateRow label={'攻击力'} value={`${unit?.attack}`} />
          <StateRow label={'防御力'} value={`${unit?.defense}`} />
          <StateRow label={'敏捷'} value={`${unit?.agility}`} />
          <StateRow label={'朝向'} value={`${unit?.direction}`} />
        </div>
      </div>

      {/* Movement Section */}
      <div style={sectionStyle}>
        <StateRow 
          label={'移动速度'} 
          value={`${unit?.movement || 0} (${unit?.baseMovement || 0}) ${unit?.movementType ? MOVEMENT_TYPE_LABELS[unit.movementType] : ''}`} 
        />
        <StateRow label={'朝向'} value={`${unit?.direction}`} />
        <StateRow label={'坐标'} value={`x: ${unit?.position.x}, y: ${unit?.position.y}`} />
      </div>

      {/* Critical & Effect Stats */}
      <div style={sectionStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          <StateRow label={'暴击率'} value={`${unit?.critRate}%`} />
          <StateRow label={'暴击伤害'} value={`${unit?.critDamage}%`} />
          <StateRow label={'效果命中'} value={`${unit?.effectHitRate}%`} />
          <StateRow label={'效果抵抗'} value={`${unit?.effectResist}%`} />
        </div>
      </div>

      {/* Buffs Section */}
      {unit?.buffs && unit.buffs.length > 0 && (
        <div style={sectionStyle}>
          <div style={{ fontSize: '14px', marginBottom: '4px' }}>状态效果</div>
          <div style={{ display: 'grid', gap: '4px' }}>
            {unit.buffs.map(buff => (
              <div key={buff.id} style={buffRowStyle}>
                <span style={labelStyle}>
                  {getBuffName(buff.id)}
                </span>
                <span style={valueStyle}>
                  {buff.duration === -1 ? '永久' : `${buff.duration}回合`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description Section */}
      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
        {unit?.description || 'No description available.'}
      </div>
    </div>
  );
};

UnitInfoDisplay.displayName = 'UnitInfoDisplay';

const StateRow: React.FC<{ label: string, value: string }> = ({ label, value }) => {
  return (
    <div style={statRowStyle}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value}</span>
    </div>
  );
};

const IsMovedTag: React.FC = () => {
  return (
    <div style={movedTagStyle}>已行动</div>
  );
};

const movedTagStyle: React.CSSProperties = {
  backgroundColor: "rgba(255, 0, 0, 0.2)",
  color: "#ff6b6b",
  padding: "2px 6px",
  borderRadius: "3px",
  fontSize: "12px",
}

const sectionStyle: React.CSSProperties = {
  marginBottom: "8px",
  padding: "4px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
};

const statRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  margin: "2px 0",
};

const labelStyle: React.CSSProperties = {
  color: 'rgba(255, 255, 255, 0.7)',
};

const valueStyle: React.CSSProperties = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontWeight: 'bold',
};

const buffRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "2px 4px",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: "2px",
};

function getBuffName(buffId: string): string {
  switch (buffId) {
    case 'dayWalkerBuff': return '日行者增益';
    case 'nightPhobicDebuff': return '夜晚恐惧';
    default: return buffId;
  }
}