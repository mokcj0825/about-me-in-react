import React from 'react';
import { TestStep } from '../type/InstructionData';

interface TestSequenceProps {
  steps: TestStep[];
}

export const TestSequence: React.FC<TestSequenceProps> = ({ steps }) => {
  return (
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
        {steps.map(step => (
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
  );
};

export default TestSequence; 