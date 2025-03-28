import React from 'react';
import Battlefield from './components/Battlefield';

interface RendererProps {
  blessingId: string;
}

export const Renderer: React.FC<RendererProps> = ({ blessingId }) => {
  return (
    <div style={{ height: '100%' }}>
      <Battlefield blessingId={blessingId} />
    </div>
  );
};

export default Renderer;
