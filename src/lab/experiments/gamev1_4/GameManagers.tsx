import React from "react";
import { UnitManager } from "./UnitManager";
import { HoverManager } from "./HoverManager";
import { SelectionManager } from "./SelectionManager";
import { TerrainManager } from "./TerrainManager";
import { TurnManager } from "./TurnManager";

interface GameManagersProps {
  children: React.ReactNode;
}

export const GameManagers: React.FC<GameManagersProps> = ({ children }) => (
  <>
    <UnitManager />
    <HoverManager />
    <SelectionManager />
    <TerrainManager />
    <TurnManager />
    {children}
  </>
);
