import React, { useEffect, useState } from 'react';
import { BlessingPreview } from '../type/BlessingPreview';
import { InstructionData } from '../type/InstructionData';
import BlessingPreviewCard from './BlessingPreviewCard';
import UnitCard from './UnitCard';
import TestSequence from './TestSequence';

interface BattlefieldProps {
  blessingId: string;
}

export const Battlefield: React.FC<BattlefieldProps> = ({ blessingId }) => {
  const [preview, setPreview] = useState<BlessingPreview | null>(null);
  const [instruction, setInstruction] = useState<InstructionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    // Reset states when blessingId changes
    setPreview(null);
    setInstruction(null);
    setError(null);
    setIsLoading(true);

    const loadBattlefieldData = async () => {
      try {
        // Load both preview and instruction data using dynamic imports
        const [previewData, instructionData] = await Promise.all([
          import(/* webpackMode: "eager" */ `../preview/${blessingId}.json`),
          import(/* webpackMode: "eager" */ `../instructions/${blessingId}.json`)
        ]);

        if (isMounted) {
          setPreview(previewData.default);
          setInstruction(instructionData.default);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBattlefieldData();

    // Cleanup function
    return () => {
      isMounted = false;
      
      // Clear state on unmount
      setPreview(null);
      setInstruction(null);
      setError(null);
    };
  }, [blessingId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!preview || !instruction) {
    return <div>No data available</div>;
  }

  return (
    <div style={{
      display: 'grid',
      gap: '20px',
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <BlessingPreviewCard preview={preview} />
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        <div>
          <h3>Player Units</h3>
          {instruction.setup.player_units.map((unit, index) => (
            <UnitCard key={`player-${index}`} unit={unit} />
          ))}
        </div>
        
        <div>
          <h3>Enemy Units</h3>
          {instruction.setup.enemy_units.map((unit, index) => (
            <UnitCard key={`enemy-${index}`} unit={unit} />
          ))}
        </div>
      </div>

      <TestSequence steps={instruction.test_sequence} />
    </div>
  );
};

export default Battlefield; 