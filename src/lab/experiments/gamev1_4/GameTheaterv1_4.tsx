import React from "react";
import { GameManagers } from "./GameManagers";
import { GameRenderer } from "./GameRenderer";

const GameTheaterv1_4: React.FC = () => {
  return (
    <GameManagers>
      <GameRenderer />
    </GameManagers>
  );
};

export default GameTheaterv1_4;