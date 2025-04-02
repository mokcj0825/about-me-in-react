import React from 'react';
import Section from '../Section';
import { BlessingInstruction } from '../../types';

interface OverviewSectionProps {
  instruction: BlessingInstruction;
}

const getRarityLabel = (rarity: BlessingInstruction['rarity']): string => {
  if (rarity > 5) {
    return `${rarity} ⚠️`;  // Show warning emoji for invalid rarity
  }
  return '★'.repeat(rarity);
};

const getRarityColor = (rarity: BlessingInstruction['rarity']): string => {
  if (rarity > 5) {
    return '#FF0000';  // Red for invalid rarity
  }
  switch (true) {
    case rarity <= 1: return '#808080';  // Grey
    case rarity <= 2: return '#0066CC';  // Blue
    case rarity <= 5: return '#FFB700';  // Golden yellow
    default: return '#FF0000';  // Red (shouldn't reach here due to earlier check)
  }
};

const getCategoryColor = (category: BlessingInstruction['category']): string => {
  switch (category) {
    case 'offense': return '#FF4444';  // Red
    case 'defense': return '#44FF44';  // Green
    case 'hinder': return '#9C27B0';   // Purple
    case 'boost': return '#2196F3';    // Blue
    case 'recovery': return '#4CAF50'; // Emerald
  }
};

interface BadgeProps {
  label: string;
  color: string;
  isRarity?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ label, color, isRarity = false }) => (
  <span style={{
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    backgroundColor: '#f5f5f5',
    color: isRarity ? color : '#666',
    fontWeight: 'bold',
    fontSize: '0.875rem',
    marginRight: '0.5rem',
    border: isRarity ? `2px solid ${color}` : 'none',
    boxShadow: isRarity ? `0 0 4px ${color}40` : 'none'
  }}>
    {label}
  </span>
);

const OverviewSection: React.FC<OverviewSectionProps> = ({ instruction }) => (
  <Section title="Overview">
    <div style={{ fontSize: "0.875rem" }}>
      <div style={{ marginBottom: '1rem' }}>
        <Badge 
          label={getRarityLabel(instruction.rarity)}
          color={getRarityColor(instruction.rarity)}
          isRarity={true}
        />
        <Badge 
          label={instruction.category} 
          color={getCategoryColor(instruction.category)} 
        />
      </div>
      <p><strong>ID:</strong> {instruction.id}</p>
      <p><strong>Name:</strong> {instruction.name}</p>
      <p><strong>Description:</strong> {instruction.description}</p>
    </div>
  </Section>
);

export default OverviewSection; 