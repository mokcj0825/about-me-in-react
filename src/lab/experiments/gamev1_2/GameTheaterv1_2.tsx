import React from "react";
import { GameManagers } from "./GameManagers";
import { GameRenderer } from "./GameRenderer";


const GameTheaterv1_2: React.FC = () => {

  const width = 15;
  const height = 15;

  return (
    <GameManagers>
      <GameRenderer width={width} height={height} />
    </GameManagers>
  );
};

export default GameTheaterv1_2;