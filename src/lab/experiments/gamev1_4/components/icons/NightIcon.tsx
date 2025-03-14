import React from 'react';

export const NightIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 4L13 8L12 12L11 8L12 4Z"  // Top star point
      fill="#E1E1E1"
    />
    <path
      d="M12 20L13 16L12 12L11 16L12 20Z"  // Bottom star point
      fill="#E1E1E1"
    />
    <path
      d="M4 12L8 13L12 12L8 11L4 12Z"  // Left star point
      fill="#E1E1E1"
    />
    <path
      d="M20 12L16 13L12 12L16 11L20 12Z"  // Right star point
      fill="#E1E1E1"
    />
    <path
      d="M8 8C8 12 12 16 16 16C14 12 14 8 16 4C12 4 8 8 8 8Z"  // Crescent moon shape
      fill="#E1E1E1"
    />
  </svg>
); 