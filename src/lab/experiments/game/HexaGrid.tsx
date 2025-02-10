import React from 'react';
import ScrollableMapUnit from './ScrollableMapUnit';


const HexaGrid: React.FC = () => {
  return (
    <div>
      <ScrollableMapUnit
        mapWidth={40}
        mapHeight={40}
        onUnitClick={() => console.log('clicked')}
      />
    </div>
  );
};

export default HexaGrid;
