import React, { useState, useEffect, useCallback } from 'react';
import { Blessing } from './type/BlessingData';
import BlessingPreviewCard from './components/BlessingPreviewCard';
import { BlessingPreview } from './type/BlessingPreview';

interface BlessingListProps {
  onSelectBlessing: (blessingId: string) => void;
  selectedBlessingId?: string;
}

export const BlessingList: React.FC<BlessingListProps> = ({ onSelectBlessing, selectedBlessingId }) => {
  const [availableBlessings, setAvailableBlessings] = useState<Blessing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredBlessing, setHoveredBlessing] = useState<BlessingPreview | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const loadAvailableBlessings = async () => {
      try {
        const blessingCatalog = await import('./data/blessing-data.json');
        setAvailableBlessings(blessingCatalog.blessings);
        
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
  }, []);

  const handleMouseEnter = useCallback(async (event: React.MouseEvent, blessingId: string) => {
    try {
      const previewData = await import(/* webpackMode: "eager" */ `./preview/${blessingId}.json`);
      setHoveredBlessing(previewData.default);
      setMousePosition({ x: event.clientX, y: event.clientY });
    } catch (err) {
      console.error('Failed to load blessing preview:', err);
    }
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (hoveredBlessing) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  }, [hoveredBlessing]);

  const handleMouseLeave = useCallback(() => {
    setHoveredBlessing(null);
    setMousePosition(null);
  }, []);

  if (isLoading) {
    return <div style={{ padding: '20px' }}>Loading available blessings...</div>;
  }

  const previewStyle = mousePosition ? {
    position: 'fixed' as const,
    left: mousePosition.x + 16,
    top: mousePosition.y + 8,
    maxWidth: '300px',
    zIndex: 1000,
    pointerEvents: 'none' as const,
    transform: mousePosition.y > window.innerHeight / 2 
      ? 'translateY(-100%)' 
      : 'translateY(0)',
  } : {};

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
              backgroundColor: blessing.id === selectedBlessingId ? '#e6f3ff' : '#fff',
              transition: 'all 0.2s ease'
            }}
            onClick={() => onSelectBlessing(blessing.id)}
            onMouseEnter={(e) => handleMouseEnter(e, blessing.id)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {blessing.name}
          </div>
        ))}
      </div>

      {hoveredBlessing && mousePosition && (
        <div style={previewStyle}>
          <BlessingPreviewCard preview={hoveredBlessing} />
        </div>
      )}
    </div>
  );
};

export default BlessingList;
