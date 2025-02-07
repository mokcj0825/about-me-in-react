import React from 'react';
import SimpleMapUnit from './SimpleMapUnit';


const HexaGrid: React.FC = () => {
  return (
    <div>
      <SimpleMapUnit
        mapWidth={5}
        mapHeight={5}
        onUnitClick={() => console.log('clicked')}
      />
    </div>
  );
};

export default HexaGrid;
