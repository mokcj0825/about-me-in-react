import React from 'react';

export const DayIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 4L13.5 8L12 12L10.5 8L12 4Z"  // Top star point
      fill="#FFD700"
    />
    <path
      d="M12 20L13.5 16L12 12L10.5 16L12 20Z"  // Bottom star point
      fill="#FFD700"
    />
    <path
      d="M4 12L8 13.5L12 12L8 10.5L4 12Z"  // Left star point
      fill="#FFD700"
    />
    <path
      d="M20 12L16 13.5L12 12L16 10.5L20 12Z"  // Right star point
      fill="#FFD700"
    />
    <circle
      cx="12"
      cy="12"
      r="4"
      fill="#FFD700"
    />
  </svg>
); 