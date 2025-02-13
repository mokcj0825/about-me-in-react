export interface HexCoordinate {
  x: number;
  y: number;
  z: number;
}

export const createHexCoordinate = (x: number, y: number): HexCoordinate => {
  const z = -x - y;  // This ensures the coordinate sum is always 0
  return { x, y, z };
};

// Get neighbors using four patterns based on x and y
export const getNeighbors = (hex: HexCoordinate): HexCoordinate[] => {
    const isYEven = hex.y % 2 === 0;
    return isYEven
      ? [
          createHexCoordinate(hex.x + 1, hex.y),  // right
          createHexCoordinate(hex.x - 1, hex.y),  // left
          createHexCoordinate(hex.x, hex.y + 1),  // top left
          createHexCoordinate(hex.x + 1, hex.y + 1),  // top right
          createHexCoordinate(hex.x, hex.y - 1),  // bottom left
          createHexCoordinate(hex.x + 1, hex.y - 1),  // bottom right
        ]
      : [
          createHexCoordinate(hex.x + 1, hex.y),  // right
          createHexCoordinate(hex.x - 1, hex.y),  // left
          createHexCoordinate(hex.x - 1, hex.y + 1),  // top left
          createHexCoordinate(hex.x, hex.y + 1),  // top right
          createHexCoordinate(hex.x - 1, hex.y - 1),  // bottom left
          createHexCoordinate(hex.x, hex.y - 1),  // bottom right
        ];
  };


  export const getDistance = (a: HexCoordinate, b: HexCoordinate): number => {
    if (a.x === b.x && a.y === b.y) return 0; // Edge case: same position
  
    const queue: [HexCoordinate, number][] = [[a, 0]];
    const visited = new Set<string>(); // Use a Set for fast lookups
    visited.add(`${a.x},${a.y}`);
  
    let index = 0; // Index-based queue traversal
  
    while (index < queue.length) {
      const [current, distance] = queue[index++]; // O(1) pop operation
  
      for (const neighbor of getNeighbors(current)) {
        const key = `${neighbor.x},${neighbor.y}`;
        if (!visited.has(key)) {
          if (neighbor.x === b.x && neighbor.y === b.y) return distance + 1; // Found target early
          visited.add(key);
          queue.push([neighbor, distance + 1]);
        }
      }
    }
  
    return -1; // No path found
  };

// Helper function to verify distances
export const debugDistance = (a: HexCoordinate, b: HexCoordinate): void => {
  const distance = getDistance(a, b);
  console.log(`Distance from (${a.x},${a.y}) to (${b.x},${b.y}): ${distance}`);
}

export const isValidCoordinate = (coord: HexCoordinate): boolean => {
  return coord.x + coord.y + coord.z === 0;
};

export const areCoordinatesEqual = (a: HexCoordinate, b: HexCoordinate): boolean => {
  return a.x === b.x && a.y === b.y && a.z === b.z;
}; 