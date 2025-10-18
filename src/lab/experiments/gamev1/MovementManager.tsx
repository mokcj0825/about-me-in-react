import { useEffect, useState } from 'react';
import { eventBus } from "./EventBus";
import { UnitSelectedEvent, UnitHoveredEvent } from "./types/EventTypes";
import { getZoneOfControl } from "./types/HexCoordinate";
import { UnitData, initialUnits } from "./types/UnitData";
import { hasCharacteristic } from "./types/Characteristics";
import { createHexCoordinate, HexCoordinate } from "../game-versioning/types/HexCoordinate";

export const MovementManager = () => {
  const [units] = useState<UnitData[]>(initialUnits);

  const findUnitAtPosition = (coord: HexCoordinate): UnitData | undefined => {
    return units.find(unit => 
      unit.position.x === coord.x && unit.position.y === coord.y
    );
  };

  const getMoveableGrids = (startCoord: HexCoordinate, movement: number): HexCoordinate[] => {
    const result = new Set<string>();
    const visited = new Map<string, number>();
    
    const movingUnit = findUnitAtPosition(startCoord);
    if (!movingUnit) return [];

    console.log('Moving unit:', movingUnit);
    console.log('Has 神速:', hasCharacteristic(movingUnit.characteristics, movingUnit.buffs, 'ignore-zoc'));

    const ignoresZOC = hasCharacteristic(
      movingUnit.characteristics,
      movingUnit.buffs,
      'ignore-zoc'
    );

    const opposingZOC = units
      .filter(u => {
        if (movingUnit.fraction === 'enemy') {
          return u.fraction === 'player' || u.fraction === 'ally';
        } else if (movingUnit.fraction === 'player' || movingUnit.fraction === 'ally') {
          return u.fraction === 'enemy';
        }
        return false;
      })
      .flatMap(u => getZoneOfControl(u.position));

    // ... rest of the movement calculation logic ...

    return Array.from(result).map(key => {
      const [x, y] = key.split(',').map(Number);
      return createHexCoordinate(x, y);
    });
  };

  useEffect(() => {
    // Handle unit selection
    const handleUnitSelected = ({ unitId, position }: UnitSelectedEvent) => {
      const unit = findUnitAtPosition(position);
      if (unit) {
        const moveableGrids = getMoveableGrids(position, unit.movement);
        eventBus.emit('moveable-grids-calculated', { grids: moveableGrids });
      }
    };

    // Handle unit hover
    const handleUnitHovered = ({ unitId }: UnitHoveredEvent) => {
      const unit = units.find(u => u.id === unitId);
      if (unit) {
        const moveableGrids = getMoveableGrids(unit.position, unit.movement);
        eventBus.emit('moveable-grids-calculated', { grids: moveableGrids });
      }
    };

    eventBus.on('unit-selected', handleUnitSelected);
    eventBus.on('unit-hovered', handleUnitHovered);
    
    return () => {
      eventBus.off('unit-selected', handleUnitSelected);
      eventBus.off('unit-hovered', handleUnitHovered);
    };
  }, []);

  return null;
};
