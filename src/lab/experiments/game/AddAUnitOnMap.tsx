import React from 'react';
import ScrollableMapUnitv2 from "./ScrollableMapUnitv2";


const AddAUnitOnMap: React.FC = () => {
  return (
    <div>
      <ScrollableMapUnitv2
        mapWidth={15}
        mapHeight={10}
        onUnitClick={() => console.log('clicked')}
      />
    </div>
  );
};

export default AddAUnitOnMap;
