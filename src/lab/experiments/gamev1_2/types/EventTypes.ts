import { HexCoordinate } from "../../game-versioning/types/HexCoordinate";

/**
 * Event fired when a unit is selected
 * @interface UnitSelectedEvent
 * @property {string} unitId - Unique identifier of the selected unit
 * @property {HexCoordinate} position - Grid position of the selected unit
 */
export interface UnitSelectedEvent {
  unitId: string;
  position: HexCoordinate;
}

/**
 * Event fired when a unit is hovered over
 * @interface UnitHoveredEvent
 * @property {string} unitId - Unique identifier of the hovered unit
 */
export interface UnitHoveredEvent {
  unitId: string;
} 