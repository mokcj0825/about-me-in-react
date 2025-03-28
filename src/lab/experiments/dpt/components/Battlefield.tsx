import React, { useEffect, useState } from 'react';
import { BlessingPreview } from '../type/BlessingPreview';
import { InstructionData } from '../type/InstructionData';

interface BattlefieldProps {
  blessingId: string;
}

export const Battlefield: React.FC<BattlefieldProps> = ({ blessingId }) => {
  const [preview, setPreview] = useState<BlessingPreview | null>(null);
  const [instruction, setInstruction] = useState<InstructionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBattlefieldData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Load both preview and instruction data
        const [previewData, instructionData] = await Promise.all([
          import(`../preview/${blessingId}.json`),
          import(`../instructions/${blessingId}.json`)
        ]);
        setPreview(previewData);
        setInstruction(instructionData);
      } catch (error) {
        console.error('Error loading battlefield data:', error);
        setError('Failed to load battlefield data');
      } finally {
        setIsLoading(false);
      }
    };

    loadBattlefieldData();
  }, [blessingId]); // Reset and reload when blessingId changes

  if (isLoading) {
    return (
      <div style={{ padding: '20px' }}>
        Loading battlefield...
      </div>
    );
  }

  if (error || !preview || !instruction) {
    return (
      <div style={{ padding: '20px', color: '#ff4444' }}>
        {error || 'Failed to load battlefield data'}
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      height: '100%'
    }}>
      {/* Blessing Preview */}
      <div style={{
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ margin: '0 0 12px 0' }}>{preview.name}</h3>
        <div style={{ 
          display: 'inline-block',
          padding: '4px 12px',
          backgroundColor: '#e9ecef',
          borderRadius: '16px',
          fontSize: '14px',
          marginBottom: '12px'
        }}>
          {preview.path}
        </div>
        <p style={{ 
          margin: '0',
          lineHeight: '1.6',
          color: '#495057'
        }}>
          {preview.description}
        </p>
      </div>

      {/* Units Display */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Player Units */}
        <div style={{
          flex: 1,
          padding: '16px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ margin: '0 0 12px 0' }}>Player Units</h4>
          {instruction.setup.player_units.map(unit => (
            <div key={unit.id} style={{
              padding: '8px',
              marginBottom: '8px',
              border: '1px solid #eee',
              borderRadius: '4px'
            }}>
              <div style={{ fontWeight: 'bold' }}>{unit.name}</div>
              <div>HP: {unit.hp}/{unit.maxHp}</div>
              {unit.energy !== undefined && (
                <div>Energy: {unit.energy}/{unit.maxEnergy}</div>
              )}
            </div>
          ))}
        </div>

        {/* Enemy Units */}
        <div style={{
          flex: 1,
          padding: '16px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ margin: '0 0 12px 0' }}>Enemy Units</h4>
          {instruction.setup.enemy_units.map(unit => (
            <div key={unit.id} style={{
              padding: '8px',
              marginBottom: '8px',
              border: '1px solid #eee',
              borderRadius: '4px'
            }}>
              <div style={{ fontWeight: 'bold' }}>{unit.name}</div>
              {unit.hp !== undefined && <div>HP: {unit.hp}/{unit.maxHp}</div>}
              {unit.attack && <div>Attack: {unit.attack}</div>}
              {unit.target_type && <div>Target: {unit.target_type}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Battle Log */}
      <div style={{
        padding: '16px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h4 style={{ margin: '0 0 12px 0' }}>Test Sequence</h4>
        <div style={{
          fontFamily: 'monospace',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          {instruction.test_sequence.map(step => (
            <div key={step.step} style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: 'bold' }}>Step {step.step}: {step.action.description}</div>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                {step.action.expected_result.map((result, index) => (
                  <li key={index}>{result}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Battlefield; 