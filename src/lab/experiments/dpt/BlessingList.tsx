/// <reference types="vite/client" />
import React, { useEffect, useState, useCallback } from 'react';
import BlessingPreviewCard from './components/BlessingPreviewCard';
import { BlessingPreview } from './type/BlessingPreview';

interface ExtendedBlessingPreview extends BlessingPreview {
  rarity: number;
  category: string;
}

interface BlessingListProps {
  onSelectBlessing: (id: string) => void;
  selectedBlessingId?: string;
}

const getRarityBackground = (rarity: number): string => {
  switch (true) {
    case rarity === 1: return '#f8f9fa';  // Very light gray
    case rarity === 2: return '#e3f2fd';  // Very light blue
    case rarity === 3: return '#fff8e1';  // Very light gold
    case rarity === 4: return '#f3e5f5';  // Very light purple
    case rarity === 5: return '#fbe9e7';  // Very light orange
    default: return '#ffebee';  // Very light red
  }
};

const BlessingList: React.FC<BlessingListProps> = ({ onSelectBlessing, selectedBlessingId }) => {
  const [blessings, setBlessings] = useState<ExtendedBlessingPreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hoveredBlessing, setHoveredBlessing] = useState<ExtendedBlessingPreview | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const loadBlessings = async () => {
      try {
        const previewFiles = import.meta.glob<{ default: ExtendedBlessingPreview }>('./preview/*.json');
        const blessingsMap = new Map<string, ExtendedBlessingPreview>();

        for (const path in previewFiles) {
          const module = await previewFiles[path]();
          const blessing = module.default;
          // Only add if not already in the map
          if (!blessingsMap.has(blessing.id)) {
            blessingsMap.set(blessing.id, blessing);
          }
        }

        // Convert map to array and sort
        const loadedBlessings = Array.from(blessingsMap.values()).sort((a, b) => {
          if (b.rarity !== a.rarity) {
            return b.rarity - a.rarity;
          }
          return a.name.localeCompare(b.name);
        });

        setBlessings(loadedBlessings);
      } catch (error) {
        console.error('Failed to load blessings:', error);
        setError('Failed to load blessings');
      }
    };

    loadBlessings();
  }, []);

  const handleMouseEnter = useCallback((event: React.MouseEvent, blessing: ExtendedBlessingPreview) => {
    setHoveredBlessing(blessing);
    setMousePosition({ x: event.clientX, y: event.clientY });
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

  if (error) {
    return <div style={{ padding: '1rem', color: 'red' }}>{error}</div>;
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
    <div style={{ padding: '1rem' }}>
      <h2 style={{ marginBottom: 10 }}>Blessings</h2>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto'
      }}>
        {blessings.map(blessing => (
          <div
            key={blessing.id}
            style={{
              padding: '0.75rem',
              borderRadius: '4px',
              backgroundColor: selectedBlessingId === blessing.id 
                ? '#e8f5e9'  // Light green for selected
                : getRarityBackground(blessing.rarity),
              border: '1px solid #e0e0e0',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => handleMouseEnter(e, blessing)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => onSelectBlessing(blessing.id)}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontWeight: 'bold' }}>{blessing.name}</span>
            </div>
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
