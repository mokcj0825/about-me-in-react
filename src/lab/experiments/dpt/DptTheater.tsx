import React, { useState } from 'react';
import BlessingList from './BlessingList';
import { Renderer } from './Renderer';

interface DptTheaterProps {
  blessingId?: string;
}

export const DptTheater: React.FC<DptTheaterProps> = ({ blessingId: initialBlessingId }) => {
  const [selectedBlessingId, setSelectedBlessingId] = useState<string>(initialBlessingId || '');

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      padding: '20px',
      gap: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        width: '300px',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <BlessingList
          onSelectBlessing={setSelectedBlessingId}
          selectedBlessingId={selectedBlessingId}
        />
      </div>
      <div style={{
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '20px'
      }}>
        {selectedBlessingId && (
          <Renderer
            blessingId={selectedBlessingId}
          />
        )}
      </div>
    </div>
  );
};

export default DptTheater;