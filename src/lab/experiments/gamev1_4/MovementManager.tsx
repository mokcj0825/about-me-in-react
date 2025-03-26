import { useEffect, useState } from 'react';
import { eventBus } from "./EventBus";
import { UnitSelectedEvent, UnitHoveredEvent } from "./types/EventTypes";
import { HexCoordinate, createHexCoordinate, getNeighbors, getZoneOfControl } from "./types/HexCoordinate";
import { UnitData, initialUnits } from "./types/UnitData";
import { hasCharacteristic } from "./types/Characteristics";

/**
 * MovementManager Component
 * 
 * Manages unit movement calculations and interactions:
 * - Handles unit selection and hover events
 * - Calculates moveable grid positions
 * - Applies movement rules and restrictions
 * - Integrates with Zone of Control system
 * 
 * @component
 */
export const MovementManager = () => {
  // Initialize units from data
  const [units] = useState<UnitData[]>(initialUnits);

  /**
   * Finds a unit at a specific coordinate
   * @param {HexCoordinate} coord - Position to check
   * @returns {UnitData | undefined} Unit at position if found
   */
  const findUnitAtPosition = (coord: HexCoordinate): UnitData | undefined => {
    return units.find(unit => 
      unit.position.x === coord.x && unit.position.y === coord.y
    );
  };

  /**
   * Calculates all grid positions a unit can move to
   * @param {HexCoordinate} startCoord - Unit's current position
   * @param {number} movement - Unit's movement range
   * @returns {HexCoordinate[]} Array of reachable coordinates
   */
  const getMoveableGrids = (startCoord: HexCoordinate, movement: number): HexCoordinate[] => {
    const result = new Set<string>();
    const visited = new Map<string, number>();
    
    const movingUnit = findUnitAtPosition(startCoord);
    if (!movingUnit) return [];

    return Array.from(result).map(key => {
      const [x, y] = key.split(',').map(Number);
      return createHexCoordinate(x, y);
    });
  };

  useEffect(() => {
    /**
     * Handles unit selection events
     * @param {UnitSelectedEvent} event - Unit selection event data
     */
    const handleUnitSelected = ({ unitId, position }: UnitSelectedEvent) => {
      const unit = findUnitAtPosition(position);
      if (unit) {
        const moveableGrids = getMoveableGrids(position, unit.movement);
        eventBus.emit('moveable-grids-calculated', { grids: moveableGrids });
      }
    };

    /**
     * Handles unit hover events
     * @param {UnitHoveredEvent} event - Unit hover event data
     */
    const handleUnitHovered = ({ unitId }: UnitHoveredEvent) => {
      const unit = units.find(u => u.id === unitId);
      if (unit) {
        const moveableGrids = getMoveableGrids(unit.position, unit.movement);
        eventBus.emit('moveable-grids-calculated', { grids: moveableGrids });
      }
    };

    // Subscribe to events
    eventBus.on('unit-selected', handleUnitSelected);
    eventBus.on('unit-hovered', handleUnitHovered);
    
    // Cleanup event subscriptions
    return () => {
      eventBus.off('unit-selected', handleUnitSelected);
      eventBus.off('unit-hovered', handleUnitHovered);
    };
  }, []);

  return null;
};
