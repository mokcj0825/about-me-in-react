import React from 'react';
import Section from '../Section';
import { BlessingInstruction } from '../../types';

interface DataStructuresSectionProps {
  instruction: BlessingInstruction;
}

const DataStructuresSection: React.FC<DataStructuresSectionProps> = ({ instruction }) => (
  <Section title="Data Structures">
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {Object.entries(instruction.implementation.data_structures).map(([key, value]) => (
        key !== 'required_interfaces' && (
          <div key={key}>
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>{key}</h3>
            <pre style={{ 
              margin: 0,
              background: "#fff",
              padding: "0.5rem",
              borderRadius: "4px",
              fontSize: "0.875rem"
            }}>
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        )
      ))}
    </div>
  </Section>
);

export default DataStructuresSection; 