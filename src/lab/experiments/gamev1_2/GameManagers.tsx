import React from "react";
import { UnitManager } from "./UnitManager";
import { HoverManager } from "./HoverManager";
import { SelectionManager } from "./SelectionManager";
import { MovementManager } from "./MovementManager";
import { TerrainManager } from "./TerrainManager";
import { TurnManager } from "./TurnManager";

interface GameManagersProps {
  children: React.ReactNode;
}

export const GameManagers: React.FC<GameManagersProps> = ({ children }) => (
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
