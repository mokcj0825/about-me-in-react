import React, { useState, useEffect } from 'react';
import { Blessing } from './type/BlessingData';

interface BlessingListProps {
  onSelectBlessing: (blessingId: string) => void;
  selectedBlessingId?: string;
}

export const BlessingList: React.FC<BlessingListProps> = ({ onSelectBlessing, selectedBlessingId }) => {
  const [availableBlessings, setAvailableBlessings] = useState<Blessing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAvailableBlessings = async () => {
      try {
        const blessingCatalog = await import('./data/blessing-data.json');
        setAvailableBlessings(blessingCatalog.blessings);
        
        // If no blessing is selected and we have blessings available, select the first one
        if (!selectedBlessingId && blessingCatalog.blessings.length > 0) {
          onSelectBlessing(blessingCatalog.blessings[0].id);
        }
      } catch (error) {
        console.error('Error loading blessing catalog:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailableBlessings();
  }, []); // Run once on component mount

  if (isLoading) {
    return <div style={{ padding: '20px' }}>Loading available blessings...</div>;
  }

  return (
    <div style={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h2 style={{ 
        padding: '20px',
        margin: 0,
        borderBottom: '1px solid #eee'
      }}>Available Blessings</h2>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px'
      }}>
        {availableBlessings.map(blessing => (
          <div 
            key={blessing.id} 
            style={{
              padding: '12px 16px',
              marginBottom: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: blessing.id === selectedBlessingId ? '#e6f3ff' : '#fff'
            }}
            onClick={() => onSelectBlessing(blessing.id)}
          >
            {blessing.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlessingList;
