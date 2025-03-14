# Game Data Structures

This directory contains JSON data files that define the game's static data structures, including map layouts, unit configurations, and stage setups.

## Data Files

### Map Data (`map-data.json`)
Defines the game board's terrain layout:
- Width and height of the map grid
- Terrain types for each cell (plain, mountain, forest, sea, etc.)
- Used for pathfinding and movement calculations

### Unit Stage Demo (`unit-stage-demo.json`)
Contains initial unit configurations for the demo stage:

#### Unit Properties
- **Basic Information**
  - `id`: Unique identifier
  - `name`: Display name
  - `class`: Unit class type (knight, mage, archer, etc.)
  - `description`: Unit description
  - `faction`: Team alignment (player, enemy, ally)

- **Position & Movement**
  - `position`: {x, y} coordinates
  - `direction`: Facing direction (top-right, right, bottom-right, etc.)
  - `movement`: Movement range
  - `movementType`: Movement capability (foot, float, flying)

- **Combat Stats**
  - `attack`, `defense`, `hitpoint`, `agility`
  - `critRate`, `critDamage`
  - `damageType`: Type of damage dealt (physical, magical)
  - `role`: Combat role (tank, dps, support)

- **Special Effects**
  - `breakEffect`, `effectHitRate`, `effectResist`
  - `vulnerability`: Array of vulnerability types
  - `characteristics`: Special trait IDs
  - `buffs`: Active buff effects

- **Resource Management**
  - `energy`, `maxEnergy`, `energyRegen`
  - `damageResist`, `damageBoost`, `damageMitigation`

## Usage Example

```typescript
// Loading map data
const mapData = await loadJSON('map-data.json');
const terrain = mapData.terrain[y][x];  // Access terrain at specific coordinates

// Loading unit data
const stageData = await loadJSON('unit-stage-demo.json');
const units = stageData.initialUnits;  // Array of unit configurations
```

## Data Structure Guidelines

### Terrain Types
- `plain`: Basic traversable terrain
- `mountain`: Difficult terrain, higher movement cost
- `forest`: Provides cover, affects visibility
- `sea`: Water terrain, limited accessibility
- `cliff`: Impassable terrain
- `road`: Improved movement speed
- `swamp`: Difficult terrain, may have special effects
- `ruins`: Special terrain, may have tactical advantages
- `wasteland`: Dangerous terrain, may cause effects
- `river`: Water terrain, affects movement

### Unit Factions
- `player`: Player-controlled units
- `enemy`: Hostile units
- `ally`: AI-controlled friendly units

### Movement Types
- `foot`: Standard ground movement
- `float`: Can traverse water/gaps
- `flying`: Ignores terrain restrictions

## Future Considerations

1. **Data Expansion**
   - Additional terrain types
   - More unit classes
   - Special terrain effects
   - Complex movement rules

2. **Data Validation**
   - JSON schema validation
   - Type checking
   - Data integrity verification

3. **Performance**
   - Data caching strategies
   - Lazy loading for large maps
   - Optimized data structures

## Technical Notes
- All data files use JSON format
- Coordinates use zero-based indexing
- Properties use camelCase naming
- Arrays use consistent ordering
- Optional properties should be explicitly null