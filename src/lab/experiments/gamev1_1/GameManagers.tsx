import React from "react";
import { UnitManager } from "./UnitManager";
import { HoverManager } from "./HoverManager";
import { SelectionManager } from "./SelectionManager";
import { MovementManager } from "./MovementManager";
import { TerrainManager } from "./TerrainManager";
import { TurnManager } from "./TurnManager";
import GameManagerProps from "../game-versioning/GameManagerProp";

export const GameManagers: React.FC<GameManagerProps> = ({ children }) => (
  <>
    <UnitManager />
    <HoverManager />
    <MovementManager />
    <SelectionManager />
    <TerrainManager />
    <TurnManager />
    {children}
  </>
);
