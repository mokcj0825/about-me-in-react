import React from 'react';
import { HexCoordinate } from '../../types/HexCoordinate';
import { UnitData } from '../../types/UnitData';
import { DirectionIndicator } from './DirectionIndicator';

/**
 * Props interface for the HexCellContent component
 * @interface HexCellContentProps
 */
interface HexCellContentProps {
  /** The coordinate position of this hex cell */
  coordinate: HexCoordinate;
  
  /** The unit data if a unit is present in this cell */
  unit?: UnitData;
  
  /** Optional CSS styles to apply to the container */
  style?: React.CSSProperties;
}

/**
 * HexCellContent component - Renders the unit content within a hex cell
 * 
 * This component is responsible for displaying unit-related content, including:
 * - Unit sprites/images
 * - Unit direction indicators
 * - Unit status effects
 * - Any other unit-specific visual elements
 * 
 * @component
 */
export const HexCellContent: React.FC<HexCellContentProps> = ({ 
  coordinate,
  unit,
  style
}) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      ...style
    }}
  >
    {unit && (
      <>
        {/* Example structure for sprite-based units: */}
        {/*
        <div className="unit-sprite-container">
          <img 
            src={`/assets/units/${unit.faction}/${unit.type}.png`}
            alt={`${unit.faction} ${unit.type}`}
            className="unit-sprite"
          />
        </div>
        */}
        
        {/* Temporary text representation - remove when sprites are implemented */}
        {unit.faction === 'player' ? 'P' : unit.faction === 'ally' ? 'A' : 'E'}
        
        {/* Keep direction indicator or update it to work with sprites */}
        <DirectionIndicator 
          direction={unit.direction}
        />
      </>
    )}
  </div>
);
