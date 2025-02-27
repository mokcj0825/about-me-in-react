# Movement System

This directory contains the core movement system implementation for the hex-based game. It handles unit movement calculations, pathfinding, and terrain interactions.

## System Components

### Core Classes

#### `MovementCalculator`
The main calculator class that:
- Calculates reachable hexes for units
- Handles movement costs and terrain interactions
- Integrates with Zone of Control (ZoC) system
- Applies special movement characteristics

### Movement Rules

#### `GroundMovement`
Implementation of basic ground movement rules:
- Unit collision detection
- Terrain cost calculations
- Basic pathfinding rules
- Terrain type determination

### Data Structures

#### Movement Costs (`constants.ts`)
Defines the base movement costs for different combinations of:
- Terrain types (plain, mountain, forest, etc.)
- Movement types (foot, ooze, float, flying)
- Special terrain effects

Example:
```typescript
{
   'plain':{ foot: 1, ooze: 1, float: 1, flying: 1 },
   'mountain': { foot: 3, ooze: 999, float: 2, flying: 1 }
}
```

#### Types (`types.ts`)
Core type definitions:
- `TerrainType`: Available terrain types
- `MovementCost`: Movement cost structure
- `MovementRule`: Interface for movement rule implementations

## Movement Mechanics

### Cost Calculation
1. Base cost determined by terrain type
2. Modified by unit's movement type
3. Adjusted for special characteristics
4. Affected by Zone of Control

### Pathfinding Process
1. Start from unit's position
2. Calculate available movement points
3. Check neighboring hexes
4. Apply movement costs and rules
5. Handle special cases (ZoC, terrain effects)

### Special Rules
- Units can move through friendly units
- Hostile units block movement
- Zone of Control affects movement
- Special characteristics can modify costs
- Terrain may be impassable for certain movement types

## Usage Example

```typescript
// Initialize movement calculator
const calculator = new MovementCalculator(
  new GroundMovement(),
  zocRules
);

// Get moveable hexes for a unit
const reachableHexes = calculator.getMoveableGrids(
  startPosition,
  unit.movement,
  allUnits
);
```

## Integration Points

### Zone of Control
- Affects unit movement
- Can stop movement when entering/leaving
- Modifies available paths

### Unit Characteristics
- Can modify movement costs
- May grant special movement abilities
- Affects terrain accessibility

### Terrain System
- Defines base movement costs
- Creates movement restrictions
- Affects pathfinding decisions

## Future Improvements

1. **Movement Rules**
   - Additional movement types
   - Complex terrain interactions
   - Weather effects on movement

2. **Pathfinding**
   - Optimized algorithms
   - Path cost prediction
   - Movement preview

3. **Special Effects**
   - Status effect integration
   - Temporary terrain modifications
   - Dynamic movement costs

## Technical Notes

- Written in TypeScript
- Uses hex grid coordinates
- Implements A* pathfinding concepts
- Handles edge cases and validation
- Maintains type safety 