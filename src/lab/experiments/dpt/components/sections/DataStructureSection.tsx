import React from 'react';
import Section from '../Section';
import { BlessingInstruction } from '../../types';

interface DataStructureSectionProps {
  instruction: BlessingInstruction;
}

const DataStructureSection: React.FC<DataStructureSectionProps> = ({ instruction }) => (
  <Section title="Data Structure">
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {Object.entries(instruction.implementation.data_structure).map(([key, value]) => (
        key !== 'required_interface' && (
          <div key={key}>
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>{key}</h3>
            <pre style={{ 
              margin: 0,
              background: "#fff",
              padding: "0.5rem",
              borderRadius: "4px",
              fontSize: "0.875rem",
              maxWidth: '100%',
              overflow: 'auto',
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap'
            }}>
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        )
      ))}
    </div>
  </Section>
);

export default DataStructureSection; 