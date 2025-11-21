/**
 * Get color based on unit fraction
 * @param fraction
 * @deprecated This function no longer uses after v1.2
 */
export const getUnitColor = (fraction: string) => {
  switch (fraction) {
    case 'player':
      return '#ffeb3b';  // Yellow for player
    case 'ally':
      return '#4CAF50';  // Green for ally
    case 'enemy':
      return '#ff4444';  // Red for enemy
    default:
      return '#f0f0f0';
  }
};